import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 group">
      <motion.a
        href="https://line.me/R/ti/p/@177eggfh"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#06C755] text-white p-4 rounded-full shadow-lg shadow-green-500/30 hover:bg-[#05a847] transition-all flex items-center justify-center gap-2"
        title="ติดต่อทาง Line"
      >
        <MessageCircle size={32} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[200px] transition-all duration-300 ease-in-out font-bold">
          <span className="pl-3 pr-2">ติดต่อ LINE @177eggfh</span>
        </span>
      </motion.a>
    </div>
  );
}
