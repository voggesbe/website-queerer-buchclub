document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('all-books-container');
  const baseurl = container.getAttribute('data-baseurl') || '';

  fetch(`${baseurl}/assets/data/books.json`)
    .then(response => response.json())
    .then(books => {
      if (books.length === 0) {
        container.innerHTML = '<p>Keine Bücher gefunden.</p>';
        return;
      }

      books.forEach(book => {
        const slug = book.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

        const bookHtml = `
          <div id="${slug}" class="book-detail" style="margin-bottom: 2em; display: grid; grid-template-columns: 200px 1fr; gap: 1rem; align-items: start;">
            <div class="book-image-col">
              <img src="${baseurl}${book.image}" alt="${book.title}" style="width: 100%; height: auto; border-radius: 4px;" />
            </div>
            <div class="book-info-col">
              <h2 style="margin-top: 0;">${book.title}</h2>
              <p><strong>Autor:</strong> ${book.author}</p>
              <p>${book.description}</p>
              <p><strong>Diskussion am:</strong> ${new Date(book.discussion_date).toLocaleDateString('de-DE')}</p>
            </div>
          </div>`;

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
