var margin = {t:10,l:50,b:50,r:50},
    width  = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b,
    padding = 0;

var dispatch = d3.dispatch('nodeClick')

var category_canvas = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var color = d3.scale.ordinal()
    .domain(["Cultural", "Natural", "Mixed"])
    .range(["#fdb913", "#00addc", "7fb378"]);

var force = d3.layout.force().size([width,height]).charge(0).gravity(0);

var foci = {};
foci.before = { x: width*.12, y: height*.35 };
foci.after = { x: width*.72, y: height*.35 };

var scaleR = d3.scale.sqrt().range([80,150]);


//------------------------------------------------------------------------load data     
queue()
      .defer(d3.csv, "data/thumbData.csv", parseThumb)
      .await(DataLoaded)


function parseThumb(d){ 
    return { 
      'name': d.FileName,
      'category': d.Category,
      'time': d.TimeSpan,
      'value':+d.Value,
      'title':d.Feature,
      r:80
  };
}

function DataLoaded(err, Thumb){
   setup(Thumb)
}//DataLoaded
///////////////////////////////////////////////////////////////////setup data
function setup(Thumb){
  draw(Thumb);
}//setup





/////////////////////////////////////////////////////////////////////////////////////////end setup
/////////////////////////////////////////////////////////////////////////////////////////draw map
function draw(Data){


scaleR.domain(d3.extent(Data, function(d) { return d.value; }));

var nodes = category_canvas.selectAll('.node')
    .data(Data)
nodesEnter = nodes.enter()
    .append('image')
    .attr("xlink:href", function(d){ return "data/thumbGOOD/" + d.name })
    .attr('opacity', 1)
    .attr("class", function(d){ return d.category })
    .classed('node', true)
    .classed('thumb', true)
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y})
    .attr('width', function(d){ return scaleR(d.value) })
    .attr('height', function(d){ return scaleR(d.value) })
    .on('mouseover', function(d, i){

      })
      .on('mouseleave', function(d, i){
        d3.selectAll('.node').classed('hover', false)
      })
      .on('click', function(d, i){
        d3.selectAll('.node').classed('myactive', false)
        d3.selectAll(".node").classed('unactive', true)


        var category= d3.select('.category');
          category.select('h2')
              .html(d.title);   
          // site_text.select('p')
          //     .html('');
      })


///////////////////////////////////////////toggle///////////////////
// function toggleItem(elem) {
//   for (var i = 0; i < elem.length; i++) {
//     elem[i].addEventListener("click", function(e) {
//       var current = this;
//       for (var i = 0; i < elem.length; i++) {
//         if (current != elem[i]) {
//           elem[i].classList.remove('myactive');
//         } 
//         else if (current.classList.contains('myactive') === true) {
//           current.classList.remove('myactive');
//         } 
//         else {
//           current.classList.add('myactive')
//         }
//       }
//       e.preventDefault();
//     });
//   };
// }
// toggleItem(document.querySelectorAll('.node'));



nodes.exit().remove()


force.nodes(Data)
    .on('tick',onForceTick)
    .start();

function onForceTick(e){
    var q = d3.geom.quadtree(Data),
        i = 0,
        n = Data.length;

    while( ++i<n ){
        q.visit(collide(Data[i]));
    }
 nodes
        .each(function(d){
          var focus;
          if (d.time =="before"){ var focus = foci.before; }
          else { var focus = foci.after; }
            d.x += (focus.x-d.x)*(e.alpha*.3);
            d.y += (focus.y-d.y)*(e.alpha*.3);
        })
       .attr('y',function(d){return d.y})
       .attr('x',function(d){return d.x})
}
    function collide(dataPoint){
    var nr = (scaleR(dataPoint.value)/Math.sqrt(2))+ padding;
          dataPoint.r = nr 

        var nr = dataPoint.r + padding,
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
                    l = (l-r)/l*.01;
                    dataPoint.x -= x*= (l);
                    dataPoint.y -= y*= l;
                    quadPoint.point.x += (x);
                    quadPoint.point.y += y;
                }
            }
            return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
        }
    }


$(".aero").on('click', function(d){
  $('.scene').hide();
  $("#Aero-Gal").show();
  d3.selectAll(".aero").classed('myactive', true)
})
$(".aero").on('mouseover', function(d){
  d3.selectAll(".aero").classed('hover', true)
})

$(".arch").on('click', function(d){
  $('.scene').hide();
  $("#Arch-Gal").show();

  d3.selectAll(".arch").classed('myactive', true)
})
$(".arch").on('mouseover', function(d){
  d3.selectAll(".arch").classed('hover', true)
})


$(".column").on('click', function(d){
  $('.scene').hide();
  $("#Column-Gal").show();
    d3.selectAll(".column").classed('myactive', true)
})
$(".column").on('mouseover', function(d){
  d3.selectAll(".column").classed('hover', true)
})


$(".castle").on('click', function(d){
  $('.scene').hide();
  $("#Castle-Gal").show();
  d3.selectAll(".castle").classed('myactive', true)
})
$(".castle").on('mouseover', function(d){
  d3.selectAll(".castle").classed('hover', true)
})


$(".temple").on('click', function(d){
  $('.scene').hide();
  $("#Temple-Gal").show();
  d3.selectAll(".temple").classed('myactive', true)
})
$(".temple").on('mouseover', function(d){
  d3.selectAll(".temple").classed('hover', true)
})


$(".theater").on('click', function(d){
  $('.scene').hide();
  $("#Theater-Gal").show();
  d3.selectAll(".theater").classed('myactive', true)
})
$(".theater").on('mouseover', function(d){
  d3.selectAll(".theater").classed('hover', true)
})


$(".pano").on('click', function(d){
  $('.scene').hide();
  $("#Pano-Gal").show();
  d3.selectAll(".pano").classed('myactive', true)
})
$(".pano").on('mouseover', function(d){
  d3.selectAll(".pano").classed('hover', true)
})


$(".violence").on('click', function(d){
  $('.scene').hide();
  $("#Violence-Gal").show();
  d3.selectAll(".violence").classed('myactive', true)
})
$(".violence").on('mouseover', function(d){
  d3.selectAll(".violence").classed('hover', true)
})

$(".sculpture").on('click', function(d){
  $('.scene').hide();
  $("#Sculpture-Gal").show();
  d3.selectAll(".sculpture").classed('myactive', true)
})
$(".sculpture").on('mouseover', function(d){
  d3.selectAll(".sculpture").classed('hover', true)
})


}





////////////////////////////////////////////////////////////////////////////////////////////////////end draw map
////////////////////////////////////////////////////////////////////////////////////////////////////append List