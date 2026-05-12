import React, { useState, useEffect, useRef } from 'react';
import { Upload, Check, X, Search, ImageIcon, Loader2, Eye, EyeOff } from 'lucide-react';
import { Product } from '../data/mockData';

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'https://whshop20.onrender.com');
const CLOUD_NAME = 'dffqpiizc';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin1234';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((item: any) => {
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
          setProducts(formatted);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadSuccess(false);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !editingProduct) return;
    if (!UPLOAD_PRESET) {
      setUploadError('ยังไม่ได้ตั้งค่า VITE_CLOUDINARY_UPLOAD_PRESET ใน .env');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'wh_products');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      if (!cloudRes.ok) throw new Error('อัปโหลดไป Cloudinary ไม่สำเร็จ');
      const cloudData = await cloudRes.json();
      const newImageId: string = cloudData.public_id;

      // 2. Update product in backend
      const backendRes = await fetch(`${API_URL}/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ imageId: newImageId })
      });
      if (!backendRes.ok) {
        throw new Error('Backend ยังไม่มี PATCH /api/products/:id — ต้องเพิ่ม endpoint ในฝั่ง server ก่อน');
      }

      // 3. Update local state
      const newImageUrl = `${CLOUDINARY_BASE_URL}${newImageId}.jpg`;
      setProducts(prev =>
        prev.map(p => (p.id === editingProduct.id ? { ...p, image: newImageUrl } : p))
      );
      setUploadSuccess(true);
      setTimeout(() => {
        setEditingProduct(null);
        setPreviewUrl(null);
        setSelectedFile(null);
        setUploadSuccess(false);
      }, 1500);
    } catch (err: any) {
      setUploadError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
  };

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Login screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-3">
              <ImageIcon size={32} className="text-primary-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-dark">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">วงษ์หิรัญ ค้าส่ง</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="รหัสผ่าน"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 pr-12 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {authError && (
              <p className="text-red-500 text-sm font-medium">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Admin dashboard ---
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-dark">Admin — จัดการรูปสินค้า</h1>
            <p className="text-gray-500 mt-1 text-sm">
              คลิกที่รูปสินค้าเพื่ออัปโหลดรูปใหม่ไปยัง Cloudinary · {filteredProducts.length} รายการ
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้าหรือรหัสบาร์โค้ด..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 font-medium text-dark placeholder-gray-400 shadow-sm"
          />
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-primary-500" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                onClick={() => openEdit(product)}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow">
                      <Upload size={20} className="text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-bold text-dark line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{product.barcode}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Image Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-extrabold text-dark">เปลี่ยนรูปสินค้า</h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm font-medium text-gray-500 mb-4 line-clamp-1">
                {editingProduct.name}
              </p>

              {/* Image preview — click to pick file */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 mb-4 cursor-pointer hover:border-primary-400 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={previewUrl || editingProduct.image}
                  alt={editingProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 font-bold text-sm text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    คลิกเพื่อเลือกรูป
                  </div>
                </div>
                {previewUrl && (
                  <span className="absolute top-2 right-2 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    รูปใหม่
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors mb-3 flex items-center justify-center gap-2"
              >
                <Upload size={15} />
                เลือกรูปจากเครื่อง
              </button>

              {uploadError && (
                <p className="text-red-500 text-xs font-medium mb-3 bg-red-50 px-3 py-2 rounded-xl leading-relaxed">
                  {uploadError}
                </p>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading || uploadSuccess}
                className={`w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                  uploadSuccess
                    ? 'bg-green-500'
                    : !selectedFile || uploading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    กำลังอัปโหลด...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check size={18} />
                    อัปโหลดสำเร็จ!
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    อัปโหลดลง Cloudinary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
