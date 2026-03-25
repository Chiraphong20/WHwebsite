import React, { useState } from 'react';
import { X, ShoppingCart, LogIn, Trash2, MessageCircle, ChevronRight, Store, Truck, Check } from 'lucide-react';
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
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');

  const [customerNameInput, setCustomerNameInput] = useState('');
  const [customerPhoneInput, setCustomerPhoneInput] = useState('');
  const [customerAddressInput, setCustomerAddressInput] = useState('');
  const [orderNoteInput, setOrderNoteInput] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const LINE_OA_URL = 'https://lin.ee/7aOjZI9';
  const LINE_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(LINE_OA_URL)}`;

  React.useEffect(() => {
    if (user?.displayName && !customerNameInput) {
      setCustomerNameInput(user.displayName);
    }
  }, [user]);

  const total = items.reduce((sum, i) => sum + Number(i.product.wholesalePrice) * i.qty, 0);

  const draftMessage = `สวัสดีครับ/ค่ะ แจ้งโอนเงิน / คอนเฟิร์มออเดอร์ครับ\nชื่อ: ${customerNameInput}\nเบอร์โทร: ${customerPhoneInput}\nยอดรวม: ฿${total.toLocaleString()}`;
  const LINE_OA_WITH_MESSAGE_URL = `https://line.me/R/oaMessage/@177eggfh/?${encodeURIComponent(draftMessage)}`;

  const API_URL = import.meta.env.VITE_API_URL || 'https://whshop20.onrender.com';

  const handleOrder = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }

    if (!customerNameInput.trim()) {
      alert('กรุณากรอกชื่อผู้ติดต่อ');
      return;
    }
    if (!customerPhoneInput.trim()) {
      alert('กรุณากรอกเบอร์โทรติดต่อ');
      return;
    }
    if (deliveryMethod === 'DELIVERY' && !customerAddressInput.trim()) {
      alert('กรุณากรอกที่อยู่จัดส่ง');
      return;
    }

    try {
      const payload = {
        customerName: customerNameInput.trim(),
        customerContact: customerPhoneInput.trim(),
        address: deliveryMethod === 'DELIVERY' ? customerAddressInput.trim() : 'รับเองที่ร้าน',
        note: orderNoteInput.trim(),
        deliveryMethod: deliveryMethod,
        status: 'PENDING',
        totalAmount: total,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.qty,
          price: i.product.wholesalePrice,
          productName: i.product.name,
          productPrice: i.product.wholesalePrice
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
        if (onClear) onClear();
        setShowSuccessModal(true);
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
    <>
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

              {/* User Details Form */}
              {items.length > 0 && (
                <div className="mt-6 space-y-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <span className="font-bold text-dark text-sm">ข้อมูลติดต่อและจัดส่ง</span>
                  <input
                    type="text"
                    placeholder="ชื่อผู้ติดต่อ *"
                    value={customerNameInput}
                    onChange={e => setCustomerNameInput(e.target.value)}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-gray-50/50"
                  />
                  <input
                    type="tel"
                    placeholder="เบอร์โทรติดต่อ *"
                    value={customerPhoneInput}
                    onChange={e => setCustomerPhoneInput(e.target.value)}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors bg-gray-50/50"
                  />
                  {deliveryMethod === 'DELIVERY' && (
                    <textarea
                      placeholder="ที่อยู่จัดส่ง *"
                      rows={2}
                      value={customerAddressInput}
                      onChange={e => setCustomerAddressInput(e.target.value)}
                      className="w-full text-sm py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none bg-gray-50/50"
                    />
                  )}
                  <textarea
                    placeholder="หมายเหตุ (เพิ่มเติม)"
                    rows={2}
                    value={orderNoteInput}
                    onChange={e => setOrderNoteInput(e.target.value)}
                    className="w-full text-sm py-2.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none bg-gray-50/50"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-4 bg-white z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                {/* Delivery Option */}
                <div className="flex flex-col space-y-2.5">
                  <span className="font-bold text-dark text-sm flex items-center gap-2">
                    <Truck size={16} className="text-primary-500" />
                    วิธีการรับสินค้า
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryMethod('PICKUP')}
                      className={`relative overflow-hidden py-3 px-3 rounded-2xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                        deliveryMethod === 'PICKUP' 
                          ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' 
                          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {deliveryMethod === 'PICKUP' && <div className="absolute top-0 right-0 w-8 h-8 bg-primary-100 rounded-bl-full -mr-2 -mt-2"></div>}
                      <Store size={20} className={deliveryMethod === 'PICKUP' ? 'text-primary-500' : 'text-gray-400'} />
                      รับเองที่ร้าน
                    </button>
                    <button
                      onClick={() => setDeliveryMethod('DELIVERY')}
                      className={`relative overflow-hidden py-3 px-3 rounded-2xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                        deliveryMethod === 'DELIVERY' 
                          ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-sm' 
                          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {deliveryMethod === 'DELIVERY' && <div className="absolute top-0 right-0 w-8 h-8 bg-primary-100 rounded-bl-full -mr-2 -mt-2"></div>}
                      <Truck size={20} className={deliveryMethod === 'DELIVERY' ? 'text-primary-500' : 'text-gray-400'} />
                      จัดส่ง
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
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
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-xs sm:max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative"
            >
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors pl"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4 mt-2">
                <Check size={32} className="stroke-[3]" />
              </div>

              <h3 className="text-xl font-bold text-dark mb-2">สั่งซื้อสำเร็จ!</h3>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                ระบบได้รับคำสั่งซื้อของคุณแล้ว<br/>
                <span className="font-bold text-primary-600">อยากให้แอดมินรับออเดอร์ไว ๆ</span><br/>
                ทัก LINE OA ของทางร้านได้เลยครับ!
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100 w-full flex flex-col items-center">
                <img src={LINE_QR_URL} alt="LINE OA QR Code" className="w-32 h-32 rounded-xl mb-3 shadow-sm border border-gray-200" />
                <p className="font-bold text-sm text-gray-700">@177eggfh</p>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  📌 <span className="font-semibold">สั่งสินค้าโดยตรงกับแอดมิน</span><br/>
                  <a href={LINE_OA_URL} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline inline-block mt-0.5">
                    {LINE_OA_URL}
                  </a>
                </p>
              </div>

              <a
                href={LINE_OA_WITH_MESSAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
                className="w-full bg-[#00B900] hover:bg-[#009900] text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-[#00B900]/30"
              >
                <MessageCircle size={20} />
                <span>ทักแชทแจ้งแอดมิน / ส่งสลิป</span>
              </a>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
                className="mt-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                ปิดหน้าต่างนี้
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
