document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('books-container');
  const baseurl = container.getAttribute('data-baseurl') || '';
  const now = new Date();

  fetch(`${baseurl}/assets/data/books_2025.json`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(books => {
      const upcomingBooks = books.filter(book => new Date(book.discussion_date) >= now);

      if (upcomingBooks.length === 0) {
        container.innerHTML = '<p>Derzeit keine kommenden Bücher.</p>';
        return;
      }

      // Helper to slugify title
      const slugify = text =>
        text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text

      upcomingBooks.forEach(book => {
        const slug = slugify(book.title);
        const colDiv = document.createElement('div');
        colDiv.className = '4u 12u$(mobile)';
        colDiv.innerHTML = `
          <div class="item" style="text-align:center;">
            <a href="${baseurl}/alle_buecher.html#${slug}">
              <img src="${baseurl}${book.image}" alt="${book.title}" style="width:100%; height:auto;" />
            </a>
            <header>
              <h3>${book.title}</h3>
            </header>
          </div>`;
        container.appendChild(colDiv);
      });
    })
    .catch(err => {
      container.innerHTML = `<p>Fehler beim Laden der Bücher: ${err.message}</p>`;
    });
});
