export const parseDay = day => {
  const match = day.match(/[A-Z][a-z]/g);

  if (!match) return null;

  return match;
};

export const parseTime = time => {
  const [start, end] = time.match(/\d{1,2}:\d{2}/g) || [];

  if (!start || !end) return null;

  return { start, end };
};
