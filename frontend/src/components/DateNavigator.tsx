import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { addMonths, subMonths } from 'date-fns';

export type DateNavigatorRenderProps = {
  year: number;
  month: number;
};

type DateNavigatorProps = {
  children: (props: DateNavigatorRenderProps) => React.ReactNode;
};

const STORAGE_KEY = 'app:selectedMonth';

export const DateNavigator: React.FC<DateNavigatorProps> = ({ children }) => {

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Date(stored) : new Date();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentDate.toISOString());
  }, [currentDate]);

  const goPrev = () => setCurrentDate(d => subMonths(d, 1));
  const goNext = () => setCurrentDate(d => addMonths(d, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <div>
      <div className="flex items-center justify-center mb-4 m-3">
        <Button
          icon="pi pi-chevron-left"
          className="p-button-text text-2xl w-10 h-10"
          onClick={goPrev}
          aria-label="Previous month"
        />
        <Calendar
          value={currentDate}
          onChange={e => e.value && setCurrentDate(e.value)}
          monthNavigator
          yearNavigator
          yearRange="2000:2030"
          dateFormat="mm/yy"
          showIcon
          placeholder="Select month"
          className="mx-3"
          view="month"
        />
        <Button
          icon="pi pi-chevron-right"
          className="p-button-text text-2xl w-10 h-10"
          onClick={goNext}
          aria-label="Next month"
        />
      </div>
      {children({ year, month })}
    </div>
  );
};
