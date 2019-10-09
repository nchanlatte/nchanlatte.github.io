$(document).ready(function() {
  var data = {
    gallery: [
      {
        title: "Japan",
        img: (src = "./images/japan.jpg"),
        alt: "lorem"
      },
      {
        title: "India",
        img: (src = "./images/taj.jpg"),
        alt: "lorem"
      },
      {
        title: "Spain",
        img: (src = "./images/barc.jpg"),
        alt: "lorem"
      },
      {
        title: "Italy",
        img: (src = "./images/rome.jpg"),
        alt: "lorem"
      },
      {
        title: "NYC",
        img: (src = "./images/nyc.jpg"),
        alt: "lorem"
      },
      {
        title: "Korea",
        img: (src = "./images/korea.jpg"),
        alt: "lorem"
      },
      {
        title: "Montouk",
        img: (src = "./images/montok.jpg"),
        alt: "lorem"
      },
      {
        title: "Miami",
        img: (src = "./images/miami.jpg"),
        alt: "lorem"
      },
      {
        title: "San Francisco",
        img: (src = "./images/IMG_20190324_104238.jpg"),
        alt: "lorem"
      },
      {
        title: "Belgium",
        img: (src = "./images/belgium.jpg"),
        alt: "lorem"
      },
      {
        title: "Iceland",
        img: (src = "./images/IMG_20190913_192053.jpg"),
        alt: "lorem"
      }
    ]
  };

  var source = $("#template").html();
  var template = Handlebars.compile(source);
  $("#content").html(template(data));
});

$(window).load(function() {
  var $items = $(".item");
  $items.on({
    mousemove: function(e) {
      var $that = $(this);
      $that.find(".overflow > img").velocity(
        {
          translateZ: 0,
          translateX: Math.floor(
            e.pageX - $that.offset().left - $that.width() / 2
          ),
          translateY: Math.floor(
            e.pageY - $that.offset().top - $that.height() / 2
          ),
          scale: "2"
        },
        {
          duration: 400,
          easing: "linear",
          queue: false
        }
      );
    },
    mouseleave: function() {
      $(this)
        .find(".overflow > img")
        .velocity(
          {
            translateZ: 0,
            translateX: 0,
            translateY: 0,
            scale: "1"
          },
          {
            duration: 1000,
            easing: "easeOutSine",
            queue: false
          }
        );
    }
  });
});
