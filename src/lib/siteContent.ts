// รูปแบบข้อมูล "เนื้อหาเว็บไซต์" ที่แก้ไขได้จากหน้า Admin (เก็บผ่าน /api/settings/:key)
// ค่าเริ่มต้นด้านล่างตรงกับข้อความเดิมที่เคย hardcode ไว้ในแต่ละหน้า — ใช้เป็น fallback
// เวลาที่ backend ยังไม่มีข้อมูล (ยังไม่ seed) หรือเรียก API ไม่สำเร็จ เว็บจะยังแสดงผลได้ตามปกติ

import { Package } from '../data/mockData';

export interface HomeContent {
  stats: { number: string; label: string; desc: string }[];
  highlightsTitle: string;
  highlightsSubtitle: string;
  highlights: { title: string; desc: string }[];
  reels: string[]; // ลิงก์ Facebook Reel เช่น https://www.facebook.com/reel/xxxxxxx/
}

export interface AboutContent {
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  stats: { number: string; label: string }[];
  values: { title: string; desc: string }[];
}

export interface ContactContent {
  phone: string;
  email: string;
  facebookLink: string;
  facebookName: string;
  lineOaLink: string;
  lineOaName: string;
  address: string;
  hoursLine1: string;
  hoursLine2: string;
}

export interface PackagesContent {
  heroTitle: string;
  heroSubtitle: string;
  featureHighlights: { title: string; desc: string }[];
  salesPackageTitle: string;
  salesPackageSubtitle: string;
  packages: Package[];
  equipmentTitle: string;
  equipmentSubtitle: string;
  equipment: { image: string; label: string }[];
  posFeaturesTitle: string;
  posFeaturesSubtitle: string;
  posFeatures: { image: string; label: string }[];
  galleryTitle: string;
  gallerySubtitle: string;
  galleryImages: string[];
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  stats: [
    { number: '10+ ปี', label: 'ประสบการณ์ค้าส่ง', desc: 'เชี่ยวชาญตลาดสินค้าเบ็ดเตล็ด' },
    { number: '4 สาขา', label: 'หน้าร้านในโคราช', desc: 'พร้อมให้บริการและรับสินค้า' },
    { number: '1,500+', label: 'คู่ค้าที่ไว้ใจเรา', desc: 'ร้านค้าปลีกทั่วประเทศ' },
  ],
  highlightsTitle: 'ทำไมลูกค้ากว่า 1,500 รายถึงเลือกเรา?',
  highlightsSubtitle: 'จุดเด่น 3 ประการที่เป็นหัวใจหลักของวงษ์หิรัญ ที่ทำให้ธุรกิจของคุณเติบโตไปพร้อมกับเรา',
  highlights: [
    { title: 'ราคา (Price)', desc: 'เราให้ราคาขายส่งที่คุ้มค่าที่สุด ช่วยเพิ่มส่วนต่างกำไรให้ร้านค้าของคุณ ทำให้ร้าน 20 บาทของคุณโตได้ไว' },
    { title: 'มาตรฐาน (Standards)', desc: 'คัดสรรสินค้าคุณภาพ พร้อมระบบการจัดส่งและการบริการหลังการขายที่รัดกุม ตรวจสอบได้' },
    { title: 'หลากหลาย (Variety)', desc: 'สินค้าครบทุกหมวดหมู่กว่า 1,000 รายการ มาที่เราที่เดียวได้ของครบ พร้อมเปิดร้านทันที ไม่ต้องวิ่งหลายที่' },
  ],
  reels: [
    'https://www.facebook.com/reel/1488611779327844/',
    'https://www.facebook.com/reel/1094261466200926/',
    'https://www.facebook.com/reel/2116653489111310/',
    'https://www.facebook.com/reel/755963940920240/',
  ],
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  heroTitleLine1: 'รู้จักกับ',
  heroTitleHighlight: 'วงษ์หิรัญค้าส่ง',
  heroSubtitle: 'เราคือพันธมิตรที่ช่วยให้คุณเริ่มต้นและเติบโตในธุรกิจร้าน 20 บาท ด้วยประสบการณ์กว่า 10 ปี และความจริงใจ',
  storyHeading: 'จากร้านค้าเล็กๆ สู่โกดังค้าส่งขนาดใหญ่ที่ได้รับความไว้วางใจ',
  storyParagraph1: 'วงษ์หิรัญค้าส่ง เริ่มต้นจากการเป็นร้านขายปลีกสินค้าเบ็ดเตล็ด เราเข้าใจดีว่าพ่อค้าแม่ค้าต้องการอะไร ทั้งในเรื่องของคุณภาพสินค้า ราคาที่แข่งขันได้ และความหลากหลายที่ตอบโจทย์ผู้บริโภค',
  storyParagraph2: 'ปัจจุบันเราได้ขยายตัวเป็นโกดังค้าส่งขนาดใหญ่ในจังหวัดนครราชสีมา ที่รวบรวมสินค้าจากโรงงานโดยตรง เพื่อส่งต่อสินค้าคุณภาพในราคาที่คุ้มค่าที่สุดให้กับลูกค้าทั่วประเทศ',
  stats: [
    { number: '1,000+', label: 'รายการสินค้า' },
    { number: '500+', label: 'ลูกค้าเปิดร้านใหม่' },
    { number: '10+ ปี', label: 'ประสบการณ์ค้าส่ง' },
    { number: '4 สาขา', label: 'หน้าร้านในโคราช' },
  ],
  values: [
    { title: 'ความซื่อสัตย์', desc: 'เราค้าขายด้วยความจริงใจ แจ้งรายละเอียดสินค้าและราคาอย่างตรงไปตรงมา' },
    { title: 'คุณภาพสินค้า', desc: 'คัดสรรสินค้าที่ใช้งานได้จริง ทนทาน และคุ้มค่ากับราคา 20 บาท' },
    { title: 'เติบโตไปด้วยกัน', desc: 'เราไม่ได้แค่ขายสินค้า แต่เราอยากเห็นลูกค้าประสบความสำเร็จในธุรกิจ' },
  ],
};

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
  phone: '093 502 2828',
  email: 'wonghirangroup@gmail.com',
  facebookLink: 'https://www.facebook.com/wonghiran20korat',
  facebookName: 'วงษ์หิรัญค้าส่ง20โคราช',
  lineOaLink: 'https://line.me/R/ti/p/@177eggfh',
  lineOaName: '@177eggfh',
  address: '476/1 หมู่ 2 ต.บ้านเกาะ อ.เมือง จ.นครราชสีมา 30000',
  hoursLine1: 'เปิดทุกวัน 08:00 – 17:30 น.',
  hoursLine2: 'หยุดเฉพาะวันสงกรานต์และวันปีใหม่',
};

