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
 d3.selectAll(".aero").classed('myactive', true)
  $("img").remove();

  var folder1 = "data/before/aeroView/";
  var folder2 = "data/after/aeroView/";

      $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });
})

$(".aero").on('mouseover', function(d){
  d3.selectAll(".aero").classed('hover', true)
})

//end//////////////////////////////////////////////////////////////////////////
$(".arch").on('click', function(d){
  d3.selectAll(".arch").classed('myactive', true)

  $("img").remove();
  var folder1 = "data/before/arch/";
  var folder2 = "data/after/arch/";

      $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });



})
$(".arch").on('mouseover', function(d){
  d3.selectAll(".arch").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////

$(".column").on('click', function(d){
  d3.selectAll(".column").classed('myactive', true)
  $("img").remove();

  var folder1 = "data/before/columnade/";
  var folder2 = "data/after/columnade/";


      $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

})
$(".column").on('mouseover', function(d){
  d3.selectAll(".column").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////

$(".castle").on('click', function(d){
  d3.selectAll(".castle").classed('myactive', true)
  $("img").remove();

  var folder1 = "data/before/castleHill/";
  var folder2 = "data/after/castleHill/";

      $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

})

$(".castle").on('mouseover', function(d){
  d3.selectAll(".castle").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////

$(".temple").on('click', function(d){
  d3.selectAll(".temple").classed('myactive', true)
  $("img").remove();
  
  var folder1 = "data/before/bahalTemple/";
  var folder2 = "data/after/bahalTemple/";

     $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

})
$(".temple").on('mouseover', function(d){
  d3.selectAll(".temple").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////

$(".theater").on('click', function(d){
  d3.selectAll(".theater").classed('myactive', true)
  $("img").remove();
  
  var folder1 = "data/before/theatre/";
  var folder2 = "data/after/theatre/";
 
     $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });
})
$(".theater").on('mouseover', function(d){
  d3.selectAll(".theater").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////

$(".pano").on('click', function(d){
  d3.selectAll(".pano").classed('myactive', true)
  $("img").remove();
 
 var folder1 = "data/before/pano/";
 var folder2 = "data/after/pano/";

      $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

})
$(".pano").on('mouseover', function(d){
  d3.selectAll(".pano").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////

$(".violence").on('click', function(d){
  d3.selectAll(".violence").classed('myactive', true)
    $("img").remove();

  var folder1 = "data/before/violence/";
  var folder2 = "data/after/violence/";

      $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });
})
$(".violence").on('mouseover', function(d){
  d3.selectAll(".violence").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////
$(".sculpture").on('click', function(d){
  d3.selectAll(".sculpture").classed('myactive', true)
  $("img").remove();

  var folder1 = "data/before/scolpture/";
  var folder2 = "data/after/scolpture/";

      $.ajax({
      url : folder1,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                   $("#before").append( "<div class=grid-item><img src='"+ folder1 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

      $.ajax({
      url : folder2,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                    $("#after").append( "<div class=grid-item><img src='"+ folder2 + val +"'></div>" );
                    triggerMasonry();
              } 
          });
      }
  });

})
$(".sculpture").on('mouseover', function(d){
  d3.selectAll(".sculpture").classed('hover', true)
})
//end//////////////////////////////////////////////////////////////////////////
}





////////////////////////////////////////////////////////////////////////////////////////////////////end draw map
////////////////////////////////////////////////////////////////////////////////////////////////////append List