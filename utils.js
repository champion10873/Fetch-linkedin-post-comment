exports.extractPublicIdentifier = function (url) {
  const personRegex = /in\/([^\/]+)/;
  const companyRegex = /company\/([^\/]+)/;

  let match;

  if (url.includes("/in/")) {
    match = url.match(personRegex);
    if (match && match[1]) {
      return { public_identifier: match[1], is_company: false };
    }
  } else if (url.includes("/company/")) {
    match = url.match(companyRegex);
    if (match && match[1]) {
      return { public_identifier: match[1], is_company: true };
    }
  }

  return { public_identifier: null, is_company: false };
};
