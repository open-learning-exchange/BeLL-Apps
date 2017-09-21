$(function() {

    App.Views.siteFeedbackPage = Backbone.View.extend({

        tagName: "table",
        className: " table-feedback notification-table table-striped",
        authorName: null,
        searchText: null,
        Resolved: null,
        stack: null,
        category: null,
        urgent: null,
        applyFilters: null,
        resultArray: null,
        events: {
            "click #see-all": function(e) {
                this.applyFilters = "0"
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #switch": function(e) {
                this.applyFilters = "1"
                this.category = $('#select_category').val()
                this.urgent = $('#select_urgent').val()
                if ($('#select_status').val() == "Resolved") {
                    this.Resolved = "1"
                } else {
                    this.Resolved = "0"
                }
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #search_feedback": function(e) {
                this.applyFilters = "0"
                searchText = $("#searchText").val()
                if (searchText != "") {
                    while (skipStack.length > 0) {
                        skipStack.pop();
                    }
                    this.resultArray = []
                    skip = 0
                    skipStack.push(skip)
                    this.fetchRecords()
                }
            },
            "click #previousButton": function(e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }
            },
            "click #next_button": function(e) {

                skipStack.push(skip)
                this.resultArray = []
                this.fetchRecords()
            }
        },

        initialize: function() {
            this.resultArray = []
            this.category = "Bug"
            this.Resolved = "1"
            this.applyFilters = "0"
            this.searchText = ""
            if (url == "unknown") {
                url = "siteFeedback"
            }
            if ($("#comments") != null) {
                $('#debug').append('<div id="comments"></div>')
            }
        },

        addAll: function() {
            this.$el.html('<h4>Keyword:&nbsp;<input class="form-control" type="text" placeholder="Search in comment" value="" size="30" id="searchText" style="height:24px;margin-top:1%;"></input>&nbsp;<span><button class="btn btn-info" id="search_feedback">Search</button>&nbsp;<button class="btn btn-info" id="see-all">See All</button></span>&nbsp;<img id="progress_img" src="vendor/progress.gif" width="3%"></h4><br/>')
            this.$el.append('<Select id="select_category"><option>Bug</option><option>Question</option><option>Suggestion</option></select>&nbsp;&nbsp<select id="select_status"><option>Unresolve</option><option>Resolved</option></select>&nbsp;&nbsp<select id="select_urgent"><option>Normal</option><option>Urgent</option></select>&nbsp;&nbsp<button class="btn btn-info" id="switch">Apply Filters</button><br/><br/>')
            this.$el.append('<th ><h4>Feedback</h4></th><th ><h4>Status</h4></th>')
            $("#progress_img").hide()
            this.collection.forEach(this.addOne, this)
            this.$el.append('<br/><br/><input type="button" class="btn btn-hg btn-primary" id="previousButton" value="< Previous"> &nbsp;&nbsp;&nbsp;<button class="btn btn-hg btn-primary" style="width: 233px;" id="next_button" >Next></button>')
        },

        addOne: function(model) {
            if (!model.get("category")) {
                model.set("category", "Bug")
            }
            if (!model.get("priority")) {

                model.set("priority", [])
            }
            if (model.toJSON()._id != "_design/bell") {
                var revRow = new App.Views.siteFeedbackPageRow({
                    model: model
                })
                revRow.render()
                this.$el.append(revRow.el)
            }
        },
        render: function() {
            this.addAll()
            //alert('in render')
            if (skipStack.length <= 1) {
                $("#previousButton").hide()
            }
            if (this.collection.length < 5) {
                $("#next_button").hide()
            }
        },
        fetchRecords: function() {
            $("#progress_img").show()
            var obj = this
            this.collection.fetch({
                success: function() {
                    //alert(obj.resultArray.length + ' skip : ' + skip)
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.collection.models, searchText))
                    //alert(obj.resultArray.length + ' skip : ' + skip)

                    if (obj.resultArray.length != limitofRecords && obj.collection.models.length == limitofRecords) {
                        obj.fetchRecords()
                        return;
                    } else if (obj.resultArray.length == 0 && obj.collection.models.length == 0 && skipStack.length > 1) {

                        $("#next_button").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        if (searchText != "") {
                            alert(App.languageDict.attributes.No_Result)
                        }
                        //obj.render()
                        // $('#not-found').html("No Such Record Exist");
                        //  $("#selectAllButton").hide() 
                    }
                    var ResultCollection = new App.Collections.siteFeedbacks()
                    //if(obj.resultArray.length > 0)
                    {
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.$el.html('')
                        obj.render()
                    }
                }
            })

        },

        filterResult: function(model) {

            var temp = model.get("PageUrl")
            if (!temp) {
                temp = ''
            }
            var temp2 = temp.split('/')
            var ul = temp2[0]
            for (var i = 1; i < temp2.length; i++) {
                if (temp2[i].length != 32) {
                    ul = ul + "/" + temp2[i]
                } else {
                    i = temp.length
                }
            }
            if (ul == url) {
                return true
            } else {
                return false
            }
        },

        checkFilters: function(result) {
            if (this.filterResult(result)) {
                if (this.applyFilters == "0") {
                    return true
                } else if (this.Resolved == result.get("Resolved") && this.category == result.get("category")) {
                    if (this.urgent == "Normal" && result.get("priority").length == 0) {
                        return true
                    } else if (this.urgent == "Urgent" && result.get("priority").length > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        searchInArray: function(resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount
            _.each(resourceArray, function(result) {
                if (result.get("comment") != null) {
                    skip++

                    //alert(that.Resolved+' '+result.get("Resolved") + ' ' + that.category + ' ' +  result.get("category"))
                    if (!result.get("category")) {
                        result.set("category", "Bug")
                    }
                    if (!result.get("priority")) {
                        result.set("priority", [])
                    }
                    if (result.get("comment").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 && that.checkFilters(result)) {
                        if (resultArray.length < limitofRecords) {
                            resultArray.push(result)
                        } else {
                            enablenext = 1
                            skip--
                        }
                    } else if (resultArray.length >= limitofRecords) {
                        skip--
                    }


                }
            })

            return resultArray
        }

    })

})