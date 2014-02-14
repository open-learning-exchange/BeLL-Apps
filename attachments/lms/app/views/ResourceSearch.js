$(function () {

    App.Views.ResourceSearch = Backbone.View.extend({


        template: $('#template-Search').html(),
        type:'',
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
            //this.$el.html(_.template(this.template, this.vars))
            //this.searchText = $("#searchText").val()
            //alert(searchText)
            
            this.type=searchType.toLowerCase()
            
            if (searchText != "") {
                this.fetchRecords()
            }
        },

        fetchRecords: function () {
            var obj = this
            this.groupresult.fetch({
                success: function () {
                
            
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.groupresult.models, searchText))
                
					console.log("result"+obj.groupresult.models.length)

                    if (obj.resultArray.length != searchRecordsPerPage && obj.groupresult.models.length == limitofRecords) {
                        obj.fetchRecords()
                    } else if (obj.groupresult.models.length == 0) {
                        previousPageButtonPressed()
                         obj.appnedResult()

                    } else if (obj.groupresult.models.length < limitofRecords && obj.resultArray.length == 0 && skipStack.length == 1) {
                        $('.body').html("No Such Record Exist");
                        $("#selectAllButton").hide()
                       alert('no record found')

                    } else {
                       obj.appnedResult()
                    }
                }
            })

        },
        appnedResult:function(){
           
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
                            $('.body').append(SearchSpans.el)
                        }

                    
        
        },
        searchInArray: function (resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount
            
            
            
            if (searchText != "") {
                _.each(resourceArray, function (result) {
                    if (result.get('title') != null) {
                        skip++
                        //console.log( skip+' '+result.get("title"))
                        if (result.get('title').toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
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

            }
            return resultArray
        },
        searchInArrayForTag:function(resourceArray, searchText){
        
            var that = this
            var resultArray = []
            var foundCount
     
            if (searchText != "") {
                
                _.each(resourceArray, function (result) {
                    if (result.get('Tag') != null) {
                        skip++
                        //console.log( skip+' '+result.get("title"))
                        if (result.get('Tag').indexOf(searchText.toLowerCase()) >= 0) {
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

            }
            return resultArray
        
        }
        

    })

})