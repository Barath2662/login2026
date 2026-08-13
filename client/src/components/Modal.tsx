import type { FC, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="p-6 bg-[#121217] border border-gray-800 rounded relative min-w-[400px]">
        {title && <h2 className="text-xl font-bold text-white mb-4 uppercase">{title}</h2>}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
        {children}
      </div>
    </div>
  );
};
