$(function() {
    App.Views.MeetupSpans = Backbone.View.extend({

        tagName: "tr",

        addOne: function(model) {
            var modelView = new App.Views.MeetupSpan({
                model: model
            })
            modelView.render()
            $('#meetUpTable').append(modelView.el)
        },

        addAll: function() {

            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {

                $('#meetUpTable').append("<td class='course-box'>No MeetUp</td>")
            }
        },

        render: function() {
            this.addAll()
        }

    })

})