var imagesLoaded = false;
// const LEFT_POSITIONS = { min: "-120%", max: "-100%" };
// const CENTER_POSITIONS = { min: "-80%", max: "-60%" };
// const RIGHT_POSITIONS = { min: }

$(document).ready(function() {
  var imageSection = $("#play");
  var imageGrid = $(".insta-polaroid-container");
  
  var fadeInImages = function() {
    if (imagesLoaded) {    
      // fade in images in a random order
      $(".insta-polaroid").each(function(_index, containerEl) {
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
    url: "https://us-west2-sanguine-link-226918.cloudfunctions.net/recent-instagram-posts-v2?getPosts=true",
    success: function(response) {
      var posts = response["posts"].slice(0, 3);
      
      $.each(posts, function(_index, post) {     
        var instaPolaroid = $(`<a class="insta-polaroid" href="${post["url"]}">`)
        var imageContainer = $(`<div class="photo">`);
        var label = $(`<div class="label">`);

        label.text(`${post["caption"].substring(0, 45)}...`);
        imageContainer.html(`<img src="${post["image"]}"></img>`);
        instaPolaroid.append(imageContainer);
        instaPolaroid.append(label);

        imageGrid.append(instaPolaroid);
      });

      imageGrid.children(".loading").remove();
      imagesLoaded = true;
    },
    error: function(_response) {
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
    var scrollTriggerHeight = imageSection.offset().top + imageSection.outerHeight() - $(window).height() - 600;
  
    if ($(this).scrollTop() > scrollTriggerHeight) {
      fadeInImages();
    }
  });

  // set up clothesline
  $(".polaroid").hover(function() {
    var images = $(this).children(".photo").children("img");
    images.filter(".still").hide();
    images.filter(".moving").show();
  }, function() {
    var images = $(this).children(".photo").children("img");
    var movingImg = images.filter(".moving");
    
    // reload the "moving" image gif so it 
    // always starts at the beginning on hover
    movingImg.attr('src', movingImg.attr("src"));
    movingImg.hide();

    images.filter(".still").show()
  })
});
