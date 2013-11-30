jQuery ( $ ) ->
  $("#content").submit (event) ->
    url = $("#url").val().replace "https:", "http:"
    url += "/"  unless url[url.length - 1] is "/"
    options =
      url: url
      theme: $("#theme").val()
    chrome.storage.sync.set options
    location.replace "app.html?#{ encodeURIComponent(JSON.stringify(options)) }"
    event.preventDefault()

  $("#theme").change ->
    $("link").attr "href", "bootswatch/#{ $("#theme").val() }/bootstrap.min.css"

  chrome.storage.sync.get (options) ->
    unless options.theme?
      options = 
        theme: "custom"
        url: "http://en.wikipedia.org/"
      chrome.storage.sync.set options
    $("#url").val options.url
    $("#theme").val options.theme
    $("link").attr "href", "bootswatch/#{ options.theme }/bootstrap.min.css"

  $(".icon-left-open").click (event) ->
    history.back()
    event.preventDefault()