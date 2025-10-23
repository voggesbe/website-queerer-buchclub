// Calculate third Thursday of given year/month
function getThirdThursday(year, month) {
  let date = new Date(year, month, 1);
  let thursdayCount = 0;

  while (true) {
    if (date.getDay() === 4) { // Thursday is 4
      thursdayCount++;
      if (thursdayCount === 3) return date;
    }
    date.setDate(date.getDate() + 1);
  }
}

// Get next 3 third Thursdays from today
function getNextThreeThirdThursdays() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  const dates = [];
  while (dates.length < 3) {
    let thirdThursday = getThirdThursday(year, month);
    thirdThursday.setHours(18, 0, 0, 0); // 6 PM
    if (thirdThursday >= today) dates.push(new Date(thirdThursday));
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }
  return dates;
}

// Normalize date to yyyy-mm-dd string for comparison
function formatDateKey(date) {
  let yyyy = date.getFullYear();
  let mm = (date.getMonth() + 1).toString().padStart(2, '0');
  let dd = date.getDate().toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Main function: fetch books, match dates, render clickable dates side by side
async function renderUpcomingLinkedDates() {
  const container = document.getElementById('upcoming-dates');
  if (!container) return;

  const baseurl = container.getAttribute('data-baseurl') || '';

  // Add here all your JSON data files to fetch and merge
  const bookDataFiles = [
    `${baseurl}/assets/data/books.json`
  ];

  // Fetch and combine book data
  const bookLists = await Promise.all(bookDataFiles.map(url =>
    fetch(url).then(res => res.json())
  ));
  const allBooks = bookLists.flat();

  // Create a lookup of books by discussion_date (yyyy-mm-dd)
  const bookMap = {};
  allBooks.forEach(book => {
    // Extract date part only and normalize
    const discDate = new Date(book.discussion_date);
    const key = formatDateKey(discDate);
    bookMap[key] = book;
  });

  // Get next three third Thursday dates
  const upcomingDates = getNextThreeThirdThursdays();

  // Create date boxes side by side
  const dateBoxes = upcomingDates.map(date => {
    const key = formatDateKey(date);
    const book = bookMap[key];
    const bookSlug = book ? book.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') : '';
    const href = bookSlug ? `alle_buecher.html#${bookSlug}` : '';

    return `
      <div class="date-box">
        <a href="${href}">
          ${date.toLocaleDateString('de-DE', {
            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </a>
      </div>
    `;
  });

  container.innerHTML = `<div class="date-container">${dateBoxes.join('')}</div>`;
}

// Run on page load
document.addEventListener('DOMContentLoaded', renderUpcomingLinkedDates);
