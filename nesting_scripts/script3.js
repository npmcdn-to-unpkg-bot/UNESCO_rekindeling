
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
      .defer(d3.csv, "data/countries.csv", parseCountries)
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

function parseCountries(d){ 
    return { 
      'country': d.country,
      'total': d.total
  };
}

// function parseWorld(d){ 
//     return { 
//       'geo_country': topojson.feature(worldMap_.objects.countries).features
//   };
// }
function DataLoaded(err, worldMap_, Countries_, Sites_){
  Sites_.forEach(function(d) {
      var newDate = parseDate(d.date);
      d.newDate = newDate;
  })
Sites = d3.nest()
    .key(function(d){ return d.site_country })
    .entries(Sites_)

    var total=0;

    Sites.forEach(function(country){
            total = country.values.length
            country.total = total
        })

var nested_data =Sites
        .sort(function(a, b){
        return d3.descending(a.total, b.total)
      })



    console.log(nested_data)

 setup(worldMap_, Countries_, Sites) 
}
//--------------------------------------------------------------

var countryli;
var siteNodes;
var dropDown = d3.select("#filter").append("select")
                  .attr("name", "country-list");

function setup(worldMap_, nested_data){




var list = dropDown.selectAll("option")
         .data(Sites)
         .enter()
         .append("option")
         .attr('value', function(d){
          return d.key
         })
         .text(function(d){
          return d.key
         });


 list.on('change', function() {
      var selected = d3.select(this).select("select").property("value")
      
      
      var cd = nested_data.filter(function(d, i) {
         return (selected == 'Italy')
       });
       console.log(cd)
       updateNested_data(cd.pop())
  });



// BIND, ENTER, REMOVE
  function updateNested_data(cd) {

      var country = map.selectAll(".country") .data(cd.values)
        
      var countryEnter = country
        
          .enter().append('div')
          .attr('class', 'country')

      countryEnter
            .append("p")
            .attr('class', 'label')
            .style('font-weight', 'bold')
            .text(function(d) {
                return d.key;
            })

      country.exit().remove();
   
  };
     var filter = nested_data.filter(function(d) {
         return ("Italy" == d.key)
     });

  updateNested_data(filter.pop())


var geo_country = topojson.feature(worldMap_, worldMap_.objects.countries).features;

var worldmap = map.selectAll('.states')
        .data(geo_country)
        .enter()
        .append('path')
        .attr('class', 'world_path')
        .attr('d', map_path)


   siteNodes = map.selectAll('.site_nodes')
        .data(Sites_)
        .enter()
        .append('circle')
        .attr('class', 'site_nodes')
        .attr('r',2)
        .attr("transform", function(d) {
          return "translate(" + projection([ d.lng, d.lat]) + ")"})







  options.on("change", function() {
      var selected = this.value;
      console.log(selected)
      displayOthers = this.checked ? "inline" : "none";
      display = this.checked ? "none" : "inline";


      map.selectAll(".circles")
          .filter(function(d) {return selected != d.country;})
          .attr("display", displayOthers);
          
      map.selectAll(".circles")
          .filter(function(d) {return selected == d.country;})
          .attr("display", display);

      });








}








