import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { ProductSection } from '../lib/siteContent';

// หัวข้อสินค้าที่แอดมินสร้างเอง: ชื่อหัวข้อ + คำอธิบาย + สินค้าที่เลือกไว้
export default function ProductGridSection({ section }: { section: ProductSection }) {
  if (!section.products.length) return null;
  return (
    <section className="py-20 bg-white" data-edit={`home_content:customSections.${section.id}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-100 pb-6 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">{section.title}</h2>
            {section.subtitle && <p className="text-lg text-gray-600">{section.subtitle}</p>}
          </div>
          <Link to="/products" className="text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 px-5 py-2.5 rounded-full transition-colors">
            ดูสินค้าทั้งหมด →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {section.products.map(product => (
            <Link to="/products" key={product.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" />
                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white text-primary-600 px-6 py-2.5 rounded-full font-bold flex items-center space-x-2">
                    <ShoppingCart size={18} />
                    <span>เลือกดูสินค้า</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-primary-600 font-bold mb-1.5 bg-primary-50 inline-block px-2 py-0.5 rounded w-fit">{product.category}</p>
                <h3 className="font-semibold text-dark text-base line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors flex-1">{product.name}</h3>
                <div className="mt-auto pt-3 border-t border-gray-50">
                  <div className="flex items-center justify-between bg-primary-50 rounded-2xl px-3 py-2 border border-primary-100">
                    <div>
                      <span className="text-[10px] font-extrabold text-primary-600 block">ราคาส่ง</span>
                      <span className="text-[10px] text-primary-400">ซื้อ {product.minWholesaleQty}+ {product.unit}</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-extrabold text-xl text-primary-600">฿{Number(product.wholesalePrice).toLocaleString()}</span>
                      <span className="text-[10px] text-primary-400"> /{product.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
