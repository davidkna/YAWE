# Download
Download for [Chrome](https://chrome.google.com/webstore/detail/daffpdngkoncjmbmpbmpkpehjjkffinb/), [Opera](https://addons.opera.com/de/extensions/details/yawe-yet-another-wiki-extension/) and [Firefox](https://addons.mozilla.org/de/firefox/addon/yawe/)


# Versions
```
npm -v
6.14.8

node -v
v14.11.0
```

# Building
## Chrome
```
npm install
npm run gulp release:chrome
rm -f dist.zip && bsdtar -C dist/ -acf dist.zip .
```

## Firefox
```
npm install
npm run gulp release:firefox
rm -f dist.zip && bsdtar -C dist/ -acf dist.zip .
```

## Opera
```
npm install
npm run gulp release:opera
rm -f dist.zip && bsdtar -C dist/ -acf dist.zip .
```

