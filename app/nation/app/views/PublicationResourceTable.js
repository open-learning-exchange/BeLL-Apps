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
            if (model.attributes._id !== undefined) {
                var publicationResourceRowView = new App.Views.PublicationResourceRow({
                    model: model
                })
                publicationResourceRowView.Id = this.Id
                publicationResourceRowView.render()
                this.$el.append(publicationResourceRowView.el)
            }
        },

        addAll: function() {
            this.$el.append('<tr><th>'+App.languageDictValue.get('Title')+'</th><th colspan="2" width="30%">'+App.languageDictValue.get('Actions')+'</th></tr>')
            if (this.collection.length == 0)
                this.$el.append('<tr><td colspan="2">'+App.languageDictValue.get('No_Resource_Pub')+'<td></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})