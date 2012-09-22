$(function ($) {
	function getUrlVar(key) {
		var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
		return decodeURIComponent(result && result[1] || "");
	}

	$('.loading').attr('src', chrome.extension.getURL('images/ajax-loader.gif'));
	$('.navbar a').each(function() {
		$(this).attr('href', chrome.extension.getURL($(this).attr('href')));
	});

	var url = localStorage['wikiURL'];
	if (url[url.length - 1] != '/') {
		url += '/';
	}
	var a = document.createElement('a');
	a.href = url;
	var base = a.protocol + '//' + a.hostname;
	$('base').attr('href', base);
	$.getJSON(url + 'w/api.php', {
		'action': 'parse',
		'format': 'json',
		'page': getUrlVar("s"),
		'prop': 'text'
	}, function (response) {
		$('base').attr('href', a.protocol + '//' + a.hostname);
		$('#cnt').html(response.parse.text['*']
			.replace(new RegExp('href="/wiki/', 'g'), 'href="' + chrome.extension.getURL('show.html') + '?s=')
			.replace(new RegExp('href="'+ url +'/wiki/', 'g'), 'href="' +chrome.extension.getURL('show.html'+ '?s=')));
		$('#cnt').prepend('<h1>' + getUrlVar('s').replace(new RegExp('_', 'g'), ' ') + '</h1>\n');
		$('#cnt a').each(function () {
			var $this = $(this);
		$('#cnt a').not('#toc a').each(function () {
			var $this = $(this),
				href = this.href.split('/');
			if ( href[0] != 'chrome-extension:' ) {
			$(this).on("click", function (event) {
				chrome.tabs.create({
					url: $(this).attr('href')
				});
			});
		}
		});
		});
	});
});