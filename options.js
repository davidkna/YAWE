$(function($) {
  $("#content").submit(function(event) {
    var options, url;
    url = $("#url").val().replace("https:", "http:");
    if (url[url.length - 1] !== "/") {
      url += "/";
    }
    options = {
      url: url,
      theme: $("#theme").val()
    };
    chrome.storage.sync.set(options);
    location.replace("index.html?" + encodeURIComponent(options.theme) + "&" + encodeURIComponent(options.url));
    return event.preventDefault();
  });
  $("#theme").change(function() {
    return $("link").attr("href", "bootswatch/" + $("#theme").val() + "/bootstrap.min.css");
  });
  chrome.storage.sync.get(function(options) {
    if (options.theme == null) {
      options = {
        theme: "custom",
        url: "http://en.wikipedia.org/"
      };
      chrome.storage.sync.set(options);
    }
    $("#url").val(options.url);
    $("#theme").val(options.theme);
    return $("link").attr("href", "bootswatch/" + options.theme + "/bootstrap.min.css");
  });
  return $(".icon-left-open").click(function(event) {
    history.back();
    return event.preventDefault();
  });
});
