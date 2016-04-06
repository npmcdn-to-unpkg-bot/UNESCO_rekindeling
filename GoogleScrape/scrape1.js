// cheerio = require('cheerio');

// request = require('request');

// request('https://www.google.com/#tbm=isch&q=design', function(error, response, html) {
//   var $;
//   if (!error && response.statusCode === 200) {
//     $ = cheerio.load(html);
//     $('img').each(function(i, element) {
//       var a;
//       console.log(i, element);
//       a = $(this).prev();
//       console.log(a);
//       return console.log(a.text());
//     });
//     return;
//   }
// });


from bs4 import BeautifulSoup
import requests
import re
import urllib2
import os


def get_soup(url,header):
  return BeautifulSoup(urllib2.urlopen(urllib2.Request(url,headers=header)))

image_type = "Action"
# you can change the query for the image  here  
query = "Terminator 3 Movie"
query= query.split()
query='+'.join(query)
url=url="https://www.google.co.in/search?q="+query+"&source=lnms&tbm=isch"
print url
header = {'User-Agent': 'Mozilla/5.0'} 
soup = get_soup(url,header)

images = [a['src'] for a in soup.find_all("img", {"src": re.compile("gstatic.com")})]
#print images
for img in images:
  raw_img = urllib2.urlopen(img).read()
  #add the directory for your image here 
  DIR="C:\Users\hp\Pictures\\valentines\\"
  cntr = len([i for i in os.listdir(DIR) if image_type in i]) + 1
  print cntr
  f = open(DIR + image_type + "_"+ str(cntr)+".jpg", 'wb')
  f.write(raw_img)
  f.close()