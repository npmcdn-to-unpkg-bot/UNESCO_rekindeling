Math.seedrandom('abcde');  // define a fixed random seed, to avoid to have a different layout on each page reload. change the string to randomize
 var pictures = []; // pictures that are already displaced by the layout are pushed into this array
 var svg = d3.select('svg') // obtain a d3 reference to the SVG
 
 d3.layout.picturecloud().size([25, 20])
     .pictures([ // define weight and URL for each of the pictures that have to be displaced
         {weight: 30, url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTYeeVaoc6SLZ1n1ZjEvx7UIGqyGkVUq7BufgfcZkhh0F2vZDyPsg'},
         {weight: 30,  url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTDs6b0kngWRbaXlxjzGJstnXo6LVkdy5DImez-2kJjfmnK5RtRqA'},
         {weight: 20,  url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRkWmRN5PlgrS3-pBZd9KsSQ4dwX7s_49RVSXBH2YiCht_PzZYy'},
         {weight: 60,  url: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS4QASnGmj--rEb5w8-9C65OiY8cRCfG3zPW7TBVYaVqfsl9uQS'},
         {weight: 20,  url: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRTDTRSzhupYjbitgZ2U8ys3Co00kD-7OeflplqmlkQuX8FaLXE'},
         {weight: 20,  url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSrYeNkvDMySkX0lhKWv-JHJOnZqP34SQcvgZzoew2-NNsSI3oAGA'},
         {weight: 20,  url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRYH3pYVfsc0rg0Eh1kvgsx0PDX5oU3DA47acpYrmwNip8DPXmKBA'},
         {weight: 20,  url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTybv8tN2K4fIBZNFV0nOHtx98TJ51st27pjsAJ00sVxHljFEoq'},




         // {weight: 30,  url: ''},
         // {weight: 15,  url: ''},
         // {weight: 7,   url: ''},
         // {weight: 8,   url: ''},
         // {weight: 20,  url: ''},
         // {weight: 64,  url: ''},
         // {weight: 24,  url: ''},
         // {weight: 38,  url: ''}
    ])
     .padding(0.01) // define the minimum distance between pictures
     .on('picture', function(picture, extent) { // whenever a picture is displaced, call this callback
         pictures.push(picture); // store the picture into the global array
         draw(pictures, extent); // call the function that actually draws the picture (more on that below)
     } )
     .start(); // execute the layout
     
 function draw(pictures, extent) {
     svg.selectAll('.picture') // select all elements having the class 'picture'
        .data(pictures) // bind those elements to the global array containing all the pictures that have already been displaced
       .enter().append('image') // for each new picture found, create an SVG image element
        .attr('class', 'picture') // assign the class 'picture' to it
         .attr('xlink:href', function(d) { return d.url; }) // set the source URL for the image
        .attr('width', function(d) { return d.width; }) // set width and height (that have been computed by the layout)
        .attr('height', function(d) { return d.height; })
       .attr('transform', function(d) {
           return 'translate(' + [d.x-d.width/2, d.y-d.height/2] + ')'; // center the image in d.x and d.y (also computed by the layout)
         })
         .attr('opacity','0') // fade in animation
       .transition()
         .duration(600)
         .attr('opacity','1')
 
     // update the SVG viewBox using extent data (provided by the layout)
     svg.transition()
       .duration(600) // animate the update
        .attr('viewBox', extent.left+' '+extent.top+' '+(extent.right-extent.left)+' '+(extent.bottom-extent.top));
 }