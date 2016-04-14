
var margin = {t:50,l:50,b:50,r:50},
    width  = $('.img_gallery').width()-margin.l-margin.r,
    height = $('.img_gallery').height()-margin.t-margin.b,
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
 var gallery = d3.select(".img_gallery").append('svg').attr('width', width).attr('height', height);

function DataLoaded(err, beforeWar, inWar){
console.log("hi")
    draw(inWar);
console.log(inWar)
    d3.selectAll('.btn').on('click',function(){
       var type = d3.select(this).attr('id');
        if(type=='beforeWar'){

            d3.selectAll('.nodes').attr('hide', true);

            draw(beforeWar);

            d3.selectAll('.nodes').classed('hide', false);


        }else{
            d3.selectAll('.nodes').classed('hide', true);

            draw(inWar);
console.log(inWar)
            d3.selectAll('.nodes').classed('hide', false);


         
        }
    });
}
//--------------------------------------------------------------



function draw(data){

var nodes = gallery.selectAll('.nodes')
    .data(data);

nodesEnter = nodes.enter()
    .append('image')
    .attr('class', 'nodes')
    .attr("xlink:href", function(d){ return d.url })
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y})
    .attr('width', 50)
    .attr('height', 50);

nodes.exit().remove()
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
        .each(function(d){
        var focus = {};
           focus.x = width/2;
           focus.y = height/2;

            d.x += (focus.x-d.x)*(e.alpha*.1);
            d.y += (focus.y-d.y)*(e.alpha*.1);
        })
       .attr('y',function(d){return d.y})
       .attr('x',function(d){return d.x})
}
    function collide(dataPoint){
        var nr = dataPoint.r + 30,
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
                    dataPoint.x -= x*= (l*2);
                    dataPoint.y -= y*= l;
                    quadPoint.point.x += (x);
                    quadPoint.point.y += y;
                }
            }
            return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
        }
    }

}
