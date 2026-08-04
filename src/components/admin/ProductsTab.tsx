import React, { useState, useEffect, useRef } from 'react';
import { Upload, Check, X, Search, ImageIcon, Loader2 } from 'lucide-react';
import { Product } from '../../data/mockData';
import { adminFetch, AdminSessionExpiredError } from '../../lib/adminApi';

const CLOUD_NAME = 'dffqpiizc';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto,w_800/`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export default function ProductsTab({ onSessionExpired }: { onSessionExpired: () => void }) {
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await adminFetch('/api/products');
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
      } catch (err) {
        if (err instanceof AdminSessionExpiredError) onSessionExpired();
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [onSessionExpired]);

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

      const backendRes = await adminFetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: newImageId })
      });
      if (!backendRes.ok) throw new Error('บันทึกรูปสินค้าไม่สำเร็จ');

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
      if (err instanceof AdminSessionExpiredError) { onSessionExpired(); return; }
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

  return (
    <div>
      <p className="text-gray-500 mb-6 text-sm">
        คลิกที่รูปสินค้าเพื่ออัปโหลดรูปใหม่ไปยัง Cloudinary · {filteredProducts.length} รายการ
      </p>

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
