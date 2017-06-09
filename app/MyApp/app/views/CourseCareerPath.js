$(function() {

    App.Views.CourseCareerPath = Backbone.View.extend({
        template: $('#template-courseCareerPath').html(),
        vars: {},
        searchText: "",
        searchCoursePathName: "",
        events: {
            "click .Search": function(e) {
             this.renderTable($('#searchText').val().toLowerCase())
            },
        },
        
        initialize: function() {
            
        },
        render: function() {
            this.$el.html(_.template(this.template,this.vars))
        },
        renderTable: function(searchText) {
            App.startActivityIndicator()
            var that = this
            var career = new App.Collections.CourseCareerPath()
            career.CoursePathName = searchText
            career.fetch({
                success: function(response){
                    var careerTable = new App.Views.CourseCareerPath({
                        collection: response
                    })
                    careerTable.render();
                    $(".btable").append("<tr><td>"+career.models[0].attributes.CoursePathName+"</td><td></td></tr>")
                    App.stopActivityIndicator()
                },
                error: function() {
                    App.stopActivityIndicator()
                }
            })
        }
    })

})