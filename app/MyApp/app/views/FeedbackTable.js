$(function () {
    App.Views.FeedbackTable = Backbone.View.extend({

        tagName: "table",

        className: "btable btable-striped",

        addOne: function (model) {
            var feedbackRow = new App.Views.FeedbackRow({
                model: model
            })
            feedbackRow.render()
            this.$el.append(feedbackRow.el)
        },

        addAll: function () {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.$el.append('<tr><th>'+App.languageDict.attributes.Comment+'</th><th>'+App.languageDict.attributes.Rating+'</th></tr>')
            this.collection.each(this.addOne, this)
        },

        render: function () {
            this.addAll()
        }

    })

})