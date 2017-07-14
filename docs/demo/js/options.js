// Transforms query string to javascript object


// Transforms Javascript Object to query string

// Returns first element that matches CSS selector {expr}.
// Querying can optionally be restricted to {container}’s descendants
// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
function $(expr, container = document) {
  return container.querySelector(expr)
}

// Finds first parent DOM element that is a link - if it exists


// Transforms http or plain url to https
function http2https(url) {
  if (!url.match(/^http/)) {
    return `https://${url}`
  }

  return url.replace(/^http:/, 'https:')
}

// Options to use if none set
const defaultOptions = {
  theme: 'custom',
  url: 'https://en.wikipedia.org/',
};

const availableThemes = [
  'cerulean',
  'cosmo',
  'custom',
  'cyborg',
  'darkly',
  'flatly',
  'journal',
  'litera',
  'lumen',
  'lux',
  'materia',
  'minty',
  'pulse',
  'sandstone',
  'simplex',
  'slate',
  'solar',
  'spacelab',
  'superhero',
  'united',
  'yeti',
];

// Returns user settings from localStorage
function getOptions() {
  const stored = localStorage.getItem('settings');
  if (!stored) {
    localStorage.setItem('settings', JSON.stringify(defaultOptions));
    return defaultOptions
  }

  const options = JSON.parse(stored);
  if (!availableThemes.includes(options.theme)) {
    options.theme = defaultOptions.theme;
    localStorage.setItem('settings', JSON.stringify(options));
  }

  return options
}

const options = getOptions();

// Back/Forward support
$('#back').addEventListener('click', (event) => {
  event.preventDefault();
  history.back();
});

$('#forward').addEventListener('click', (event) => {
  event.preventDefault();
  history.forward();
});

// Minimal dropdown menu
$('.dropdown').addEventListener('click', (event) => {
  event.preventDefault();
  event.target.parentNode.classList.toggle('show');

  const expanded = Boolean(event.target.getAttribute('aria-expanded'));
  event.target.setAttribute('aria-expanded', (!expanded).toString());
  event.target.classList.toggle('active');
});

// get <select> value
function getVal(el) {
  return el.options[el.selectedIndex].getAttribute('value')
}

// set <select> value
function setVal(el, val) {
  for (let i = 0; i < el.options.length; i += 1) {
    if (el.options[i].value === val) {
      el.selectedIndex = i; // eslint-disable-line no-param-reassign
      return
    }
  }

  setVal(el, 'custom');
}

// Save on submit
$('form', $('#content')).addEventListener('submit', (event) => {
  event.preventDefault();
  let url = http2https($('#url').value);
  const theme = getVal($('#theme'));

  if (url[url.length - 1] !== '/') {
    url += '/';
  }

  if (url === '') {
    url = 'https://en.wikipedia.org/';
  }

  localStorage.setItem('settings', JSON.stringify({
    url,
    theme,
  }));

  location.replace('app.html');
});

// Theme preview
$('#theme').addEventListener('change', () => {
  $('link').setAttribute('href', `themes/${getVal($('#theme'))}/style.css`);
});

// Set initial values
$('#url').setAttribute('value', options.url);
setVal($('#theme'), options.theme);

// Load theme
$('link').setAttribute('href', `themes/${options.theme}/style.css`);

// fix url to https on blur
$('#url').addEventListener('blur', (event) => {
  $('#url').value = http2https(event.target.value);
});

// New Tab support
$('#newTab').addEventListener('click', (event) => {
  event.preventDefault();
  window.open(location.href, '_newtab');
});
