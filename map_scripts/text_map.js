(function() {

var pm = {t:0,r:10,b:0,l:65},
    p_w = $('#text_map').width(),
    p_h = $('#text_map').height();


var text_map = d3.select('#text_map')
    .append('svg')
    .attr('class', "text")
    .attr('width',p_w+pm.l+pm.r)
    .attr('height',p_h+pm.t+pm.b)
    .append('g')
    .attr('transform','translate('+pm.l+','+pm.t+')');


var color =  d3.scale.ordinal().domain([0, 24]).range(["#2B5189","#DD5846","#91A357", "#gg44ys", "#2B5189","#DD5846","#91A357", "#gg44ys","#2B5189","#DD5846","#91A357", "#gg44ys" , "#DD5846","#91A357", "#gg44ys", "#2B5189","#DD5846","#91A357", "#gg44ys","#2B5189","#DD5846","#91A357", "#gg44ys", "#e6e6e6" ]);
var text_color = d3.scale.sqrt().domain([0, 110]).range(["#e2e2e2","#a2a2a2"]);
var text_size = d3.scale.sqrt().domain([0, 110]).range([7,20]);

function draw_textmap(industry) {

var nestedNodes = d3.nest()
    .key(function (d){return d.industry; })
    .entries(industry)
    
    var sum_total=0;

    nestedNodes.forEach(function(industry){
            total = industry.values.length
            industry.total = total
            sum_total += industry.total
        })

var text_data = nestedNodes
        .sort(function(a, b){
        return d3.descending(a.total, b.total)})


text_data = nestedNodes.map(function (d){
    return {
        name: d.key,
        value: d.total    
    }


})

console.log("ext_data", text_data)

text_map.selectAll("texts")
    .data(text_data)
    .enter()
    .append("text")
    .attr("dy", function(d, i) {
                    return (i * 20) + 42
                })
    .attr("dx", 0)
    .style("font-size", function(d){ return text_size(d.value) })
    .attr("class", "industry")
    .text(function(d) { return [d.value, d.name];})
    .style("fill", function(d){return text_color(d.value) });


}


//---------------------------------------------------------------------
function dataLoaded(err, industry) {
    if (err) console.error(err);


    console.log(industry);
    draw_textmap(industry);
}
//-----------------------------------------------------------QUEUE
queue()

.defer(d3.csv, "./data/survey.csv", parse)
.await(dataLoaded)

function parse(d){
    return {
        lat: (+d["LocationLatitude"] == "#NULL!" ? undefined: +d["LocationLatitude"]),
        lng: (+d["LocationLongitude"] == "#NULL!" ? undefined: +d["LocationLongitude"]),
        industry: (d["INDUSTRY"] == "#NULL!" ? undefined: d["INDUSTRY"]),
        lngLat: [+d.LocationLongitude, +d.LocationLatitude]
        }
}

}).call(this);