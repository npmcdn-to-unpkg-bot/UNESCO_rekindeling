
var margin = {t:50,l:50,b:50,r:50},
    width  = $('.gallery').width()-margin.l-margin.r,
    height = $('.gallery').height()-margin.t-margin.b,
    padding = 10;
var force = d3.layout.force()
    .size([width,height])
    .charge(0)
    .gravity(0);


 var gallery = d3.select(".gallery")
  .append('svg')
  .attr('class', 'svgGallery')
  .attr('width', width)
  .attr('height', height);

//------------------------------------------------------------------------load data     
queue()
      .defer(d3.csv, "imgData/Palmyra.csv", parseImage)
      .await(DataLoaded)

function parseImage(d){ 
    return { 
      'url': d.rgi_image,
      r:10,
      'time': d.Time
        };
}



// $('#inWar').on('click', inWar);



function DataLoaded(err, data){

        // draw(data);


    d3.selectAll('.btn').on('click',function(){

       var type = d3.select(this).attr('class');
        if(type=='beforeWar'){
             d3.selectAll('.nodes').filter(function(d){ return d.time == "beforeWar"});

        }else{

            d3.selectAll('.nodes').filter(function(d){ return d.time == "inWar"});

        }
    });


   draw(data.filter(function(d){ return d.time == "beforeWar"}))



}
//--------------------------------------------------------------



function draw(data){




var nodes = gallery.selectAll('.nodes')
        .data(data)
    // .data(data.filter(function(d){ return d.time == "inWar"}));
nodesEnter = nodes.enter()
    .append('image')
 //   .attr('class', function(d){ return d.time})
    .classed('nodes', true)
    .attr("xlink:href", function(d){ return d.url })
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y})
    .attr('width', 100)
    .attr('height', 70);

nodes.exit().remove()

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
        var nr = dataPoint.r + 100,
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
