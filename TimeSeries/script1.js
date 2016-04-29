var margin = {t:120,l:50,b:50,r:50},
    w  = $('.map').width()-margin.l-margin.r,
    h = $('.map').height()-margin.t-margin.b,
    padding = 10;

queue()
      // .defer(d3.json, "data/countries.geo.json")
      .defer(d3.csv, "data/UNESCO_data.csv", parseUnesco)
      .await(dataLoaded)

var globalDispatcher = d3.dispatch('countrychange', 'categorychange');
var parseDate = d3.time.format("%Y").parse;
function dataLoaded(err,rows){



    rows.forEach(function(d) {
        var newDate = parseDate(d.date);
        d.newDate = newDate;
    });




    d3.select('.country-list').on('click',function(){
        console.log(this)
        globalDispatcher.countrychange(this.value);

    });
    // d3.selectAll('.category').on('click',function(){
    //     globalDispatcher.categorychange(d3.select(this).attr('id'));
    // })

    //create nested hierarchy based on stations
    var SitesByCountry = d3.nest()
        .key(function(d){return d.country_id})
        .map(rows,d3.map);

console.log(SitesByCountry)
var countryli_ul = d3.select(".country-list")
      .append('ul');
    countryli = countryli_ul
      .selectAll('li')
      .data(SitesByCountry.keys())
      .enter()
      .append('li')
      .text(function(d){ 
        return  d;
      })
      .attr('id', function(d){
        return SitesByCoutry.get(d.country)
      })

// var list = d3.select(".country-list")
//     .append('select')
//     .selectAll('select')
//     .data(SitesByCountry.keys())
//     .enter()
//     .append('option')
//     .html(function(d){ 
//     return  d;
//     })
//       .attr('value', function(d){
//         return d
//       })


    var timeSeries = d3.timeSeries()
        .width(w)
        .height(h)
        .timeRange([new Date(1970, 1, 01),new Date(2015, 1, 01)])
        .value(function(d){ return d.newDate; })
        .maxY(30)
        .binSize(d3.time.year);

    var plots = d3.select('.map')
        .datum(SitesByCountry.get('afg'))
        .call(timeSeries);

    globalDispatcher.on('countrychange',function(d){
        plots.datum(SitesByCountry.get(d))
            .call(timeSeries);
    });
    // globalDispatcher.on('intervalchange',function(int){
    //     var interval = int=='d'?d3.time.day:d3.time.week;
    //     timeSeriesModule.binSize(interval);
    //     plots.call(timeSeries)
    // })


}

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
      'country_id': d.udnp_code
  };
}


