$(function( $ ) {
	$('form').submit(function() {
		localStorage.setItem('wikiURL', $('#wikiURL').val());
		return false;
	});
});