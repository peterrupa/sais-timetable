export const IS_SEARCH_PAGE = selector => !!selector.querySelectorAll('a#DERIVED_SSS_CRT_LINK_ADD_ENRL').length;

export const IS_VALID_COURSE = (day, time) => (day && day.every(d => d !== 'TBA')) && (time && time !== 'TBA');
