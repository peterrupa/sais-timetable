import { Search } from '../selectors';
import { parseDay, parseTime } from '../parsers';

const handleSearchPage = $ => {
  const subjectsEl = $.querySelectorAll(Search.SUBJECTS);
  const subjectsCartEl = $.querySelectorAll(Search.SUBJECTS_CART);
  const durationRoomEl = $.querySelectorAll(Search.DURATION_ROOM);
  const durationRoomCartEl = $.querySelectorAll(Search.DURATION_ROOM_CART);

  // Combine nodes
  const subjects = [...subjectsEl, ...subjectsCartEl];
  const durationRooms = [...durationRoomEl, ...durationRoomCartEl];

  const courses = subjects.map((subject, i, arr) => {
    const course = subject.innerText.trim() ? subject.innerText : arr[i - 1].innerText; // if blank, probably multiple timeslots
    
    const [ timeslot = null, room = null ] = durationRooms[i].innerText.split('\n'); // Format: <Timeslot>\n<Venue>
    const day = parseDay(timeslot);
    const time = parseTime(timeslot);

    return {
      course,
      day,
      time,
      room: room ? room.trim() : null,
      section: '',
    }
  });

  return courses;
}

export default handleSearchPage;
