$(function() {

    App.Views.SurveyTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "table table-striped",

        initialize: function() {
        },
        addOne: function(model) {
            var surveyRowView = new App.Views.SurveyRow({
                model: model
            })
            surveyRowView.render()
            this.$el.append(surveyRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>'+App.languageDictValue.get('Date')+'</th><th>'+App.languageDictValue.get("Survey_Number")+'</th><th>'+App.languageDictValue.get('Title')+'</th><th>'+App.languageDictValue.get('Sent_to')+'</th><th>'+App.languageDictValue.get('Submitted_By')+'</th><th colspan="2">'+App.languageDictValue.get('Actions')+'</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }
    })

})