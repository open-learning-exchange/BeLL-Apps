$(function () {

    App.Views.ArticleTable = Backbone.View.extend({

        tagName: "table",
        className: "news-table",
        authorName: null,

        initialize: function () {
            this.$el.append('<th colspan="2">Article List</th>')
        },

        setAuthorName: function (author) {
            this.authorName = author

        },

        addOne: function (model) {

            if (model.get("Tag") == "News") {
                if (model.get("author").toLowerCase() == this.authorName) {
                    art = new App.Views.ArticleTableRow({
                        model: model
                    })
                    art.render()
                    this.$el.append(art.el)
                }
            }
        },

        addAll: function () {
            this.collection.forEach(this.addOne, this)
        },
        render: function () {
            this.addAll()
        }

    })

})