$(function() {
    App.Views.CoursesSpans = Backbone.View.extend({

        tagName: "tr",

        addOne: function(model) {
            var modelView = new App.Views.CourseSpan({
                model: model
            })
            modelView.render()
            $('#cc').append(modelView.el)
        },

        addAll: function() {

            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {

                $('#cc').append("<td class='course-box'>"+App.languageDict.attributes.Empty_Courses+"</td>")
            }
        },

        render: function() {
            this.addAll()
        }

    })

})