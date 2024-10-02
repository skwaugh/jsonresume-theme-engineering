const
  fs = require('fs'),
  handlebars = require('handlebars'),
  handlebarsWax = require('handlebars-wax'),
  addressFormat = require('address-format'),
  moment = require('moment'),
  Swag = require('swag');

Swag.registerHelpers(handlebars);

handlebars.registerHelper({

  wrapURL: function (url) {
    const wrappedUrl = '<a href="' + url + '">' + url.replace(/.*?:\/\//g, '') + "</a>";
    return new handlebars.SafeString(wrappedUrl);
  },

  wrapMail: function (address) {
    const wrappedAddress = '<a href="mailto:' + address + '">' + address + "</a>";
    return new handlebars.SafeString(wrappedAddress);
  },

  formatAddress: function (address, city, region, postalCode, countryCode) {
    let addressList = addressFormat({
      address: address,
      city: city,
      subdivision: region,
      postalCode: postalCode,
      countryCode: countryCode
    });

    return addressList.join('<br/>');
  },

  formatDate: function (date) {
    // Handle "Present" explicitly
    if (typeof date === 'string' && date.toLowerCase() === "present") {
      return "Present";
    }
    // Specify the input format to match "MMMM YYYY" (e.g., "January 2023")
    return moment(date, "MMMM YYYY").format('MMM YYYY');
  },

  getValueIfDiffFromPrevious: function (array, index, key) {
    return (array[index - 1] && (array[index][key] === array[index - 1][key])) ? '' : array[index][key];
  },
});

function render(resume) {
  let dir = __dirname,
    css = fs.readFileSync(dir + '/style.css', 'utf-8'),
    resumeTemplate = fs.readFileSync(dir + '/resume.hbs', 'utf-8');

  let Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(dir + '/views/**/*.{hbs,js}');
  Handlebars.partials(dir + '/partials/**/*.{hbs,js}');

  return Handlebars.compile(resumeTemplate)({
    css: css,
    resume: resume
  });
}

module.exports = {
  render: render,
  pdfRenderOptions: {
    format: 'A4',
    mediaType: 'print',
  },
};

