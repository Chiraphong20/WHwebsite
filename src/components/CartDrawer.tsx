import React from 'react';
import { X, ShoppingCart, LogIn, Trash2, MessageCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
  product: Product;
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (productId: string | number) => void;
  onQtyChange: (productId: string | number, delta: number) => void;
  onClear?: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemove, onQtyChange, onClear }: CartDrawerProps) {
  const { user, isLoggedIn, login } = useAuth();

  const total = items.reduce((sum, i) => sum + Number(i.product.wholesalePrice) * i.qty, 0);

  const API_URL = import.meta.env.VITE_API_URL || 'https://whshop20.onrender.com';

  const handleOrder = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    try {
      const payload = {
        customerName: user?.displayName || 'ลูกค้าจาก LINE',
        customerContact: '-',
        address: 'รอการยืนยันที่อยู่จัดส่งทางแชท LINE',
        deliveryMethod: 'DELIVERY',
        status: 'PENDING',
        totalAmount: total,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.qty,
          price: i.product.wholesalePrice
        })),
        timestamp: new Date().toISOString(),
        customerLineUserId: user?.userId,
        customerLineDisplayName: user?.displayName,
        customerLinePictureUrl: user?.pictureUrl
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('ส่งคำสั่งซื้อเรียบร้อย! ทางร้านจะรีบติดต่อกลับไปทาง LINE นะครับ');
        if (onClear) onClear();
        onClose();
        
        // Option to still open LINE chat to say hello (uncomment to enable)
        // const msg = encodeURIComponent(`แจ้งยืนยันการสั่งซื้อจากระบบ รหัสลูกค้า: ${user?.displayName}`);
        // window.open(`https://line.me/R/oaMessage/@177eggfh/?${msg}`, '_blank');
      } else {
        const errData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errData.error || 'ไม่สามารถรับออเดอร์ได้'}`);
      }
    } catch (error) {
      console.error('Order Error:', error);
      alert('ระบบขัดข้อง ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-dark text-white">
              <div className="flex items-center space-x-3">
                <ShoppingCart size={22} className="text-primary-400" />
                <h2 className="text-lg font-bold">ตะกร้าสินค้า</h2>
                <span className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.reduce((s, i) => s + i.qty, 0)}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* LINE Login Banner — shown when NOT logged in */}
            {!isLoggedIn && (
              <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center space-x-3">
                <MessageCircle size={20} className="text-green-600 shrink-0" />
                <p className="text-sm text-green-800 font-medium flex-1">กรุณาล็อกอินผ่าน LINE เพื่อดำเนินการสั่งซื้อ</p>
                <button
                  onClick={login}
                  className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors shrink-0 flex items-center space-x-1"
                >
                  <LogIn size={13} />
                  <span>Login</span>
                </button>
              </div>
            )}

            {/* Logged-in user info */}
            {isLoggedIn && user && (
              <div className="bg-primary-50 border-b border-primary-100 px-5 py-3 flex items-center space-x-3">
                {user.pictureUrl && (
                  <img src={user.pictureUrl} alt={user.displayName} className="w-8 h-8 rounded-full" />
                )}
                <p className="text-sm text-primary-800 font-medium">สวัสดี, <strong>{user.displayName}</strong></p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4">
                  <ShoppingCart size={48} className="opacity-30" />
                  <p className="font-medium">ตะกร้าว่างอยู่<br />เลือกสินค้าที่ต้องการด้านซ้ายเลยครับ</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-dark text-sm line-clamp-2">{item.product.name}</p>
                      <p className="text-primary-600 font-extrabold text-sm mt-1">฿{Number(item.product.wholesalePrice).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button onClick={() => onRemove(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => onQtyChange(item.product.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-sm transition-colors">-</button>
                        <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                        <button onClick={() => onQtyChange(item.product.id, 1)} className="w-7 h-7 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center font-bold text-sm transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-600">ยอดรวมทั้งหมด</span>
                  <span className="text-2xl font-extrabold text-primary-600">฿{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleOrder}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all text-white shadow-lg ${isLoggedIn
                      ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/30'
                      : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                    }`}
                >
                  {isLoggedIn ? (
                    <>
                      <ShoppingCart size={20} />
                      <span>ยืนยันการสั่งซื้อ</span>
                      <ChevronRight size={18} />
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>ล็อคอิน LINE เพื่อสั่งซื้อ</span>
                    </>
                  )}
                </button>
                {!isLoggedIn && (
                  <p className="text-center text-xs text-gray-400">จำเป็นต้องล็อกอินผ่าน LINE ก่อนดำเนินการสั่งซื้อ</p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
