import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className: string;
}

export function Button({
  children,
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={clsx(className)}>
      {children}
    </button>
  );
}
