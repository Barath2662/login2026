import React from 'react';
import qrcode from 'qrcode-generator';

interface SafeQRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
}

export const SafeQRCode: React.FC<SafeQRCodeProps> = ({
  value,
  size = 180,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  className = '',
}) => {
  try {
    const qr = qrcode(0, 'H');
    qr.addData(value || 'LOGIN2K26');
    qr.make();
    const count = qr.getModuleCount();
    const cellSize = Math.max(2, Math.floor(size / count));
    const actualSize = cellSize * count;

    const cells: React.ReactNode[] = [];
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          cells.push(
            <rect
              key={`${row}-${col}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fgColor}
            />
          );
        }
      }
    }

    return (
      <svg
        width={actualSize}
        height={actualSize}
        viewBox={`0 0 ${actualSize} ${actualSize}`}
        className={className}
        style={{ backgroundColor: bgColor }}
      >
        <rect width={actualSize} height={actualSize} fill={bgColor} />
        {cells}
      </svg>
    );
  } catch (err) {
    console.error('QR rendering error:', err);
    return (
      <div className="w-40 h-40 bg-black border border-red-500 flex items-center justify-center text-xs font-mono text-red-500 p-2 text-center">
        QR Generation Error
      </div>
    );
  }
};
