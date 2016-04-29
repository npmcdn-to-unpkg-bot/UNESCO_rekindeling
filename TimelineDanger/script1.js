var margin = {t:50,l:50,b:50,r:50},
    width  = $('.danger_canvas').width()-margin.l-margin.r,
    height = $('.danger_canvas').height()-margin.t-margin.b,
    padding = 10;

d3.select('.site_text').classed('hide', true);

var danger_canvas = d3.select('.danger_canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var color =  d3.scale.ordinal().domain([0, 2]).range(["#2B5189","#91A357","#DD5846"]);
var colorDark =  d3.scale.ordinal().domain([0, 2]).range(["#2B5189","#91A357","#DD5846"]);

    //cultural: green, natural: red, mixed:blue
  //  blue 2B5189
  //  red DD5846
  //  green 91A357

var totalCultural;// = $(".Cultural").length;
var totalNatural;// = $(".Natural").length;
var totalMixed;// = $(".Mixed").length;

var parseDate = d3.time.format("%Y").parse;

var scaleX = d3.time.scale().range([0, width]);
var scaleY = d3.scale.linear().domain([1, 42]).range([0, height]);
countCountry = d3.map();
countCountrySorted = d3.map();
var SitesByCountry;
// var centroidCountry = d3.map();
// countCountry = d3.map();
// countCountrySorted = d3.map();

//------------------------------------------------------------------------load data     
queue()
      .defer(d3.json, "data/countries.geo.json")
      .defer(d3.csv, "data/UNESCO_danger.csv", parseUnesco)
      .await(DataLoaded)

var dispatch = d3.dispatch('countryHover', 'countryLeave', 'countryClick');

function parseUnesco(d){ 
    return { 
      'name':(d["name_en"] == " " ? undefined: d["name_en"]),
      'category': (d["category"] == " " ? undefined: d["category"]),
      'country': (d["states_name_en"] == " " ? undefined: d["states_name_en"]),
      'region': d.region_name_en,
      'date': d.date_inscribed,
      'unid': +d.unique_number,
      'lat': +d.latitude,
      'lng': +d.longitude,
      'desc': d.short_description_en,
      'url': d.url,
      'country_id': d.udnp_code,
      'area':+d.area_hectares,
      start: +d.danger_start,
      end: +d.danger_end,
      index:+d.index,
      r:10

  };
}


function DataLoaded(err, worldMap_, Sites_){
Sites_.forEach(function(d){ 
  var start_year = new Date(d.start);
  var end_year = new Date(d.end);

  d.start_year = start_year;
  d.end_year = end_year;
})

  CountryLookup = d3.map();
    Sites_.forEach(function(d) {
      CountryLookup.set(d.country_id, d.country)
    })
   setup(worldMap_, Sites_)

}//DataLoaded
///////////////////////////////////////////////////////////////////setup data
function setup(worldMap_, Data){

  SitesByCountry = d3.nest()
          .key(function (d) { return d.country_id; })
          .map(Data, d3.map);


  SitesByCountry.values().forEach(function(eachCountry){
   // console.log(SitesByCountry.get(eachCountry.country_id).length);


//eachCountry.length
    countCountry.set(eachCountry[0].country_id, eachCountry.length);

  ;})

  countCountryKey = SitesByCountry.keys()
    .sort(function(a, b){
      return d3.descending(countCountry.get(a), countCountry.get(b))
    })
  countCountryKey.forEach(function(cntry){
    countCountrySorted.set(cntry, countCountry.get(cntry))
  })
  // RectList(Data); 
  appendCountryList(countCountrySorted); 
  TimeLine(Data);
}//setup


// function RectList(Data){
// console.log(Data);
// var nodes = danger_canvas.selectAll('.danger_nodes')
//     .data(Data)
// nodesEnter = nodes.enter()
//     .append('rect')
//     .attr('opacity', 1)
//     .attr("class", function(d){ return d.category })
//     .classed('danger_nodes', true)
//     .attr('x', 100)
//     .attr('y',function(d){return scaleY(d.index) })
//     .attr('width', 5)
//     .attr('height', 5)
//     .style("fill", function(d) { return color(d.category);})

// nodes.exit().remove()

// }

function TimeLine(Data){


var minYear = d3.min(Data, function(d){ return d.start_year})
var maxYear = d3.max(Data, function(d){ return d.end_year})

scaleX.domain([minYear, maxYear])
var index_lines = danger_canvas.selectAll(".lines")
      .data(Data)
      indexLinesEnter = index_lines.enter()
      .append('line')
      .attr('x1', 0 )
      .attr('x2', width )
      .attr('y1', function(d){ return scaleY(d.index) })
      .attr('y2', function(d){ return scaleY(d.index) })
      .style("stroke", "#e2e2e2")
      .classed('index-lines', true); 


var lines = danger_canvas.selectAll(".timelines")
      .data(Data)
      linesEnter = lines.enter()
      .append('line')
      .attr('x1', function(d){ return scaleX(d.start_year) })
      .attr('x2', function(d){ return scaleX(d.end_year) })
      .attr('y1', function(d){ return scaleY(d.index) })
      .attr('y2', function(d){ return scaleY(d.index) })
      .attr('class', function(d){ return d.index})
      .classed('lines', true);


      // .on('mouseover', function(d, i){
      //     dispatch.countryHover(d);

      // })
      // .on('mouseleave', function(d, i){
      //     dispatch.countryLeave(d);
      // })
      // .on('click', function(d, i){

      //   d3.selectAll('.area_nodes').classed('hover', false).classed('myactive', false)
      //   d3.selectAll('.sites').classed('hide',true)
  
      //   dispatch.countryClick(d);

      //   var site_text= d3.select('.site_text');
      //     site_text.select('h2')
      //         .html('');   
      //     site_text.select('p')
      //         .html('');
      // })

}



function appendCountryList(Data){

var countryli_ul = d3.select(".country-list")
      .append('ul');
    countryli = countryli_ul
      .selectAll('li')
      .data(countCountrySorted.keys())
      .enter()
      .append('li')
      .attr('class', 'country-list')
      .classed('country', true)
      .text(function(d){ 
        return  countCountrySorted.get(d) + " " + CountryLookup.get(d);
      })
      .on('mouseover', function(d, i){
          dispatch.countryHover(d);

      })
      .on('mouseleave', function(d, i){
          dispatch.countryLeave(d);
      })
      .on('click', function(d, i){

        d3.selectAll('.area_nodes').classed('hover', false).classed('myactive', false)
        d3.selectAll('.sites').classed('hide',true)
  
        dispatch.countryClick(d);


        var site_text= d3.select('.site_text');
          site_text.select('h2')
              .html('');   
          site_text.select('p')
              .html('');
      })


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
toggleItem(document.querySelectorAll('.country'));
///////////////////////////////////////////toggle end////////////////
}

dispatch.on('countryHover', function(countryName){
   countrySelect = d3.selectAll('.area_nodes').filter(function(d){ 
      return d.country == CountryLookup.get(countryName)
   })

   countrySelect.classed('hover', true)
    countryLiSelect = d3.selectAll('.country').filter(function(d){ 
      return d == countryName
    })
    countryLiSelect.classed('hover', true)
    d3.select('.site_text').classed('hide', true);
});

dispatch.on('countryLeave', function(countryName){
    countrySelect = d3.selectAll('.area_nodes').filter(function(d){
      return d.country == CountryLookup.get(countryName);
    })
    countrySelect.classed('hover', false)
    countryLiSelect = d3.selectAll('.country').filter(function(d){ 
      return d == countryName
    })
    countryLiSelect.classed('hover', false)
});

dispatch.on('countryClick', function(countryName){
    countrySelect = d3.selectAll('.area_nodes').filter(function(d){
      return d.country == CountryLookup.get(countryName);



    })
    countrySelect.classed('myactive', true)
    countrySelectSite = d3.selectAll('.sites').filter(function(d){
      return d.country_id == countryName;
    })
    countrySelectSite.classed('hide', false)


totalCultural = $(".Cultural.myactive").length;
totalNatural = $(".Natural.myactive").length;
totalMixed = $(".Mixed.myactive").length;
console.log("tc", totalCultural, totalNatural, totalMixed)


var titles = $('.category_text').select('h2')
              .html("Natural"+" "+totalNatural+"     -     "+"Mixed"+" "+totalMixed+" "+" - "+"Cultural"+" "+totalCultural);

});

