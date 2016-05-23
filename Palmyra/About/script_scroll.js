//Create scrollController
//Step 1: create a global scroll controller
d3.select("#overview").classed("active", true)



var scrollController = new ScrollMagic.Controller({
		globalSceneOptions:{
		triggerHook:'onLeave'
		}
	});

//Step2: create scenes
var scene1 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-1').clientHeight,
		triggerElement:'#scene-1',
		reverse:true

	})
	.on('enter',function(){
	})
	.on('leave',function(){
	})
	.setClassToggle("#overview", "active")
	.addTo(scrollController);
//-------------------------------------------------------------------------------------
//SECTION 2

var scene2p = new ScrollMagic.Scene({
		duration: .01
	})
	.on('enter', function(){
		d3.select("header").classed("hide", true)
	})
	.setClassToggle("#thelist", "active")
	.setPin("#scene-2")
	.addTo(scrollController);


var scene2 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-2').clientHeight*3,
		triggerElement:'#scene-2',
		reverse:true
	})
	.on('enter', function(){
		d3.select("header").classed("hide", false)
	})
	.setClassToggle("#thelist", "active")
	.setPin("#scene-2")
	.addTo(scrollController);

//--------------------------------------------------------------------------------
//SECTION 3
var scene3p = new ScrollMagic.Scene({
		duration:.1,

	})
		.setPin("#scene-3")
		.setClassToggle("#palmyra", "active")
		.addTo(scrollController);

var scene3 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-3').clientHeight*4,
		triggerElement:'#scene-3',
		reverse:true
	})
	.setPin("#scene-3")
	.setClassToggle("#palmyra", "active")
	.addTo(scrollController);

var timeline = new ScrollMagic.Scene({
		duration:document.getElementById('scene-3').clientHeight*3,
		triggerElement:'#timeline',
		reverse:true
	})
	.setPin("#timeline")
	.setClassToggle("#palmyra", "active")
	.addTo(scrollController);



var scene3p1 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-3p1').clientHeight*1,
		triggerElement:'#scene-3p1',
		reverse:true
	})
	.setPin("#scene-3p1")
	.setClassToggle("#palmyra", "active")
	.addTo(scrollController);




//-------------------------------------------------------------------------------------
var scene4p = new ScrollMagic.Scene({
		duration:.1,
	})
		.setPin("#scene-4")
		.setClassToggle("#project", "active")
		.addTo(scrollController);

var scene4 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-4').clientHeight*1,
		triggerElement:'#scene-4',
		reverse:true
	})
	.setPin("#scene-4")
	.setClassToggle("#project", "active")
	.addTo(scrollController);

// var scene4pp = new ScrollMagic.Scene({
// 		duration:.1,
// 	})
// 		.setPin("#scene-4pp0")
// 		.setClassToggle("#project", "active")
// 		.addTo(scrollController);

// var scene4pp0 = new ScrollMagic.Scene({
// 		duration:document.getElementById('scene-4pp0').clientHeight*1,
// 		triggerElement:'#scene-4pp0',
// 		reverse:true
// 	})

// 	.setPin("#scene-4pp0")
// 	.setClassToggle("#project", "active")
// 	.addTo(scrollController);




// var scene4p0 = new ScrollMagic.Scene({
// 		duration:document.getElementById('scene-4p0').clientHeight*1,
// 		triggerElement:'#scene-4p0',
// 		reverse:true
// 	})

// 	.setPin("#scene-4p0")
// 	.setClassToggle("#project", "active")
// 	.addTo(scrollController);


var scene4p1 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-4p1').clientHeight*5,
		triggerElement:'#scene-4p1',
		reverse:true
	})
	  .on('enter', function(){
	      d3.select('.opac1').transition().delay(1000).duration(document.getElementById('scene-4p1').clientHeight*1.5).style('opacity', 1);
	      // d3.select('.opac2').transition().delay(1000).duration(document.getElementById('scene-4p1').clientHeight*1.5).style('opacity', 1);
	  })
	  .on('leave', function(){
	      d3.select('.opac1').transition().duration(document.getElementById('scene-4p1').clientHeight*1.5).style('opacity', 0);
	      // d3.select('.opac2').transition().duration(document.getElementById('scene-4p1').clientHeight*1.5).style('opacity', 0);
	  })
	.setPin("#scene-4p1")
	.setClassToggle("#project", "active")
	.addTo(scrollController);


var scene5 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-5').clientHeight*1,
		triggerElement:'#scene-5',
		reverse:true
	})
	.setPin("#scene-5")
	.setClassToggle("#protocol", "active")
	.addTo(scrollController);

var scene6 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-6').clientHeight*1.5,
		triggerElement:'#scene-6',
		reverse:true
	})
// .on('enter', function(){
// 	    $('#popup').show();
// } )
	.setPin("#scene-6")
	.setClassToggle("#explore", "active")
	.addTo(scrollController);
