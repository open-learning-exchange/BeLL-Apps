$(function() {

    App.Views.PublicationResourceTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var publicationResourceRowView = new App.Views.PublicationResourceRow({
                model: model
            })
            publicationResourceRowView.Id = this.Id
            publicationResourceRowView.render()
            this.$el.append(publicationResourceRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Resource Title</th><th colspan="2">Actions</th></tr>')
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2"> No Resource in this publication <td></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})