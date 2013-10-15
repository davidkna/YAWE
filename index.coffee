$ ($) ->
    
    # FUNCTIONS
    openWikiPageHash = ->
        wikiPage = new RegExp("/wiki/([^&]*)", "i").exec(location.hash)
        if wikiPage?
            $("#s").val wikiPage[1].replace(new RegExp("_", "g"), " ")
            openWiki wikiPage[1], true
    search = (query, process) ->
        $.getJSON url + "w/api.php?callback=?",
            format: "json"
            action: "opensearch"
            search: query
            suggest: true
            limit: 100
        , (response) ->
            process response[1]

    openWiki = (page, history) ->
        $("base").attr "href", url + "wiki/" + page
        $("#content").hide().empty()
        $("#loading").show()
        location.hash = "/wiki/" + page    unless history
        $.getJSON url + "w/api.php?callback=?",
            action: "mobileview"
            format: "json"
            page: page
            sections: "all"
        , (response) ->
            if response.mobileview.normalizedtitle? then title = response.mobileview.normalizedtitle else title = page
            content = ""
            content += "<h1 class=\"page-header\">" + title + "</h1>\n"
            response = response.mobileview.sections
            $.each response, (key, value) ->
                key *= 1
                if value.toclevel is 1
                    content += "</details>"    unless key is 1
                    content += "<details id=\"" + value.line + "\" class=\"panel panel-default\">\n<summary class=\"panel-heading\"><span class=\"panel-title\">" + value.line + "</span></summary>\n<div class=\"panel-body>\"" + value.text.replace("class=\"", "class=\"hide ") + "</div>\n"
                else
                    content += value.text + "\n"

            content += "</details>"
            $("#content").html content
            $("#content, #loading").toggle()
            $("details").details()    unless $.fn.details.support

    
    # get URL infos
    localStorage["wikiURL"] = "http://en.wikipedia.org/"    unless localStorage["wikiURL"]?
    url = localStorage["wikiURL"]
    openWikiPageHash()
    
    # EVENTS

    # back/forward
    $("#back").click ->
        history.back()
        openWikiPageHash()
        false

    $("#forward").click ->
        history.forward()
        openWikiPageHash()
        false

    # new tab
    $("#newTab").click (event) ->
        window.open url + "wiki/" + $("#s").val(), "_newtab"
        event.preventDefault()

    $("#s").keypress ->
        $("#s").typeahead
            source: search
            items: 10

    # links (wiki)
    $("#content").on "click", "a[href^='/wiki/'], a[href^='" + url + "wiki/'], a[href^='" + url.replace("https:", "http:") + "wiki/']", (event) ->
        href = @href.split("/")
        page = decodeURIComponent(href[href.length - 1])
        page = decodeURIComponent(href[href.length - 2])    if page is ""
        $("#s").val page.replace(new RegExp("_", "g"), " ")
        openWiki page
        event.preventDefault()

    # links (not wiki)
    $("#content").on "click", "a:not(a[href^='/wiki/'], a[href^='" + url + "wiki/'], a[href^='" + url.replace("https:", "http:") + "wiki/'], a[href='options.html'])", (event) ->
        window.open @href, "_newtab"
        event.preventDefault()

    $("a[href='options.html']").click ->
        $("base").attr "href", ""

    $("#search").submit (event) ->
        openWiki $("#s").val()
        event.preventDefault()