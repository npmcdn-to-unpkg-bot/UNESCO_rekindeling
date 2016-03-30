
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

 var force = d3.layout.force()
            .size([width,height])
            .charge(-80)
            .gravity(0);

var scaleR = d3.scale.sqrt().range([0,50]).domain([0,47]);

var parseDate = d3.time.format("%Y").parse;    
var Sites;
//------------------------------------------------------------------------load data     
queue()
      .defer(d3.json, "data/world-50m.json")
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

// var mapSitesPicByCountry = d3.map()
// var mapCategoryByCountry = d3.map()
// var mapSiteNameByCountry = d3.map()
// var mapSiteDescriptionByCountry = d3.map()


var mapSitesByCountry = d3.map()
var mapCentroidByCountry = d3.map()


var SitesByCountry;

function DataLoaded(err, worldMap_, Sites_){

  Sites_.forEach(function(d) {
      var newDate = parseDate(d.date);
      d.newDate = newDate;
     // mapSitesByCountry.set(d.site_country, d.name)

  })

 SitesByCountry = d3.nest()
        .key(function (d) { return d.site_country; })
        .key(function (d) { return d.category; })
        .map(Sites_, d3.map);


console.log(SitesByCountry)

    // var center = []
    // center = worldMap_.features.map(function(d){

    //     var centroid = path.centroid(d);

    //     if (centroidCountry.has(d.properties.name) == false) {
    //         centroidCountry.set(d.properties.name, centroid)
    //     }
      
    //   return {  state:d.properties.name, 
    //             x0:centroid[0], 
    //             y0:centroid[1], 
    //             x:centroid[0], 
    //             y:centroid[1], 
    //             r:0
    //           };
    // })


SitesByCountry.keys().forEach(function(eachCountry){
  console.log('country',eachCountry);





;})


//mapSitesByCountry.top(Infinity).length


console.log('values', SitesByCountry.values())

 setup(worldMap_, SitesByCountry) 
}
//--------------------------------------------------------------

var countryli;
var siteNodes;

function setup(worldMap_, SitesByCountry){

  var countrylist = SitesByCountry.keys();
  var categorylist = SitesByCountry.values();
  //categotylist.get(length)


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


}









