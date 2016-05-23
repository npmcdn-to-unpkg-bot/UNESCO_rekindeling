(function() {

var margin = {t:10,l:50,b:10,r:50},
    width  = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b,
    padding = 10;

d3.select('.site_text').classed('hide', true);

var map = d3.select('#canvas-1')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height-margin.t-margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var projection = d3.geo.mercator().translate([width/2.5, height/1.8]).scale(70);
    
var path = d3.geo.path().projection(projection); 
var force = d3.layout.force().size([width,height]).charge(-80).gravity(0);
var scaleR = d3.scale.sqrt().range([0,30]).domain([0,53]);
var SitesByCountry;
var centroidCountry = d3.map();
countCountry = d3.map();
countCountrySorted = d3.map();





function start() {
$("#section-2").hide();
$("#section-3").hide();
init_vis1();
}
window.onload = start;


$(document).ready(function(){
        $("#btn-3").on('click', function(){
        $(".section").hide(); 
        $("#section-1").show();

})});

$(document).ready(function(){
        $("#btn-32").on('click', function(){
        $(".section").hide(); 
        $("#section-1").show();
})});


function init_vis1(){

//------------------------------------------------------------------------load data     



queue()
      .defer(d3.json, "data/countries.geo.json")
      .defer(d3.csv, "data/UNESCO_data.csv", parseUnesco)
      .await(DataLoaded)

var dispatch = d3.dispatch('countryHover', 'countryLeave', 'countryClick', 'siteClick', 'countryNodeClick', 'countryNodeHover', 'countryNodeLeave');

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
      r:10
  };
}


function DataLoaded(err, worldMap_, Sites_){


  CountryLookup = d3.map();
    Sites_.forEach(function(d) {
      CountryLookup.set(d.country_id, d.country)
    })


   setup(worldMap_, Sites_)


}//DataLoaded
///////////////////////////////////////////////////////////////////setup data
function setup(worldMap_, Data){

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
                r:40
              };
    })

  SitesByCountry = d3.nest()
          .key(function (d) { return d.country_id; })
          .map(Data, d3.map);


  SitesByCountry.values().forEach(function(eachCountry){
   // console.log(SitesByCountry.get(eachCountry.country_id).length);
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
  appendCountryList(countCountrySorted); 
  draw(center);
  appendSiteGallery(Data);

}//setup
/////////////////////////////////////////////////////////////////////////////////////////end setup
/////////////////////////////////////////////////////////////////////////////////////////draw map
function draw(center){

      var nodes =map.selectAll('.country_nodes')
            .data(center, function(d){return d.state})
        var nodesEnter = nodes.enter()
            .append('g')
        nodes
            .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')';})
            .attr('opacity', .7)
            .attr('fill', 'rgb(140, 140, 140)')
        nodes.append('circle')
            .attr('data-value', function(d){
              return d.state;
            })
            // .classed('country', true)
            .classed('country_nodes', true)
            .attr("r", function(d){
                  var values = countCountrySorted.get(d.state);
                  if (values>=0) {return scaleR(values); } else { return scaleR(0);}
            })
            .on('mouseover', function(d, i){
                dispatch.countryNodeHover(d);
            })
            .on('mouseleave', function(d, i){
                dispatch.countryNodeLeave(d);
            })
            .on('click', function(d, i){
              d3.selectAll('.country_li').classed('hover', false).classed('myactive', false)
              d3.selectAll('.country_nodes').classed('hover', false).classed('myactive', false)
              d3.selectAll('.sites').classed('hide',true)
        
              dispatch.countryNodeClick(d);

              var site_text= d3.select('.site_text');
                site_text.select('h2')
                    .html('');   
                site_text.select('p')
                    .html('');
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
        function collide(dataPoint, Sites_){

         var values = countCountrySorted.get(dataPoint.state);

          if (values>=0) {

            var nr = (scaleR(values)/Math.sqrt(2))+ padding} else {var nr = scaleR(0)+ padding;}
          
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
                        dataPoint.x -= x*= (l*.02);
                        dataPoint.y -= y*= (l*.02);
                        quadPoint.point.x += (x*.02);
                        quadPoint.point.y += (y*.02);
                    }
                }
                return x1>nx2 || x2<nx1 || y1>ny2 || y2<ny1;
            }
        } //collide
      } //onForceTick
} //draw(center)
////////////////////////////////////////////////////////////////////////////////////////////////////end draw map
////////////////////////////////////////////////////////////////////////////////////////////////////append List
function appendCountryList(Data){

var countryli_ul = d3.select(".country-list1")
      .append('ul');
 var countryli = countryli_ul
      .selectAll('li')
      .data(countCountrySorted.keys())
      .enter()
      .append('li')
      .attr('class', 'country_li')
      // .classed('country', true)
      .classed('lst', true)
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
        d3.selectAll('.country_nodes').classed('hover', false).classed('myactive', false)
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
toggleItem(document.querySelectorAll('.country_li'));
toggleItem(document.querySelectorAll('.sites'));
toggleItem(document.querySelectorAll('.country_nodes'));
toggleItem(document.querySelectorAll('.sites'));
///////////////////////////////////////////toggle end////////////////
}

