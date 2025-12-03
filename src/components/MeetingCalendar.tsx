'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '@/lib/utils';

interface MeetingCalendarProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  maxSelections: number;
}

export function MeetingCalendar({
  selectedDates,
  onDatesChange,
  maxSelections,
}: MeetingCalendarProps) {
  const [value, setValue] = useState<Date | Date[]>(new Date());

  const handleDateChange = (date: Date | Date[]) => {
    if (Array.isArray(date)) {
      // 다중 선택 모드
      if (date.length <= maxSelections) {
        onDatesChange(date);
      }
    } else {
      // 단일 선택 모드
      const newDates = [...selectedDates];
      const dateIndex = newDates.findIndex(
        d => d.toDateString() === date.toDateString()
      );

      if (dateIndex >= 0) {
        // 이미 선택된 날짜면 제거
        newDates.splice(dateIndex, 1);
      } else {
        // 새로 선택
        if (newDates.length < maxSelections) {
          newDates.push(date);
        } else {
          alert(`최대 ${maxSelections}개의 날짜만 선택 가능합니다.`);
          return;
        }
      }
      onDatesChange(newDates);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const isSelected = selectedDates.some(
      selectedDate => selectedDate.toDateString() === date.toDateString()
    );
    return isSelected ? 'bg-blue-600 text-white' : '';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <Calendar
          onChange={handleDateChange}
          value={value}
          tileClassName={tileClassName}
          minDate={new Date()}
          selectRange={false}
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          선택된 날짜 ({selectedDates.length}/{maxSelections})
        </h3>
        {selectedDates.length === 0 ? (
          <p className="text-gray-500">날짜를 선택해주세요.</p>
        ) : (
          <ul className="space-y-2">
            {selectedDates.map((date, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded"
              >
                <span>{formatDate(date)}</span>
                <button
                  onClick={() => {
                    const newDates = selectedDates.filter((_, i) => i !== index);
                    onDatesChange(newDates);
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  제거
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

