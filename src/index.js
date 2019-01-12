import { IFRAME, TIMETABLE, DOWNLOAD_BUTTON, TOGGLE_TIMETABLE, Cart, Search } from './selectors';
import { IS_SEARCH_PAGE } from './conditionals';
import wrapper from './html';

import handleAddToCart from './pages/cart';
import handleSearchPage from './pages/search';
import { renderTable } from './pages/timetable';

const Application = function () {
  let mountPoint;
  let courses;

  if (IS_SEARCH_PAGE(this.document)) {
    courses = handleSearchPage(this.document);
    mountPoint = this.document.querySelector(Search.HEADER);
  } else {
    courses = handleAddToCart(this.document);
    mountPoint = this.document.querySelector(Cart.LIST);
  }

  if (mountPoint) {
    mountPoint.innerHTML = wrapper + mountPoint.innerHTML;

    const timetable = this.document.querySelector(TIMETABLE);
    const toggle = this.document.querySelector(TOGGLE_TIMETABLE);
    
    renderTable(this.document.querySelector(TIMETABLE), courses);
    toggle.addEventListener('click', e => {
      e.preventDefault();

      if (timetable.classList.contains('shown')) {
        timetable.classList.remove('shown');
        timetable.classList.add('hidden');
      } else {
        timetable.classList.remove('hidden');
        timetable.classList.add('shown');
      }
    });
  }
}

const iframe = document.querySelector(IFRAME);

if (iframe) {
  const frame = { window: iframe.contentWindow, document: iframe.contentDocument };

  frame.window.addEventListener('load', function () {
    const app = Application.bind(this);

    // Render application
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(() => {
      const timetable = this.document.querySelector(TIMETABLE);

      if (!timetable) {
        app(); // Run app if not mounted
      } else {
        const button = this.document.querySelector(DOWNLOAD_BUTTON);
        button.addEventListener('click', function() {
          let url = timetable.toDataURL('image/png');
          url.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
          url.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=schedule.png');

          this.href = url;
        }, false);
      }
    });

    app();
    observer.observe(this.document, { subtree: true, attributes: true });
  });
}
