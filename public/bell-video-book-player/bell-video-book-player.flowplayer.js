

$(function() {
// var resource_url = $.url().fparam("url")
var resource_url = 'example-book/kevins-birthday.webmsd.webm.cuepoints.json' ; 
var video_url = 'example-book/kevins-birthday.webmsd.webm';
 // Get the cuepoints JSON file for this video file @todo If the metadata doesn't exist, set up
 // some sensible defaults to fall back on.
 $.getJSON(resource_url , function(data) {

    // Set the size of the player for the user's screen
    // setInterval(function() { using an interval doesn't work as well as you would expect...
      var aspectRatio = data.width / data.height
      var dimensions = findOptimalResolutionForScreen(aspectRatio)
      $('.player').width(dimensions.width)
      $('.player').height(dimensions.height)
    // }, 1000)

    // Set the video
    $(".player video").html("<source type='video/webm' src='" + video_url + "'/>")

    // Set page turn cuepoints for flowplayer
    $(".player").attr("data-cuepoints", JSON.stringify(data))

    // Initialize the player
    var player = $(".player").flowplayer({"generate_cuepoints": true});
    
  })
 
});

/*
 * http://flowplayer.org/docs/api.html
 * Flowplayer hook
 */
flowplayer(function(api, root) {
 
  // when a new video is about to be loaded
  api.bind("cuepoint", function(e, api, cuepoint) {

    console.log(cuepoint)

    var destinationPage = cuepoint.index, 
      nextPage, 
      previousPage
    ;

    var lastPage = -1
    $(".video-reader-pager .fp-cuepoint").each(function() {
      lastPage++
    })

    // Depending on what page we are on will affect what is the next and previous
    // pages.
    if(destinationPage > lastPage) {
      // Go back to the beginning
      destinationPage = 0
      currentPage = 0
      nextPage = 1
      previousPage = lastPage
    }
    else if (destinationPage < 0) {
      // Go to the last page
      destinationPage = lastPage
      currentPage = lastPage
      nextPage = 0
      previousPage = lastPage - 1
    }
    else if (destinationPage < lastPage)  {
      // proceed 
      nextPage = destinationPage + 1
      currentPage = destinationPage
      previousPage = destinationPage - 1
    }

    // Clear the pager
    $(".fp-cuepoint").text("")
    $(".fp-cuepoint").removeClass("previous-page")
    $(".fp-cuepoint").removeClass("next-page")
    $(".fp-cuepoint").removeClass("current-page")

    // Set the links
     $(".fp-cuepoint" + lastPage).text("<").addClass("previous-page")
    $(".fp-cuepoint" + currentPage).html("<div class='page-number'>Page <h2>" + (currentPage + 1 + "</h2></div>")).addClass("current-page")
    $(".fp-cuepoint" + (currentPage + 1)).text(">").addClass("next-page")

  // when a video is loaded and ready to play
  }).bind("ready", function() {

    /*
     * Build out the pager
     */

    // Add Page Numbers for the cuepoints
    var currentPage = 0
    var lastPage = -1
    $(".video-reader-pager .fp-cuepoint").each(function() {
      lastPage++
    })

    $(".fp-cuepoint" + lastPage).text("<").addClass("previous-page")
    $(".fp-cuepoint" + currentPage).html("<div class='page-number'>Page <h2>" + (currentPage + 1 + "</h2></div>")).addClass("current-page")
    $(".fp-cuepoint" + (currentPage + 1)).text(">").addClass("next-page")

  });
 
});
