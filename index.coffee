jQuery ($) ->
  "use strict"
  options = location.search.substring(1, location.hash.lenght).split('&')
  options = 
    theme: decodeURIComponent(options[0])
    url: decodeURIComponent(options[1])


  $("link").attr "href", "bootswatch/" + options.theme + "/bootstrap.min.css"

  # FUNCTIONS
  getWikiPageHash = ->
    page = location.hash.substring(7, location.hash.length)
    if page != ""
      $("#search").val decodeURIComponent(page)
      getWiki page, true

  search = (query, process) ->
    jQuery.getJSON options.url + "w/api.php?callback=?",
      format: "json"
      action: "opensearch"
      search: query
      suggest: true
      limit: 100
    , (response) ->
      process response[1]

  getWiki = (page, history) ->
    $("base").attr "href", options.url + "wiki/" + page
    $("#content").fadeOut().empty()
    $("#loading").fadeIn()
    location.hash = "/wiki/" + page  unless history

    wikiOptions =
      action: "mobileview"
      format: "json"
      page: page
      sections: "all"
    $.getJSON options.url + "w/api.php?callback=?", wikiOptions, (response) ->
      title = response.mobileview.normalizedtitle or page.replace /_/g, " "
      $("#search").val title
      content = ""
      content += "<h1 class=\"page-header\">" + title + "</h1>\n"
      response = response.mobileview.sections
      $.each response, (key, value) ->
        key *= 1
        if value.toclevel is 1
          content += "</details>"  unless key is 1
          content += "<details id=\"" + value.line + "\" class=\"panel panel-default\">\n<summary class=\"panel-heading\"><span class=\"panel-title\">" + value.line + "</span></summary>\n<div class=\"panel-body>\"" + value.text.replace("class=\"", "class=\"hide ") + "</div>\n"
        else
          content += value.text + "\n"

      content += "</details>"
      $("#content").html content
      $("#content img").lazyload(
          effect: "fadeIn"
        )
      $("#content, #loading").fadeToggle()
      $("details").details()  unless $.fn.details.support

  
  getWikiPageHash()
  
  # EVENTS
  $("#back").click ->
    history.back()
    getWikiPageHash()
    false

  $("#forward").click ->
    history.forward()
    getWikiPageHash()
    false

  $("#newTab").click (event) ->
    window.open options.url + "wiki/" + $("#search").val(), "_newtab"
    event.preventDefault()

  $("#search").keypress ->
    $("#search").typeahead
      source: search
      items: 10


  $("#content").on "click", "a[href^='/wiki/'], a[href^='" + options.url + "wiki/'], a[href^='" + options.url.replace("https:", "http:") + "wiki/']", (event) ->
    href = @href.split("/")
    page = decodeURIComponent(href[href.length - 1])
    page = decodeURIComponent(href[href.length - 2])  if page is ""
    $("#search").val page
    getWiki page
    event.preventDefault()

  $("#content").on "click", "a:not(a[href^='/wiki/'], a[href^='" + options.url + "wiki/'], a[href^='" + options.url.replace("https:", "http:") + "wiki/'], a[href='options.html'])", (event) ->
    window.open @href, "_newtab"
    event.preventDefault()

  $("a[href='options.html']").click ->
    $("base").attr "href", ""

  $("#search-form").submit (event) ->
    getWiki $("#search").val()
    event.preventDefault()