import type { FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

export const DashboardLayout: FC = () => {
  const location = useLocation();
  const { reduceMotion } = useThemeStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
        transition={{ duration: 0.2 }}
        className="w-full h-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};