dispatch.on('countryHover', function(countryName){

   countrySelect = d3.selectAll('.country_nodes').filter(function(d){ 
      return d.state == countryName
   })
   countrySelect.classed('hover', true)
    countryLiSelect = d3.selectAll('.country_li').filter(function(d){ 
      return d == countryName
    })
    countryLiSelect.classed('hover', true)
    d3.select('.site_text').classed('hide', true);
    d3.selectAll(".sites").classed('myactive', false);
});

dispatch.on('countryLeave', function(countryName){
    countrySelect = d3.selectAll('.country_nodes').filter(function(d){
      return d.state == countryName;
    })
    countrySelect.classed('hover', false)
    countryLiSelect = d3.selectAll('.country_li').filter(function(d){ 
      return d == countryName
    })
    countryLiSelect.classed('hover', false)
});



dispatch.on('countryClick', function(countryName){
    countrySelect = d3.selectAll('.country_nodes').filter(function(d){
      return d.state == countryName;
    })
    countrySelect.classed('myactive', true)

    countrySelectSite = d3.selectAll('.sites').filter(function(d){
      return d.country_id == countryName;
    })
    countrySelectSite.classed('hide', false)
});


dispatch.on('countryNodeClick', function(countryName){
    countrySelect = d3.selectAll('.country_nodes').filter(function(d){
      return d == countryName;
    })
    countrySelect.classed('myactive', true)


    countryLiSelect = d3.selectAll('.country_li').filter(function(d){
      console.log(CountryLookup.get(d) == CountryLookup.get(countryName.state))

      return  CountryLookup.get(d) == CountryLookup.get(countryName.state);
    })
    countryLiSelect.classed('myactive', true)



    countrySelectSite = d3.selectAll('.sites').filter(function(d){
      return CountryLookup.get(d.country_id) == CountryLookup.get(countryName.state);
    })
    countrySelectSite.classed('hide', false)
});

dispatch.on('countryNodeHover', function(countryName){
    countrySelect = d3.selectAll('.country_nodes').filter(function(d){
      return d == countryName;
    })
    countrySelect.classed('hover', true)


    countryLiSelect = d3.selectAll('.country_li').filter(function(d){
      console.log(CountryLookup.get(d) == CountryLookup.get(countryName.state))

      return  CountryLookup.get(d) == CountryLookup.get(countryName.state);
    })
    countryLiSelect.classed('hover', true)
});

dispatch.on('countryNodeLeave', function(countryName){
    countrySelect = d3.selectAll('.country_nodes').filter(function(d){
      return d == countryName;
    })
    countrySelect.classed('hover', false)


    countryLiSelect = d3.selectAll('.country_li').filter(function(d){
      console.log(CountryLookup.get(d) == CountryLookup.get(countryName.state))

      return  CountryLookup.get(d) == CountryLookup.get(countryName.state);
    })
    countryLiSelect.classed('hover', false)
});

function appendSiteGallery(Data){

 var site_gallery = d3.select('.site_img');
    var sites = site_gallery.selectAll('.sites');
    sites
        .data(Data)
        .enter()
        .append('img')
        .attr('src', function(d){ return d.url})
        .classed({'sites': true})
        .classed('hide', true)
        .on('click', site_click);



}
///////////////////////////////////////////toggle///////////////////
function site_click(d, i){
var imageSelect = d3.selectAll(".sites").classed('myactive', false);
  var site_text= d3.select('.site_text').classed('hide', false);
    site_text.select('h2')
        .html(d.name)     
    site_text.select('p')
        .html(d.desc)   


var imageSelect = d3.select(this).classed('myactive', true);

}

}

}).call(this);




