$(function() {

    App.Views.ReportsTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "btable btable-striped",

        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var reportRowView = new App.Views.ReportsRow({
                model: model
            })
            reportRowView.isManager = this.isManager
            reportRowView.render()
            this.$el.append(reportRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr id="firstRowOfReports"><th>'+App.languageDict.attributes.Time+'</th><th>'+App.languageDict.attributes.Title+'</th><th>'+App.languageDict.attributes.author+'</th><th>'+App.languageDict.attributes.View_s+'</th><th colspan="5">'+App.languageDict.attributes.action+'</th></tr>')

            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})