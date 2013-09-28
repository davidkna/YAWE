$(function ($) {
	$('#content').submit(function () {

		var wikiURL = $('#wikiURL').val().replace('https:', 'http:');
		if (!wikiURL.endsWith('/')) {
			wikiURL += '/';
		}
		localStorage['wikiURL'] = wikiURL;

		location.replace('index.php');
		return false;
	});
	$('#wikiURL').val(localStorage['wikiURL']);
});