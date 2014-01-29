$(function () {
    App.Views.TutorsSpans = Backbone.View.extend({

        tagName: "tr",

        addOne: function (model) {
            var modelView = new App.Views.TutorSpan({
                model: model
            })
            modelView.render()
            $('#tutorTable').append(modelView.el)
        },

        addAll: function () {

            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {

                $('#tutorTable').append("<td class='course-box'>No Tutor</td>")
            }
        },

        render: function () {
            this.addAll()
        }  

    })

})