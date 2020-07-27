particlesJS.load('page-bg', '/static/particles.json', function() {});
$(window).on('load', function() {
  var cnt = 0;
  $('.anim-item').each(function() {
    var it = $(this)
    setTimeout(function() {
      it.css('opacity', 1);
    }, cnt * 300);
    cnt++;
  })
});