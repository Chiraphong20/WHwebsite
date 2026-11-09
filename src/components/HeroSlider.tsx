import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../lib/siteContent';

const INTERVAL_MS = 5000;

// แบนเนอร์ Hero: รูปเดียวแสดงเฉยๆ · หลายรูปสไลด์อัตโนมัติ (เลื่อนจาง) หยุดเมื่อเอาเมาส์วาง
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => { if (index >= count) setIndex(0); }, [count, index]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setIndex(i => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(t);
  }, [count, paused]);

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid">
        {slides.map((s, i) => {
          const img = (
            <img
              src={s.image}
              alt={s.alt}
              className="w-full h-auto object-cover sm:object-contain"
              // @ts-ignore - fetchPriority is supported in modern browsers but may not be in current React types
              fetchPriority={i === 0 ? 'high' : 'auto'}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          );
          const active = i === index;
          return (
            <div
              key={i}
              aria-hidden={!active}
              className={`[grid-area:1/1] transition-opacity duration-700 ${active ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}
            >
              {s.link ? <a href={s.link} target={/^https?:/.test(s.link) ? '_blank' : undefined} rel="noopener noreferrer" tabIndex={active ? 0 : -1}>{img}</a> : img}
            </div>
          );
        })}
      </div>
      {count > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`ไปที่แบนเนอร์ ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary-500' : 'w-2 bg-white/80 hover:bg-white'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
