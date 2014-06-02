	(function($) {

		var url = $.url()
	    
	    var file=url.param("doc")
	    var docId=file
	    
	    if(file.indexOf('/')!=-1){
	      var vars=file.split('/')
	          docId=vars[2]
	    }	    
        
        var dbName='resources'
			
		
		// @todo If there is not doc defined, show a dialog for giving us a doc ID.

		// Get the attached pages from the document in couchdb

		var doc = $.couch.db(dbName).openDoc(docId, {
              success: function(doc) {
				$(".page-number").click(function() {
					$(".go-to").slideDown()
					return false
				})
				
				// Set the "go to library" URL
				
				$(".to-library").attr('href', "/" +  url.segment(1) + "/_design/bell/MyApp/index.html#resources")

        		var pages = [] 
				// Only put files in the pages directory into the pages array
				$.each(doc._attachments, function (key, value) {
				    //  console.log(key)
				    pages.push(key)
					// if(key.indexOf("pages/") === 0) {
					//	pages.push(key)
					// }
				})
				pages.sort()

				//
				// Display the page
				//
				var thisPage = 0
				if(url.param("page")) {
					thisPage = parseInt(url.param("page"))
				}
				if(url.param("submit_page")) {
					thisPage = parseInt(url.param("submit_page")) - 1
				}

				// @todo Setting width to 100% works fine when the image is less than the 
				// screen width but will probably mess up your image if it is greater.
				// In cases where window.width < image.width we'll need to set the viewport
				// so that it rests with the full image width in view on load.  Haven't
				// had any luck making this work as of yet using the meta tags.
				
				
				$(".view").hide().html('<img width="100%" src="/' + dbName + '/' + docId + '/' + pages[thisPage] + '">').show("slide", { direction: url.param("slide") }, 500);
				setTimeout(function() {
					var newHeight = $(".view img").height()
					$(".view").height(newHeight)
				}, 600)

				// Display the page number
				
				var readPage = thisPage + 1

				// We may have an offset that we want to take into account
				
				if (doc.start_page) {
					if(doc.start_page > readPage) {
						// @todo Create a Roman Numeral
					}
					else {
						readPage = readPage - doc.start_page
					}
				}
				$('a.page-number').hide()
				$('a.page-number').html("<div class='page'>page</div>" + readPage)
				$('a.page-number').fadeIn()

				// Set up the next and previous URLs	
				// Determine next and previous pages
				
				if(thisPage == pages.length) {
					nextPage = 0
				}else {
					nextPage = thisPage + 1
				}

				if(thisPage == 0) {
					previousPage = pages.length
				}else {
					previousPage = thisPage - 1
				}
				
				// Set the URLs
				
				$("a.next").attr("href", url.attr("path") + "?slide=right&page=" + nextPage).click(function() {
					$(".view img").hide("slide", { direction: "left" }, 250);
					$(".page-number").fadeOut(300)
					setTimeout(function(){window.location.assign(url.attr("path") + "?slide=right&page=" + nextPage + "&doc=" + docId)},300)
					return false
				})
				$("a.previous").attr("href", url.attr("path") + "?slide=left&page=" + previousPage).click(function() {
					$(".view img").hide("slide", { direction: "right" }, 250);
					$(".page-number").fadeOut(750)
					setTimeout(function(){window.location.assign(url.attr("path") + "?slide=left&page=" + previousPage + "&doc=" + docId)},300)
					return false
				})

				// Cache the next and previous page
				
				$(".cache").append('<img width="100%" src="/' + dbName+ '/' + docId + '/' + pages[previousPage] + '">');
				$(".cache").append('<img width="100%" src="/' + dbName + '/' + docId + '/' + pages[nextPage] + '">');


			  }
            })
	})(jQuery);