// แปลงลิงก์ Facebook Reel/วิดีโอทั่วไปให้เป็น URL สำหรับฝัง <iframe> ผ่าน Facebook Video Plugin
export function getFacebookEmbedUrl(url: string, width = 267, height = 476): string | null {
  if (!url) return null;
  try {
    new URL(url); // ตรวจว่าเป็น URL ที่ถูกต้อง
    return `https://www.facebook.com/plugins/video.php?height=${height}&href=${encodeURIComponent(url)}&show_text=false&width=${width}&t=0`;
  } catch {
    return null;
  }
}
