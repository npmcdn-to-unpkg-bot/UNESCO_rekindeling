cheerio = require('cheerio');

request = require('request');

request('https://www.google.com/#tbm=isch&q=design', function(error, response, html) {
  var $;
  if (!error && response.statusCode === 200) {
    $ = cheerio.load(html);
    $('img').each(function(i, element) {
      var a;
      console.log(i, element);
      a = $(this).prev();
      console.log(a);
      return console.log(a.text());
    });
    return;
  }
});