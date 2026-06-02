'use client';

import { useState, useRef, useEffect } from 'react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
  snapPoints?: number[];
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = '80vh',
  snapPoints = [0, 50, 100]
}: MobileBottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ y: 0, startSnap: 0, timestamp: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentSnap(0);
    } else {
      setCurrentSnap(100);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      y: e.clientY,
      startSnap: currentSnap,
      timestamp: Date.now()
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      y: e.touches[0].clientY,
      startSnap: currentSnap,
      timestamp: Date.now()
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSheet(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateSheet(e.touches[0].clientY);
  };

  const updateSheet = (clientY: number) => {
    const delta = clientY - dragStartRef.current.y;
    const percentageDelta = (delta / window.innerHeight) * 100;
    const newSnap = Math.max(0, Math.min(100, dragStartRef.current.startSnap + percentageDelta));

    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${100 - newSnap}%)`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    finalizeSnap();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    finalizeSnap();
  };

  const finalizeSnap = () => {
    const current = dragStartRef.current.startSnap;
    const elapsed = Date.now() - dragStartRef.current.timestamp;
    const velocity = Math.abs((current - dragStartRef.current.startSnap) / elapsed);

    let closestSnap = snapPoints[0];
    let closestDistance = Math.abs(current - closestSnap);

    for (const snap of snapPoints) {
      const distance = Math.abs(current - snap);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSnap = snap;
      }
    }

    // If user swiped down fast, close the sheet
    if (velocity > 0.5 && current < dragStartRef.current.startSnap) {
      setCurrentSnap(0);
      setTimeout(onClose, 300);
      return;
    }

    setCurrentSnap(closestSnap);
    if (closestSnap === 0) {
      setTimeout(onClose, 300);
    }
  };

  const handleBackdropClick = () => {
    setCurrentSnap(0);
    setTimeout(onClose, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCurrentSnap(0);
      setTimeout(onClose, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-[80] bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${100 - currentSnap}%)`,
          maxHeight,
          pointerEvents: isDragging ? 'none' : 'auto'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Draggable Handle */}
        <div
          className="flex justify-center items-center py-3 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="button"
          tabIndex={0}
          aria-label="Drag to adjust"
        >
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 60px)` }}>
          <div className="px-4 py-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
