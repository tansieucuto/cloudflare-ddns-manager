/**
 * ============================================================================
 * CLOUDFLARE DDNS MANAGER
 * ============================================================================
 *
 * A lightweight, self-hosted Dynamic DNS updater for Cloudflare.
 * Features a built-in Web Dashboard for easy management, multi-domain
 * support, and smart IP synchronization.
 *
 * SECURITY NOTICE:
 * This application is designed to bind to Localhost (127.0.0.1) only.
 * For remote access, please use SSH Tunneling or a secure Reverse Proxy.
 *
 * @author      Luong Minh Tan
 * @copyright   (c) 2025 Luong Minh Tan
 * @license     MIT License
 * @version     1.0.0
 * @repository  https://github.com/tansieucuto/cloudflare-ddns-manager
 * ============================================================================
 */

const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const DATA_DIR = process.cwd();
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.static(PUBLIC_DIR));

let CONFIG = null;
let CF_CLIENT = null;
let AUTO_INTERVAL = null;

function loadConfig() {
    if (fs.existsSync(SETTINGS_FILE)) {
        try {
            CONFIG = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
            if (CONFIG.token) {
                CF_CLIENT = axios.create({
                    baseURL: 'https://api.cloudflare.com/client/v4',
                    headers: { 'Authorization': `Bearer ${CONFIG.token}`, 'Content-Type': 'application/json' }
                });
            }
            return true;
        } catch (e) { return false; }
    }
    return false;
}


async function syncAllOwnedRecords() {
    if (!CONFIG || !CONFIG.id || !CF_CLIENT) return;


    const time = new Date().toLocaleTimeString('en-US', { hour12: false });

    try {
        const ipRes = await axios.get('https://api.ipify.org?format=json');
        const currentIP = ipRes.data.ip;
        const zonesRes = await CF_CLIENT.get('/zones?status=active');
        const zones = zonesRes.data.result;
        let updateCount = 0;


        for (const zone of zones) {
            const recRes = await CF_CLIENT.get(`/zones/${zone.id}/dns_records?type=A&per_page=100`);
            const records = recRes.data.result;

            for (const r of records) {
                const comment = r.comment || "";
                if (comment.includes(`managed by ${CONFIG.id}`)) {
                    if (r.content !== currentIP) {
                        await CF_CLIENT.put(`/zones/${zone.id}/dns_records/${r.id}`, {
                            type: 'A', name: r.name, content: currentIP, ttl: 120, proxied: false,
                            comment: comment
                        });
                        console.log(`[${time}] [UPDATE] Updated record: ${r.name}`);
                        updateCount++;
                    }
                }
            }
        }
        if (updateCount === 0) {
            console.log(`[${time}] [IDLE] All records match IP. No update needed.`);
        }

    } catch (e) {
        console.error(`[${time}] [ERROR] ${e.message}`);
    }
}


function startBackgroundJob() {
    if (AUTO_INTERVAL) clearInterval(AUTO_INTERVAL);
    syncAllOwnedRecords();
    AUTO_INTERVAL = setInterval(syncAllOwnedRecords, 5* 60 * 1000);
}


app.get('/api/status', (req, res) => res.json({ configured: !!(CONFIG && CF_CLIENT && CONFIG.id), id: CONFIG ? CONFIG.id : null }));
app.post('/api/setup', (req, res) => {
    const { id, token, port } = req.body;
    if (!id || !token || !port) return res.status(400).json({ message: "Missing information!" });
    const newConfig = { id: id.trim(), token: token.trim(), port: parseInt(port) };

    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newConfig, null, 2));
        res.json({ success: true, message: "Saved! Please restart the app" });
        setTimeout(() => process.exit(0), 1000);
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

const requireConfig = (req, res, next) => {
    if (!CONFIG || !CF_CLIENT) return res.status(403).json({ message: "Token not configured!" });
    next();
};

app.get('/api/zones', requireConfig, async (req, res) => {
    try {
        const response = await CF_CLIENT.get('/zones?status=active');
        res.json({ success: true, data: response.data.result.map(z => ({ id: z.id, name: z.name })) });
    } catch (e) { res.status(500).json({ message: "Token Error" }); }
});

app.get('/api/records', requireConfig, async (req, res) => {
    try {
        const response = await CF_CLIENT.get(`/zones/${req.query.zoneId}/dns_records?type=A&per_page=100`);
        const records = response.data.result.filter(r => r.comment && r.comment.includes('ddns')).map(r => ({
            id: r.id, name: r.name, content: r.content,
            ownerId: r.comment.split('managed by ')[1] || '???',
                                                                                                            isMine: (CONFIG.id && r.comment.includes(CONFIG.id))
        }));
        res.json({ success: true, data: records });
    } catch (e) { res.status(500).json({ message: "Records Error" }); }
});

app.post('/api/update', requireConfig, async (req, res) => {
    const { zoneId, zoneName, subdomain } = req.body;
    const fullDomain = (subdomain === '@') ? zoneName : `${subdomain}.${zoneName}`;

    try {
        const ipRes = await axios.get('https://api.ipify.org?format=json');
        const currentIP = ipRes.data.ip;

        const search = await CF_CLIENT.get(`/zones/${zoneId}/dns_records?name=${fullDomain}&type=A`);
        const exist = search.data.result[0];

        if (exist && exist.comment.includes('ddns |') && !exist.comment.includes(CONFIG.id)) {
            return res.status(409).json({ success: false, message: `Domain belongs to [${exist.comment.split('managed by ')[1]}]!` });
        }

        const payload = { type: 'A', name: fullDomain, content: currentIP, ttl: 120, proxied: false, comment: `ddns | managed by ${CONFIG.id}` };

        if (exist) await CF_CLIENT.put(`/zones/${zoneId}/dns_records/${exist.id}`, payload);
        else await CF_CLIENT.post(`/zones/${zoneId}/dns_records`, payload);

        startBackgroundJob();

        res.json({ success: true, message: "Added" });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.delete('/api/delete', requireConfig, async (req, res) => {
    try {
        await CF_CLIENT.delete(`/zones/${req.body.zoneId}/dns_records/${req.body.recordId}`);
        // Xóa xong thì quét lại
        syncAllOwnedRecords();
        res.json({ success: true, message: "Deleted!" });
    } catch (e) { res.status(500).json({ message: "Delete Error" }); }
});



const hasConfig = loadConfig();
const PORT = hasConfig ? CONFIG.port : 3000;

app.listen(PORT, '127.0.0.1',  () => {
    console.log(`\n>>> APP RUNNING AT: http://localhost:${PORT}`);
    if (!hasConfig) {
        console.log(">>> NO CONFIG. ACCESS WEB TO SETUP!");
    } else {
        startBackgroundJob();
    }
});
