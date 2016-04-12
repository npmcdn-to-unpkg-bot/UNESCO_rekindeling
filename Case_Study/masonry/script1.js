$('.grid').masonry({
  // options
  itemSelector: '.grid-item',
  columnWidth: 200
});



//------------------------------------------------------------------------load data     
queue()
      .defer(d3.csv, "imgData/Palmyra_beforeWar.csv", parseImage)
      .defer(d3.csv, "imgData/Palmyra_inWar.csv", parseImage)
      .await(DataLoaded)

function parseImage(d){ 
    return { 
      'url': d.rgi_image,
      r:10
        };
}
var   gallery = d3.select(".grid").append('svg').attr('width', width).attr('height', height);

function DataLoaded(err, beforeWar, inWar){
    draw(inWar)
      $('#inWar').on('click',function(d){
        d.preventDefault();
        
         d3.selectAll('.nodes').remove()

        draw(inWar)   
    });

      $('#beforeWar').on('click',function(d){
        d.preventDefault();

       d3.selectAll('.nodes').remove()

        draw(beforeWar)

    });
}
//--------------------------------------------------------------



function draw(data){

nodes = gallery.selectAll('.img')
    .data(data);

nodesEnter = nodes
    .enter()
    .append('image')
    .attr('class', 'nodes')
    .attr("xlink:href", function(d){ return d.url })
    .attr('x', 10)
    .attr('y',20
    .attr('width', 100)
    .attr('height', 100);
}
