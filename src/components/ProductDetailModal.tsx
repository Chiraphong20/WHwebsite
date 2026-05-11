import React, { useState } from 'react';
import { X, ShoppingCart, Tag, Package, Barcode, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  cartQty?: number;
  onAddToCart?: (product: Product) => void;
  onUpdateQty?: (product: Product, delta: number) => void;
  onSetQty?: (product: Product, qty: number) => void;
}

const CLOUD_NAME = "dffqpiizc";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/`;

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  cartQty,
  onAddToCart,
  onUpdateQty,
  onSetQty,
}) => {
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const uniqueImages = [...new Set(allImages)];

  const handlePrevImg = () => setActiveImg(i => (i - 1 + uniqueImages.length) % uniqueImages.length);
  const handleNextImg = () => setActiveImg(i => (i + 1) % uniqueImages.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="md:w-1/2 bg-gray-50 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden relative">
                <div className="relative aspect-square">
                  <img
                    src={uniqueImages[activeImg] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.isBestSeller && (
                    <span className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      ขายดี 🔥
                    </span>
                  )}
                  {uniqueImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImg}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNextImg}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {uniqueImages.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {uniqueImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImg === i ? 'border-primary-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="md:w-1/2 p-6 flex flex-col">
                {/* Category */}
                <span className="text-xs text-primary-600 font-bold uppercase tracking-wide bg-primary-50 inline-block px-3 py-1 rounded-full w-fit mb-3">
                  {product.category}
                </span>

                {/* Name */}
                <h2 className="text-xl font-extrabold text-dark leading-snug mb-4">{product.name}</h2>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-500 leading-relaxed mb-5 bg-gray-50 rounded-2xl p-4">
                    {product.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                      <Layers size={15} className="text-primary-600" />
                    </div>
                    <span className="text-gray-500">หน่วยนับ:</span>
                    <span className="font-bold text-dark">{product.unit}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                      <Package size={15} className="text-primary-600" />
                    </div>
                    <span className="text-gray-500">ซื้อขั้นต่ำ:</span>
                    <span className="font-bold text-dark">{product.minWholesaleQty} {product.unit}</span>
                  </div>
                  {product.barcode && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <Barcode size={15} className="text-primary-600" />
                      </div>
                      <span className="text-gray-500">บาร์โค้ด:</span>
                      <span className="font-mono font-bold text-dark">{product.barcode}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <Tag size={15} className="text-green-600" />
                    </div>
                    <span className="text-gray-500">สต็อก:</span>
                    <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? `${product.stock} ชิ้น` : 'สินค้าหมด'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400 font-medium">ราคาปลีก</span>
                    <span className="text-gray-400 font-semibold line-through text-sm">฿{Number(product.retailPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary-600 font-bold">ราคาส่ง</span>
                    <span className="text-3xl font-extrabold text-primary-600">฿{Number(product.wholesalePrice).toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 text-right mt-1">ซื้อขั้นต่ำ {product.minWholesaleQty} {product.unit} ถึงได้ราคานี้</p>
                </div>

                {/* Cart Controls */}
                {cartQty !== undefined && cartQty > 0 ? (
                  <div className="w-full h-[50px] flex items-center justify-between bg-primary-50 rounded-2xl border border-primary-200 p-1 shadow-inner">
                    <button
                      onClick={() => onUpdateQty && onUpdateQty(product, -1)}
                      className="w-10 h-10 flex-shrink-0 rounded-xl bg-white text-primary-600 font-bold shadow-sm hover:bg-primary-100 flex items-center justify-center active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={cartQty || ''}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && onSetQty) onSetQty(product, val);
                        if (e.target.value === '' && onSetQty) onSetQty(product, 0);
                      }}
                      onBlur={e => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val) || val <= 0) onSetQty && onSetQty(product, 0);
                      }}
                      className="flex-1 text-center bg-transparent font-extrabold text-dark focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => onUpdateQty && onUpdateQty(product, 1)}
                      className="w-10 h-10 flex-shrink-0 rounded-xl bg-primary-500 text-white font-bold shadow-sm hover:bg-primary-600 flex items-center justify-center active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  onAddToCart && (
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full py-4 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 active:scale-95 transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                    >
                      <ShoppingCart size={20} />
                      เพิ่มลงตะกร้า
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
