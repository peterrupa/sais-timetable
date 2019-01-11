import { IFRAME, TIMETABLE, Cart } from './selectors';
import { IS_SEARCH_PAGE, IS_VALID_COURSE } from './conditionals';
import wrapper from './html';

import Scheda from './scheda';

import handleAddToCart from './pages/cart';

export const defaultColors = [
  '#FF6600', '#086B08', '#4B7188', '#8C0005', '#FF69B1',
  '#191973', '#474747', '#8B5928', '#C824F9', '#8EEFC2'
];

const Application = function () {
  if (this.document.readyState === 'complete') {
    let courses;
    let colorIndex = 0;
    const colorMapping = {};

    if (IS_SEARCH_PAGE(this.document)) {
      console.log('SEARCH PAGE');
    } else {
      courses = handleAddToCart(this.document);

      console.log(courses);

      // Create HTML
      const cart = this.document.querySelector(Cart.LIST);
      cart.innerHTML = wrapper + cart.innerHTML;
    }

    // Render Table
    const table = this.document.querySelector(TIMETABLE);
    const scheda = new Scheda();
    scheda.init(table);

    // Render Courses
    courses.forEach(({ day, time, course: courseCode, section, room }) => {
      if (IS_VALID_COURSE(day, time)) {
        // Get Color
        let color;
        if (colorMapping.hasOwnProperty(courseCode)) {
          color = colorMapping[courseCode];
        } else {
          color = defaultColors[colorIndex % defaultColors.length];
          colorIndex++;
          colorMapping[courseCode] = color;
        }

        // Loop through days
        day.forEach(day => {
          scheda.add({
            day,
            time: `${time.start}-${time.end}`,
            courseCode,
            section,
            room,
            color
          });
        });
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
    // setInterval(() => {
    //   if (!this.document.querySelector('#timetable')) { // if app is already rendered
    //     app();
    //   }
    // }, 50);

    app();
  });
}
