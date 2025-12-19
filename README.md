<div align="center">
<div align="right">
  <a href="README.VI.md">
    <img src="https://flagcdn.com/40x30/vn.png" alt="Tiếng Việt" width="30"/>
  </a>
</div>

# CLOUDFLARE DDNS MANAGER

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

<p align="center">
  <b>Automated IP update tool for Cloudflare with a simple Web management dashboard.</b>
</p>

</div>

---

## FEATURES
-   **Web Dashboard:** Intuitive interface, no need to edit config files.
-   **IP Sync:** Automatically detects and synchronizes Public IP.
-   **Multi-Domain:** Manage multiple domains simultaneously.
-   **Lightweight:** Runs directly, no cumbersome installation.
-   **Multi-Node Management:** Supports running the tool on multiple computers/IPs simultaneously. Each DNS record clearly displays the Node ID of the managing machine, helping you know exactly which IP points to which machine without conflicts.
---

## SCREENSHOTS

| Dashboard | Setup |
|:---:|:---:|
| ![image](https://github.com/user-attachments/assets/b508e71b-225b-44db-95a6-c0f49c750d6e) | ![image](https://github.com/user-attachments/assets/f5ff3711-e39b-49d7-8e46-3a6e2732aae1) |

---

## API TOKEN GUIDE (IMPORTANT)
> **⚠️ READ CAREFULLY BEFORE USE:**
> This tool does **NOT** create free domains for you.
> 1.  You must **BUY** a domain (anywhere: P.A, Matbao, Namecheap...).
> 2.  You must **transfer that domain to Cloudflare** (change Nameservers) and it must be Active.
>


For the tool to run, you must grant it permission to edit DNS. Follow these steps exactly:

1.  Access: [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens).
2.  Click **Create Token**.
3.  Select template **Edit Zone DNS** (First line).
4.  Section **Zone Resources**: Select **Include** -> **All zones**.
5.  Click **Continue to summary** -> **Create Token**.
6.  **COPY IMMEDIATELY** that string. It only shows once. If lost, you must create a new one.

---

## INSTALLATION & USAGE

### Method 1: Download and run (Recommended)
1.  Go to **Releases** section, download the `.exe` file (Windows) or binary (Linux).
2.  Run the file.
3.  Access: `http://localhost:3000`.

### Method 2: Run from Source Code
```bash
git clone [https://github.com/tansieucuto/cloudflare-ddns-manager.git](https://github.com/tansieucuto/cloudflare-ddns-manager.git)
cd cloudflare-ddns-manager
npm install
npm start
```
---

###  REMOTE ACCESS / HEADLESS SERVER

Since this tool only runs on Localhost (127.0.0.1) to avoid being hacked.

To access the Dashboard from another machine, you must create a tunnel (SSH Tunnel). Do as follows:
### 1. Use Computer (Windows / Mac / Linux)
Open Terminal (or CMD) on your computer (not on the server) and type:

```bash
# syntax: ssh -L [PORT]:127.0.0.1:[TOOL_PORT] [User]@[Server-IP]
ssh -L 3000:127.0.0.1:3000 root@192.168.1.100
```
if running the tool on Windows or WinServer, simply RDP to the machine and use it.

---

## LINSENCE

This project is distributed under the MIT License.

> **DISCLAIMER:**
> This software is provided "AS IS", without any warranty. The author is
>  **NOT RESPONSIBLE** for any damages (data loss, token exposure, system compromise...) arising during use.

<div align="center">
  <b>Developed by <a href="https://github.com/tansieucuto">Luong Minh Tan</a></b>
</div>
