import { useEffect, useMemo, useRef, useState } from 'react';
import { formatShortDate, getMonthLabel } from '../utils';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function parseIsoDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function toIsoDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getFirstWeekday(year, month) {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function DatePicker({ availableDates, value, onChange }) {
  const initial = value ? parseIsoDate(value) : parseIsoDate(availableDates[0] ?? '2026-09-01');
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const containerRef = useRef(null);

  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);

  const bounds = useMemo(() => {
    if (!availableDates.length) return null;
    const sorted = [...availableDates].sort();
    return {
      min: parseIsoDate(sorted[0]),
      max: parseIsoDate(sorted[sorted.length - 1]),
    };
  }, [availableDates]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstWeekday = getFirstWeekday(viewYear, viewMonth);
  const blanks = Array.from({ length: firstWeekday });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function canGoPrev() {
    if (!bounds) return false;
    return viewYear > bounds.min.year ||
      (viewYear === bounds.min.year && viewMonth > bounds.min.month);
  }

  function canGoNext() {
    if (!bounds) return false;
    return viewYear < bounds.max.year ||
      (viewYear === bounds.max.year && viewMonth < bounds.max.month);
  }

  function goPrevMonth() {
    if (!canGoPrev()) return;
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (!canGoNext()) return;
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function selectDate(iso) {
    onChange(iso);
    setIsOpen(false);
  }

  function clearDate() {
    onChange('');
    setIsOpen(false);
  }

  const displayLabel = value ? formatShortDate(value) : 'Выберите день';

  return (
    <div className="date-picker" ref={containerRef}>
      <label htmlFor="departure-date" className="date-picker__label">
        Дата отправления
      </label>
      <button
        id="departure-date"
        type="button"
        className={`date-picker__trigger${value ? ' date-picker__trigger--active' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span>{displayLabel}</span>
        <span className="date-picker__icon" aria-hidden="true">📅</span>
      </button>

      {isOpen && (
        <div className="date-picker__dropdown" role="dialog" aria-label="Выбор даты отправления">
          <div className="date-picker__nav">
            <button type="button" onClick={goPrevMonth} disabled={!canGoPrev()} aria-label="Предыдущий месяц">
              ‹
            </button>
            <span className="date-picker__month-title">
              {getMonthLabel(viewMonth)} {viewYear}
            </span>
            <button type="button" onClick={goNextMonth} disabled={!canGoNext()} aria-label="Следующий месяц">
              ›
            </button>
          </div>

          <div className="date-picker__weekdays">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="date-picker__grid">
            {blanks.map((_, i) => (
              <span key={`blank-${i}`} className="date-picker__day date-picker__day--empty" />
            ))}
            {days.map((day) => {
              const iso = toIsoDate(viewYear, viewMonth, day);
              const isAvailable = availableSet.has(iso);
              const isSelected = value === iso;

              return (
                <button
                  key={iso}
                  type="button"
                  className={[
                    'date-picker__day',
                    isAvailable && 'date-picker__day--available',
                    isSelected && 'date-picker__day--selected',
                  ].filter(Boolean).join(' ')}
                  disabled={!isAvailable}
                  onClick={() => selectDate(iso)}
                  aria-label={isAvailable ? formatShortDate(iso) : undefined}
                  aria-pressed={isSelected}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {value && (
            <button type="button" className="date-picker__clear" onClick={clearDate}>
              Сбросить дату
            </button>
          )}
        </div>
      )}
    </div>
  );
}
