import React, { useEffect, useRef, useState } from 'react';
import { StripImage } from '../lib/siteContent';

const GAP = 16;

// แถวรูปภาพ 5 ภาพ (มือถือ 3 ภาพ): ถ้ามีไม่เกินจำนวนต่อแถวจะแสดงนิ่งตรงกลาง ถ้าเกินจะเลื่อนอัตโนมัติวนไปเรื่อยๆ (หยุดเมื่อเอาเมาส์วาง)
export default function ImageStrip({ images }: { images: StripImage[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const perView = width && width < 640 ? 3 : 5;
  const itemW = width ? (width - GAP * (perView - 1)) / perView : 0;
  const scrolling = images.length > perView;

  const item = (s: StripImage, key: string) => {
    const img = <img src={s.image} alt={s.alt} loading="lazy" className="w-full aspect-square object-cover rounded-2xl shadow-sm bg-gray-100" />;
    return (
      <div key={key} style={{ width: itemW }} className="shrink-0">
        {s.link ? <a href={s.link} target={/^https?:/.test(s.link) ? '_blank' : undefined} rel="noopener noreferrer">{img}</a> : img}
      </div>
    );
  };

  return (
    <div ref={box} className="overflow-hidden group">
      {itemW > 0 && (scrolling ? (
        <div
          className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
          style={{ gap: GAP, paddingRight: GAP, animationDuration: `${Math.max(images.length * 4, 12)}s` }}
        >
          {[...images, ...images].map((s, i) => item(s, `${i}`))}
        </div>
      ) : (
        <div className="flex justify-center" style={{ gap: GAP }}>
          {images.map((s, i) => item(s, `${i}`))}
        </div>
      ))}
    </div>
  );
}
