$(function ($) {
	//search with Wikimedia-API
	$('form').submit(function (e) {
		return false;
	});

	function getUrlVar(key) {
		var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
		return decodeURIComponent(result && result[1] || "");
	}
	if ( !localStorage['wikiURL'] ) {
		localStorage['wikiURL'] = 'http://en.wikipedia.org/'
	}
	var url = localStorage['wikiURL'];
	if (url[url.length - 1] != '/') {
		url += '/';
	}

	function search(query) {
		jQuery.getJSON(url + 'w/api.php', {
			'fomat': 'json',
			'action': 'opensearch',
			'search': query,
			'limit': 100
		}, function (response) {
			$('#result').empty();
			for (var i = 0; i < response[1].length; i++) {
				$('#result').append('<li><a href="show.html?s=' + response[1][i] + '">' + response[1][i] + '</a></li>\n');
			}
		});
	}
	if( !localStorage.getItem('wikiURL') ) {
		location.href = 'options.html'
	}


	if (getUrlVar('s')) search(getUrlVar('s'));
	$('#s').keypress(function () {
		search($('#s').val());
		history.pushState({}, '', 'search.html?s=' + $('#s').val());
	});
});