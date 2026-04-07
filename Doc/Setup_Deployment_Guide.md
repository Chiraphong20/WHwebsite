# คู่มือติดตั้งและเผยแพร่ (Setup & Deployment Guide)

เอกสารนี้รวบรวมขั้นตอนการทำงานเพื่อให้สามารถนำ Source Code ของโปรเจกต์ **WongHiran Website** ย้ายจากรูปแบบการสร้างพัฒนาโค้ด ออกไปสู่สถานะการให้บริการออนไลน์แก่บุคคลทั่วไปแบบสมบูรณ์ (Production Production) 

---

## 1. การเตรียมตั้งค่าโปรเจกต์ (Project Preparation)

### 1.1 ไฟล์การตั้งค่า Environment Variables
ตรวจสอบใน Root Folder ว่ามีไฟล์ `.env` ที่กำหนดค่าตัวแปรจำเป็นครบถ้วนหรือยัง หากกำลังทดสอบในเครื่องของตัวเอง (Local) สามารถเปลี่ยนชื่อจาก `.env.example` เป็น `.env` ได้เลย

**ตัวอย่าง `/.env`**
```env
# ตั้งค่าคีย์จำเป็น
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### 1.2 ตรวจสอบข้อผิดพลาดของ Typescript (Linting)
คุณควรแน่ใจว่าการแก้ไขโค้ดทุกส่วนผ่านมาตรฐานของ TypeScript เพื่อป้องกันเซิร์ฟเวอร์ตีกลับโค้ดที่ผิดปกติ
```bash
# ตรวจสอบโค้ดก่อน Build ทุกครั้ง
npm run lint
```
*ถ้าผ่าน โปรแกรมจะไม่แสดง Error สีแดง และไม่มีผลลัพธ์ย้อนกลับ (No Emit)*

---

## 2. ขั้นตอนการติดตั้งและรันทดสอบในเครื่องตัวเอง (Local Development)

ระบบสามารถจำลองทำงานได้อย่างรวดเร็วมากด้วยเครื่องมือ Vite 

```bash
# โคลนโปรเจกต์
git clone https://github.com/your-org/WH-Website.git
cd WH-Website

# โหลดโปรแกรมและ Library ทุกอย่างให้ครบ
npm install

# รันระบบจำลองโฮสต์ 
npm run dev
```

จากนั้นเปิด Browser พิสูจน์ผลงานที่ `http://localhost:3000` (หรือเลข Port ที่เทอร์มินัลแนะนำ)

---

## 3. ขั้นตอนการ Build สู่ Production (Manual Build)

สำหรับกรณีที่มีโฮสต์แบบทำเอง (VPS หรือ Apache/Nginx แบบเก่า) ต้องทำ Static Build ให้ตัวอ่าน Browser รู้จัก

```bash
# สั่งประกอบร่างเว็บไซต์ 
npm run build
```

**ผลลัพธ์:**
- ระบบจะสร้างโฟลเดอร์ชื่อ `dist/` ขึ้นมา 
- ประกอบไปด้วย `index.html` และ โฟลเดอร์ `assets/`
- นำไฟล์ทั้งหมดในโฟลเดอร์ `dist` โยนใส่ Public directory ของ Server ปลายทางได้เลยทันที (เช่น `public_html/`)

---

## 4. แนะนำระบบคุมแบนด์วิธ — การ Deploy แบบใช้ Vercel

ทีมผู้จัดทำ แนะนำการ Deploy โปรเจกต์ฝั่ง React (Frontend) ขึ้นไปที่ Vercel ซึ่งรองรับสถาปัตยกรรมระดับ Edge Network ตอบสนองได้รวดเร็วทุกมุมโลก และไม่มีภาระหนี้สินค่าดูแลเซิร์ฟเวอร์กวนใจ

### 4.1 ข้อกำหนดสำหรับ Vercel
โปรดตรวจสอบว่าไฟล์ `vercel.json` วางอยู่ใน Root Directory
```json
{
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
*ไฟล์นี้จะเป็นผู้บังคับให้ URL Path ที่เปลี่ยนแปลง ไม่โชว์ Error 404 เวลาผู้ใช้ Refresh หน้า*

### 4.2 วิธีการเชื่อมต่อ (Connect your repository)
1. นำ Source Code เอาขึ้นบัญชี GitHub ของคุณ
2. ล็อคอินเข้า [vercel.com](https://vercel.com)
3. คลิก **"Add New"** > **"Project"**
4. กด Import Repo GitHub ของวงษ์หิรัญเข้ามา
5. ตั้งค่า Framework Preset ให้เป็น **`Vite`** 
6. กดหมวด "Environment Variables" เพิ่มคีย์ `VITE_GOOGLE_MAPS_API_KEY` และใส่ค่า Value ลงไป
7. กด **"Deploy"** รอประมาณไม่เกิน 30 วินาที

### 4.3 เชื่อมเข้ากับชื่อทางการ (Custom Domain)
หลัง Vercel จัดการระบบเสร็จแล้ว:
1. เข้าไปที่เมนู **Settings** > **Domains**
2. กด Add ชื่อ `wonghiran.com` และ `www.wonghiran.com`
3. ไปจัดการเปิดระบบ Control Panel ของผู้จดโดเมน ชี้ค่า Nameserver กลับตามที่ระบบแนะนำ
4. SSL (กุญแจ HTTPS) จะถูกเจนด้วยตัวเองและติดให้อัตโนมัติทันที
