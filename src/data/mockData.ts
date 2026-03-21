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
  image: string;
  images: string[];
  description: string;
  isBestSeller?: boolean; // added for Home.tsx compatibility
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
  "ของเล่นเด็ก", "เครื่องเขียน", "กีฬากลางแจ้ง", "เครื่องครัว",
  "กิ๊ฟช็อป", "เครื่องบูชา", "อุปกรณ์ไอที", "ของใช้ในบ้าน",
  "เบ็ดเตล็ด", "เครื่องมือช่าง", "ความงาม", "อุปกรณ์สัตว์เลี้ยง"
];

// PRODUCTS array is now fetched dynamically from the backend inside pages!

export const PACKAGES: Package[] = [
  {
    id: 'starter-1',
    name: 'แพ็กเกจเริ่มต้นเปิดร้าน',
    price: '10,000 บาท',
    description: 'เหมาะสำหรับผู้ที่ต้องการทดลองตลาด หรือเปิดร้านขนาดเล็ก',
    items: [
      'สินค้าคละหมวดหมู่ 500+ ชิ้น',
      'ป้ายไวนิลหน้าร้าน 1 ผืน',
      'คู่มือการจัดร้านเบื้องต้น',
      'ให้คำปรึกษาฟรี'
    ],
    image: 'https://picsum.photos/seed/package1/600/400'
  },
  {
    id: 'starter-2',
    name: 'แพ็กเกจเปิดร้านขนาดกลาง',
    price: '30,000 บาท',
    description: 'แพ็กเกจยอดนิยม ครอบคลุมสินค้าขายดีทุกหมวดหมู่',
    items: [
      'สินค้าคละหมวดหมู่ 1,500+ ชิ้น',
      'ป้ายไวนิลหน้าร้าน 2 ผืน',
      'ชั้นวางสินค้าขนาดมาตรฐาน 2 ชุด',
      'บริการจัดส่งฟรี (ตามเงื่อนไข)',
      'ให้คำปรึกษาการตั้งราคา'
    ],
    image: 'https://picsum.photos/seed/package2/600/400'
  }
];
