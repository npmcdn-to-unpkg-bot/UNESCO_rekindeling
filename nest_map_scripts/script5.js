
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

var projection = d3.geo.equirectangular()
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

var dispatch = d3.dispatch('countryHover', 'countryLeave', 'countryClick');

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

var mapSitesByCountry = d3.map()
var mapCentroidByCountry = d3.map()


var SitesByCountry;
countByCountry = d3.map();
function DataLoaded(err, worldMap_, Sites_){

  Sites_.forEach(function(d) {
      var newDate = parseDate(d.date);
      d.newDate = newDate;
  })

 SitesByCountry = d3.nest()
        .key(function (d) { return d.site_country; })
      //  .key(function (d) { return d.category; })
        .map(Sites_, d3.map);


SitesByCountry.values().forEach(function(eachCountry){
// console.log('country',eachCountry.length);
  countByCountry.set(eachCountry[0].site_country, eachCountry.length);
//[0] is each site, they all have ast least 1
//the first entry of each group(key)/grouped by country
//countByCountry is object and inside it are arrays...keys(), values(), methods() etc give the arrays from objects
;})
console.log(countByCountry)
countByCountrySorted = d3.map()

countByCountryKey = countByCountry.keys()
 .sort(function(a, b){
    return d3.descending(countByCountry.get(a), countByCountry.get(b))
  })


countByCountryKey.forEach(function(cntry){
  countByCountrySorted.set(cntry, countByCountry.get(cntry))
})

appendCountryList(countByCountrySorted); 
appendMap(worldMap_, Sites_);
}
//--------------------------------------------------------------

var countryli;
var siteNodes;

function appendCountryList(countByCountrySorted, Sites_){

var countryli_ul = d3.select(".country-list")
      .append('ul');
    countryli = countryli_ul
      .selectAll('li')
      //d = data --> the keys = countries
      .data(countByCountrySorted.keys())
      .enter()
      .append('li')
      .attr('class', 'lst')
      .text(function(d){ 
        // d is country, countByCountry.get(d) is the 'value'
        return  countByCountrySorted.get(d) + " " + d;
      })
      .on('mouseover', function(d, i){
        dispatch.countryHover(i);
       // console.log(countByCountrySorted.keys())
       // console.log(d3.select(this).data()[0])

        countryName = d3.select(this).data()[0]

        countrySelect = d3.selectAll('.site_nodes').filter(function(d){
          return d.site_country == countryName;
        })
        countrySelect.classed('hover', true)

      })



    //---------- this is the listener function ------------------//

    dispatch.on('countryHover.'+countByCountrySorted, function(index){
      selected = countryli.selectAll('.lst').filter(function(d,i) { 
        return i == index; 
      })
      selected.style('color','red').style('opacity', .7);
    });

    dispatch.on('countryLeave', function(index){
      selected = countryli.selectAll('.lst').filter(function(d,i) { 
        return i == index; 
      });
      selected.style('color',null).style('opacity', 1);
    });

///////////////////////////////////////////toggle///////////////////
function toggleItem(elem) {
  for (var i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function(e) {
      var current = this;
      for (var i = 0; i < elem.length; i++) {
        if (current != elem[i]) {
          elem[i].classList.remove('myactive');
        } 
        else if (current.classList.contains('myactive') === true) {
          current.classList.remove('myactive');
        } 
        else {
          current.classList.add('myactive')
        }
      }
      e.preventDefault();
    });
  };
}
toggleItem(document.querySelectorAll('.lst'));
//toggleItem(document.querySelectorAll('.site_nodes'));
///////////////////////////////////////////toggle end////////////////


















}
function appendMap(worldMap_, Sites_){

var geo_country = topojson.feature(worldMap_, worldMap_.objects.countries).features;

var worldmap = map.selectAll('.states')
        .data(geo_country)
        .enter()
        .append('path')
        .attr('class', 'world_path')
        .attr('d', map_path)

var siteNodes = map.selectAll('.site_nodes')
        .data(Sites_)
        .enter()
        .append('circle')
        .attr('r',1)
        .attr('data-value', function(d){
          return d.site_country;
        })
        .classed({'site_nodes': true})
        .attr("transform", function(d) {
          return "translate(" + projection([ d.lng, d.lat]) + ")"})
}









