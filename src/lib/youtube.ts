// แปลงลิงก์ YouTube ทั่วไป (watch, youtu.be, shorts, embed) ให้เป็น URL สำหรับฝัง <iframe>
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let videoId = '';

    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') videoId = u.searchParams.get('v') || '';
      else if (u.pathname.startsWith('/embed/')) videoId = u.pathname.split('/embed/')[1];
      else if (u.pathname.startsWith('/shorts/')) videoId = u.pathname.split('/shorts/')[1];
    }

    videoId = videoId.split('?')[0].split('&')[0];
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