export const DEFAULT_PACKAGES_CONTENT: PackagesContent = {
  heroTitle: 'แฟรนไชส์แบบพาร์ทเนอร์ (ไม่มีสัญญา)',
  heroSubtitle: 'เหมาะสำหรับท่านที่มีประสบการณ์เป็นเจ้าของธุรกิจแล้ว และต้องการแบรนด์ร้านค้าเป็นของตัวเอง หรือต้องการขายสินค้าหลากหลายประเภทภายในร้านร่วมกัน',
  featureHighlights: [
    { title: 'แบรนด์ของคุณเอง', desc: 'ร้านค้าเป็นแบรนด์ของคุณ คุณคือเจ้าของ 100%' },
    { title: 'ตกแต่งอิสระ', desc: 'ดีไซน์และตกแต่งร้านค้าในสไตล์ที่คุณต้องการ' },
    { title: 'ไม่มีข้อผูกมัด', desc: 'ซื้อสินค้าจากแหล่งไหนเข้าร้านเพิ่มก็ได้ ไม่มีสัญญาผูกมัด' },
    { title: 'บริหารและลงทุนเอง', desc: 'บริหารร้านเอง ลงทุนเอง 100% กำไรรับเต็มๆ' },
  ],
  salesPackageTitle: 'SALES PACKAGE',
  salesPackageSubtitle: 'ราคานี้รวมรายการสินค้า ชั้นวาง เคาน์เตอร์ และป้ายร้านแล้ว',
  packages: [
    {
      id: 'pack-s',
      name: 'PACK S (พื้นที่ประมาณ 16 ตรม.)',
      price: '95,000 บาท',
      description: 'แพ็กเกจเริ่มต้น เหมาะสำหรับผู้ที่มีพื้นที่จำกัดหรือเพิ่งเริ่มต้น',
      items: [
        'สินค้าสำหรับจำหน่าย เลือกสินค้าได้ 10 บาท หรือ 20 บาท 2,000 ชิ้น',
        'ชั้นวางสินค้าขนาด 45 X 90 X 180 (6 ชุด)',
        'ชั้นวางสินค้าขนาด 45 X 90 X 150 (2 ชุด)',
        'ชั้นสองด้านขนาด 90 X 90 X 150 (2 ชุด)',
        'ชุดเคาท์เตอร์คิดเงินขนาด 60X40 ซม. (1 ตัว)',
        'ชุดตะขอแขวนความยาว 8 นิ้ว (100 ตัว)',
        'ชิ้นป้ายหน้าร้าน ปรับตามขนาดร้าน (ไม่เกิน 10 ตารางเมตร)',
        'ป้ายธงญี่ปุ่นขนาด 120 X 50 ซม. (2 ชุด)',
        'ฟิวเจอร์บอร์ดบนชั้น 30 X 90 (2 ชุด)',
        'ระบบขายสินค้าแบบ ONLINE: GROWSTORE (1 LICENSE)',
      ],
      image: '/images/packages/package-page-5.jpg',
    },
    {
      id: 'pack-m',
      name: 'PACK M (พื้นที่ประมาณ 32 ตรม.)',
      price: '189,000 บาท',
      description: 'แพ็กเกจขนาดยอดนิยม ได้สินค้าหลากหลายและชั้นวางจัดเต็มร้าน',
      items: [
        'สินค้าสำหรับจำหน่าย เลือกสินค้าได้ 10 บาท หรือ 20 บาท 6,000 ชิ้น',
        'ชั้นวางสินค้าขนาด 45 X 90 X 180 (8 ชุด)',
        'ชั้นวางสินค้าขนาด 45 X 90 X 150 (2 ชุด)',
        'ชั้นสองด้านขนาด 90 X 90 X 150 (2 ชุด)',
        'ชุดเคาท์เตอร์คิดเงินขนาด 60X40 ซม. (1 ตัว)',
        'ชุดตะขอแขวนความยาว 8 นิ้ว (200 ตัว)',
        'ชิ้นป้ายหน้าร้าน ปรับตามขนาดร้าน (ไม่เกิน 10 ตารางเมตร)',
        'ป้ายธงญี่ปุ่นขนาด 120 X 50 ซม. (2 ชุด)',
        'ฟิวเจอร์บอร์ดบนชั้น 30 X 90 (2 ชุด)',
        'ระบบขายสินค้าแบบ ONLINE: GROWSTORE (1 LICENSE)',
      ],
      image: '/images/packages/package-page-6.jpg',
    },
    {
      id: 'pack-l',
      name: 'PACK L (พื้นที่ประมาณ 60 ตรม.)',
      price: '349,000 บาท',
      description: 'แพ็กเกจใหญ่ครอบคลุมทุกสินค้า เหมาะสำหรับทำเลศักยภาพสูง',
      items: [
        'สินค้าสำหรับจำหน่าย เลือกสินค้าได้ 10 บาท หรือ 20 บาท 12,000 ชิ้น',
        'ชั้นวางสินค้าขนาด 45 X 90 X 180 (21 ชุด)',
        'ชั้นวางสินค้าขนาด 45 X 90 X 150 (6 ชุด)',
        'ชั้นสองด้านขนาด 90 X 90 X 150 (6 ชุด)',
        'ชุดเคาท์เตอร์คิดเงินขนาด 150X40 ซม. (1 ตัว)',
        'ชุดตะขอแขวนความยาว 8 นิ้ว (500 ตัว)',
        'ชิ้นป้ายหน้าร้าน ปรับตามขนาดร้าน (ไม่เกิน 10 ตารางเมตร)',
        'ป้ายธงญี่ปุ่นขนาด 120 X 50 ซม. (2 ชุด)',
        'ฟิวเจอร์บอร์ดบนชั้น 30 X 90 (2 ชุด)',
        'ระบบขายสินค้าแบบ ONLINE: GROWSTORE (1 LICENSE)',
      ],
      image: '/images/packages/package-page-7.jpg',
    },
  ],
  equipmentTitle: 'อุปกรณ์ตกแต่งร้านที่ได้รับ',
  equipmentSubtitle: 'ตัวอย่างชั้นวางสินค้าและอุปกรณ์คุณภาพมาตรฐาน',
  equipment: [
    { image: '/images/packages/shelf-single.png', label: 'ชั้นวางสินค้าหน้าเดียว' },
    { image: '/images/packages/shelf-double.png', label: 'ชั้นวางสินค้าสองหน้า' },
    { image: '/images/packages/shelf-mesh.png', label: 'แผงตาข่ายแบบหลัง/ตะขอแขวน' },
  ],
  posFeaturesTitle: 'ฟีเจอร์เด่นของ GROW STORE POS',
  posFeaturesSubtitle: 'ตัวช่วยให้คุณบริหารร้าน 20 บาทได้อย่างมืออาชีพและง่ายดาย',
  posFeatures: [
    { image: '/images/pakages-pos-growstore/POS.png', label: 'ระบบแคชเชียร์หน้าจอ POS' },
    { image: '/images/pakages-pos-growstore/product.png', label: 'ระบบจัดการสต๊อกสินค้า' },
    { image: '/images/pakages-pos-growstore/report.png', label: 'แดชบอร์ดรายงานยอดขาย' },
    { image: '/images/pakages-pos-growstore/mobile-pos.png', label: 'ดูรายงานผ่านมือถือ' },
    { image: '/images/pakages-pos-growstore/branch.png', label: 'บริหารจัดการได้หลายสาขา' },
    { image: '/images/pakages-pos-growstore/shortcut-menu.png', label: 'เมนูลัดขายรวดเร็ว' },
  ],
  galleryTitle: 'ภาพกิจกรรมหน้าตาของร้าน',
  gallerySubtitle: 'ตัวอย่างร้านค้าที่ใช้บริการแพ็กเกจและอุปกรณ์ตกแต่งของเรา',
  galleryImages: [
    '/images/activity/625944877_1495111829287615_3307159896768661283_n.jpg',
    '/images/activity/625999582_1494767965988668_6283804814847378561_n.jpg',
    '/images/activity/648792989_1526453439486787_5066533745799125478_n.jpg',
    '/images/activity/649039943_1526453346153463_931526647838172594_n.jpg',
    '/images/activity/650335348_1532227425576055_6870237604650914477_n.jpg',
    '/images/activity/650359189_1532971292168335_1145679540030734189_n.jpg',
    '/images/activity/650381185_1532106315588166_8581240454353907097_n.jpg',
    '/images/activity/652971401_1532971392168325_1634730471391681130_n.jpg',
  ],
};

// ดึงเนื้อหาจาก /api/settings/:key — คืนค่า null ถ้ายังไม่มี/เรียกไม่สำเร็จ (ให้ผู้เรียกใช้ fallback เอง)
export async function fetchSiteContent<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`/api/settings/${key}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

// เหมือน fetchSiteContent แต่ผสาน (merge) กับค่าเริ่มต้นเสมอ กันหน้าเว็บพังถ้าข้อมูลที่บันทึกไว้เป็นสคีมาเก่า
// (เช่น เพิ่งเพิ่มฟิลด์ใหม่ทีหลัง แต่ข้อมูลเดิมใน backend ยังไม่มีฟิลด์นั้น)
export async function fetchSiteContentMerged<T extends object>(key: string, defaults: T): Promise<T> {
  const data = await fetchSiteContent<Partial<T>>(key);
  return data ? { ...defaults, ...data } : defaults;
}
