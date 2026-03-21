import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
      <motion.a
        href="https://line.me"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-green-500 text-white p-3.5 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
        title="ติดต่อทาง Line"
      >
        <MessageCircle size={24} />
      </motion.a>
      
      <motion.a
        href="tel:08xxxxxxxx"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-red-600 text-white p-3.5 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center"
        title="โทรสอบถาม"
      >
        <Phone size={24} />
      </motion.a>
    </div>
  );
}
