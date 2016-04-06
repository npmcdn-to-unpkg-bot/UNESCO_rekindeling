
var margin = {t:50,l:50,b:50,r:50},
    width  = $('.map').width()-margin.l-margin.r,
    height = $('.map').height()-margin.t-margin.b,
    padding = 10;

var map = d3.select('.map')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var projection = d3.geo.mercator()
      .translate([width/2, height/2])
      .scale(150);

var map_path = d3.geo.path()
      .projection(projection);


var parseDate = d3.time.format("%Y").parse;    
var Sites;
//------------------------------------------------------------------------load data     
queue()
      .defer(d3.json, "data/world-50m.json")
      //.defer(d3.csv, "data/countries.csv", parseCountries)
      .defer(d3.csv, "data/UNESCO.csv", parseUnesco)
      .await(DataLoaded)

var dispatch = d3.dispatch('countryHover', 'countryLeave');

function parseUnesco(d){ 
    return { 
      'name':(d["name_en"] == " " ? undefined: d["name_en"]),
      'category': (d["category"] == " " ? undefined: d["category"]),
      'site_country': (d["states_name_en"] == " " ? undefined: d["states_name_en"]),
      'region': d.region_name_en,
      'date': d.date_inscribed,
      'id': +d.unique_number,
      'lat': +d.latitude,
      'lng': +d.longitude

  };
}

countryMap = d3.map()
counter = 0
var SitesByCountry;
function DataLoaded(err, worldMap_, Sites_){
  console.log(Sites_)
  Sites_.forEach(function(d) {
      counter = counter + 1;
      var newDate = parseDate(d.date);
      d.newDate = newDate;
      countryMap.set(d.site_country, d.name)
      d.counter = counter;
  })

 SitesByCountry = d3.nest()
        .key(function (d) { return d.site_country; })
        .key(function (d) { return d.category; })
        .entries(Sites_)
        // .map(Sites_, d3.map);
 var total = 0;
 console.log(SitesByCountry)
SitesByCountry.forEach(function(country){
  console.log(country)
})
// countryMap.values().forEach(function(country){
//             console.log(country)

//             total = country.values.length
//             country.total = total
// })

console.log(SitesByCountry)
 setup(worldMap_, SitesByCountry) 
}
//--------------------------------------------------------------

var countryli;
var siteNodes;

function setup(worldMap_, SitesByCountry){

  var countrylist = countryMap.keys();

  //console.log(countrylist[163])
  //map.keys()
  //
  //console.log('country', countrylist)

  var countryli_ul = d3.select(".country-list")
  .append('ul');
  countryli = countryli_ul
    .selectAll('li')
    .data(countrylist)
    .enter()
    .append('li')
    .attr('class', 'lst')
    .text(function(d){ 
    return d
    })


var geo_country = topojson.feature(worldMap_, worldMap_.objects.countries).features;

var worldmap = map.selectAll('.states')
        .data(geo_country)
        .enter()
        .append('path')
        .attr('class', 'world_path')
        .attr('d', map_path)


   siteNodes = map.selectAll('.nodes_group').append("g")
        .data(countrylist);
    siteNodes.selectAll('.site_nodes')
        .data(function(d){ return d})
        .enter()
        .append('circle')
        .attr('class', 'site_nodes')
        .attr('r',2)
        .attr("transform", function(values) {
          return "translate(" + projection([ d.lng, d.lat]) + ")"})


  countryli.on("click", function() {
      var selected = this.value;
      console.log(selecttged)
      displayOthers = this.checked ? "inline" : "none";
      display = this.checked ? "none" : "inline";


      map.selectAll(".site_nodes")
          .filter(function(d) {return selected != d.name;})
          .attr("display", displayOthers);
          
      map.selectAll(".site_nodes")
          .filter(function(d) {return selected == d.name;})
          .attr("display", display);

      });








}









