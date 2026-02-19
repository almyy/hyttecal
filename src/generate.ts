import ical, { ICalCalendarMethod } from 'ical-generator';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { DateRange } from './scrape.js';

const OUTPUT_DIR = join(process.cwd(), 'calendar');
const OUTPUT_FILE = join(OUTPUT_DIR, 'hyttecal.ics');

export function generateCalendar(bookings: DateRange[]): void {
  const calendar = ical({
    name: 'Hyttecal',
    method: ICalCalendarMethod.PUBLISH,
    timezone: 'Europe/Oslo',
  });

  for (const { start, end } of bookings) {
    // iCal all-day event end is exclusive, so add one day
    const exclusiveEnd = new Date(end);
    exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);

    calendar.createEvent({
      summary: 'Hytte opptatt',
      start,
      end: exclusiveEnd,
      allDay: true,
      timezone: 'Europe/Oslo',
    });
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, calendar.toString(), 'utf-8');
  console.log(`Skrev ${bookings.length} reservasjoner til ${OUTPUT_FILE}`);
}
