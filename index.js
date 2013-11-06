jQuery(function($) {
  "use strict";
  var getWiki, getWikiPageHash, options, search;
  options = location.search.substring(1, location.hash.lenght).split('&');
  options = {
    theme: decodeURIComponent(options[0]),
    url: decodeURIComponent(options[1])
  };
  $("link").attr("href", "bootswatch/" + options.theme + "/bootstrap.min.css");
  getWikiPageHash = function() {
    var page;
    page = location.hash.substring(7, location.hash.length);
    if (page !== "") {
      $("#search").val(decodeURIComponent(page));
      return getWiki(page, true);
    }
  };
  search = function(query, process) {
    return jQuery.getJSON(options.url + "w/api.php?callback=?", {
      format: "json",
      action: "opensearch",
      search: query,
      suggest: true,
      limit: 100
    }, function(response) {
      return process(response[1]);
    });
  };
  getWiki = function(page, history) {
    var wikiOptions;
    $("base").attr("href", options.url + "wiki/" + page);
    $("#content").hide().empty();
    $("#loading").show();
    if (!history) {
      location.hash = "/wiki/" + page;
    }
    wikiOptions = {
      action: "mobileview",
      format: "json",
      page: page,
      sections: "all"
    };
    return $.getJSON(options.url + "w/api.php?callback=?", wikiOptions, function(response) {
      var content, title;
      title = response.mobileview.normalizedtitle || page.replace(/_/g, " ");
      $("#search").val(title);
      content = "";
      content += "<h1 class=\"page-header\">" + title + "</h1>\n";
      response = response.mobileview.sections;
      $.each(response, function(key, value) {
        key *= 1;
        if (value.toclevel === 1) {
          if (key !== 1) {
            content += "</details>";
          }
          return content += "<details id=\"" + value.line + "\" class=\"panel panel-default\">\n<summary class=\"panel-heading\"><span class=\"panel-title\">" + value.line + "</span></summary>\n<div class=\"panel-body>\"" + value.text.replace("class=\"", "class=\"hide ") + "</div>\n";
        } else {
          return content += value.text + "\n";
        }
      });
      content += "</details>";
      $("#content").html(content);
      $("#content, #loading").toggle();
      if (!$.fn.details.support) {
        return $("details").details();
      }
    });
  };
  getWikiPageHash();
  $("#back").click(function() {
    history.back();
    getWikiPageHash();
    return false;
  });
  $("#forward").click(function() {
    history.forward();
    getWikiPageHash();
    return false;
  });
  $("#newTab").click(function(event) {
    window.open(options.url + "wiki/" + $("#search").val(), "_newtab");
    return event.preventDefault();
  });
  $("#search").keypress(function() {
    return $("#search").typeahead({
      source: search,
      items: 10
    });
  });
  $("#content").on("click", "a[href^='/wiki/'], a[href^='" + options.url + "wiki/'], a[href^='" + options.url.replace("https:", "http:") + "wiki/']", function(event) {
    var href, page;
    href = this.href.split("/");
    page = decodeURIComponent(href[href.length - 1]);
    if (page === "") {
      page = decodeURIComponent(href[href.length - 2]);
    }
    $("#search").val(page);
    getWiki(page);
    return event.preventDefault();
  });
  $("#content").on("click", "a:not(a[href^='/wiki/'], a[href^='" + options.url + "wiki/'], a[href^='" + options.url.replace("https:", "http:") + "wiki/'], a[href='options.html'])", function(event) {
    window.open(this.href, "_newtab");
    return event.preventDefault();
  });
  $("a[href='options.html']").click(function() {
    return $("base").attr("href", "");
  });
  return $("#search-form").submit(function(event) {
    getWiki($("#search").val());
    return event.preventDefault();
  });
});
