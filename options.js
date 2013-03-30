$(function ($) {
	$('#content').submit(function () {
		localStorage['wikiPrefix'] = $('#wikiURL').val();
		location.replace('search.html');
		return false;
	});
	$('#wikiURL').val(localStorage['wikiPrefix']);
});