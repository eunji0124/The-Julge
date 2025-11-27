import { ReactNode, useEffect } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const BaseModal = ({ isOpen, onClose, children }: BaseModalProps) => {
  // 스크롤 방지
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // ESC키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true">
      <div
        className="flex flex-col items-center rounded-xl bg-white text-center shadow-md"
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
