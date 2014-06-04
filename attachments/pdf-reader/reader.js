	var pages = [] ;
	(function($) {

		var url = $.url()
	    
	    var file=url.param("doc")
	    var docId=file
	    if(file==undefined){
			file=$(location).attr('href');	    
	    	console.log(file)
	    }
	    if(file.indexOf('/')!=-1){
	      var vars=file.split('/')
	          docId=vars[2]
	        
	    }	    
        
        var dbName='resources'
			
		
		// @todo If there is not doc defined, show a dialog for giving us a doc ID.
			if(!docId){
				alert("Document is missing")
			}
		// Get the attached pages from the document in couchdb

		var doc = $.couch.db(dbName).openDoc(docId, {
              success: function(doc) {
				$(".page-number").click(function() {
					$(".go-to").slideDown()
					return false
				})
				

        		
				// Only put files in the pages directory into the pages array
				$.each(doc._attachments, function (key, value) {
				    //  console.log(key)
				    pages.push(key)
					// if(key.indexOf("pages/") === 0) {
					//	pages.push(key)
					// }
				})
				pages.sort()
				$('#page').attr('max', pages.length);
				// Set the "go to library" URL
				
				$(".to-library").attr('href', "/" +  url.segment(1) + "/_design/bell/MyApp/index.html#resources")
				//
				// Display the page
				//
				var thisPage = 0
				if(url.param("page")) {
					thisPage = parseInt(url.param("page"))
				}
				
// 				Removed submit_page code and write my own code for Go to pages functionality
// 				if(url.param("submit_page")) {
// 					thisPage = parseInt(url.param("submit_page")) - 1
// 					alert(thisPage)
// 				}

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
				$('a.page-number').html("<div class='page'>page</div>" + readPage + ' / ' + pages.length)
				$('a.page-number').fadeIn()

				// Set up the next and previous URLs	
				// Determine next and previous pages
				
				if(thisPage == pages.length) {
					nextPage = 0
				}else {
					nextPage = thisPage + 1
				}
					previousPage = thisPage - 1
				
				// Set the URLs
				if(thisPage>=(pages.length-1)){
				$(".next").removeAttr('href');
				$( ".next" ).hover(function() {
  					 $( this ).fadeTo( "slow", 0.3 );
				});
				}
				else{
				$("a.next").attr("href", url.attr("path") + "?slide=right&page=" + nextPage).click(function() {
					$(".view img").hide("slide", { direction: "left" }, 250);
					$(".page-number").fadeOut(300)
					setTimeout(function(){window.location.assign(url.attr("path") + "?slide=right&page=" + nextPage + "&doc=" + docId)},300)
					return false
				})
				}
				if(thisPage<=0){
				$(".previous").removeAttr('href');
				$( ".previous" ).hover(function() {
  					 $( this ).fadeTo( "slow", 0.3 );
				});
				}
				else{
					$("a.previous").attr("href", url.attr("path") + "?slide=left&page=" + previousPage).click(function() {
					$(".view img").hide("slide", { direction: "right" }, 250);
					$(".page-number").fadeOut(750)
					setTimeout(function(){window.location.assign(url.attr("path") + "?slide=left&page=" + previousPage + "&doc=" + docId)},300)
					return false
				})
				}
				
				// Cache the next and previous page
				
				$(".cache").append('<img width="100%" src="/' + dbName+ '/' + docId + '/' + pages[previousPage] + '">');
				$(".cache").append('<img width="100%" src="/' + dbName + '/' + docId + '/' + pages[nextPage] + '">');


			  }
            })
	})(jQuery);