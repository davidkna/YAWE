$(function ($) {
	// get wiki URL
	if (!localStorage['wikiURL']) {
		localStorage['wikiURL'] = 'http://en.wikipedia.org/'
	}
	var url = localStorage['wikiURL'];
	if (url[url.length - 1] != '/') {
		url += '/';
	}

	// get base url
	var a = document.createElement('a');
	a.href = url;
	var base = a.protocol + '//' + a.hostname;


	function openWikiPageHash() {
		var wikiPage = new RegExp('/wiki/([^&]*)', 'i').exec(location.hash);
		if (wikiPage) {
			$('#s').val(wikiPage[1]);
			openWiki(wikiPage[1], true);
		}
	}
	$('#back').click(function () {
		history.back();
		openWikiPageHash();
		return false;
	});
	$('#forward').click(function () {
		history.forward();
		openWikiPageHash();
		return false;
	});

	$('#newTab').click(function () {
		chrome.tabs.create({
			url: url + 'wiki/' + $('#s').val()
		});
		return false;
	});


	// autocomplete
	function search(query, process) {
		jQuery.getJSON(url + 'w/api.php', {
			'fomat': 'json',
			'action': 'opensearch',
			'search': query,
			'limit': 100
		}, function (response) {
			process(response[1]);
		});
	}

	// open wiki page
	function openWiki(page, history) {
		$('#content')
			.hide()
			.empty();
		$('#loading').show();
		if (!history) location.hash = '/wiki/' + page;
		$.getJSON(url + 'w/api.php', {
			'action': 'parse',
			'format': 'json',
			'page': page,
			'prop': 'text'
		}, function (response) {
			$('base')
				.attr('href', base);
			$('#content')
				.append('<h1>' + page.replace(new RegExp('_', 'g'), ' ') + '</h1>\n' + response.parse.text['*'].replace(new RegExp('href="/wiki/', 'g'), 'data-wiki="1" href="' + url).replace(new RegExp('href="url', 'g'), 'data-wiki="1" href="' + url));
			$('#content *')
				.removeAttr('style');
			$('#toc').remove();
			$('#content a')
				.not('a[data-wiki="1"]')
				.each(function () {
				var $this = $(this),
					href = this.href.split('/');
				if (href[0] != 'chrome-extension:' && href[0][0] != '#') {
					$(this)
						.on('click', function (event) {
						chrome.tabs.create({
							url: $(this)
								.attr('href')
						});
					});
				}
			});
			// use blockquote instead of table
			$('.cquote')
				.each(function () {
				$(this)
					.after('<blockquote>' + $(this)
					.find('td')
					.eq(1)
					.html() + '</blockquote>');
				$(this)
					.remove()
			});

			function joinOuter(el) {
				var response = '';
				$(el).each(function () {
					response += this.outerHTML;
				});
				return response;
			}
			var content = '';
			$('h2 .mw-headline').parent().each(function (i) {
				content += '<details><summary><h2>' + $(this).find('.mw-headline').text() + '</h2></summary>' + joinOuter($(this).nextUntil('h2')) + '</details>';
			});
			$('h2 .mw-headline').parent().nextUntil('h2').remove();
			$('h2 .mw-headline').parent().remove();
			$('#content').append(content);

			$('.accordion-toggle').on('click', function () {
				$(this).toggleClass('arrow-up');
			});



			$('base')
				.attr('href', '');
			$('#loading').hide();
			$('#content').show().scrollTop(0);
		});
	}

	// Events
	$('#s')
		.keypress(function () {
		$('#s')
			.typeahead({
			'source': search
		});
	});
	$('#content')
		.on('click', 'a[data-wiki="1"]', function () {
		var href = this.href.split('/'),
			page = decodeURIComponent(href[href.length - 1]);
		if (page == '') page = decodeURIComponent(href[href.length - 2])
		$('#s')
			.val(page.replace(new RegExp('_', 'g'), ' '));
		openWiki(page);
	})
	$('#search').submit(function (e) {
		openWiki($('#s').val());
		return false;
	});
});