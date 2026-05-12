import { ShoppingCart } from 'lucide-react';
import { Product } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  cartQty?: number;
  onAddToCart?: (product: Product) => void;
  onUpdateQty?: (product: Product, delta: number) => void;
  onSetQty?: (product: Product, qty: number) => void;
  onCardClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cartQty, onAddToCart, onUpdateQty, onSetQty, onCardClick }) => (
  <div
    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
    onClick={() => onCardClick && onCardClick(product)}
  >
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />
      {/* Cover baked-in price/code banners in product catalog images */}
      <div className="absolute top-0 left-0 right-0 h-[14%] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[16%] bg-gradient-to-t from-white to-transparent pointer-events-none" />
      {product.isBestSeller && (
        <span className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          ขายดี 🔥
        </span>
      )}
    </div>

    <div className="p-4 flex-1 flex flex-col">
      <p className="text-xs text-primary-600 font-bold mb-1.5 uppercase tracking-wide bg-primary-50 inline-block px-2 py-0.5 rounded w-fit">{product.category}</p>
      <h3 className="font-bold text-dark text-base line-clamp-2 h-12 group-hover:text-primary-600 transition-colors mb-3">{product.name}</h3>

      <div className="mt-auto pt-3 border-t border-gray-50">
        {/* Bulk price tier */}
        {!!product.bulkQty && product.bulkQty > 0 && !!product.bulkPrice && product.bulkPrice > 0 && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-2">
            <div>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded mb-1 block w-fit">ราคาส่ง</span>
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-green-700 text-lg leading-none">฿{Number(product.bulkPrice).toLocaleString()}</span>
                <span className="text-[10px] text-green-600">{product.bulkQty} {product.unit}ขึ้นไป</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onAddToCart) onAddToCart(product); }}
              className="text-[11px] font-bold text-green-700 bg-green-200 hover:bg-green-300 px-2.5 py-1.5 rounded-lg whitespace-nowrap active:scale-95 transition-all"
            >
              + {product.bulkQty} {product.unit}
            </button>
          </div>
        )}

        {/* Dual price */}
        <div className="space-y-1.5 mb-3">
          {Number(product.retailPrice) > 0 && Number(product.retailPrice) !== Number(product.wholesalePrice) && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">ราคาปลีก</span>
              <span className="text-sm text-gray-400 font-medium">฿{Number(product.retailPrice).toLocaleString()} / {product.unit}</span>
            </div>
          )}
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

        {/* Unit qty + stock */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {product.unitQty && product.unitQty > 0 ? (
            <span className="text-[11px] text-gray-500 font-medium">{product.unitQty} ชิ้น / {product.unit}</span>
          ) : (
            <span />
          )}
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {product.stock > 0 ? `เหลือ ${product.stock}` : 'หมด'}
          </span>
        </div>

        {/* Cart controls */}
        {cartQty !== undefined && cartQty > 0 ? (
          <div className="w-full h-[46px] flex items-center justify-between bg-primary-50 rounded-2xl border border-primary-200 p-1 shadow-inner">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onUpdateQty) onUpdateQty(product, -1); }}
              className="w-9 h-9 flex-shrink-0 rounded-xl bg-white text-primary-600 font-bold shadow-sm hover:bg-primary-100 flex items-center justify-center active:scale-95 transition-all"
            >
              -
            </button>
            <input
              type="number"
              value={cartQty || ''}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const val = parseInt(e.target.value);
                if (!isNaN(val) && onSetQty) onSetQty(product, val);
                if (e.target.value === '' && onSetQty) onSetQty(product, 0);
              }}
              onBlur={(e) => {
                const val = parseInt(e.target.value);
                if (isNaN(val) || val <= 0) {
                  if (onSetQty) onSetQty(product, 0);
                }
              }}
              className="flex-1 w-full min-w-0 text-center bg-transparent font-extrabold text-dark focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onUpdateQty) onUpdateQty(product, 1); }}
              className="w-9 h-9 flex-shrink-0 rounded-xl bg-primary-500 text-white font-bold shadow-sm hover:bg-primary-600 flex items-center justify-center active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        ) : (
          onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full py-3 bg-primary-500 text-white text-sm rounded-2xl hover:bg-primary-600 active:scale-95 transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
            >
              <ShoppingCart size={18} />
              เพิ่มลงตะกร้า
            </button>
          )
        )}
      </div>
    </div>
  </div>
);

export default ProductCard;
