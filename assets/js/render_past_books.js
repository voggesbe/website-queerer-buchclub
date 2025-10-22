document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('past-books-container');
  const baseurl = container.getAttribute('data-baseurl') || '';
  const now = new Date();

  fetch(`${baseurl}/assets/data/books.json`)
    .then(response => response.json())
    .then(books => {
      const pastBooks = books.filter(book => new Date(book.discussion_date) <= now);

      if (pastBooks.length === 0) {
        container.innerHTML = '<p>Derzeit keine besprochenen Bücher.</p>';
        return;
      }

      // Group books by year and month
      const booksByYear = {};
      pastBooks.forEach(book => {
        const date = new Date(book.discussion_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-based

        if (!booksByYear[year]) booksByYear[year] = {};
        if (!booksByYear[year][month]) booksByYear[year][month] = [];
        booksByYear[year][month].push(book);
      });

      // Sort years descending
      const years = Object.keys(booksByYear).sort((a,b) => b - a);

      // Create year select dropdown
      const yearSelect = document.createElement('select');
      yearSelect.id = 'year-select';
      years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });

      // Create month select dropdown
      const monthSelect = document.createElement('select');
      monthSelect.id = 'month-select';

      // Utility to fill month options for a selected year
      function fillMonthOptions(selectedYear) {
        monthSelect.innerHTML = '';

        const allMonthsOption = document.createElement('option');
        allMonthsOption.value = 'all';
        allMonthsOption.textContent = 'Alle Monate';
        monthSelect.appendChild(allMonthsOption);

        const months = Object.keys(booksByYear[selectedYear] || {}).sort((a,b) => a - b);
        months.forEach(month => {
          const option = document.createElement('option');
          option.value = month;
          option.textContent = new Date(selectedYear, month - 1).toLocaleString('de-DE', { month: 'long' });
          monthSelect.appendChild(option);
        });
        monthSelect.value = 'all'; // default to all months
      }

      // Function to render books
      function renderBooks(selectedYear, selectedMonth) {
        // Remove old list if present
        const oldList = container.querySelector('.books-list');
        if (oldList) container.removeChild(oldList);

        const booksContainer = document.createElement('div');
        booksContainer.className = 'books-list';

        let booksToRender = [];
        if (selectedMonth === 'all') {
          Object.values(booksByYear[selectedYear]).forEach(monthGroup => {
            booksToRender.push(...monthGroup);
          });
        } else {
          booksToRender = booksByYear[selectedYear][selectedMonth] || [];
        }

        if (booksToRender.length === 0) {
          booksContainer.innerHTML = '<p>Keine Bücher für diese Auswahl.</p>';
          container.appendChild(booksContainer);
          return;
        }

        booksToRender.forEach(book => {
          const slug = book.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
          const bookHtml = `
            <div id="${slug}" class="book-detail">
              <div class="book-image-col">
                <img src="${baseurl}${book.image}" alt="${book.title}" />
              </div>
              <div class="book-info-col">
                <h2>${book.title}</h2>
                <p><strong>Autor*in:</strong> ${book.author}</p>
                <p class="description">${book.description}</p>
                <p><strong>Diskussion am:</strong> ${new Date(book.discussion_date).toLocaleDateString('de-DE')}</p>
              </div>
            </div>`;
          booksContainer.insertAdjacentHTML('beforeend', bookHtml);
        });
        container.appendChild(booksContainer);
      }

      // Empty current container and insert selectors
      container.innerHTML = '';
      container.appendChild(yearSelect);
      container.appendChild(monthSelect);

      // Initialize selects with most recent year
      const initialYear = years[0];
      yearSelect.value = initialYear;
      fillMonthOptions(initialYear);

      // Initial render
      renderBooks(initialYear, 'all');

      // Event listeners
      yearSelect.addEventListener('change', () => {
        const year = yearSelect.value;
        fillMonthOptions(year);
        renderBooks(year, 'all');
      });

      monthSelect.addEventListener('change', () => {
        renderBooks(yearSelect.value, monthSelect.value);
      });
    })
    .catch(err => {
      container.innerHTML = `<p>Fehler beim Laden der Bücher: ${err.message}</p>`;
    });
});
