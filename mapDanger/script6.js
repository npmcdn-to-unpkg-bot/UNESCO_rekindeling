var margin = {t:120,l:50,b:50,r:50},
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
    
var path = d3.geo.path()
      .projection(projection);

 var force = d3.layout.force()
            .size([width,height])
            .charge(-80)
            .gravity(0);

var scaleR = d3.scale.sqrt().range([0,40]).domain([0,53]);
var Sites;
countCountrySorted = d3.map();
var countryli;
var siteNodes;
var centroidCountry = d3.map();
var SitesByCountry;
countCountry = d3.map();
var CountryInDanger;


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
      // 'danger_start': (d["danger_start"] == " " ? undefined: d["danger_start"]),
      // 'danger_end': (d["danger_end"] == " " ? undefined: d["danger_end"]),
      'region': d.region_name_en,
      'date': d.date_inscribed,
      'unid': +d.unique_number,
      'lat': +d.latitude,
      'lng': +d.longitude,
      'desc': d.short_description_en,
      'url': d.url,
      'country_id': d.udnp_code
  };
}


function DataLoaded(err, worldMap_, Sites_){
    var center = []
    center = worldMap_.features.map(function(d){
        var centroid = path.centroid(d);
        if (centroidCountry.has(d.id) == false) {
            centroidCountry.set(d.id, centroid)
        }
      return {  state:d.id.toLowerCase(), 
                x0:centroid[0], 
                y0:centroid[1], 
                x:centroid[0], 
                y:centroid[1], 
                r:0
              };
    })



Sites_.forEach(function(d){
  if (d.danger != undefined) {
    return d.danger = 1;
  }
  else {
    return d.danger = 0;
  }
})
  var cf = crossfilter(Sites_);
  filterDanger = cf.dimension(function(d){return d.danger});
  filterDanger.filter(1);    



function dangerClick(d){
  console.log(filterDanger.top(Infinity).length)

  //There are 59 sites in danger
  //I NEED TO UPDATE THE DATA TO BE THE RESULTS FROM THE CROSSFILTER -- 'filterDanger'
  //There will be 59 sites in danger put into the same nest by country --'SitesByCountry'

Sites_ = Sites_.filter(function(d){ return d.danger == 1})

console.log(Sites_)
}











//filterDanger = Sites_;

CountryLookup = d3.map();
  Sites_.forEach(function(d) {
    CountryLookup.set(d.country_id, d.country)
  })

var InDanger = Sites_.filter(function(d){ return d.danger == 1})

 SitesByCountry = d3.nest()
        .key(function (d) { return d.country_id; })
        .map(Sites_, d3.map);

SitesByCountry.values().forEach(function(eachCountry){
  countCountry.set(eachCountry[0].country_id, eachCountry.length);

            if (centroidCountry.get(eachCountry.key) != undefined) {
                eachCountry.x0 = centroidCountry.get(eachCountry.key)[0]
                eachCountry.x = centroidCountry.get(eachCountry.key)[0]
                eachCountry.y = centroidCountry.get(eachCountry.key)[1]
                eachCountry.y0 = centroidCountry.get(eachCountry.key)[1]
          }
;})

countCountryKey = SitesByCountry.keys()
  .sort(function(a, b){
    return d3.descending(countCountry.get(a), countCountry.get(b))
  })
countCountryKey.forEach(function(cntry){
  countCountrySorted.set(cntry, countCountry.get(cntry))
})

  $('#DangerBtn').on('click',function(d){
      d.preventDefault();
      console.log('click');
      dangerClick(d)
  });




appendCountryList(countCountrySorted); 
draw(center);
appendSiteGallery(Sites_);
} //DataLoaded

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

function draw(center){

      var nodes =map.selectAll('.site_nodes')
            .data(center, function(d){return d.state})
        var nodesEnter = nodes.enter()
            .append('g')
            .attr('opacity', 0)      
        nodes.exit().remove();
        nodes
            .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')';})
            .attr('opacity', .7)
            .attr('fill', 'rgb(140, 140, 140')
        nodes.append('rect')
            .attr('data-value', function(d){
              return d.state;
            })
            .classed('country', true)
            .classed({'site_nodes': true})
            .attr('x', function(d){ return 0 }).attr('y', function(d){ return 0 })
                .attr("width", 
                  function(d){
           
                   var values = countCountrySorted.get(d.state);
                  if (values>=0) {return scaleR(values); } else { return scaleR(0);}
                  })
                   .attr("height",
                    function(d){var values = countCountrySorted.get(d.state);

                  if (values>=0) { return scaleR(values); } else { return scaleR(0); }              
                  })

           .on('mouseover', function(d, i){
              dispatch.countryHover(d);
            })
