$(function() {

    App.Views.ReportsTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

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
            this.$el.append(reportRowView.el);
        },

        addAll: function() {
            this.$el.append('<tr id="firstRowOfReports"><th>'+App.languageDictValue.attributes.Time+'</th><th>'+App.languageDictValue.attributes.Reques_t+'</th><th>'+App.languageDictValue.attributes.author+'</th><th>'+App.languageDictValue.attributes.View_s+'</th><th colspan="5">'+App.languageDictValue.attributes.Actions+'</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

})