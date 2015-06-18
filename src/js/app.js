import qs from 'query-string';
document.addEventListener('DOMContentLoaded', () => {
	let options = {
		theme: '',
		url: ''
	}

	const $link = $('link');
	if (!localStorage.getItem('settings')) {
		const defaultOptions = {
			theme: 'custom',
			url: 'https://en.wikipedia.org/',
			timestamp: timestamp()
		};
		localStorage.setItem('settings', JSON.stringify(defaultOptions));
		$link.setAttribute('href', 'bootswatch/custom/style.css');
		options = defaultOptions;
	} else {
		options = JSON.parse(localStorage.getItem('settings'));
		$link.setAttribute('href', `bootswatch/${ options.theme }/style.css`);
	}
	fromHash();
	const isWikiRegex = new RegExp(`^(${ regEscape(options.url.slice(0, -1)).replace(/^https?:/, 'https?:') })?/wiki/.+$`);

	function isWiki(str) {
		return str.match(isWikiRegex);
	}

	function timestamp() {
		return Math.floor(Date.now() / 1000);
	}
	// Returns first element that matches CSS selector {expr}.
	// Querying can optionally be restricted to {container}’s descendants
	// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
	function $(expr, container) {
		return typeof expr === 'string' ? (container || document).querySelector(expr) : expr || null;
	}

	// Returns all elements that match CSS selector {expr} as an array.
	// Querying can optionally be restricted to {container}’s descendants
	// Source: http://lea.verou.me/2015/04/jquery-considered-harmful/
	function $$(expr, container) {
		return [].slice.call((container || document).querySelectorAll(expr));
	}

	// Returns url as JSON
	// Source: https://mathiasbynens.be/notes/xhr-responsetype-json
	function getJSON(url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('get', url, true);
			xhr.responseType = 'json';
			xhr.addEventListener('load', () => {
				const status = xhr.status;
				if (status === 200) {
					resolve(xhr.response);
				} else {
					reject(`${ status }: ${ xhr.statusText}`);
				}
			});
			xhr.send();
		});
	}

	function regEscape(str) {
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	function search(query, callback) {
		const ajaxOptions = qs.stringify({
			format: 'json',
			action: 'opensearch',
			search: query,
			suggest: true,
			limit: 10
		});
		const url = options.url;
		getJSON(`${ url }w/api.php?${ ajaxOptions }`)
			.then((response) => {
				callback(response[1]);
			});
	}

	function getArticle(article) {
		$('base').setAttribute('href', options.url + 'wiki/' + article);
		$('#content').innerHTML = '';
		$('#content').style.display = 'none';
		$('#loading').style.display = 'block';
		$('body').classList.add('loading');
		if (qs.parse(location.hash).article !== article) {
			location.hash = qs.stringify({
				article: article
			});
		}

		// https://en.wikipedia.org/w/api.php?action=help&modules=mobileview
		const wikiOptions = {
			action: 'mobileview',
			format: 'json',
			noheadings: true,
			page: article,
			sections: 'all',
			redirect: 'yes'
		};
		const url = options.url;

		getJSON(`${ url }w/api.php?${ qs.stringify(wikiOptions) }`)
			.then(response => {
				if (response.error) {
					$('#content').innerHTML = wrapError(response.error.info);
				} else {
					$('#content').innerHTML = prepareResponse(response, article);
				}
				$('#content').style.display = 'block';
				$('#loading').style.display = 'none';
				$('body').classList.remove('loading');
			}, errorMsg => {
				$('#content').innerHTML = wrapError(errorMsg);
				$('#content').style.display = 'block';
				$('#loading').style.display = 'none';
				$('body').classList.remove('loading');
			});
	}
	function prepareResponse(response, article) {
		const sections = response.mobileview.sections;
		const title = response.mobileview.normalizedtitle || article.replace(/_/g, ' ');
		let result = '';

		result += `<h1>${ title }</h1>`;
		result += sections[0].text;

		let i = 1;
		while (sections[i]) {
			result += `<details><summary><h2>${ sections[i].line }</h2></summary>`;
			result += `<div class='panel-body'>${ sections[i].text }`;
			i++;

			while (sections[i] && sections[i].toclevel !== 1) {
				let level = sections[i].toclevel + 1;
				if (level > 6) {
					level = 6;
				}
				result += `<h${ level }>${ sections[i].line }</h${ level }>`;
				result += `${ sections[i].text }`;
				i++;
			}
			result += '</div></details>';
		}
		return result;
	}
	function fromHash() {
		if (location.hash !== '') {
			const hash = qs.parse(location.hash);
			$('#search').setAttribute('value', hash.article);
			getArticle(hash.article, true);
		}
	}

	function wrapError(msg) {
		return `<div class='alert alert-danger'>${ msg }</div>`;
	}

	$('#back').addEventListener('click', (event) => {
		event.preventDefault();
		history.back();
		fromHash();
	});
	$('#forward').addEventListener('click', (event) => {
		event.preventDefault();
		history.forward();
		fromHash();
	});
	$('#newTab').addEventListener('click', (event) => {
		event.preventDefault();
		window.open(`${ options.url }wiki/${ $('#search').value }`, '_newtab');
	});

	addEventListener('hashchange', () => {
		fromHash();
	})

	const awesome = new Awesomplete($('#search'), {
		minChars: 1,
		maxItems: 10
	});

	$('#search').addEventListener('input', () => {
		search($('#search').value, (response) => {
			awesome.list = response;
			awesome.evaluate();
		});
	});

	$('#content').addEventListener('click', (event) => {
		const target = event.target;
		if (target.tagName.toLowerCase() === 'a') {
			if (isWiki(target.href)) {
				event.preventDefault();
				const searchTerm = decodeURIComponent(target.pathname
					.replace('\/wiki\/', '')
					.replace(/#.+$/, '')
					.replace('/$', '')
					.replace(/_/g, ' '));
				$('#search').value = searchTerm;
				getArticle(searchTerm);
			} else {
				if (target.dataset.internal !== '') {
					event.preventDefault();
					window.open(target.href, '_newtab');
				}
			}
		}
	});

	$('a[href="options.html"]').addEventListener('click', () => {
		$('base').setAttribute('href', '');
	});

	$('.dropdown .btn').addEventListener('click', (event) => {
		event.preventDefault();
		event.target.classList.toggle('active');
		$('.dropdown-menu').classList.toggle('show');
	});

	$('#search-form').addEventListener('submit', (event) => {
		event.preventDefault();
		getArticle($('#search').value);
	});
});
