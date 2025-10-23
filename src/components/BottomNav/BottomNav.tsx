'use client';

import { useState } from 'react';
import BoxIcon from '../../../public/icons/box.svg';
import HomeIcon from '../../../public/icons/home.svg';
import SettingsIcon from '../../../public/icons/settings.svg';
import UploadIcon from '../../../public/icons/upload.svg';
import { Button } from '../Button';
import Link from 'next/link';

type TabId = 'BOX' | 'UPLOAD' | 'HOME' | 'SETTINGS';

interface NavTab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const NAV_TABS: NavTab[] = [
  { href: '/box', id: 'BOX', label: '박스', icon: BoxIcon },
  { href: '/upload', id: 'UPLOAD', label: '업로드', icon: UploadIcon },
  { href: '/', id: 'HOME', label: '홈', icon: HomeIcon },
  { href: '/settings', id: 'SETTINGS', label: '세팅', icon: SettingsIcon },
];

export default function BottomNav() {
  const [activeTab, setActiveTab] = useState<TabId>('HOME');

  const handleClick = (id: TabId): void => {
    setActiveTab(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom ">
      <div className="w-full max-w-app grid grid-cols-4 justify-center items-center mx-auto p-2">
        {NAV_TABS.map(({ href, id, label, icon: Icon }) => {
          const isActive = id === activeTab;

          return (
            <Link
              href={href}
              key={id}
              onClick={() => {
                handleClick(id);
              }}
              className="flex flex-col gap-1 justify-center items-center"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? 'text-[#000000]' : 'text-[#D2D2D2]'}`}
              />
              <span
                className={`text-[0.625rem] font-bold ${isActive ? 'text-[#000000]' : 'text-[#D2D2D2]'}`}
              >
                {id}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
