document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('all-books-container');
  const baseurl = container.getAttribute('data-baseurl') || '';
  const now = new Date();

  fetch(`${baseurl}/assets/data/books.json`)
    .then(response => response.json())
    .then(books => {
      const futureBooks = books.filter(book => new Date(book.discussion_date) >= now);

      if (futureBooks.length === 0) {
        container.innerHTML = '<p>Derzeit keine besprochenen Bücher.</p>';
        return;
      }

      // Group books by year and month
      const booksByYear = {};
      futureBooks.forEach(book => {
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
          </div>
        `;

        container.insertAdjacentHTML('beforeend', bookHtml);
      });


      // Scroll to anchor if URL has hash
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    })
    .catch(e => {
      container.innerHTML = `<p>Fehler beim Laden der Bücher: ${e.message}</p>`;
    });
});
