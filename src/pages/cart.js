import { Cart } from '../selectors';
import { parseDay, parseTime } from '../parsers';

const handleAddToCart = $ => {
  const subjectsEl = $.querySelectorAll(Cart.SUBJECTS);
  const durationEl = $.querySelectorAll(Cart.DURATION);
  const roomEl = $.querySelectorAll(Cart.ROOM);

  const courses = Array.from(subjectsEl).map((subject, i) => {
    const [, course, section] = subject.innerText.match(/([^-]+)-(.+)/);

    const dayTime = durationEl[i].innerText;
    const day = parseDay(dayTime);
    const time = parseTime(dayTime);

    const room = roomEl[i].innerText;

    return { course, section, day, time, room };
  });

  return courses;
};

export default handleAddToCart;