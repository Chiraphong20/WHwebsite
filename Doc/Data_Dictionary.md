# พจนานุกรมข้อมูล (Data Dictionary)
## ไฟล์อ้างอิง: `src/data/mockData.ts`

เอกสารนี้รวบรวมรายละเอียดโครงสร้างของแต่ละชุดข้อมูลที่ถูกจำลองเก็บเอาไว้ในระบบ Client (Frontend Data Model) โดยอธิบายชื่อคอลัมน์ (Field Key), ชนิดข้อมูล (Data Type ของ TypeScript) และรายละเอียดของข้อมูลที่จัดเก็บ

---

## 1. Type Interface: `Branch` 
**คำอธิบาย:** จัดเก็บข้อมูลสาขาทั้ง 4 แห่งของวงษ์หิรัญค้าส่ง ใช้ส่งค่าไปให้ Google Maps ในการปักหมุดตำแหน่ง (Marker)

| ชื่อคอลัมน์ (Field) | ชนิดข้อมูล (Type) | เงื่อนไข (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `id` | string | PK | รหัสสาขา (เช่น branch-1, branch-2) |
| `name` | string | NOT NULL | ชื่อของสาขา (เช่น สาขาใหญ่ (บ้านเกาะ)) |
| `address` | string | NOT NULL | ที่อยู่ของสาขาเต็มรูปแบบ |
| `phone` | string | NOT NULL | เบอร์โทรศัพท์ประจำสาขา |
| `coordinates` | object | NOT NULL | พิกัดแผนที่ (มี `{ lat: number, lng: number }`) |
| `mapUrl` | string | NULL | ลิงก์ตรงที่เปิดดูบนแอป Google Maps ของอุปกรณ์ผู้ใช้ |
| `hours` | string | NOT NULL | ช่วงเวลาที่จุดบริการนี้เปิดให้ทำงาน (เช่น ทุกวัน 08:00 - 17:00 น.) |
| `imageUrl` | string | NOT NULL | พาธ หรือ URL รูปภาพหน้าร้าน |

---

## 2. Type Interface: `Product`
**คำอธิบาย:** รายละเอียดสินค้าเพื่อโชว์ในแค็ตตาล็อกและแสดงฟังก์ชันการกดเพิ่มลงตะกร้า (จำลอง)

| ชื่อคอลัมน์ (Field) | ชนิดข้อมูล (Type) | เงื่อนไข (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `id` | string | PK | รหัสเฉพาะของตัวสินค้า |
| `name` | string | NOT NULL | ชื่อของตัวสินค้า |
| `description` | string | NULL | รายละเอียดและคำบรรยายของสินค้า |
| `price` | number | NOT NULL | ราคาขายปัจจุบัน (หน่วย: บาท) |
| `category` | string | NOT NULL | รหัสหรือชื่อหมวดหมู่ที่ใช้แบ่งประเภทสินค้า |
| `imageUrl` | string | NOT NULL | ภาพประกอบสินค้า |
| `isNew` | boolean | NULL | ธงสำหรับป้ายแจ้งเตือน "สินค้าใหม่ล่าสุด" ถ้าหากเป็น `true` |
| `isHot` | boolean | NULL | ธงสำหรับป้ายแจ้งเตือน "สินค้ายอดฮิต" ติดไฟ ถ้าหากเป็น `true` |

---

## 3. Type Interface: `Package`
**คำอธิบาย:** ข้อมูลโปรโมชัน "แฟรนไชส์จำลอง" เพื่อโปรโมทให้ลูกค้าหรือพ่อค้าแม่ค้าหน้าใหม่เปิดร้าน 20 บาท

| ชื่อคอลัมน์ (Field) | ชนิดข้อมูล (Type) | เงื่อนไข (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `id` | string | PK | รหัสอ้างอิงโปรโมชัน |
| `title` | string | NOT NULL | ชื่อที่โชว์ของแพ็กเกจ |
| `description` | string | NOT NULL | คำบรรยายสรรพคุณแบบสั้น |
| `price` | number | NOT NULL | งบประมาณที่เป็นตัวช่วยอ้างอิงของแต่ละระดับ |
| `features` | string[] | NOT NULL | อาร์เรย์ (รายการ) ของจุดเด่นและสิ่งที่ลูกค้าจะได้จากการคว้าแพ็กเกจนี้ |
| `imageUrl` | string | NOT NULL | โปสเตอร์กราฟิกประกอบตัวแพ็กเกจ (ถ้ามี) |

---

## 4. Type Interface: `Category`
**คำอธิบาย:** ใช้ฟื้นฟูเครื่องมือสืบค้นหาในหน้าแคตตาล็อกสินค้า 

| ชื่อคอลัมน์ (Field) | ชนิดข้อมูล (Type) | เงื่อนไข (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `id` | string | PK | รหัสหมวดหมู่ (เช่น toy, station, kitchen) |
| `name` | string | NOT NULL | ชื่อหมวดหมู่ฉบับภาษาไทยที่สามารถมองเห็นได้ |
| `icon` | reactNode| NULL | ลิงก์หรือออปเจกต์ไอคอนภาพ SVG จาก Lib ภายนอก |
