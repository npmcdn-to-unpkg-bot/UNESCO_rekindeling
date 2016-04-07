
var margin = {t:50,l:50,b:50,r:50},
    width  = $('.gallery').width()-margin.l-margin.r,
    height = $('.gallery').height()-margin.t-margin.b,
    padding = 10;
var force = d3.layout.force()
    .size([width,height])
    .charge(0)
    .gravity(0);
//------------------------------------------------------------------------load data     
queue()
      .defer(d3.csv, "imgData/Palmyra_beforeWar.csv", parseImage)
      .defer(d3.csv, "imgData/Palmyra_inWar.csv", parseImage)
      .await(DataLoaded)

function parseImage(d){ 
    return { 
      'url': d.rgi_image,
      r:10
        };
}
var gallery;
function DataLoaded(err, beforeWar, data){

 setupGallery(data) 
}
//--------------------------------------------------------------


function setupGallery(data){

  gallery = d3.select(".gallery");
  //.append('svg');

  // var xPos = Math.random()*width;
  // data = []

  // inWar.forEach(function(each){
  //   data.push({
  //       u:each.url,     
  //       x:xPos,
  //       x0:xPos,
  //       y:height/2+Math.random()*5,
  //       r:200
  //   })
  //   console.log(data)
  // })
  draw(data);
}

function draw(data){

var nodes = gallery.selectAll('.img')
    .data(data)
    .enter()
    // .append('g')
//    .append('circle')
    .append('image')
    .attr("xlink:href", function(d){ return d.url })
    .attr('class', 'image_node')
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y})
    .attr('width', 200)
    .attr('height', 100);
    // .attr('width',function(d){return d.r})
    // .attr('height',function(d){return d.r})

//Collision detection
force.nodes(data)
    .on('tick',onForceTick)
    .start();

function onForceTick(e){
    var q = d3.geom.quadtree(data),
        i = 0,
        n = data.length;

    while( ++i<n ){
        q.visit(collide(data[i]));
    }

    nodes
        .each(gravity(e.alpha*.01))
        .attr('cx',function(d){return d.x})
        .attr('cy',function(d){return d.y})

    function gravity(k){
        //custom gravity: data points gravitate towards a straight line
        return function(d){
            d.y += (height/2 - d.y)*k;
            d.x += (d.x0 - d.x)*k;
        }
    }

    function collide(dataPoint){
        var nr = dataPoint.r + 5,
            nx1 = dataPoint.x - nr,
            ny1 = dataPoint.y - nr,
            nx2 = dataPoint.x + nr,
            ny2 = dataPoint.y + nr;

        return function(quadPoint,x1,y1,x2,y2){
            if(quadPoint.point && (quadPoint.point !== dataPoint)){
                var x = dataPoint.x - quadPoint.point.x,
                    y = dataPoint.y - quadPoint.point.y,
                    l = Math.sqrt(x*x+y*y),
                    r = nr + quadPoint.point.r;
                if(l<r){
                    l = (l-r)/l*.1;
                    dataPoint.x -= x*= (l*.05);
                    dataPoint.y -= y*= l;
                    quadPoint.point.x += (x*.05);
                    quadPoint.point.y += y;
                }
            }
            return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
        }
    }
}
}