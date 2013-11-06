$(function($) {
  chrome.storage.sync.get(function(options) {
    if (!options.theme) {
      options = {
        theme: "custom",
        url: "http://en.wikipedia.org/"
      };
      chrome.storage.sync.set(options);
    }
    $("iframe").attr("src", "index.html?" + encodeURIComponent(options.theme) + "&" + encodeURIComponent(options.url));
  });
});
