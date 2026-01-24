import { DateInfo } from '../types';

export const getCurrentDates = (): DateInfo => {
  const now = new Date();

  // Format Gregorian Date (e.g., الجمعة، 24 مايو 2024)
  const gregorianFormatter = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory'
  });

  // Format Hijri Date (e.g., 15 ذو القعدة 1445)
  const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    gregorian: gregorianFormatter.format(now),
    hijri: hijriFormatter.format(now),
  };
};