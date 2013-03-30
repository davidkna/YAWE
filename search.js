$(function ( $ ) {
	// FUNCTIONS
	function openWikiPageHash() {
		var wikiPage = new RegExp('/wiki/([^&]*)', 'i').exec(location.hash);
		if (wikiPage) {
			$('#s').val(wikiPage[1].replace(new RegExp('_', 'g'), ' '));
			openWiki(wikiPage[1], true);
		}
	}
	function search(query, process) {
		jQuery.getJSON(url + 'w/api.php', {
			fomat: 'json',
			action: 'opensearch',
			search: query,
			limit: 100
		}, function (response) {
			process(response[1])
		})
	}
	function openWiki(page, history) {
		$('base').attr('href', url);
		$('#content').hide().empty();
		$('#loading').show();
		if (!history) location.hash = '/wiki/' + page;
		$.getJSON(url + 'w/api.php', {
			action: 'parse',
			format: 'json',
			page: page,
			prop: 'text'
		}, function (response) {
			$('#content').append('<h1>' + page.replace(new RegExp('_', 'g'), ' ') + '</h1>\n' + response.parse.text['*'].replace(new RegExp('href="/wiki/', 'g'), 'data-wiki="1" href="' + url).replace(new RegExp('href="url', 'g'), 'data-wiki="1" href="' + url));
			$('#content *').removeAttr('style');
			$('#toc').remove();
			$('#content a').not('a[data-wiki="1"]').each(function () {
				var $this = $(this),
					href = this.href.split('/');
				if (href[0] != 'chrome-extension:' && href[0][0] != '#') {
					$(this).on('click', function () {
						chrome.tabs.create({
							url: $(this).attr('href')
						})
					})
				}
			});

			// beautify stuff
			$('.cquote').each(function () {
				$(this).after('<blockquote>' + $(this).find('td').eq(1).html() + '</blockquote>');
				$(this).remove()
			});
			$('table > tr > td > span.mbox-text-span').parents().eq(3).replaceWith('<div class="alert alert-info">' + $(this).html() + '</span>');
			$('.dablink').addClass('alert alert-info');
			var content = '',
				h2 = $('h2 .mw-headline').parent();
			function joinOuterHTMLs(el) {
				var result = '';
				$(el).each(function () {
					result += this.outerHTML
				});
				return result
			}
			h2.each(function () {
				content += '<details id="' + $(this).find('.mw-headline').attr('id') + '"><summary><h2>' + $(this).find('.mw-headline').text() + '</h2></summary>' + joinOuterHTMLs($(this).nextUntil('h2')) + '</details>'
			});
			h2.nextUntil(h2).remove();
			h2.remove();

			$('#content').append(content);
			$('#loading').hide();
			// Hash Support. Still buggy
			if (!page.split('#')[1]) {
				$('#content').show().scrollTop(0)
			} else {
				$('#' + page.split('#')[1]).attr('open', 'open');
				$('#content').show().scrollTop($('#' + page.split('#')[1]).offset().top);
			}
		})
	}
	// get URL infos
	if (!localStorage['wikiPrefix']) {
		localStorage['wikiPrefix'] = 'en';
	}
	var url = 'http://' + localStorage['wikiPrefix'] + '.wikipedia.org/';

	// EVENTS
	$('#back').click(function () {
		history.back();
		openWikiPageHash();
		return false
	});
	$('#forward').click(function () {
		history.forward();
		openWikiPageHash();
		return false
	});
	$('#newTab').click(function () {
		chrome.tabs.create({
			url: url + 'wiki/' + $('#s').val()
		});
		return false
	});
	$('#s').keypress(function () {
		$('#s').typeahead({
			'source': search,
			'items': 10
		})
	});
	$('#content').on('click', 'a[data-wiki="1"]', function () {
		var href = this.href.split('/'),
			page = decodeURIComponent(href[href.length - 1]);
		if (page == '') page = decodeURIComponent(href[href.length - 2])
		$('#s').val(page.replace(new RegExp('_', 'g'), ' '));
		openWiki(page);
	})
	$('#search').submit(function (b) {
		openWiki($('#s').val());
		return false
	})
})