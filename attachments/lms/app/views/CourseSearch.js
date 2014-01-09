$(function () {

    App.Views.CourseSearch = Backbone.View.extend({


        template: $('#template-Search').html(),

        vars: {},
        groupresult: null,
        resultArray: null,

        initialize: function () {
            this.groupresult = new App.Collections.SearchCourses()
            this.resultArray = []
            enablenext = 0
        },
        render: function () {
            var obj = this
            //this.$el.html(_.template(this.template, this.vars))
            //this.searchText = $("#searchText").val()
            // alert(searchText)
            if (searchText != "") {
                this.fetchRecords()
            }
        },

        fetchRecords: function () {
            var obj = this
            this.groupresult.fetch({
                success: function () {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.groupresult.models, searchText))


                    if (obj.resultArray.length != searchRecordsPerPage && obj.groupresult.models.length == limitofRecords) {
                        obj.fetchRecords()
                    } else if (obj.groupresult.models.length == 0) {
                        previousPageButtonPressed()

                    } else if (obj.groupresult.models.length < limitofRecords && obj.resultArray.length == 0 && skipStack.length == 1) {
                        $('#not-found').html("No Such Record Exist");
                        $("#selectAllButton").hide()


                    } else {
                        var ResultCollection = new Backbone.Collection();
                        if (obj.resultArray.length > 0) {
                            ResultCollection.set(obj.resultArray)
                            var SearchSpans = new App.Views.GroupsTable({
                                collection: ResultCollection
                            })
                            SearchSpans.resourceids = obj.resourceids
                            SearchSpans.render()
                            $('.body').append(SearchSpans.el)
                        }

                    }
                }
            })

        },
        searchInArray: function (resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount

            if (searchText != "") {
                _.each(resourceArray, function (result) {
                    if (result.get("name") != null) {
                        skip++
                        //console.log( skip+' '+result.get("title"))
                        if (result.get("name").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
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