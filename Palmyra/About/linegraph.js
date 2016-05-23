(function() {


var m = {t:50,r:150,b:50,l:100},
    w = d3.select('#timeline').node().clientWidth- m.l- m.r,
    h = d3.select('#timeline').node().clientHeight - m.t - m.b;

var plot = d3.select('#timeline')
    .append('svg')
    .attr('width',w+ m.l+ m.r)
    .attr('height',h+ m.t+ m.b)
    .append('g')
    .attr('transform','translate('+ m.l+','+ m.t+')');
plot.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w + m.l + m.r)
        .attr("height", h + m.b + m.t);

var scaleY = d3.scale.linear().domain([1, 5]).range([h*.5, h*1.5]);
var scaleX = d3.scale.linear().domain([-2000, 2016.5]).range([0, w]);
var scaleX2 = d3.scale.linear().domain([1980, 2016.5]).range([0, w]);
var color = d3.scale.ordinal().domain(["1", "2"]).range(["#fff", "#ff0000"]);

queue()

      .defer(d3.csv, "data/timeline.csv", parseUnesco)
      .await(DataLoaded)

function parseUnesco(d){ 
    return { 
      'name':(d["name"] == " " ? undefined: d["name"]),
      'title':(d["title"] == " " ? undefined: d["title"]),
      'year_label':(d["year_label"] == " " ? undefined: d["year_label"]),
      'start': (d["start"] == " " ? undefined: d["start"]),
      'end': (d["end"] == " " ? undefined: d["end"]),
      'index':d["index"],
      'line1':d["line1"],
      'line2':d["line2"],
      line3:d.line3,
      line4:d.line4,
      line5:d.line5,
      id:d["color-id"]
  };
}
///////////////////////////////////////////////////////////////////scrollmagic

///////////////////////////////////////////////////////////////////scrollmagic
function DataLoaded(err, Sites_){
   setup(Sites_)
}//DataLoaded
///////////////////////////////////////////////////////////////////setup data
function setup(Data){
//Visualize the distribution of these 300 random numbers, but how?
//We can visualize by position, and/or color
var lines = plot.selectAll('.line')
    .data(Data)
    .enter()
    .append('line')
    .attr('class',function(d){ return d.title})
    .attr("clip-path", "url(#clip)")
    .attr('x1',function(d){ return scaleX(d.start)})
    .attr('x2',function(d){ return scaleX(d.end)})
    .attr('y1', h/2)
    .attr('y2', h/2)
    .classed("line", true)
    .style("stroke", function(d){ return color(d.id) })

var labels = plot.selectAll('.labels')
  .data(Data)
  .enter()
  .append('foreignObject')
  .attr('x',function(d){ return scaleX(d.start)})
  .attr('y', function(d){ return scaleY(d.index)})
  .attr('width', 300)
  .attr('height', 50)
  .attr('class',function(d){ return d.start})
  .classed("labels", true)
  .append("xhtml:p")
  .html(function(d){ 

if(d.start==1980) return null;
if (d.start==2013) return null;
if (d.start==2012) return null;
if (d.start==2015) return null;
if (d.start==2016.5) return null;
    else return d.title
      //'<div style="width: 160px;">' + '<p>' + d.line1 + '<br>' + d.line2 + '<br>' + d.line3 + '<br>' + d.line4 + '<br>' + d.line5 + '</p>' +'</div>'
  })


function transition() {
  lines.transition().duration(100000).tween("axis", function(d, i) {
    var i = d3.interpolate(scaleX, scaleX2);
    return function(t) {
      lines.attr('x1',function(d){ return scaleX2(d.start)})
            .attr('x2',function(d){ return scaleX2(d.end)})
    }
  });

  labels.transition().duration(100000).tween("labels", function(d, i) {
    var i = d3.interpolate(scaleX, scaleX2);
    return function(t) {
      d3.selectAll('.labels')
      .attr('x', function(d){
        if (d.start == 1980) return 0;
        else return  w-200
        })

      .html(function(d){ 
        if (d.start== -2000) return null; 
        if (d.start== 33) return null; 
        if (d.start== 2016) return null; 
        else return  d.title
         // '<div style="width: 160px;">' + '<p>' + d.line1 + '<br>' + d.line2 + '<br>' + d.line3 + '<br>' + d.line4 + '<br>' + d.line5 + '</p>' +'</div>'
      });
    }
  });
}

function transition2() {
  lines.transition().duration(0).tween("axis", function(d, i) {
    var i = d3.interpolate(scaleX, scaleX2);
    return function(t) {
      lines.attr('x1',function(d){ return scaleX(d.start)})
            .attr('x2',function(d){ return scaleX(d.end)})
    }
  });

  labels.transition().duration(0).tween("labels", function(d, i) {
    var i = d3.interpolate(scaleX2, scaleX);
    return function(t) {
      d3.selectAll('.labels').attr('x',function(d){ return scaleX(d.start)})
      .html(function(d){ 
        if(d.start==1980) return null;
        if (d.start==2013) return null;
        if (d.start==2012) return null;
        if (d.start==2015) return null;
        if (d.start==2016.5) return null;
        else return d.title
          //'<div style="width: 160px;">' + '<p>' + d.line1 + '<br>' + d.line2 + '<br>' + d.line3 + '<br>' + d.line4 + '<br>' + d.line5 + '</p>' +'</div>'
    })
  };
})
}



var scrollController = new ScrollMagic.Controller({
    globalSceneOptions:{
    triggerHook:'onLeave'
    }
  });

var scene3p2 = new ScrollMagic.Scene({
   duration:document.getElementById('scene-3p2').clientHeight*1,
   triggerElement:'#scene-3p2',
   reverse:true
 })
 .on('enter',function(){
  d3.select("#scene-3").attr('id', "scene-3new")
  transition();
  setInterval(transition, 100000);
 })
 .setPin("#scene-3p2")
 .setClassToggle("#palmyra", "active")
 .addTo(scrollController);


var scene3p1 = new ScrollMagic.Scene({
    duration:document.getElementById('scene-3p1').clientHeight*1,
    triggerElement:'#scene-3p1',
    reverse:true
  })
.on('enter', function(){
   d3.select("#scene-3new").attr('id', "scene-3")
   transition2();
   setInterval(transition, 100000);
})
  .setClassToggle("#palmyra", "active")
  .addTo(scrollController);
}



}).call(this);