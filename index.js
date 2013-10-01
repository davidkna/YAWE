$(function($) {
    // FUNCTIONS
    function openWikiPageHash() {
        var wikiPage = new RegExp('/wiki/([^&]*)', 'i').exec(location.hash);
        if (wikiPage) {
            $('#s').val(wikiPage[1].replace(new RegExp('_', 'g'), ' '));
            openWiki(wikiPage[1], true);
        }
    }

    function search(query, process) {
        jQuery.getJSON(url + 'w/api.php?callback=?', {
            format: 'json',
            action: 'opensearch',
            search: query,
            suggest: true,
            limit: 100
        }, function(response) {
            process(response[1]);
        });
    }

    function openWiki(page, history) {
        $('base').attr('href', url + 'wiki/' + page);
        $('#content').hide().empty();
        $('#loading').show();
        if (!history) location.hash = '/wiki/' + page;
        $.getJSON(url + 'w/api.php?callback=?', {
            action: 'mobileview',
            format: 'json',
            page: page,
            sections: 'all'
        }, function(response) {
            var title = response.mobileview.normalizedtitle || page,
                content = '';

            content += '<h1 class="page-header">' + title + '</h1>\n';
            response = response.mobileview.sections;
            $.each(response, function(key, value) {
                key *= 1;
                if (value.toclevel == 1) {
                    if (key != 1) content += '</details>';
                    content += '<details id="' + value.line + '" class="panel panel-default">\n<summary class="panel-heading"><span class="panel-title">' + value.line + '</span></summary>\n<div class="panel-body>"' + value.text.replace('class="', 'class="hide ') + '</div>\n';
                } else {
                    content += value.text + '\n';

                }

            });
            content += '</details>';
            $('#content').html(content);
            $('#content, #loading').toggle();
        });
    }
    // get URL infos
    if (!localStorage['wikiURL']) {
        localStorage['wikiURL'] = 'http://en.wikipedia.org/';
    }
    var url = localStorage['wikiURL'];
    openWikiPageHash();
    // EVENTS
    $('#back').click(function() {
        history.back();
        openWikiPageHash();
        return false;
    });
    $('#forward').click(function() {
        history.forward();
        openWikiPageHash();
        return false;
    });
    $('#newTab').click(function() {
        window.open(url + 'wiki/' + $('#s').val(), '_newtab');
        return false;
    });
    $('#s').keypress(function() {
        $('#s').typeahead({
            'source': search,
            'items': 10
        });
    });
    $('#content').on('click', "a[href^='/wiki/'], a[href^='" + url + "wiki/'], a[href^='" + url.replace('https:', 'http:') + "wiki/']", function(event) {
        var href = this.href.split('/'),
            page = decodeURIComponent(href[href.length - 1]);
        if (page == '') {
            page = decodeURIComponent(href[href.length - 2])
        }
        $('#s').val(page.replace(new RegExp('_', 'g'), ' '));
        openWiki(page);
        event.preventDefault();
    });
    $('#content').on('click', "a:not(a[href^='/wiki/'], a[href^='" + url + "wiki/'], a[href^='" + url.replace('https:', 'http:') + "wiki/'], a[href='options.html'])", function(event) {
        window.open(this.href, '_newtab');
        event.preventDefault();
    });

    $('#search').submit(function(event) {
        openWiki($('#s').val());
        event.preventDefault();
    });
});