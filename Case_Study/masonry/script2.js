
var margin = {t:50,l:50,b:50,r:50},
    width  = $('.gallery').width()-margin.l-margin.r,
    height = $('.gallery').height()-margin.t-margin.b,
    padding = 10;

//------------------------------------------------------------------------load data     
queue()
      .defer(d3.csv, "imgData/Palmyra_beforeWar.csv", parseImage)
      .await(DataLoaded)

function parseImage(d){ 
    return { 
      'url': d.rgi_image
        };
}


function DataLoaded(err, ImageData){
console.log(ImageData)
 setupGallery(ImageData) 
}
//--------------------------------------------------------------


function setupGallery(ImageData){

    gallery = d3.select(".gallery");
    
    gallery.selectAll('.myimg')
      .data(ImageData)
      .enter()
      .append('img')
      // .attr('class', 'img')
      // .attr("xlink:href", function(d){ return d.url})
        .attr("src", function(d){ return d.url})
      // .attr("width", 100)
      // .attr("height", 100)
      .attr("x", "60")
      .attr("y", "60")

 } 








