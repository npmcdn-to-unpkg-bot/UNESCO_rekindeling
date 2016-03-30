
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
    
var path = d3.geo.path()
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
      // .defer(d3.json, "data/world-50m.json")
       .defer(d3.json, "data/countries.geo.json")
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
var centroidByCountry = d3.map();

var SitesByCountry;
countByCountry = d3.map();
function DataLoaded(err, worldMap_, Sites_){

    var center = []
    center = worldMap_.features.map(function(d){

        var centroid = path.centroid(d);

        if (centroidByCountry.has(d.properties.name) == false) {
            centroidByCountry.set(d.properties.name, centroid)
        }
      
      return {  state:d.properties.name, 
                x0:centroid[0], 
                y0:centroid[1], 
                x:centroid[0], 
                y:centroid[1], 
                r:0
              };
    })
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

            if (centroidByCountry.get(eachCountry.key) != undefined) {
                eachCountry.x0 = centroidByCountry.get(eachCountry.key)[0]
                eachCountry.x = centroidByCountry.get(eachCountry.key)[0]
                eachCountry.y = centroidByCountry.get(eachCountry.key)[1]
                eachCountry.y0 = centroidByCountry.get(eachCountry.key)[1]
          }
        //  console.log(centroidByCountry)

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
draw(center);
} //DataLoaded
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
          return d.state == countryName;
        })
        countrySelect.classed('hover', true)

      })
      .on('mouseleave', function(d, i){
        dispatch.countryLeave(i);
       // console.log(countByCountrySorted.keys())
       // console.log(d3.select(this).data()[0])

        countryName = d3.select(this).data()[0]

        countrySelect = d3.selectAll('.site_nodes').filter(function(d){
          return d.state == countryName;
        })
        countrySelect.classed('hover', false)

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
// function appendMap(worldMap_, Sites_){

// var geo_country = topojson.feature(worldMap_, worldMap_.objects.countries).features;

// var worldmap = map.selectAll('.states')
//         .data(geo_country)
//         .enter()
//         .append('path')
//         .attr('class', 'world_path')
//         .attr('d', map_path)

// var siteNodes = map.selectAll('.site_nodes')
//         .data(Sites_)
//         .enter()
//         .append('circle')
//         .attr('r',1)
//         .attr('data-value', function(d){
//           return d.site_country;
//         })
//         .classed({'site_nodes': true})
//         .attr("transform", function(d) {
//           return "translate(" + projection([ d.lng, d.lat]) + ")"})
// }


function draw(center){
      var nodes =map.selectAll('.countries')
            .data(center, function(d){return d.state});
        var nodesEnter = nodes.enter()
            .append('g')
           // .attr('class','countries')
            .attr('opacity', 0)      
        nodes.exit().remove();
        nodes
            .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')';})
            .attr('opacity', 1)
        nodes.append('rect')

            .attr('data-value', function(d){
              return d.state;
            })
            .classed({'site_nodes': true})


            .attr('x', function(d){ return 0 }).attr('y', function(d){ return 0 })
                .attr("width", function(d){
                   var values = countByCountrySorted.get(d.state);
                  if (values>=0) {return scaleR(values);} else { return scaleR(0);}
                  })
                   .attr("height", function(d){
                  var values = countByCountrySorted.get(d.state);

                  if (values>=0) { return scaleR(values); } else { return scaleR(0); }              
                  })
                .style('fill-opacity',.3)
                .on("mousemove", function(d){
             var values = countByCountrySorted.get(d.state);
                    var tooltip = d3.select(".tooltip")
                        .style("visibility","visible")
                    tooltip
                        .select('h2')
                        .html(d.state + "<br> " + values)     

//   console.log("draw center", center)

        });
//---------------------------------------------------------------------------------------
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
          var values = countByCountrySorted.get(dataPoint.state);
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




