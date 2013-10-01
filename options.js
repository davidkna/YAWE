$(function ($) {
	$('#content').submit(function (event) {

		var wikiURL = $('#wikiURL').val().replace('https:', 'http:');
		if (wikiURL[wikiURL.length - 1] != '/') {
			wikiURL += '/';
		}
		localStorage['wikiURL'] = wikiURL;
		localStorage['wikiTheme'] = $('#wikiTheme').val();

		location.replace('index.html');
		event.preventDefault();
	});
	$('#wikiURL').val(localStorage['wikiURL']);
	$('#wikiTheme').val(localStorage['wikiTheme']);
});