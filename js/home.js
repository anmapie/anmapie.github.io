var imagesLoaded = false;

$(document).ready(function() {
  var imageSection = $("#play");
  var imageGrid = $(".instagram-grid");
  
  var fadeInImages = function() {
    if (imagesLoaded) {    
      // fade in images in a random order
      $(".image-container").each(function(_index, containerEl) {
        setTimeout(function() { $(containerEl).animate({ opacity: 1 }, 1000); }, Math.floor(Math.random() * 1501) + 150);
      });
    } else {
      setTimeout(fadeInImages, 200);
    }
  }

  // start loading instagram images as soon as page loads
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://us-central1-sanguine-link-226918.cloudfunctions.net/recent-instagram-posts",
    success: function(response) {
      var posts = response["posts"].slice(0, 12);
      
      $.each(posts, function(_index, post) {     
        var imageHtml = "<img src='" + post["image"] + "'></img>"
        var imageLink = $("<div class='image-container'><a href='" + post["url"] + "'>" + imageHtml + "</a></div>");
       
        imageGrid.append(imageLink);
        imageGrid.children(".loading").remove();
        imagesLoaded = true;
      });
    },
    error: function(response) {
      imageGrid.hide();

      var iframe = "<iframe width='560' height='315' src='https://www.youtube.com/embed/0IagRZBvLtw' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
      imageSection.children(".section-content-wrapper").append($(iframe));
    }
  });

  // check if the instagram section is already visible on load + fade in images
  if (imageSection.offset().top <= $(window).height()) {
    fadeInImages();
  }

  // otherwise, fade in images when instagram section is scrolled into view
  $(window).scroll(function() {
    var scrollTriggerHeight = imageSection.offset().top + imageSection.outerHeight() - $(window).height() - 400;
  
    if ($(this).scrollTop() > scrollTriggerHeight) {
      fadeInImages();
    }
  });

  // set up slide carousel
  $(".slide-carousel").slick({ infinite: false });
});
