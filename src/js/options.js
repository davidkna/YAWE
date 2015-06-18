(() => {

	// Returns first element that matches CSS selector {expr}.
	// Querying can optionally be restricted to {container}’s descendants
	function $(expr, container) {
		return typeof expr === 'string' ? (container || document).querySelector(expr) : expr || null;
	}

	// Returns all elements that match CSS selector {expr} as an array.
	// Querying can optionally be restricted to {container}’s descendants
	function $$(expr, container) {
		return [].slice.call((container || document).querySelectorAll(expr));
	}

	function getVal(el) {
		return el.options[el.selectedIndex].getAttribute('value');
	}

	function setVal(el, val) {
		for (let i = 0; i < el.options.length; i++ ) {
			if (el.options[i].value === val) {
				el.selectedIndex = i;
				return;
			}
		}
		setVal(el, 'custom');
	}

	function fixHttp(url) {
		if (!url.match(/^http/)) {
			return `https://${ url }`;
		}
		return url.replace(/^http:/, 'https:');
	}

	function timestamp() {
		return Math.floor(Date.now() / 1000);
	}

	$('form', $('#content')).addEventListener('submit', (event) => {
		event.preventDefault();
		let url = fixHttp($('#url').value);
		const theme = getVal($('#theme'));

		if (url[-1] !== '/') {
			url.concat('/');
		}

		localStorage.setItem('settings', JSON.stringify({
			url: url,
			theme: theme,
			timestamp: timestamp
		}));

		location.replace('app.html');
	});

	$('#theme').addEventListener('change', () => {
		$('link').setAttribute('href', `bootswatch/${ getVal($('#theme')) }/style.css`);
	});

	const options = JSON.parse(localStorage.getItem('settings'));
	$('#url').setAttribute('value', options.url);
	setVal($('#theme'), options.theme);
	$('link').setAttribute('href', `bootswatch/${ options.theme }/style.css`);

	$('.icon-left-open').addEventListener('click', (event) => {
		event.preventDefault();
		history.back();
	});
	$('#url').addEventListener('blur', (event) => {
		event.target.value = fixHttp(event.target.value)
	});
})();
