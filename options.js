$(function ($) {
	$('#content').submit(function () {
		localStorage['wikiURL'] = $('#wikiURL').val();
		location.replace('search.html');
		return false;
	});
});