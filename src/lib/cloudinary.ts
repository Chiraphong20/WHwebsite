const CLOUD_NAME = 'dffqpiizc';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

// อัปโหลดรูปขึ้น Cloudinary แล้วคืนลิงก์ (ใช้ preset เดียวกับแท็บแพ็กเกจ)
export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  if (!UPLOAD_PRESET) throw new Error('ยังไม่ได้ตั้งค่า VITE_CLOUDINARY_UPLOAD_PRESET ใน .env');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
  const data = await res.json();
  return data.secure_url as string;
}
