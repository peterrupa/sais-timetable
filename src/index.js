import { IFRAME, TIMETABLE, Cart, Search } from './selectors';
import { IS_SEARCH_PAGE } from './conditionals';
import wrapper from './html';

import handleAddToCart from './pages/cart';
import handleSearchPage from './pages/search';
import { renderTable } from './pages/timetable';

const Application = function () {
  if (this.document.readyState === 'complete') {
    if (IS_SEARCH_PAGE(this.document)) {
      const courses = handleSearchPage(this.document);

      console.log(courses);

      // Render Table
      const header = this.document.querySelector(Search.HEADER);
      if (header) {
        header.innerHTML = wrapper + header.innerHTML;
        renderTable(this.document.querySelector(TIMETABLE), courses);
      }
    } else {
      const courses = handleAddToCart(this.document);

      console.log(courses);

      // Render Table
      const cart = this.document.querySelector(Cart.LIST);
      if (cart) {
        cart.innerHTML = wrapper + cart.innerHTML;
        renderTable(this.document.querySelector(TIMETABLE), courses);
      }
    }
  }
}

const iframe = document.querySelector(IFRAME);

if (iframe) {
  const frame = { window: iframe.contentWindow, document: iframe.contentDocument };

  frame.window.addEventListener('load', function () {
    const app = Application.bind(this);

    // Render application
    // setInterval(() => {
    //   if (!this.document.querySelector('#timetable')) { // if app is already rendered
    //     app();
    //   }
    // }, 50);
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(() => {
      if (!this.document.querySelector(TIMETABLE)) {
        app();
      }
    });

    app();
    observer.observe(this.document, { subtree: true, attributes: true });
  });
}
