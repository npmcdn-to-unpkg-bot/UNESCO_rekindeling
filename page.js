$(function() {
        $(".site_img").mousewheel(function(event,delta) {
            this.scrollLeft -= (delta * 30);

            event.preventDefault();
        })
    })





function start() {

    $("#section-2").hide();
    $("#capt-2").hide();
}
window.onload = start;




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
toggleItem(document.querySelectorAll('.navi.tog'));


//////////////// end //////////////////////////////
////////////////page 2//////////////////////////////

$(document).ready(function(){
    $("#btn-1").on('click', function(){
        $(".section").hide(); 
        $("#section-1").show();
        $(".capt").hide(); 
        $("#capt-1").show();

    })});
//////////////// end //////////////////////////////
////////////////page 3//////////////////////////////

$(document).ready(function(){
    $("#btn-2").on('click', function(){
    $(".section").hide(); 
    $("#section-2").show();
    $(".capt").hide(); 
    $("#capt-2").show();

    })}); 



$(document).ready(function(){
    $("#btn-3").on('click', function(){
        window.location.href='Palmyra/home.html';

})}); 



      // you can use just jquery for this
      $(document).ready(function(){
         // $('.container').fadeIn(500,function(){
          $('#popup').show();
         // });
 
      });

     $("#popup").on('click', function() {
        $('#popup').hide();

     });