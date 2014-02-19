$(function () {

    App.Views.Search = Backbone.View.extend({


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
        
            this.$el.html(_.template(this.template, this.vars))
            if (searchText != "" || (this.collectionFilter) || (this.subjectFilter) || (this.levelFilter) || (this.languageFilter) || (this.authorName) || (this.mediumFilter) || (this.ratingFilter && this.ratingFilter.length > 0)) {
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
                      // alert('Number of fetched records are Zero')
              

                    } else if (obj.groupresult.models.length < limitofRecords && obj.resultArray.length == 0 && skipStack.length == 1) {
                        $('#not-found').html("No Such Record Exist");
                        $("#selectAllButton").hide()


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
        }

    })

})