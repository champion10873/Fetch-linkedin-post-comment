exports.extractPublicIdentifier = function (url) {
  const regex = /in\/([^\/]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
};
