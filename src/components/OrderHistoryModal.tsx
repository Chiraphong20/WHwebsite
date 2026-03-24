import React, { useState, useEffect } from 'react';
import { X, Package, Loader2, Calendar, ShoppingBag, MapPin, Truck, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  productId: string;
  name?: string;
  productName?: string;
  quantity: number;
  price: number | string;
  productImage?: string;
}

interface Order {
  id: string;
  customerName: string;
  address: string;
  deliveryMethod: string;
  status: string;
  totalAmount: number | string;
  items: string | OrderItem[];
  trackingNumber?: string;
  courier?: string;
  timestamp: string;
  customerLineUserId: string;
}

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderHistoryModal({ isOpen, onClose }: OrderHistoryModalProps) {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://whshop20.onrender.com';

  useEffect(() => {
    if (isOpen && isLoggedIn && user?.userId) {
      fetchMyOrders();
    }
  }, [isOpen, isLoggedIn, user]);

  const fetchMyOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลออเดอร์ได้');
      }
      const data = await response.json();
      
      // Filter only user's orders and sort by mostly recent
      const myOrders = (Array.isArray(data) ? data : data.data || [])
        .filter((order: Order) => order.customerLineUserId === user?.userId)
        .sort((a: Order, b: Order) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setOrders(myOrders);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลประวัติคำสั่งซื้อ');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'รอตรวจสอบ/รอจัดส่ง';
      case 'COMPLETED': return 'สำเร็จแล้ว';
      case 'CANCELLED': return 'ยกเลิก';
      case 'SHIPPED': return 'จัดส่งแล้ว';
      default: return status;
    }
  };

  const parseItems = (itemsData: string | OrderItem[]): OrderItem[] => {
    if (typeof itemsData === 'string') {
      try {
        return JSON.parse(itemsData);
      } catch (e) {
        return [];
      }
    }
    return itemsData || [];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-50 z-[55] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
              <div className="flex items-center space-x-3">
                <Package size={24} className="text-primary-500" />
                <h2 className="text-xl font-bold text-dark">ประวัติการสั่งซื้อของฉัน</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {!isLoggedIn ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">กรุณาล็อกอินเพื่อดูประวัติการสั่งซื้อ</p>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
                  <p className="text-gray-500 font-medium">กำลังโหลดข้อมูล...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-medium border border-red-100">
                  {error}
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag size={64} className="text-gray-200 mb-4" />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">ยังไม่มีประวัติการสั่งซื้อ</h3>
                  <p className="text-gray-500 text-sm">เมื่อคุณสั่งซื้อสินค้า รายการจะมาแสดงที่นี่ครับ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const parsedItems = parseItems(order.items);
                    const totalItems = parsedItems.reduce((acc, item) => acc + Number(item.quantity), 0);

                    return (
                      <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        {/* Order Header */}
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                          <div>
                            <p className="font-bold text-dark mb-1">รหัสออเดอร์: {order.id}</p>
                            <div className="flex items-center text-xs text-gray-500 space-x-1">
                              <Calendar size={12} />
                              <span>{new Date(order.timestamp).toLocaleString('th-TH')}</span>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        {/* Order Items Summary */}
                        <div className="space-y-3 mb-4">
                          {parsedItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <div className="flex items-center space-x-3 overflow-hidden">
                                {item.productImage ? (
                                  <img src={item.productImage} alt={item.productName || item.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0" />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 shrink-0 flex items-center justify-center">
                                    <Package size={16} className="text-gray-300" />
                                  </div>
                                )}
                                <span className="text-gray-700 line-clamp-1 font-medium text-sm">
                                  {item.productName || item.name || 'สินค้า'}
                                </span>
                              </div>
                              <div className="flex flex-col items-end shrink-0 pl-2">
                                <span className="text-gray-500 text-xs">x{item.quantity}</span>
                                <span className="font-bold text-dark text-sm">฿{Number(item.price).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Delivery */}
                        <div className="bg-gray-50 p-3 rounded-xl space-y-2 mt-4">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-gray-600 gap-1.5 font-medium">
                              {order.deliveryMethod === 'DELIVERY' ? <Truck size={14} /> : <Store size={14} />}
                              <span>{order.deliveryMethod === 'DELIVERY' ? 'จัดส่งพัสดุ' : 'รับเองที่ร้าน'}</span>
                            </div>
                            <span className="text-gray-500">รวม {totalItems} ชิ้น</span>
                          </div>
                          
                          {order.deliveryMethod === 'DELIVERY' && order.address && (
                            <div className="flex items-start text-xs text-gray-500 gap-1.5 pt-1.5 border-t border-gray-200/60 w-full">
                              <MapPin size={12} className="shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{order.address}</span>
                            </div>
                          )}

                          {order.trackingNumber && (
                            <div className="flex items-center justify-between pt-1.5 border-t border-gray-200/60 w-full">
                              <span className="text-xs font-medium text-gray-600">เลขพัสดุ: <span className="font-bold text-primary-600">{order.trackingNumber}</span></span>
                              {order.courier && <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600 font-bold">{order.courier}</span>}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm font-bold text-gray-600">ยอดรวมทั้งสิ้น</span>
                          <span className="text-lg font-extrabold text-primary-600">฿{Number(order.totalAmount).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
