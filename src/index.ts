import { scrapeBookings } from './scrape.js';
import { generateCalendar } from './generate.js';

async function main() {
  console.log('Henter reservasjoner fra finn.no...');
  const bookings = await scrapeBookings();
  console.log(`Fant ${bookings.length} reserverte perioder.`);

  for (const { start, end } of bookings) {
    console.log(`  ${start.toDateString()} → ${end.toDateString()}`);
  }

  generateCalendar(bookings);
}

main().catch((err) => {
  console.error('Feil:', err);
  process.exit(1);
});
