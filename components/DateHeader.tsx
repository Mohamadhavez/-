import React, { useEffect, useState } from 'react';
import { getCurrentDates } from '../utils/dateUtils';
import { DateInfo } from '../types';

const DateHeader: React.FC = () => {
  const [dates, setDates] = useState<DateInfo | null>(null);

  useEffect(() => {
    setDates(getCurrentDates());
  }, []);

  if (!dates) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-emerald-100 mb-6 text-center">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-emerald-900">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗓️</span>
          <span className="font-bold text-lg">{dates.gregorian}</span>
        </div>
        <div className="hidden md:block w-px h-6 bg-emerald-200"></div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="font-bold text-lg">{dates.hijri}</span>
        </div>
      </div>
    </div>
  );
};

export default DateHeader;