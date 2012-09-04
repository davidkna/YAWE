$(function ($) {
	function getUrlVar(key) {
		var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
		return decodeURIComponent(result && result[1] || "");
	}
	var url = localStorage['wikiURL'];
	if (url[url.length - 1] != '/') {
		url += '/';
	}
	var a = document.createElement('a');
	a.href = url;
	var base = a.protocol + '//' + a.hostname;
	$.getJSON(url + 'w/api.php', {
		'action': 'parse',
		'format': 'json',
		'page': getUrlVar("s"),
		'prop': 'text'
	}, function (response) {
		$('#cnt').html(response.parse.text['*'].replace(new RegExp('src="//', 'g'), 'src="' + a.protocol + '//').replace(new RegExp('href="//', 'g'), 'src="' + a.protocol + '//').replace(new RegExp('src="/', 'g'), 'src="' + base + '/').replace(new RegExp('href="/', 'g'), 'href="' + base + '/'));
		$('#cnt').prepend('<h1>' + getUrlVar('s') + '</h1>\n');
		$('#cnt img').each(function () {
			this.src.replace('chrome-extension:', a.protocol);
		});
		$('#cnt a').each(function () {
			var $this = $(this);
			if (this.href.indexOf(base) != -1) {
				this.href = 'show.html?s=' + $this.html();
			} else {
				$this.on("click", function (event) {
					chrome.tabs.create({
						url: $(this).attr('href')
					});
				});
			}
		});
		$('#toc a').click(function() { return false; });
	});
});