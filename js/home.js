const TOP_POS_RANGE = { min: -25, max: 25 };
const TAPE_CLASSES = { 1: "right", 2: "center", 3: "left" };
const WASHI_VARIETIES = 20;
const LABEL_WORD_LIMIT = 6;
const LAST_WORD_REGEX = new RegExp(/\d|\w+\.{1}/);
var imagesLoaded = false;

$(document).ready(function() {
  setUpInstagramGrid();
  setUpClothesline();
});

function setUpClothesline() {
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

    images.filter(".still").show();
  });
}

function setUpInstagramGrid() {
  var imageSection = $("#play");
  var imageGrid = $(".insta-polaroid-container");
  
  // start loading instagram images as soon as page loads
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://us-west2-sanguine-link-226918.cloudfunctions.net/recent-instagram-posts-v2?getPosts=true",
    success: function(response) {
      var posts = response["posts"].slice(0, 12);
      var postCount = 0
      var rowOffset = 250;
      var postsPerRow = 3
      
      $.each(posts, function(_index, post) {   
        var instaPolaroid = $(`<a class="insta-polaroid" href="${post["url"]}">`)
        var imageContainer = $(`<div class="photo">`);
        var label = $(`<div class="label">`);

        label.text(buildLabelText(post["caption"]));
        imageContainer.html(`<img src="${post["image"]}"></img>`);
        instaPolaroid.append(imageContainer);
        instaPolaroid.append(label);
        instaPolaroid.addClass(getTapeClasses());
        instaPolaroid.css(getPolaroidCss());
        
        imageGrid.append(instaPolaroid);
        postCount++; 
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
}

function fadeInImages() {
  if (imagesLoaded) {    
    // fade in images in a random order
    $(".insta-polaroid").each(function(_index, containerEl) {
      setTimeout(function() { $(containerEl).animate({ opacity: 1 }, 1000); }, Math.floor(Math.random() * 1501) + 150);
    });
  } else {
    setTimeout(fadeInImages, 200);
  }
}

function getPolaroidCss() {
  var marginVal = getRandoIntInRange(TOP_POS_RANGE.min, TOP_POS_RANGE.max);

  return {
    "margin-top": `${marginVal}px`
  }
}

function getTapeClasses() { 
  var washiClass = `washi-${getRandoIntInRange(1, WASHI_VARIETIES)}`;
  var tapeClass = "";
  switch(getRandoIntInRange(1, 3)) {
    case 1:
      tapeClass = "tape-right";
      break;
    case 2:
      tapeClass = "tape-center";
      break;
    case 3:
      tapeClass = "tape-left";
      break;
  }

  return [tapeClass, washiClass];
}

function buildLabelText(label) {
  var labelWords = label.split(" ");
  var newLabel = labelWords.slice(0, LABEL_WORD_LIMIT).join(" ");

  if (!LAST_WORD_REGEX.test(newLabel)) {
    newLabel += "...";
  }

  return newLabel;
}

function getRandoIntInRange(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}
