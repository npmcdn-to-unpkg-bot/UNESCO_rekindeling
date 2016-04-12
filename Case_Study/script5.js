
var margin = {t:50,l:50,b:50,r:50},
    width  = $('.gallery').width()-margin.l-margin.r,
    height = $('.gallery').height()-margin.t-margin.b,
    padding = 10;
var force = d3.layout.force()
    .size([width,height])
    .charge(0)
    .gravity(0);
    var nodes;
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
var   gallery = d3.select(".gallery").append('svg').attr('width', width).attr('height', height);

function DataLoaded(err, beforeWar, inWar){
      $('#inWar').on('click',function(d){
        d.preventDefault();
        
         d3.selectAll('.nodes').remove()

        draw(inWar)   
    });

      $('#beforeWar').on('click',function(d){
        d.preventDefault();

       d3.selectAll('.nodes').remove()

        draw(beforeWar)

    });
}
//--------------------------------------------------------------



function draw(data){

nodes = gallery.selectAll('.img')
    .data(data);

nodesEnter = nodes
    .enter()
    .append('image')
    .attr('class', 'nodes')
    .attr("xlink:href", function(d){ return d.url })
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y})
    .attr('width', 200)
    .attr('height', 100);






        // .enter()
        // .append('g')
        // .attr('class','nodes')
        // .each(function(d){
        //     d3.select(this)
        //         .append('circle')
        //         .attr('r',22)
        //         .style('fill','#fff');
        //     d3.select(this)
        //         .append('image')
        //         .attr('height',40)
        //         .attr('width',16)
        //         .attr('x',function(d){return d.x})
        //         .attr('y',function(d){return d.y})
        //         // .attr('x',-8)
        //         // .attr('y',-20)
        //         .attr('xlink:href',function(d){ return d.url });
        // })














console.log(data)
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