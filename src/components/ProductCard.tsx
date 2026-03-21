import React from 'react';
import { Product } from '../data/mockData';
import { MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const LINE_OA_URL = 'https://line.me/R/ti/p/@wonghiran20korat';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      {product.isBestSeller && (
        <span className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          ขายดี 🔥
        </span>
      )}
    </div>
    
    <div className="p-6 flex-1 flex flex-col">
      <p className="text-xs text-primary-600 font-bold mb-2 uppercase tracking-wide bg-primary-50 inline-block px-2 py-1 rounded w-fit">{product.category}</p>
      <h3 className="font-bold text-dark text-lg line-clamp-2 h-14 group-hover:text-primary-600 transition-colors mb-4">{product.name}</h3>
      
      <div className="mt-auto pt-4 border-t border-gray-50">
        <div className="flex flex-col gap-1 mb-5">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-medium mb-1">ราคาปลีก</span>
              <span className="text-gray-500 text-sm font-semibold line-through">฿{Number(product.retailPrice).toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-primary-600 font-bold mb-1 block">ราคาส่งเริ่มต้น</span>
              <span className="font-extrabold text-3xl text-primary-600">฿{Number(product.wholesalePrice).toLocaleString()}</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-600 bg-orange-50 px-2 py-1 rounded w-fit border border-primary-200/50 font-medium self-end mt-2 tracking-wide">
            ซื้อขั้นต่ำ {product.minWholesaleQty} {product.unit} ถึ้งได้ราคานี้
          </div>
        </div>
        
        <a 
          href={`${LINE_OA_URL}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-[#06C755] text-white text-sm rounded-2xl hover:bg-[#05a847] active:scale-95 transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
        >
          <MessageCircle size={18} />
          สอบถามราคาส่งผ่าน LINE
        </a>
      </div>
    </div>
  </div>
);

export default ProductCard;

