(function() {

var m = {t:10,r:100,b:20,l:100},
    w = d3.select('#barchart').node().clientWidth- m.l- m.r,
    h = d3.select('#barchart').node().clientHeight - m.t - m.b;

var plot = d3.select('#barchart')
.append('svg')
    .attr('width',w+ m.l+ m.r)
    .attr('height',h+ m.t+ m.b)
    .append('g').attr('class','histogram')
    .attr('transform','translate('+ m.l+','+ m.t+')');

var scaleY = d3.scale.ordinal().domain(["Asia and the Pacific", "Africa", "Arab States", "Europe and North America", "Latin America and the Caribbean"]).rangePoints([0,h]),
    scaleX = d3.scale.linear().domain([1, 24]).range([100, w]);

var color = d3.scale.ordinal()
    .domain(["Cultural", "Natural", "Mixed"])
    .range(["#f90c3f", "#f9c900", "#00f782"]);

queue()

      .defer(d3.csv, "data/UNESCO_danger1.csv", parseUnesco)
      .await(DataLoaded)

var dispatch = d3.dispatch('countryHover', 'countryLeave', 'countryClick');

function parseUnesco(d){ 
    return { 
      'name':(d["name_en"] == " " ? undefined: d["name_en"]),
      'category': (d["category"] == " " ? undefined: d["category"]),
      'country': (d["states_name_en"] == " " ? undefined: d["states_name_en"]),
      'region': d.region_name_en,
      'unid': +d.unique_number,
      'lat': +d.latitude,
      'lng': +d.longitude,
      'desc': d.short_description_en,
      'url': d.url,
      'country_id': d.udnp_code,
      'area':+d.area_hectares,
      index:+d.index,
      labels:d.labels

  };
}
///////////////////////////////////////////////////////////////////scrollmagic
var scrollController = new ScrollMagic.Controller({
    globalSceneOptions:{
    triggerHook:'onLeave'
    }
  });

var scene2p1 = new ScrollMagic.Scene({
    duration:document.getElementById('scene-2p1').clientHeight*2,
    triggerElement:'#scene-2p1',
    reverse:true
  })
  .on('enter', function(){
      d3.select('.opac').transition().delay(1000).duration(document.getElementById('scene-2p1').clientHeight*1.5).style('opacity', 1);
      d3.selectAll('.rect').transition().delay(1000).duration(document.getElementById('scene-2p1').clientHeight*1.5).style('opacity', .4)
      d3.select('.Palmyra').transition().delay(1000).duration(document.getElementById('scene-2p1').clientHeight*1.5).style('opacity', 1).attr("width", 7).attr("height",17).style("stroke", "white").style("stroke-width", .8);
  })
  .on('leave', function(){
      d3.select('.opac').transition().duration(document.getElementById('scene-2p1').clientHeight*1.5).style('opacity', 0);
      d3.selectAll('.rect').transition().duration(document.getElementById('scene-2p1').clientHeight*1.5).style('opacity', 1).style("stroke", "none")
  })
  .setPin("#scene-2p1")
  .setClassToggle("#thelist", "active")
  .addTo(scrollController);

///////////////////////////////////////////////////////////////////scrollmagic





function DataLoaded(err, Sites_){

   setup(Sites_)

}//DataLoaded
///////////////////////////////////////////////////////////////////setup data
function setup(Data){
var yAxis = d3.svg.axis()
            .scale(scaleY)
            .orient("left");

//Visualize the distribution of these 300 random numbers, but how?
//We can visualize by position, and/or color
var points = plot.selectAll('.point')
    .data(Data)
    .enter()
    .append('rect').attr('class',function(d){ return d.name})
    .attr('x',function(d){ return scaleX(d.index)})
    .attr('y',function(d){ return scaleY(d.region)})
    .attr('width',5)
    .attr('height', 15)
    .classed('rect', true)
    .style('fill',function(d){return color(d.category) })
    .style('fill-opacity',.7);

var labels = plot.selectAll('.labels')
  .data(Data, function(d){ return d.labels})
  .enter()
  .append('text')
  .attr('dx',50)
  .attr('dy', function(d){ return scaleY(d.region)+7})
  .classed("labels1", true)
  .style("text-anchor","end")
  .text(function(d){ 
    return d.labels})







// var yAxis = plot.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(" + 100 + ",0)")
//     .call(yAxis);
}

}).call(this);