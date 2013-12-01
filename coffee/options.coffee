jQuery ( $ ) ->
  $("form").submit (event) ->
    url = $("#url").val().replace "https:", "http:"
    url += "/"  unless url[url.length - 1] is "/"
    options =
      url: url
      theme: $("#theme").val()
    localStorage["options"] = JSON.stringify(options)
    location.replace "index.html"
    event.preventDefault()

  $("#theme").change ->
    $("link").attr "href", "bootswatch/#{ $("#theme").val() }/bootstrap.min.css"


  unless localStorage["options"]?
    options =
      theme: localStorage["wikiTheme"].split('/')[5] or "custom"
      url: localStorage["wikiURL"] or "http://en.wikipedia.org/"

    localStorage["options"] = JSON.stringify(options)

  options = JSON.parse(localStorage["options"])
  $("#url").val options.url
  $("#theme").val options.theme
  $("link").attr "href", "bootswatch/#{ options.theme }/bootstrap.min.css"

  $(".icon-left-open").click (event) ->
    history.back()
    event.preventDefault()