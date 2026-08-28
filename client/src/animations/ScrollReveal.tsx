import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
  amount?: 'some' | 'all' | number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  className = '',
  amount = 0.2
}) => {
  const getVariants = () => {
    switch (direction) {
      case 'up':
        return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
      case 'down':
        return { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } };
      case 'left':
        return { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
      case 'right':
        return { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
      case 'none':
        return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      default:
        return { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
