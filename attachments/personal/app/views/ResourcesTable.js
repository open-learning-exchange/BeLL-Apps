$(function () {

    App.Views.ResourcesTable = Backbone.View.extend({


        authorName: null,
        tagName: "table",

        className: "news-table",
        initialize: function () {
            this.$el.append('<th colspan="2">Author list</th>')
        },

        addOne: function (model) {
            //Single Author Should not be displayed multiple times on The Screen
            if ($.inArray(model.get('author').toLowerCase(), this.authorName) == -1) {
                var resourceRowView = new App.Views.ResourceRow({
                    model: model
                })
                resourceRowView.render()
                this.$el.append(resourceRowView.el)
                this.authorName.push(model.get('author').toLowerCase())
            }
        },


        addAll: function () {
            this.authorName = []
            this.collection.forEach(this.addOne, this)
        },


        render: function () {
            this.addAll()
        }

    })

})