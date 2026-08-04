export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  minWholesaleQty: number;
  stock: number;
  unit: string;
  unitQty?: number;   // จำนวนชิ้นต่อหน่วย เช่น 1 แพ็ค = 6 ชิ้น
  bulkQty?: number;   // จำนวนขั้นต่ำสำหรับราคา bulk
  bulkPrice?: number; // ราคา bulk
  image: string;
  images: string[];
  description: string;
  isBestSeller?: boolean;
  createdAt?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  videoUrl: string;
  isPublished: boolean | number;
  createdAt: string;
  updatedAt?: string;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  description: string;
  items: string[];
  image: string;
}

// ฟังก์ชันช่วยสร้าง Link รูปภาพ
const getImg = (text: string, color: string = 'cbd5e1') => 
  `https://placehold.co/400x400/${color}/334155?text=${encodeURIComponent(text)}`;

export const CATEGORIES = [
  "สินค้าขายดี", "สินค้าโปรโมชั่น", "ของเล่นเด็ก", "อุปกรณ์กีฬา",
  "อุปกรณ์ทำความสะอาด", "เครื่องครัว", "อุปกรณ์แคมปิ้ง", "พลาสติก",
  "อุปกรณ์ไฟฟ้า", "เครื่องใช้ไฟฟ้า", "อุปกรณ์สัตว์เลี้ยง", "เครื่องมือช่าง",
  "สินค้าเทศกาล", "เซรามิก", "อุปกรณ์ขายสินค้า", "ของใช้ในบ้าน",
  "กิ๊ฟช็อป", "เครื่องบูชา", "เครื่องเขียน", "อุปกรณ์ไอที",
  "เบ็ดเตล็ด", "ของชำร่วย", "เครื่องแก้ว", "อุปกรณ์ทำสวน"
];

// PRODUCTS array is now fetched dynamically from the backend inside pages!
// PACKAGES ย้ายไปเป็นค่าเริ่มต้นที่ src/lib/siteContent.ts (DEFAULT_PACKAGES_CONTENT) — แก้ไขได้จากหน้า Admin
