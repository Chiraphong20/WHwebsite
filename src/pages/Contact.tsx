import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ChevronRight, Phone, Mail, MapPin, Clock, Facebook, Send, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

// Fix Leaflet icon issue in Production
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const STORE_LOCATION: [number, number] = [14.999589298072463, 102.11873818037388];
const LINE_OA_LINK = 'https://line.me/R/ti/p/@177eggfh';
const FACEBOOK_LINK = 'https://www.facebook.com/wonghiran20korat';
const EMAIL = 'wonghirangroup@gmail.com';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(LINE_OA_LINK, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-white overflow-hidden border-b border-zinc-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center text-xs font-black uppercase tracking-[0.3em] text-zinc-400 space-x-2 mb-8"
          >
            <span className="hover:text-primary-500 cursor-pointer transition-colors">หน้าแรก</span>
            <ChevronRight size={14} className="text-zinc-300" />
            <span className="text-primary-500">ติดต่อเรา</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-zinc-950 mb-8 tracking-tighter"
          >
            GET IN <span className="text-primary-500">TOUCH</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-semibold"
          >
            มีคำถามหรือต้องการปรึกษาเรื่องการเปิดร้าน สามารถติดต่อเราได้ทุกช่องทาง
            เรายินดีให้คำแนะนำอย่างเต็มที่และรวดเร็วที่สุด
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Phone */}
          <motion.a
            variants={itemVariants}
            href="tel:0935022828"
            className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-2xl flex items-center justify-center text-[#22C55E] mb-5 group-hover:scale-110 transition-all">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-zinc-900 text-lg">เบอร์โทรศัพท์</h3>
            <p className="text-zinc-500 font-medium mt-1">093 502 2828</p>
          </motion.a>

          {/* Email */}
          <motion.a
            variants={itemVariants}
            href={`mailto:${EMAIL}`}
            className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-[#EA4335]/10 rounded-2xl flex items-center justify-center text-[#EA4335] mb-5 group-hover:scale-110 transition-all">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-zinc-900 text-lg">อีเมล</h3>
            <p className="text-zinc-500 font-medium mt-1 break-all text-sm">{EMAIL}</p>
          </motion.a>

          {/* Facebook */}
          <motion.a
            variants={itemVariants}
            href={FACEBOOK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center text-[#1877F2] mb-5 group-hover:scale-110 transition-all">
              <Facebook size={24} />
            </div>
            <h3 className="font-bold text-zinc-900 text-lg">Facebook</h3>
            <p className="text-zinc-500 font-medium mt-1">วงษ์หิรัญค้าส่ง20โคราช</p>
          </motion.a>

          {/* Line OA */}
          <motion.a
            variants={itemVariants}
            href={LINE_OA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-[#06C755]/10 rounded-2xl flex items-center justify-center text-[#06C755] mb-5 group-hover:scale-110 transition-all">
              <i className="fa-brands fa-line text-4xl"></i>
            </div>
            <h3 className="font-bold text-zinc-900 text-lg">LINE OA</h3>
            <p className="text-zinc-500 font-medium mt-1">@177eggfh</p>
          </motion.a>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-zinc-100">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-zinc-950 mb-2">ส่งข้อความถึงเรา</h2>
                <div className="w-20 h-1 bg-primary-500" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-950 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                    <input
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      placeholder="ระบุชื่อของคุณ"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-950 uppercase tracking-wider">เบอร์โทรศัพท์</label>
                    <input
                      required
                      type="tel"
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      placeholder="08x-xxx-xxxx"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-950 uppercase tracking-wider">หัวข้อที่ต้องการสอบถาม</label>
                  <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium appearance-none">
                    <option>สอบถามราคาส่งสินค้า</option>
                    <option>สนใจแพ็กเกจเปิดร้านใหม่</option>
                    <option>สอบถามเรื่องการจัดส่ง</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-950 uppercase tracking-wider">ข้อความ</label>
                  <textarea
                    rows={4}
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                    placeholder="รายละเอียดที่ต้องการสอบถาม..."
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-zinc-200 border border-zinc-800"
                >
                  <Send size={22} className="text-primary-500" />
                  <span>ส่งข้อมูลและติดต่อผ่าน LINE OA</span>
                </motion.button>
              </form>
            </div>
          </div>

          {/* Map & Address */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-zinc-100">
              <h2 className="text-2xl font-black text-zinc-950 mb-8 border-b border-zinc-100 pb-4">
                <span className="text-primary-500">ที่อยู่วงษ์หิรัญ</span>
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white shrink-0">
                    <MapPin size={22} className="text-primary-500" />
                  </div>
                  <span className="text-zinc-600 font-medium pt-1">
                    476/1 หมู่ 2 ต.บ้านเกาะ อ.เมือง จ.นครราชสีมา 30000
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white shrink-0">
                    <Clock size={22} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="font-black text-zinc-950 uppercase tracking-wider text-sm mb-1">เวลา เปิด-ปิดโกดัง</p>
                    <p className="text-zinc-500">เปิดทุกวัน 08:00 – 17:30 น.</p>
                    <p className="text-xs text-zinc-400 mt-1 italic">หยุดเฉพาะวันสงกรานต์และวันปีใหม่</p>
                  </div>
                </div>
              </div>
            </div>

            {/* React Leaflet Map with Google Maps Layer */}
            <div className="h-[420px] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-0">
              <MapContainer
                center={STORE_LOCATION}
                zoom={18}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution="&copy; Google Maps"
                  url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />
                <Marker position={STORE_LOCATION}>
                  <Popup>
                    <div className="text-center p-1">
                      <p className="font-black text-zinc-950">วงษ์หิรัญค้าส่ง</p>
                      <p className="text-[10px] text-zinc-500">Warehouse</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

