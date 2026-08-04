import React, { useState, useEffect } from 'react';
import { ChevronRight, Award, History, Warehouse, ShieldCheck, Users, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { AboutContent, ContactContent, DEFAULT_ABOUT_CONTENT, DEFAULT_CONTACT_CONTENT, fetchSiteContentMerged } from '../lib/siteContent';

const VALUE_ICONS = [<ShieldCheck size={32} />, <Award size={32} />, <Users size={32} />];

export default function About() {
  const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [contact, setContact] = useState<ContactContent>(DEFAULT_CONTACT_CONTENT);

  useEffect(() => {
    fetchSiteContentMerged<AboutContent>('about_content', DEFAULT_ABOUT_CONTENT).then(setContent);
    fetchSiteContentMerged<ContactContent>('contact_content', DEFAULT_CONTACT_CONTENT).then(setContact);
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-dark text-white py-20 mb-20">
        <div className="absolute inset-0">
          <img
            src="/images/about/Screenshot 2026-03-21 190740.png"
            alt="โกดังวงษ์หิรัญ"
            className="w-full h-full object-cover opacity-30"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-orange-300 space-x-2 mb-6">
            <span className="text-gray-400">หน้าแรก</span>
            <ChevronRight size={14} />
            <span className="font-medium">เกี่ยวกับเรา</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {content.heroTitleLine1}<br />
              <span className="text-primary-400">{content.heroTitleHighlight}</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
              {content.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 text-primary-500 font-bold uppercase tracking-wider text-sm">
              <History size={18} />
              <span>ประวัติและความเป็นมา</span>
            </div>
            <h2 className="text-3xl font-bold text-dark leading-tight">
              {content.storyHeading}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {content.storyParagraph1}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {content.storyParagraph2}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {content.stats.map((stat, idx) => (
                <div key={idx} className="border-l-4 border-primary-500 pl-4">
                  <div className="text-3xl font-bold text-dark">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary-100">
              <img
                src="/images/about/Screenshot 2026-03-21 190740.png"
                alt="โกดังวงษ์หิรัญ"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-dark text-white p-5 rounded-2xl shadow-xl hidden md:block border border-primary-500/30">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-500 p-3 rounded-xl text-white">
                  <Warehouse size={24} />
                </div>
                <div>
                  <div className="font-bold">โกดังใหญ่พร้อมส่ง</div>
                  <div className="text-xs text-gray-400">สต็อกแน่นทุกรายการ</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="bg-dark rounded-3xl p-12 shadow-xl mb-24 relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-2xl font-bold text-white">ค่านิยมของเรา</h2>
            <p className="text-gray-400 mt-2 text-sm">สิ่งที่เราเชื่อและยึดมั่นในการทำธุรกิจทุกวัน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {content.values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4 group"
              >
                <div className="w-16 h-16 mx-auto bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  {VALUE_ICONS[i % VALUE_ICONS.length]}
                </div>
                <h3 className="font-bold text-white text-lg">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-primary-50 border border-primary-100 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <MapPin size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-dark mb-1">มาเยี่ยมชมโกดังของเรา</h3>
            <p className="text-gray-600">{contact.address}</p>
            <p className="text-sm text-gray-500 mt-1">{contact.hoursLine1} | {contact.hoursLine2}</p>
          </div>
          <a
            href={`tel:${contact.phone.replace(/\D/g, '')}`}
            className="inline-flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors shrink-0"
          >
            <Phone size={18} />
            <span>{contact.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
