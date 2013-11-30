$ ($) ->
  chrome.storage.sync.get (options) ->
    unless options.theme
      options =
        theme: "custom"
        url: "http://en.wikipedia.org/"

      chrome.storage.sync.set options
    $("iframe").attr "src", "app.html? #{ JSON.stringify options }"
