import domready from 'domready';

import {
  IFRAME
} from './selectors';

domready(function () {
  const body = document.querySelector(IFRAME);
  const { querySelector, querySelectorAll } = body;


  console.log(body);
});