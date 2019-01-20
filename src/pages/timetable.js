import Scheda from '../scheda';
import { IS_VALID_COURSE } from '../conditionals';

export const defaultColors = [
  '#FF6600',
  '#086B08',
  '#4B7188',
  '#8C0005',
  '#FF69B1',
  '#191973',
  '#474747',
  '#8B5928',
  '#C824F9',
  '#8EEFC2'
];

export const renderTable = (table, courses) => {
  const scheda = new Scheda();
  scheda.init(table);

  let colorIndex = 0;
  const colorMapping = {};

  // Render Courses
  courses.forEach(({ day, time, course: courseCode, section = '', room }) => {
    if (IS_VALID_COURSE(day, time)) {
      // Get Color
      let color;
      const key = `${courseCode} ${section}`;

      if (colorMapping.hasOwnProperty(key)) {
        color = colorMapping[key];
      } else {
        color = defaultColors[colorIndex % defaultColors.length];
        colorIndex++;
        colorMapping[key] = color;
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
};