//-------------------------------------------------------------------------
        force.stop();
        force.nodes([])
        force.start();
        force.nodes(center)
            .on('tick',onForceTick)
            .start();

    function onForceTick(e){
        var q = d3.geom.quadtree(center),
            i = 0,
            n = center.length;
          while( ++i<n ){
              q.visit(collide(center[i]));
          }
        nodes
            .each(gravity(e.alpha*.5))
            .attr('transform',function(d){
                return 'translate('+d.x+','+d.y+')';
            })
//---------------------------------------custom gravity: data points gravitate towards a straight line
        function gravity(k){
            return function(d){
                d.y += (d.y0 - d.y)*k;
                d.x += (d.x0 - d.x)*k;
            }
        } //gravity
        function collide(dataPoint, center){

       //   var values = countCountrySorted.get(dataPoint.state);
var values = 5;
          if (values>=0) { var nr = (scaleR(values)/Math.sqrt(2))+ padding} else {var nr = scaleR(0)+ padding;}
          dataPoint.r = nr 
            var nx1 = dataPoint.x - nr,
                ny1 = dataPoint.y - nr,
                nx2 = dataPoint.x + nr,
                ny2 = dataPoint.y + nr;

            return function(quadPoint,x1,y1,x2,y2){
                if(quadPoint.point && (quadPoint.point !== dataPoint)){
                    var x = dataPoint.x - quadPoint.point.x,
                        y = dataPoint.y - quadPoint.point.y,
                        l = Math.sqrt(x*x+y*y),
                        r = nr + quadPoint.point.r + padding;
                    if(l<r){
                        l = (l-r)/l*.1;
                        dataPoint.x -= x*= (l*.05);
                        dataPoint.y -= y*= (l*.05);
                        quadPoint.point.x += (x*.25);
                        quadPoint.point.y += (y*.05);
                    }
                }
                return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
            }
        } //collide
      } //onForceTick
} //draw(center)





function appendCountryList(Sites_){

var countryli_ul = d3.select(".country-list")
      .append('ul');
    countryli = countryli_ul
      .selectAll('li')
      .data(countCountrySorted.keys())
      .enter()
      .append('li')
      .classed('country', true)
      .classed('lst', true)
      .text(function(d){ 
        // d is country, countByCountry.get(d) is the 'value'
        return  countCountrySorted.get(d) + " " + CountryLookup.get(d);
      })
      .on('mouseover', function(d, i){
          dispatch.countryHover(d);
      })
      .on('mouseleave', function(d, i){
          dispatch.countryLeave(d);
      })

      .on('click', function(d, i){
        d3.selectAll('.site_nodes').classed('hover', false).classed('myactive', false)
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
toggleItem(document.querySelectorAll('.sites'));
///////////////////////////////////////////toggle end////////////////
}

dispatch.on('countryHover', function(countryName){
   countrySelect = d3.selectAll('.site_nodes').filter(function(d){ 
      return d.state == countryName
   })
   countrySelect.classed('hover', true)
    countryLiSelect = d3.selectAll('.country').filter(function(d){ 
      return d == countryName
    })
    countryLiSelect.classed('hover', true)
});

dispatch.on('countryLeave', function(countryName){
    countrySelect = d3.selectAll('.country').filter(function(d){
      return d.state == countryName;
    })
    countrySelect.classed('hover', false)
    countryLiSelect = d3.selectAll('.country').filter(function(d){ 
      return d == countryName
    })
    countryLiSelect.classed('hover', false)
});

dispatch.on('countryClick', function(countryName){
    countrySelect = d3.selectAll('.country').filter(function(d){
      return d.state == countryName;
    })
    countrySelect.classed('myactive', true)
    countrySelectSite = d3.selectAll('.sites').filter(function(d){
      return d.country_id == countryName;
    })
    countrySelectSite.classed('hide', false)
});


function appendSiteGallery(Sites_){
 var site_gallery = d3.select('.site_img');
    var sites = site_gallery.selectAll('.sites');
    sites
        .data(Sites_)
        .enter()
        .append('img')
        .attr('src', function(d){ return d.url})
        .classed({'sites': true})
        .on('click', site_click)
        .classed('hide', true)
}
///////////////////////////////////////////toggle///////////////////
function site_click(d){
  var site_text= d3.select('.site_text');
    site_text.select('h2')
        .html(d.name)     
    site_text.select('p')
        .html(d.desc)      
}

