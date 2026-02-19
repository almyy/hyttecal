import { chromium } from 'playwright';

export interface DateRange {
  start: Date;
  end: Date;
}

const FINN_URL =
  'https://www.finn.no/reise/feriehus-hytteutleie/ad.html?finnkode=244033792&ci=2';
const MONTHS_TO_SCRAPE = 12;

export async function scrapeBookings(): Promise<DateRange[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto(FINN_URL, { waitUntil: 'networkidle', timeout: 30_000 });

  const bookedDateStrings = new Set<string>();

  for (let month = 0; month < MONTHS_TO_SCRAPE; month++) {
    const dates = await page.evaluate(() => {
      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button.CalendarDay'),
      );
      return buttons
        .filter(
          (btn) =>
            btn.className.includes('CalendarDay--eventBooking') &&
            !btn.className.includes('CalendarDay--isNotDisplayedMonth'),
        )
        .map((btn) => btn.querySelector('time')?.getAttribute('datetime') ?? '')
        .filter(Boolean);
    });

    for (const d of dates) bookedDateStrings.add(d);

    if (month < MONTHS_TO_SCRAPE - 1) {
      await page.evaluate(() => {
        const btn = document.querySelector<HTMLButtonElement>('[aria-label="neste måned"]');
        btn?.click();
      });
      await page.waitForTimeout(400);
    }
  }

  await browser.close();

  return groupIntoRanges(bookedDateStrings);
}

function groupIntoRanges(dateStrings: Set<string>): DateRange[] {
  const sorted = [...dateStrings]
    .map((s) => new Date(s))
    .sort((a, b) => a.getTime() - b.getTime());

  const ranges: DateRange[] = [];
  let i = 0;

  while (i < sorted.length) {
    const rangeStart = sorted[i];
    let rangeEnd = sorted[i];

    while (i + 1 < sorted.length) {
      const next = sorted[i + 1];
      const expectedNext = new Date(rangeEnd);
      expectedNext.setDate(expectedNext.getDate() + 1);

      if (next.getTime() === expectedNext.getTime()) {
        rangeEnd = next;
        i++;
      } else {
        break;
      }
    }

    ranges.push({ start: rangeStart, end: rangeEnd });
    i++;
  }

  return ranges;
}
