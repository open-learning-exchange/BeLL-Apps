$(function() {

    App.Views.PublicationTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",
        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var publicationRowView = new App.Views.PublicationRow({
                model: model
            })
            publicationRowView.render()
            this.$el.append(publicationRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>'+App.languageDictValue.get('Date')+'</th><th>'+App.languageDictValue.get('IssueNumber')+'</th><th>'+App.languageDictValue.get('Editor_Name')+'</th><th>'+App.languageDictValue.get('Editor_Email')+'</th><th>'+App.languageDictValue.get('Editor_Phone')+'</th><th>'+App.languageDictValue.get('Sent_to')+'</th><th>'+App.languageDictValue.get('downloaded_by')+'</th><th colspan="2">'+App.languageDictValue.get('Actions')+'</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }
    })

})