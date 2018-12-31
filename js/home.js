var imagesLoaded = false;

$(document).ready(function() {
  var imageSection = $("#play");
  var imageGrid = $(".instagram-grid");
  
  // load instagram images when section is first scrolled into view
  $(window).scroll(function() {
    if (imagesLoaded) { return; }

    var scrollTriggerHeight = imageSection.offset().top + imageSection.outerHeight() - $(window).height() -400;
  
    if ($(this).scrollTop() > scrollTriggerHeight) {
      imagesLoaded = true;

      $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://us-central1-sanguine-link-226918.cloudfunctions.net/recent-instagram-posts",
        success: function(response) {
          var posts = response["posts"].slice(0, 12);

          imageGrid.show();
          
          $.each(posts, function(_index, post) {     
            var imageHtml = "<img src='" + post["image"] + "'></img>"
            var imageLink = "<div class='image-container'><a href='" + post["url"] + "'>" + imageHtml + "</a></div>";
            imageGrid.append($(imageLink));
          });
        },
        error: function(response) {
          var iframe = "<iframe width='560' height='315' src='https://www.youtube.com/embed/0IagRZBvLtw' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
          imageSection.children(".section-content-wrapper").append($(iframe));
        }
      });
    }
  });

  // set up slide carousel
  $(".slide-carousel").slick({ infinite: false });
});