'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '@/lib/utils';
import { X } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDates: Date[];
}

export function DatePickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedDates,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  const handleDateClick = (date: Date) => {
    if (selectedDates.some(d => d.toDateString() === date.toDateString())) {
      alert('이미 선택된 날짜입니다.');
      return;
    }
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelect(selectedDate);
      setSelectedDate(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">날짜 선택</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                handleDateClick(value);
              }
            }}
            value={selectedDate}
            minDate={new Date()}
            className="w-full"
          />
        </div>

        {selectedDate && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-gray-700">
              선택된 날짜: <span className="font-semibold">{formatDate(selectedDate)}</span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!selectedDate}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

