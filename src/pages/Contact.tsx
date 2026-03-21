import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { ChevronRight, Phone, Mail, MapPin, Clock, Facebook, MessageCircle, Send } from 'lucide-react';
import { motion } from 'motion/react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const STORE_LOCATION = { lat: 14.9737, lng: 102.0827 }; // Example: Nakhon Ratchasima

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('ขอบคุณที่ติดต่อเรา เราจะติดต่อกลับโดยเร็วที่สุด');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center text-sm text-gray-500 space-x-2 mb-4">
            <span>หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="text-red-600 font-medium">ติดต่อเรา</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ติดต่อสอบถามข้อมูล</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            มีคำถามหรือต้องการปรึกษาเรื่องการเปิดร้าน สามารถติดต่อเราได้ทุกช่องทาง 
            เรายินดีให้คำแนะนำอย่างเต็มที่
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          {/* Contact Info Cards */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-gray-900">โทรศัพท์</h3>
            <p className="text-gray-600 text-sm">08x-xxx-xxxx<br />044-xxx-xxx</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mx-auto">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Line OA</h3>
            <p className="text-gray-600 text-sm">@wonghiran_wholesale<br />(คลิกเพื่อแอดไลน์)</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
              <Facebook size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Facebook</h3>
            <p className="text-gray-600 text-sm">วงษ์หิรัญค้าส่ง 20 บาท<br />นครราชสีมา</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">ส่งข้อความถึงเรา</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="ระบุชื่อของคุณ"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">หัวข้อที่ต้องการสอบถาม</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                  <option>สอบถามราคาส่งสินค้า</option>
                  <option>สนใจแพ็กเกจเปิดร้านใหม่</option>
                  <option>สอบถามเรื่องการจัดส่ง</option>
                  <option>อื่นๆ</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">ข้อความ</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  placeholder="รายละเอียดที่ต้องการสอบถาม..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>ส่งข้อความ</span>
              </button>
            </form>
          </div>

          {/* Map & Address */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ที่อยู่โกดัง</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-gray-600">
                  <MapPin size={20} className="text-red-600 shrink-0 mt-1" />
                  <span>123 หมู่ 4 ต.ในเมือง อ.เมือง จ.นครราชสีมา 30000</span>
                </div>
                <div className="flex items-start space-x-3 text-gray-600">
                  <Clock size={20} className="text-red-600 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900">เวลาทำการ:</p>
                    <p>จันทร์ - เสาร์: 08:00 - 18:00 น.</p>
                    <p>อาทิตย์: 09:00 - 16:00 น.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="h-[350px] rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              {!hasValidKey ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center p-8 text-center">
                  <div>
                    <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">กรุณาตั้งค่า Google Maps API Key เพื่อแสดงแผนที่</p>
                  </div>
                </div>
              ) : (
                <APIProvider apiKey={API_KEY} version="weekly">
                  <Map
                    defaultCenter={STORE_LOCATION}
                    defaultZoom={15}
                    mapId="DEMO_MAP_ID"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <AdvancedMarker position={STORE_LOCATION}>
                      <Pin background="#dc2626" glyphColor="#fff" />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
