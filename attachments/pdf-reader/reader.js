	var pages = [];
// Sorting on numbers extracting from attachment names 1,2,3 from page-1,page-2,page-3
	function mySort(arr) {
		var regex = /page\-([0-9]+)/;

		function map(str) {
			return Number(regex.exec(str)[1]);
		}

		return arr
			.sort(
				function (a, b) {
					var av = map(a),
						bv = map(b);
					return av < bv ? -1 : av > bv ? 1 : 0;
				})
	}

	(function ($) {

		var url = $.url()

		var file = url.param("doc")
		var docId = file
		if (file == undefined) {
			file = $(location).attr('href');
			console.log(file)
		}
		if (file.indexOf('/') != -1) {
			var vars = file.split('/')
			docId = vars[2]

		}

		var dbName = 'resources'


		// @todo If there is not doc defined, show a dialog for giving us a doc ID.
		if (!docId) {
			alert("Document is missing")
		}
		// Get the attached pages from the document in couchdb

		var doc = $.couch.db(dbName).openDoc(docId, {
			success: function (doc) {
				$(".page-number").click(function () {
					$(".go-to").slideDown()
					return false
				})



				// Only put files in the pages directory into the pages array
				$.each(doc._attachments, function (key, value) {
					//  console.log(key)
					if (key.indexOf("page-") == 0) {
						pages.push(key)
					}
				})
				//pages.sort()
				mySort(pages)
				console.log(pages)
				$('#page').attr('max', pages.length);
				// Set the "go to library" URL

				$(".to-library").attr('href', "/" + url.segment(1) + "/_design/bell/MyApp/index.html#resources")
				//
				// Display the page
				//
				var thisPage = 0
				if (url.param("page")) {
					thisPage = parseInt(url.param("page"))
				}

				// 				Removed submit_page code and write GoTo page function in app.html
				// 				if(url.param("submit_page")) {
				// 					thisPage = parseInt(url.param("submit_page")) - 1
				// 					alert(thisPage)
				// 				}

				// @todo Setting width to 100% works fine when the image is less than the 
				// screen width but will probably mess up your image if it is greater.
				// In cases where window.width < image.width we'll need to set the viewport
				// so that it rests with the full image width in view on load.  Haven't
				// had any luck making this work as of yet using the meta tags.


				$(".view").append('<img id="book_page" width="100%" src="/' + dbName + '/' + docId + '/' + pages[thisPage] + '">').show("slide", {
					direction: url.param("slide")
				}, 500);

				// Display the page number

				var readPage = thisPage + 1

				// We may have an offset that we want to take into account

				if (doc.start_page) {
					if (doc.start_page > readPage) {
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

				if (thisPage == pages.length) {
					nextPage = 0
				}
				else {
					nextPage = thisPage + 1
				}
				previousPage = thisPage - 1

				// Set the URLs
				if (thisPage >= (pages.length - 1)) {
					$(".next").removeAttr('href');
					$(".next").hover(function () {
						$(this).fadeTo("slow", 0.3);
					});
				}
				else {
					$("a.next").attr("href", url.attr("path") + "?slide=right&page=" + nextPage).click(function () {
//					Ajax conversion testing
// 					$('.view').css('background-image', 'url(ajax-loader.gif)  no-repeat center top;');
// 					var xmlhttp;
// 											if (window.XMLHttpRequest)
// 											  {// code for IE7+, Firefox, Chrome, Opera, Safari
// 											  xmlhttp=new XMLHttpRequest();
// 											  }
// 											else
// 											  {// code for IE6, IE5
// 						 					  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
// 						 					  }
// 						 					xmlhttp.onreadystatechange=function()
// 						 					  {
// 						 					  if (xmlhttp.readyState==4 && xmlhttp.status==200)
// 						 						{
// 						 						//$(".view img").hide("slide", { direction: "left" }, 250);
// 						 	 					$(".page-number").fadeOut(200)
// 						 	 					$('.view').css('background-image', 'none');
// 						 	 					$('img').attr('src', "/" + dbName + "/" + docId + "/" + pages[nextPage])
// 						 	 					nextPage++
// 						 	 					previousPage++
// 						 	 					thisPage++
// 						 	 					$('a.page-number').html("<div class='page'>page</div>" + (thisPage+1) + ' / ' + pages.length)
// 						 	 					$(".page-number").fadeIn(200)
// 						 						}
// 						 					  }
// 						 					xmlhttp.open("GET", "/" + dbName + "/" + docId + "/" + pages[nextPage],true);
// 						 					xmlhttp.send();
						$(".view img").css('visibility','hidden',"slide", {
							direction: "left"
						}, 150);
						$(".page-number").fadeOut(300)
						setTimeout(function () {
							window.location.assign(url.attr("path") + "?slide=right&page=" + nextPage + "&doc=" + docId)
						}, 150)
						return false
					})
				}
				if (thisPage <= 0) {
					$(".previous").removeAttr('href');
					$(".previous").hover(function () {
						$(this).fadeTo("slow", 0.3);
					});
				}
				else {
					$("a.previous").attr("href", url.attr("path") + "?slide=left&page=" + previousPage).click(function () {
						$(".view img").css('visibility','hidden',"slide", {
							direction: "right"
						}, 150);
						$(".page-number").fadeOut(300)
						setTimeout(function () {
							window.location.assign(url.attr("path") + "?slide=left&page=" + previousPage + "&doc=" + docId)
						}, 150)
						return false
					})
				}

				// Cache the next and previous page

				$(".cache").append('<img width="100%" src="/' + dbName + '/' + docId + '/' + pages[previousPage] + '">');
				$(".cache").append('<img width="100%" src="/' + dbName + '/' + docId + '/' + pages[nextPage] + '">');


			}
		})
	})(jQuery);