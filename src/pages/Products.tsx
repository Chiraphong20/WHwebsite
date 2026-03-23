import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronRight, Loader2, PackageSearch, MessageCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { CATEGORIES, Product } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://wh-shop20.vercel.app';
const CLOUD_NAME = "dffqpiizc";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/`;

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'ทั้งหมด';

  const { isLoggedIn, login } = useAuth();
  const [cartItems, setCartItems] = useState<{ product: Product, qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((item: any) => {
            let imageUrl = item.image;
            if (item.imageId) {
              imageUrl = `${CLOUDINARY_BASE_URL}${item.imageId}.jpg`;
            } else if (!item.image) {
              imageUrl = 'https://placehold.co/400x400?text=No+Image';
            }

            return {
              ...item,
              images: typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []),
              image: imageUrl
            };
          });
          setProducts(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      login();
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: product.minWholesaleQty || 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string | number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleQtyChange = (productId: string | number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-dark mb-3">แคตตาล็อกสินค้าขายส่ง</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-2 font-medium">
              <span className="hover:text-primary-600 cursor-pointer transition-colors">หน้าแรก</span>
              <ChevronRight size={14} />
              <span className="text-primary-600 font-bold">ชุดสินค้าทั้งหมด</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-gray-500 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              แสดงสินค้า <span className="text-primary-600 font-bold">{filteredProducts.length}</span> รายการ
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white text-dark p-3.5 rounded-full shadow-sm border border-gray-100 hover:text-primary-600 hover:border-primary-100 hover:-translate-y-1 transition-all"
            >
              <ShoppingCart size={22} className="text-primary-500" />
              {cartItems.reduce((acc, item) => acc + item.qty, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-50">
                <div className="bg-primary-50 p-2 rounded-lg">
                  <Filter size={20} className="text-primary-600" />
                </div>
                <h2 className="font-bold text-dark text-lg">หมวดหมู่สินค้า</h2>
              </div>

              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <button
                  onClick={() => setSelectedCategory('ทั้งหมด')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === 'ทั้งหมด'
                      ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
                    }`}
                >
                  ทั้งหมด
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                        ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="ค้นหาสินค้าขายส่งที่คุณต้องการ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-dark placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-sm font-bold text-gray-400 hover:text-gray-600"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                <Loader2 className="animate-spin mb-4 text-primary-500" size={48} />
                <p className="text-gray-500 font-medium text-lg">กำลังโหลดรายการสินค้า...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    key={product.id}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 flex flex-col items-center justify-center">
                <PackageSearch size={64} className="text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-dark mb-2">ไม่พบสินค้าที่ตรงตามเงื่อนไข</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่สินค้าอื่นดูอีกครั้ง</p>
                <button
                  onClick={() => { setSelectedCategory('ทั้งหมด'); setSearchQuery(''); }}
                  className="bg-primary-50 text-primary-600 font-bold px-6 py-3 rounded-full hover:bg-primary-100 transition-colors"
                >
                  ล้างการค้นหาทั้งหมด
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onQtyChange={handleQtyChange}
        onClear={() => setCartItems([])}
      />
    </div>
  );
}

