<div align="center">
<div align="right">
  <a href="README.md">
    <img src="https://flagcdn.com/40x30/us.png" alt="English" width="30"/>
  </a>
</div>

  # CLOUDFLARE DDNS MANAGER

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

<p align="center">
  <b>Tool tự động cập nhật IP cho Cloudflare với giao diện Web quản lý đơn giản.</b>
</p>

</div>

---

## TÍNH NĂNG
-   **Web Dashboard:** Giao diện trực quan, không cần sửa file config.
-   **IP Sync:** Tự động phát hiện và đồng bộ IP Public.
-   **Multi-Domain:** Quản lý nhiều tên miền cùng lúc.
-   **Nhẹ:** Chạy trực tiếp, không cài đặt rườm rà.
-   **Quản lý Đa Điểm:** Hỗ trợ chạy tool trên nhiều máy tính/IP khác nhau cùng lúc. Mỗi bản ghi DNS sẽ hiển thị rõ Node ID của máy đang quản lý nó, giúp bạn biết chính xác IP nào đang trỏ về máy nào mà không bị "đá" nhau.
---

## HÌNH ẢNH

| Dashboard | Setup |
|:---:|:---:|
| ![image](https://github.com/user-attachments/assets/b508e71b-225b-44db-95a6-c0f49c750d6e) | ![image](https://github.com/user-attachments/assets/f5ff3711-e39b-49d7-8e46-3a6e2732aae1) |

---

## HƯỚNG DẪN LẤY API TOKEN (QUAN TRỌNG)
> **⚠️ ĐỌC KỸ TRƯỚC KHI DÙNG:**
> Tool này **KHÔNG** tạo tên miền miễn phí cho bạn.
> 1.  bạn phải **MUA** một tên miền (ở đâu cũng được: P.A, Matbao, Namecheap...).
> 2.  bạn phải **chuyển tên miền đó sang Cloudflare** (đổi Nameservers) và nó phải đang hoạt động (**Active**).
>


Để tool chạy được, bạn phải phải cấp quyền cho nó sửa DNS. Làm y hệt như sau:

1.  Truy cập: [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens).
2.  Bấm **Create Token**.
3.  Chọn mẫu **Edit Zone DNS** (Dòng đầu tiên).
4.  Mục **Zone Resources**: Chọn **Include** -> **All zones**.
5.  Bấm **Continue to summary** -> **Create Token**.
6.  **COPY NGAY** cái chuỗi đó. Nó chỉ hiện đúng 1 lần. Mất là phải tạo lại.

---

## CÀI ĐẶT & SỬ DỤNG

### Cách 1: Tải file chạy luôn (Recommended)
1.  Vào mục **Releases** tải file `.exe` (Windows) hoặc binary (Linux).
2.  Chạy file lên.
3.  Truy cập: `http://localhost:3000`.

### Cách 2: Chạy từ Source Code
```bash
git clone https://github.com/tansieucuto/cloudflare-ddns-manager.git
cd cloudflare-ddns-manager
npm install
npm start
```
---

###  TRUY CẬP TỪ XA / SERVER KHÔNG CÓ GIAO DIỆN

Do tool này **chỉ chạy trên Localhost (127.0.0.1)** để tránh bị hack

Muốn vào Dashboard từ máy khác, bạn phải tạo đường hầm (SSH Tunnel). Làm như sau:

### 1. Dùng Máy Tính (Windows / Mac / Linux)
Mở Terminal (hoặc CMD) trên máy tính của bạn (không phải trên server) và gõ:

```bash
# cú pháp: ssh -L [PORT]:127.0.0.1:[PORT CỦA TOOL] [User]@[IP-Server]
ssh -L 3000:127.0.0.1:3000 root@192.168.1.100
```
nếu chạy tool trên window hoặc winserver thì đơn giản chỉ cần rdp tới máy và dùng

---

## GIẤY PHÉP

Dự án này được phân phối dưới giấy phép **[MIT License](LICENSE)**.

> **TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM:**
> Phần mềm này được cung cấp "NGUYÊN TRẠNG" (AS IS), không có bất kỳ bảo hành nào.
> Tác giả **KHÔNG CHỊU TRÁCH NHIỆM** về bất kỳ thiệt hại nào (mất dữ liệu, lộ token, hệ thống bị tấn công...) phát sinh trong quá trình sử dụng.

<div align="center">
  <b>Developed by <a href="https://github.com/tansieucuto">Luong Minh Tan</a></b>
</div>
