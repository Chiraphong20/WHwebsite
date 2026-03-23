import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, ShieldCheck, Star, Loader2, ShoppingCart, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../data/mockData';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CLOUD_NAME = "dffqpiizc";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/`;

const categories = [
  "ของเล่นเด็ก", "เครื่องเขียน", "กีฬากลางแจ้ง", "เครื่องครัว",
  "กิ๊ฟช็อป", "เครื่องบูชา", "อุปกรณ์ไอที", "ของใช้ในบ้าน",
  "เบ็ดเตล็ด", "เครื่องมือช่าง", "ความงาม", "อุปกรณ์สัตว์เลี้ยง"
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.slice(0, 4).map((item: any) => {
            let imageUrl = item.image;
            if (item.imageId) {
              imageUrl = `${CLOUDINARY_BASE_URL}${item.imageId}.jpg`;
            } else if (!item.image) {
              imageUrl = 'https://placehold.co/400x400?text=No+Image';
            }
            return {
              ...item,
              images: typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []),
              image: imageUrl,
              isBestSeller: true
            };
          });
          setBestSellers(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch best sellers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <div className="flex flex-col bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center pt-20 pb-12 overflow-hidden bg-primary-50">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/2 pt-10 md:pt-0"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-primary-100 text-primary-600 font-semibold text-sm mb-6">
              <Star className="w-4 h-4 mr-2 text-accent" fill="currentColor" />
              ประสบการณ์กว่า 10 ปี โกดัง 4 สาขา
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-dark leading-tight mb-6">
              วงษ์หิรัญ<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                ฟุคุโระค้าส่ง
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium mb-10 leading-relaxed max-w-lg">
              อาณาจักรค้าส่งสินค้า 20 บาทที่ใหญ่และคุ้มค่าที่สุดในโคราช มั่นใจได้ในมาตรฐาน ราคา และบริการที่ครอบคลุมสำหรับร้านค้าของคุณ
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/products"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-primary-500 rounded-2xl hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>เริ่มช้อปสินค้าทันที</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center px-8 py-4 font-bold text-primary-600 bg-white border-2 border-primary-100 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-300"
              >
                แพ็กเกจเปิดร้าน
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="w-full md:w-1/2 mt-16 md:mt-0 flex justify-center relative"
          >
            {/* Glowing Backdrop */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-primary-300/20 to-accent/20 rounded-full blur-3xl -z-10"></div>
            
            <motion.div 
              className="relative w-72 h-72 md:w-96 md:h-96 z-10"
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <img 
                src="/images/้home/1024303_0-removebg-preview.png" 
                alt="Fukuro Cat Mascot" 
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
              
              {/* Floating Badges */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute top-4 -left-8 md:-left-12 glass px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-lg"
              >
                <div className="bg-green-100 p-2 rounded-full"><TrendingUp className="text-green-600 w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">ยอดขายปัง</div>
                  <div className="text-sm font-bold text-dark">กำไรเน้นๆ</div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 -right-8 md:-right-12 glass px-4 py-3 rounded-2xl flex items-center space-x-3 shadow-lg"
              >
                <div className="bg-primary-100 p-2 rounded-full"><Package className="text-primary-600 w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">สินค้าพร้อมส่ง</div>
                  <div className="text-sm font-bold text-dark">1,000+ รายการ</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="bg-primary-500 py-4 overflow-hidden border-y border-primary-600/50">
        <div className="flex w-max animate-marquee space-x-12 px-6">
          {/* Duplicate the array exactly twice. The animation moves -50%, which equals exactly one full set. */}
          {[...categories, ...categories, ...categories, ...categories, ...categories, ...categories, ...categories, ...categories].map((category, index) => (
            <span key={index} className="text-white/90 font-semibold text-lg flex items-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-accent mr-4 shadow-sm"></span>
              <span className="tracking-wide shadow-sm">{category}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Info Stats Section */}
      <section className="py-16 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '10+ ปี', label: 'ประสบการณ์ค้าส่ง', desc: 'เชี่ยวชาญตลาดสินค้าเบ็ดเตล็ด' },
              { number: '4 สาขา', label: 'หน้าร้านในโคราช', desc: 'พร้อมให้บริการและรับสินค้า' },
              { number: '1,500+', label: 'คู่ค้าที่ไว้ใจเรา', desc: 'ร้านค้าปลีกทั่วประเทศ' }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-primary-700 mb-2">{stat.number}</div>
                <div className="text-lg font-bold text-dark mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-dark mb-6">ทำไมลูกค้ากว่า 1,500 รายถึงเลือกเรา?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">จุดเด่น 3 ประการที่เป็นหัวใจหลักของวงษ์หิรัญ ที่ทำให้ธุรกิจของคุณเติบโตไปพร้อมกับเรา</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Star size={32} />, title: 'ราคา (Price)', desc: 'เราให้ราคาขายส่งที่คุ้มค่าที่สุด ช่วยเพิ่มส่วนต่างกำไรให้ร้านค้าของคุณ ทำให้ร้าน 20 บาทของคุณโตได้ไว' },
              { icon: <ShieldCheck size={32} />, title: 'มาตรฐาน (Standards)', desc: 'คัดสรรสินค้าคุณภาพ พร้อมระบบการจัดส่งและการบริการหลังการขายที่รัดกุม ตรวจสอบได้' },
              { icon: <Package size={32} />, title: 'หลากหลาย (Variety)', desc: 'สินค้าครบทุกหมวดหมู่กว่า 1,000 รายการ มาที่เราที่เดียวได้ของครบ พร้อมเปิดร้านทันที ไม่ต้องวิ่งหลายที่' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 bg-white rounded-[2rem] text-center shadow-lg shadow-gray-200/50 border border-gray-100 hover:border-primary-300 transition-all duration-300 group"
              >
                <div className="w-20 h-20 mx-auto bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 transform group-hover:rotate-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Star className="text-accent fill-accent" size={24} />
                <h2 className="text-3xl md:text-4xl font-bold text-dark">สินค้าขายดีแนะนำ</h2>
              </div>
              <p className="text-lg text-gray-600">ไอเทมเด็ดที่ร้าน 20 บาททุกร้านต้องมีติดร้านไว้ ขายออกไว กำไรดี</p>
            </div>
            <Link to="/products" className="group flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 px-5 py-2.5 rounded-full transition-colors">
              <span>ดูสินค้าทั้งหมด</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-primary-500" size={48} />
              <p className="text-gray-500 font-medium">กำลังโหลดสินค้าสุดฮิต...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <Link to={`/products`} key={product.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      ขายดี 🔥
                    </div>
                    {/* Hover Overlay Action */}
                    <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white text-primary-600 px-6 py-2.5 rounded-full font-bold flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <ShoppingCart size={18} />
                        <span>เลือกดูสินค้า</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-xs text-primary-600 font-bold mb-2 uppercase tracking-wide bg-primary-50 inline-block px-2 py-1 rounded w-fit">{product.category}</p>
                    <h3 className="font-semibold text-dark text-lg line-clamp-2 mb-4 group-hover:text-primary-600 transition-colors flex-1">{product.name}</h3>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-1">ราคาส่งเริ่มต้น</div>
                        <div className="text-xl font-extrabold text-primary-600 line-clamp-1">฿{Number(product.wholesalePrice).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 font-medium mb-1">ราคาปลีก</div>
                        <div className="text-sm font-semibold text-gray-600">฿{Number(product.retailPrice).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Facebook Reels Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook Reels</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">ดูบรรยากาศร้านค้าจริง</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">ชมคลิปบรรยากาศและสินค้าของเราจาก Facebook Reels ได้เลยครับ</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {[
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1488611779327844%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1094261466200926%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2116653489111310%2F&show_text=false&width=267&t=0",
              "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F755963940920240%2F&show_text=false&width=268&t=0",
            ].map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="w-full max-w-[267px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <iframe
                  src={src}
                  width="267"
                  height="476"
                  style={{ border: 'none', overflow: 'hidden', display: 'block', width: '100%' }}
                  scrolling="no"
                  frameBorder={0}
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title={`Facebook Reel ${idx + 1}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 z-0"></div>
        {/* Abstract Overlays */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent opacity-10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-sm">พร้อมจะเป็นเจ้าของร้าน 20 บาทหรือยัง?</h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed font-medium">
            เรามีแพ็กเกจสำเร็จรูปสำหรับคนเริ่มต้น พร้อมให้คำปรึกษาฟรี<br className="hidden md:block"/> 
            ตั้งแต่การเลือกสินค้าไปจนถึงการจัดร้านด้วยทีมงานมืออาชีพ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/packages"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span>ดูรายละเอียดแพ็กเกจ</span>
              <ArrowRight size={24} />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
            >
              ปรึกษาฟรี
            </Link>
          </div>
          <div className="mt-12 text-white/80 font-medium">
            หรือเยี่ยมชมเว็บไซต์หลักของเรา <a href="http://www.wonghiran.com" className="text-accent underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">www.wonghiran.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}
