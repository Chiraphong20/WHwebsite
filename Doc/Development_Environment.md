# การกำหนดสภาพแวดล้อมการพัฒนาระบบ (Development Environment)

เอกสารนี้รวบรวมรายละเอียดเครื่องมือ ซอฟต์แวร์ และฮาร์ดแวร์ที่ใช้ในการพัฒนาระบบ **WongHiran Website** เพื่อให้ผู้พัฒนาสามารถติดตั้ง ทดสอบ และรักษาสภาพแวดล้อมได้อย่างราบรื่น

---

## 1. ภาพรวมสถาปัตยกรรมระบบ (Client-Side Focus)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│              React 19 + TypeScript + Vite + TailwindCSS         │
│                     Deploy: Vercel (Edge DNS)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Read & Render
┌───────────────────────────▼─────────────────────────────────────┐
│                    INTERNAL DATA SOURCE                         │
│                 mockData.ts (JSON Object Array)                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. ซอฟต์แวร์ที่ต้องติดตั้ง (Development Prerequisites)

| ซอฟต์แวร์ | เวอร์ชันที่แนะนำ | วัตถุประสงค์ | ดาวน์โหลด |
| :--- | :---: | :--- | :--- |
| **Node.js** | 22.x ขึ้นไป | ใช้ในการรัน Development Server ของ Vite | [nodejs.org](https://nodejs.org) |
| **npm** | มากับ Node.js | จัดการ Package Dependencies ตามไฟล์ package.json | มากับ Node.js |
| **Git** | ล่าสุด | บริหารจัดการ Source Code | [git-scm.com](https://git-scm.com) |
| **Visual Studio Code** | ล่าสุด | แนะนำสำหรับการแก้ไขโค้ด เพราะซัพพอร์ต TypeScript 100% | [code.visualstudio.com](https://code.visualstudio.com) |

---

## 3. สภาพแวดล้อม Frontend (Client-Side)

### 3.1 Framework & Build Tool

| เทคโนโลยี | เวอร์ชัน | บทบาท |
| :--- | :---: | :--- |
| **React** | 19.x | UI Library สำหรับประกอบโครงสร้าง DOM |
| **TypeScript** | ~5.8 | ตัวช่วยคุมชนิดตัวแปร ช่วยในการลิงก์ MockData ไปยัง Component |
| **Vite** | 6.2 | ตัว Build Tool และ Hot Reload Server โหมดพัฒนา (Port 3000) |
| **@vitejs/plugin-react** | 5.0 | รองรับการเขียนแบบ JSX / TSX |

### 3.2 UI, Motion & Styling

| Library | เวอร์ชัน | บทบาท |
| :--- | :---: | :--- |
| **TailwindCSS** | 4.1 | นำมาเป็นเครื่องมือเขียนสไตล์ CSS ได้รวดเร็วผ่าน Utility Class |
| **motion** | 12.x | สร้างแอนิเมชันตอนอิลลิเมนต์ปรากฏหรือการสลับหน้าไปมา |
| **swiper** | 12.x | ช่วยสร้างสไลด์แกลลอรีรูปภาพบนหน้าแรกอย่างราบรื่น |
| **lucide-react** | 0.546 | ดึงชุดไอคอนแบบเวกเตอร์น้ำหนักเบา |
| **clsx / tailwind-merge** | - | ช่วยการรวมชื่อ Class Name แบบไดนามิก |

### 3.3 Routing

| Library | เวอร์ชัน | บทบาท |
| :--- | :---: | :--- |
| **react-router-dom** | 7.1 | ควบคุมการเปลี่ยนหน้า Router ไม่ต้องรันเพจใหม่ |

### 3.4 Integration & Utilities

| Library | เวอร์ชัน | บทบาท |
| :--- | :---: | :--- |
| **@vis.gl/react-google-maps**| 1.7 | ติดต่อบริการ Google Maps เพื่อใช้ประมวลหมุดการแสดงสาขา |
| **dotenv** | 17.x | อ่านค่าตัวแปรจากไฟล์ `.env` เช่น คีย์ของแผนที่ |
| **@line/liff** | 2.27 | เตรียมสภาพแวดล้อมให้รองรับ LINE LIFF เผื่อสำหรับโปรเจกต์ต่อไป |
| **@google/genai** | 1.x | ฟีเจอร์ AI จำลอง (ถ้ามี) / ติดตั้งผ่าน Package ล่าสุด |

---

## 4. โครงสร้างการทำงานภายใน

### 4.1 โครงสร้างโฟลเดอร์โครงการ

```
WongHiran Website
│
├── 📂 public/             # เก็บไฟล์สแตติกสาธารณะ รูปภาพ (icon), sitemap.xml
├── 📂 src/
│   ├── 📂 assets/         # เก็บไฟล์เนื้อหาและภาพที่ใช้ในระบบคอมไพล์
│   ├── 📂 components/     # UI Components กลาง เช่น Navbar, Footer, ProductCard
│   ├── 📂 contexts/       # React Context API (AuthContext.tsx)
│   ├── 📂 data/           # Mock data เก็บไฟล์ mockData.ts
│   ├── 📂 pages/          # ตัวหน้าแต่ละหน้า (Home, About, Contact, Packages)
│   ├── index.css          # ไฟล์ CSS หลัก รวมคำสั่งโหลด Tailwind
│   ├── main.tsx           # หน้าต่างจุดบรรจบของโค้ด React ทั้งหมด
│   └── vite-env.d.ts      # กำหนดประเภทตัวอ้างอิงของ Vite
│
├── .env / .env.example    # เก็บ Key API แผนที่
├── index.html             # จุดทางเข้าฝั่ง Web Browser รวมไปถึง SEO เมต้าแทคต่างๆ
├── package.json           # บัญชีสรุปรายการสคริปต์
├── tsconfig.json          # ไฟล์คอนฟิกตัวชี้วัดของ TS Compiler
└── vite.config.ts         # การตั้งค่างาน Build ของปู่ Vite
```

---

## 5. การ Deploy (Production Environment)

ทางกลุ่มโครงการเลือกใช้ **Vercel** เป็นที่ตั้งของระบบฐานข้อมูลเนื่องจากรองรับโปรเจกต์กลุ่ม Vite ทันที พร้อมระบบ Edge CDN อัตโนมัติ

| ส่วน | แพลตฟอร์ม | วิธี Deploy |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) | โยน Repository เข้าแพลตฟอร์ม, ค่าเริ่มต้นตั้งเป็น Vite, ไฟล์คอนฟิกใช้เว็บไซด์แบบ SPA (`vercel.json`) |

### Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 6. Environment Variables

ในโฟลเดอร์ต้นทางจะต้องมีไฟล์ `.env` สำหรับเก็บความลับ ซึ่งปัจจุบันใช้รองรับระบบ Maps ทั่วไป

### สารบบ (`.env`)
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your_key_here...
VITE_LINE_LID=your_liff_id_here
```
*(ถ้าเกิดมีระบบอื่นๆ ในอนาคต ให้ประกาศคู่คีย์ลักษณะแบบ `VITE_XXX_XXX` เพื่อให้ Vite สามารถส่งต่อไปที่ Client ได้อย่างปลอดภัย)*

---

## 7. คำสั่งรันระบบ (Commands Guide)

เปิดหน้า Terminal/Command Prompt ชี้ไปที่โฟลเดอร์โปรเจกต์ `WH-Website`

### 1. ติดตั้ง Dependencies (ทำครั้งแรก)
```bash
npm install
```

### 2. รันในโหมดพัฒนา (Development / Watch Mode)
```bash
npm run dev
# โฮสต์จะเปิดรอรับคำขอที่ http://localhost:3000 หรือ URL ที่ระบบแสดงขึ้นมา
```

### 3. ตรวจสอบข้อผิดพลาดของ Typescript (Lint)
```bash
npm run lint
```

### 4. สั่งบิวด์เพื่อขึ้นโปรดักชัน (Production Build)
```bash
npm run build
# ระบบจะรวบรวมไฟล์และทำ Minified เก็บไว้ในโฟลเดอร์ `dist/`
```

---

## 8. Extensions VS Code ที่แนะนำ
| Extension | Publisher | วัตถุประสงค์ |
| :--- | :--- | :--- |
| Prettier | Prettier | จัดรูปแบบโค้ดอัตโนมัติ (ช่วยให้บรรทัดโค้ดสั้นเรียบร้อยและมีระเบียบ) |
| Tailwind CSS IntelliSense | Tailwind Labs | พิมพ์กึ่งอัตโนมัติเกี่ยวกับ Tailwind class บนหน้า TSX ได้ลื่นไหลขึ้น |
| ES7+ React/Redux/React-Native snippets | dsznajder | ตัวรัดพิมพ์โค้ด Component สร้าง Boilerplate ได้อย่างไว |
