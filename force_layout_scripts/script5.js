
var margin = {t:50,l:50,b:50,r:50},
    width  = $('.map').width()-margin.l-margin.r,
    height = $('.map').height()-margin.t-margin.b,
    padding = 10;

var svg = d3.select('.map')
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
var siteByCountry = d3.map();
var centroidByCountry = d3.map();
var newDataSite;
var DataSite;
//------------------------------------------------------------------------load data     
queue()
      .defer(d3.json, "data/countries.geo.json")
      .defer(d3.csv, "data/UNESCO.csv", parseUnesco)
      .await(DataLoaded)

var dispatch = d3.dispatch('countryHover', 'countryLeave');

function parseUnesco(d){ 
    return { 
      'name':(d["name_en"] == " " ? undefined: d["name_en"]),
      'category': (d["category"] == " " ? undefined: d["category"]),
      'country': (d["states_name_en"] == " " ? undefined: d["states_name_en"]),
      'region': d.region_name_en,
      'date': d.date_inscribed,
  };
}

function DataLoaded(err, worldMap_, DataSite_){
  DataSite_.forEach(function(d) {
      var newDate = parseDate(d.date);
      d.newDate = newDate;

var nestedNodes = d3.nest()
    .key(function (d){return d.country; })
    .entries(DataSite_)
    
    var country_total=0;

    nestedNodes.forEach(function(country){
            total = country.values.length
            country.total = total
        })

var data = nestedNodes
        .sort(function(a, b){
        return d3.descending(a.total, b.total)
      })
//console.log(data)//console.log(DataSite_)

//setup(worldMap_, data);

  })
}
//--------------------------------------------------------------



// function setup(worldMap, data){

//   var center = []
//     center = worldMap.features.map(function(d){
//         var centroid = path.centroid(d);
//         if (centroidByCountry.has(d.properties.name) == false) {
//             centroidByCountry.set(d.properties.name, centroid)
//         }
//       return {  country:d.properties.name, 
//                 x0:centroid[0], 
//                 y0:centroid[1], 
//                 x:centroid[0], 
//                 y:centroid[1], 
//                 r:0
//               };
//     }) //center

//       data.forEach(function(country){

//             if (centroidByCountry.get(country.key) != undefined) {
//                 country.x0 = centroidByCountry.get(country.key)[0]
//                 country.x = centroidByCountry.get(country.key)[0]
//                 country.y = centroidByCountry.get(country.key)[1]
//                 country.y0 = centroidByCountry.get(country.key)[1]
//             }
//             if(siteByCountry.has(country.key) == false) {
//               siteByCountry.set(country.key, country.total);  
//               } 

            
//  drawRect(center);

//   })

// }



  




d3.selectAll('.country-list').call(appendCountryList)


  function appendCountryList(selection){

    var countryli = d3.select(".country-list").append('ul');
      countryli.selectAll('li')
      .data(DataSite)
      .enter()
      .append('li').attr('class', 'lst')
      .text(function(d){ return [d.total + '  ' + d.key] })

      .on('mouseover',function(d,i){
          dispatch.countryHover(i);
           console.log(i)
             var values = siteByCountry.get(d.name);
             var tooltip = d3.select(".tooltip")
                .style("visibility","visible")
                    tooltip
                        .select('h2')
                        .html(d.key)  
   
      })
      .on('mouseleave',function(d,i){
        dispatch.countryLeave(i);
      });

    //---------- this is the listener function ------------------//

    dispatch.on('countryHover.'+selection, function(index){
    //  console.log(countryli)
      selected = countryli.selectAll('.lst').filter(function(d,i) { 
        return i == index; 
      })
      // selectedname = siteli.selectAll('.sitelst').filter(function(d,i){
      //   return i==index;
      // }) 
      selected.style('color','red');
    //  selectedname.style('visibility', 'visible');
    });



    dispatch.on('countryLeave', function(index){
      selected = countryli.selectAll('.lst').filter(function(d,i) { 
        return i == index; 
      });
      selected.style('color',null);
      // selectedname.style('visibility', 'hidden');
    });
  }



// } 
// function drawRect(center){
//       var nodes = svg.selectAll('.countries')
//             .data(center);
//         var nodesEnter = nodes.enter()
//             .append('g')
//             .attr('class','countries')
//             .attr('opacity', 0)      
//         nodes.exit().remove();  
//         nodes
//             .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')';})
//             .attr('opacity', .1)
//         nodes.append('rect')
//             .attr('x', function(d){ return 0 }).attr('y', function(d){ return 0 })
//             .attr("width", function(d){
//               var values = siteByCountry.get(d.country);

            
//              if (values>=0) {return scaleR(values);} else { return scaleR(0);}
//              })
//                .attr("height", function(d){
//               var values = siteByCountry.get(d.country);

//               if (values>=0) { return scaleR(values); } else { return scaleR(0); }              
//               })
//             .on("mousemove", function(d,i){
//             //make broadcast function using index? to match d.key of list
//          //   console.log(i, d.country);

//              var values = siteByCountry.get(d.country);
//              var tooltip = d3.select(".tooltip")
//                 .style("visibility","visible")
//                     tooltip
//                         .select('h2')
//                         .html(d.country + "<br> " + values)  
   
//         });
// //---------------------------------------------------------------------------------------
//         force.stop();
//         force.nodes([])
//         force.start();
//         force.nodes(center)
//             .on('tick',onForceTick)
//             .start();

//     function onForceTick(e){
//         var q = d3.geom.quadtree(center),
//             i = 0,
//             n = center.length;
//           while( ++i<n ){
//               q.visit(collide(center[i]));
//           }
//         nodes
//             .each(gravity(e.alpha*.5))
//             .attr('transform',function(d){
//                 return 'translate('+d.x+','+d.y+')';
//             })
// //---------------------------------------custom gravity: data points gravitate towards a straight line
//         function gravity(k){
//             return function(d){
//                 d.y += (d.y0 - d.y)*k;
//                 d.x += (d.x0 - d.x)*k;
//             }
//         } //gravity
//         function collide(dataPoint, center){
//           var values = siteByCountry.get(dataPoint.country);
//           if (values>=0) { var nr = (scaleR(values)/Math.sqrt(2))+ padding} else {var nr = scaleR(0)+ padding;}
//           dataPoint.r = nr 
//             var nx1 = dataPoint.x - nr,
//                 ny1 = dataPoint.y - nr,
//                 nx2 = dataPoint.x + nr,
//                 ny2 = dataPoint.y + nr;

//             return function(quadPoint,x1,y1,x2,y2){
//                 if(quadPoint.point && (quadPoint.point !== dataPoint)){
//                     var x = dataPoint.x - quadPoint.point.x,
//                         y = dataPoint.y - quadPoint.point.y,
//                         l = Math.sqrt(x*x+y*y),
//                         r = nr + quadPoint.point.r + padding;
//                     if(l<r){
//                         l = (l-r)/l*.1;
//                         dataPoint.x -= x*= (l*.05);
//                         dataPoint.y -= y*= (l*.05);
//                         quadPoint.point.x += (x*.25);
//                         quadPoint.point.y += (y*.05);
//                     }
//                 }
//                 return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
//             }
//         } //collide
//       } //onForceTick
// } //draw(center)








