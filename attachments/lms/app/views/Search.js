$(function () {

    App.Views.Search = Backbone.View.extend({

		events: {
            "click #searchR": "searchResult",
            "click #addRestoPub":"addResourceToPublication"
        },
        template: $('#template-Search').html(),

        vars: {},
        groupresult: null,
        resultArray: null,

        initialize: function () {
            this.groupresult = new App.Collections.SearchResource()
            this.resultArray = []
            enablenext = 0
        },
        render: function () {
            var obj = this
            var collections=new App.Collections.listRCollection()
						   collections.fetch({
							async:false
						  })
			this.vars.tags=collections.toJSON()
            this.vars.addResource=this.addResource
            if(this.Publications!=undefined)
            {
            	
            	this.vars.Publications=this.Publications
            }
            else{
            	this.vars.Publications=false 
            }
            this.$el.html(_.template(this.template, this.vars))
            if (searchText != "" || (this.collectionFilter) || (this.subjectFilter) || (this.levelFilter) || (this.languageFilter) || (this.authorName) || (this.mediumFilter) || (this.ratingFilter && this.ratingFilter.length > 0)) {
               App.startActivityIndicator()
                this.fetchRecords()
            }
            
            
        },

        fetchRecords: function () {
            var obj = this
            this.groupresult.fetch({
                success: function () {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.groupresult.models, searchText))

                    if (enablenext == 0) {
                        $('#next_button').remove()
                    }
                    if (skipStack.length == 1) {
                        $('#previous_button').remove()
                    }

                    if (obj.resultArray.length != searchRecordsPerPage && obj.groupresult.models.length == limitofRecords) {
                        obj.fetchRecords()
                    } else if (obj.groupresult.models.length == 0) {
                        previousPageButtonPressed()
                    } else if (obj.groupresult.models.length < limitofRecords && obj.resultArray.length == 0 && skipStack.length == 1) {
                        $('#not-found').html("No Such Record Exist");
                        $("#selectAllButton").hide()
                        App.stopActivityIndicator()


                    } else {
                   
                        if(obj.addResource==true)
                        {
                           //alert('Add view')
                           obj.addResourceToStepView()
                        }
                        else{
                        
                             // alert('Manage view')
                              obj.ManageResourceView()
                        
                        }
                        App.stopActivityIndicator()

                    }
                }
            })

        },
        addResourceToStepView:function(){
        
         			var obj=this
        			var ResultCollection = new Backbone.Collection();
                        if (obj.resultArray.length > 0) {
                            ResultCollection.set(obj.resultArray)
                            var SearchSpans = new App.Views.SearchSpans({
                                collection: ResultCollection
                            })
                                  
                            SearchSpans.resourceids = obj.resourceids
                            SearchSpans.render()
                            $('#srch').append(SearchSpans.el)

                        }
        
        },
        ManageResourceView:function(){
           
                        var obj=this
                
                    
                        var ResultCollection = new Backbone.Collection();
                    
                        if (obj.resultArray.length > 0) {
                            ResultCollection.set(obj.resultArray)
                            
                    var loggedIn = new App.Models.Member({"_id": $.cookie('Member._id')})
                        loggedIn.fetch({async: false})
                    var roles = loggedIn.get("roles")
                            
                            var SearchSpans = new App.Views.ResourcesTable({
                                collection: ResultCollection
                            })
                            
                            SearchSpans.isManager = roles.indexOf("Manager")
                            
                            SearchSpans.resourceids = obj.resourceids
                            SearchSpans.render()
                            $('#srch').html('<h4>Search Result <a style="float:right" class="btn btn-info" onclick="backtoSearchView()">Back To Search</a></h4>')
                        
                            $('#srch').append(SearchSpans.el)
                        }

                    
        
        },
        checkFilters: function (result) {
        
   	 	   /* 
   	 	    console.log('++++++++++++++')  
        
    	    console.log(this.collectionFilter)  
			console.log(this.subjectFilter)
			console.log(this.levelFilter)
			console.log(this.languageFilter)
			console.log('this is rating filter   '+this.ratingFilter)
			console.log('++++++++++++++') 
			*/
		
		   //console.log(result.get('title'))
		
		    
		    //  if(this.checkCollection(result)==true)
		    //  console.log('check it tag filter is:    '+this.checkCollection(result))
		
			if(!result.get("averageRating"))
			{
				result.set("averageRating",0)
			}
            if (!this.collectionFilter && !this.levelFilter && !this.languageFilter && !this.subjectFilter && this.ratingFilter.length==0 && !this.levelFilter && !this.languageFilter && !this.authorName && !this.mediumFilter) {
                return true
            } 
            else if ((this.checkCollection(result)) || (this.checkSubject(result)) || (this.checkAvgRating(result)) || (this.checkLanguage(result)) || (this.checkLevel(result)) || (this.checkMedium(result)) || (this.checkAuthname(result))) 
        	{
                return true
            }
            return false
        },
        checkMedium:function(row){

        if(!this.mediumFilter)
             return false 
          var medium=row.get('Medium')
          var check=false
          
              if(medium){
                  if(medium==this.mediumFilter)
                    check=true
              }
          return check
        
        },
        checkAuthname:function(row){
        
          if(!this.authorName)
             return false 
          var name=row.get('author')
          var check=false
              if(name){
                 if(name.toLowerCase().indexOf(this.authorName.toLowerCase()) >= 0)
                    check=true
              }
          return check
        },
        checkCollection:function(row){
        
          if(!this.collectionFilter)
             return false 
          var collection=row.get('Tag')
          var check=false
          
          if(collection instanceof Array) 	
			$.each(this.collectionFilter,function(i,val){
			   
				var result=$.inArray(val,collection);
				if(result!=-1)	
				{		
				   check=true
				  return check
                }
			})
        	
          return check
        },
        checkSubject:function(row){
        
          if(!this.subjectFilter)
           return false
           
          var collection=row.get('subject')
          var check=false
          
          if(collection instanceof Array) 	
			$.each(this.subjectFilter,function(i,val){
			   
				var result=$.inArray(val,collection);
				if(result!=-1)	
				{		
				   check=true
				  return check
                }
			})
        	
          return check
        },
        checkAvgRating:function(row){
        
        	if((this.ratingFilter && $.inArray(row.get("averageRating").toString(), this.ratingFilter) > -1))
        	   return true
        	   
            return false;
        },
        checkLanguage:function(row){
        
         if(!this.languageFilter)
             return false 
          var name=row.get('language')
          var check=false
              if(name){
                 if(name.toLowerCase().indexOf(this.languageFilter.toLowerCase()) >= 0)
                    check=true
              }
          return check
          
        },
        checkLevel:function(row){
        
         if(!this.levelFilter)
           return false
           
          var collection=row.get('Level')
          var check=false
    console.log(row)
          if(collection instanceof Array) 	
			$.each(this.levelFilter,function(i,val){
			   
				var result=$.inArray(val,collection);
				if(result!=-1)	
				{		
				  console.log('matched '+row)
				   check=true
				  return check
                }
			})
        	
          return check
        },
        searchInArray: function (resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount
            
                _.each(resourceArray, function (result) {
                    if (result.get("title") != null) {
                        skip++
                        
                         console.log(that.checkFilters(result)+'       '+result.get("title").toLowerCase().indexOf(searchText.toLowerCase()))
                         
                        if (that.checkFilters(result) && result.get("title").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
                            if (resultArray.length < searchRecordsPerPage) {
                            	resultArray.push(result)
                            } else {
                                enablenext = 1
                                skip--
                            }
                        } else if (resultArray.length >= searchRecordsPerPage) {
                            skip--
                        }
                    }
                })
                
            return resultArray
        },
        searchResult: function()
        {
        	skip = 0;
      		popAll();
      		lastpage = false;
            skipStack.push(skip)
           
            var searchText = $("#searchText").val()
            var collectionFilter=new Array()
            var subjectFilter=new Array()
            var levelFilter=new Array()
            var languageFilter=new Array()
            
        collectionFilter=$("#multiselect-collections-search").val()
        subjectFilter=$("#multiselect-subject-search").val()
        levelFilter=$("#multiselect-levels-search").val()
		languageFilter=$("#Language-filter").val()
		authorName=$('#Author-name').val()
		
		mediumFilter=$('#multiselect-medium-search').val()
        console.log(collectionFilter)  
		console.log(subjectFilter)
		console.log(levelFilter)
		console.log(languageFilter)
         
       //  alert(mediumFilter)
         
           $("input[name='star']").each(function () {
                if ($(this).is(":checked")) {
                    ratingFilter.push($(this).val());
                }
            })

            if (searchText != "" || (collectionFilter) || (subjectFilter) ||(levelFilter) || (languageFilter) || (authorName)|| (mediumFilter) || (ratingFilter && ratingFilter.length > 0)) {
              // alert('in search')
            
                $('ul.nav').html($("#template-nav-logged-in").html())
                
               
                
                this.collectionFilter = collectionFilter
                this.languageFilter = languageFilter
                this.levelFilter = levelFilter
                this.subjectFilter = subjectFilter
                this.ratingFilter = ratingFilter
                this.mediumFilter = mediumFilter
                this.authorName = authorName
                
                this.addResource=true
                
                App.$el.children('.body').html(search.el)
                this.render()
                $("#searchText2").val(searchText)
                $("#srch").show()
                $(".row").hide()
                $(".search-bottom-nav").show()
                $(".search-result-header").show()
                $("#selectAllButton").show()
            }
            $('#previous_button').remove()
      		$('#searchText').focus();
      		$("#searchText").val(searchText)
        
        },
        addResourceToPublication:function()
        {
            if (typeof grpId === 'undefined') {
                document.location.href = '../nation/index.html#publication'
            }
            var rids = new Array()
            var publication = new App.Models.Publication({
                "_id": grpId
            })
            publication.fetch({
                async: false
            })
           
			console.log(publication.toJSON())
            $("input[name='result']").each(function () {
                if ($(this).is(":checked")) {
                    var rId = $(this).val();
                    if(publication.get("resources")!=null)
                    {
                    	 rids=publication.get("resources")
                    	if(rids.indexOf(rId)<0)
                        rids.push(rId)
                    }
                    else
                    {
                        rids.push(rId)
                    }
                    
                }
            });
			console.log(rids)
            publication.set("resources", rids)
            publication.save()
            publication.on('sync', function () {
                alert("Your Resources have been added successfully")
                window.location='../nation/index.html#publication'
            })

        
        }

    })

})