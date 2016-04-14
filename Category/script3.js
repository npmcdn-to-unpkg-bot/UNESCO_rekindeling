var margin = {t:50,l:50,b:50,r:50},
    width  = $('.category_canvas').width()-margin.l-margin.r,
    height = $('.category_canvas').height()-margin.t-margin.b,
    padding = 10;

d3.select('.site_text').classed('hide', true);

var category_canvas = d3.select('.category_canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var color =  d3.scale.ordinal().domain([0, 2]).range(["#2B5189","#91A357","#DD5846"]);
    //cultural: green, natural: red, mixed:blue

  //  blue 2B5189
  //  red DD5846
  //  green 91A357
var force = d3.layout.force().size([width,height]).charge(-1).gravity(0);


//Multiple foci
var foci = {};
foci.c = {
    x: width*.8,
    y: height/2
};
foci.n = {
    x: width*.5,
    y: height/2
};



foci.m = {
    x: width*.15,
    y: height/2
};


var titles = category_canvas.append("text").text("Cultural");


var scaleR = d3.scale.sqrt().range([5,100]);
var scaleX = d3.scale.linear().range([0, width]);
var countryli, siteNodes, SitesByCountry, CountryInDanger;
var maxRadius = 100;
var m = 3; //number of clusters
var centroidCountry = d3.map();
countCountry = d3.map();
countCountrySorted = d3.map();

//------------------------------------------------------------------------load data     
queue()
      .defer(d3.json, "data/countries.geo.json")
      .defer(d3.csv, "data/UNESCO2.csv", parseUnesco)
      .await(DataLoaded)

var dispatch = d3.dispatch('countryHover', 'countryLeave', 'countryClick');

function parseUnesco(d){ 
    return { 
      'name':(d["name_en"] == " " ? undefined: d["name_en"]),
      'category': (d["category"] == " " ? undefined: d["category"]),
      'country': (d["states_name_en"] == " " ? undefined: d["states_name_en"]),
      'danger': (+d["danger_start1"] == " " ? undefined: +d["danger_start1"]),
      'region': d.region_name_en,
      'date': d.date_inscribed,
      'unid': +d.unique_number,
      'lat': +d.latitude,
      'lng': +d.longitude,
      'desc': d.short_description_en,
      'url': d.url,
      'country_id': d.udnp_code,
      'area':+d.area_hectares,
      r:10

  };
}


function DataLoaded(err, worldMap_, Sites_){
  // Sites_.forEach(function(d){
  //   if (d.danger != undefined) {
  //     return d.danger = 1;
  //   }
  //   else {
  //     return d.danger = 0;
  //   }
  // })

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
    countCountry.set(eachCountry[0].country_id, eachCountry.length);

  ;})

  countCountryKey = SitesByCountry.keys()
    .sort(function(a, b){
      return d3.descending(countCountry.get(a), countCountry.get(b))
    })
  countCountryKey.forEach(function(cntry){
    countCountrySorted.set(cntry, countCountry.get(cntry))
  })



  appendCountryList(countCountrySorted); 
  draw(Data);
  // appendSiteGallery(Data);
}//setup
/////////////////////////////////////////////////////////////////////////////////////////end setup
/////////////////////////////////////////////////////////////////////////////////////////draw map
function draw(Data){

scaleX.domain(d3.extent(Data, function(d) { return d.area; }));
scaleR.domain(d3.extent(Data, function(d) { return d.area; }));


var nodes = category_canvas.selectAll('.area_nodes')
        .data(Data)
nodesEnter = nodes.enter()
    .append('rect')
    .attr('opacity', .7)
    .attr("class", function(d){ return d.country + d.category})
    .classed('area_nodes', true)
    .classed('country', true)
    .attr('x',function(d){return d.x})
    .attr('y',function(d){return d.y})
    .attr('width', function(d){ return scaleR(d.area) })
    .attr('height', function(d){ return scaleR(d.area) })
     .style("fill", function(d) { return color(d.category);})

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
        if (d.category =="Cultural"){
        var focus = foci.c;
        }
        else if (d.category == "Mixed"){
        var focus = foci.n;
        }
        else {
        var focus = foci.m;
        }
            d.x += (focus.x-d.x)*(e.alpha*.1);
            d.y += (focus.y-d.y)*(e.alpha*.1);
        })
       .attr('y',function(d){return d.y})
       .attr('x',function(d){return d.x})
}
    function collide(dataPoint){
    var nr = (scaleR(dataPoint.area)/Math.sqrt(2))+ 1;
          dataPoint.r = nr 

// var r = scaleR(d.area);

        var nr = dataPoint.r + 1,
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
                    dataPoint.x -= x*= (l);
                    dataPoint.y -= y*= l;
                    quadPoint.point.x += (x);
                    quadPoint.point.y += y;
                }
            }
            return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////end draw map
////////////////////////////////////////////////////////////////////////////////////////////////////append List
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
          console.log(i)
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
});

