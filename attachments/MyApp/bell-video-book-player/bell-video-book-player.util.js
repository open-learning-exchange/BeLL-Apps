

  var findOptimalResolutionForScreen = function(aspectRatio) {
    var widthAtMaxHeight = window.innerHeight * aspectRatio 
    var heightAtMaxWidth = window.innerWidth / aspectRatio

    // If the width fits with max height, use that max height, otherwise 
    // it fits better with max width.
    if (widthAtMaxHeight < window.innerWidth) {
      return {"height": window.innerHeight - 100, "width": widthAtMaxHeight}
    }
    else {
      return {"height": heightAtMaxWidth - 100, "width": window.width}
    }

  }
