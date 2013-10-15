$ ($) ->
  $("#content").submit (event) ->
    wikiURL = $("#wikiURL").val().replace("https:", "http:")
    wikiURL += "/"  unless wikiURL[wikiURL.length - 1] is "/"
    localStorage["wikiURL"] = wikiURL
    localStorage["wikiTheme"] = $("#wikiTheme").val()
    location.replace "index.html"
    event.preventDefault()

  $("#wikiTheme").change ->
    $("link").attr "href", $("#wikiTheme").val()

  $("#wikiURL").val localStorage["wikiURL"]
  $("#wikiTheme").val localStorage["wikiTheme"]
