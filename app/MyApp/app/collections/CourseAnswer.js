$(function() {

    App.Collections.CourseAnswer = Backbone.Collection.extend({

        url: function() {
            if (this.MemberID != "" && this.StepID != "")
                 return App.Server + '/courseanswer/_design/bell/_view/AnswerByMemberStepId/?key=["' +this.MemberID + '","' +this.StepID+ '"]&include_docs=true'
              else
                return App.Server + '/courseanswer/_all_docs?include_docs=true'
            

        },

        parse: function(response) {
            var models = []
            _.each(response.rows, function(row) {
                models.push(row.doc)
            });
            return models
        },

        comparator: function(model) {
            var type = model.get('Type')
            if (type) return type.toLowerCase()
        },
      model: App.Models.CourseAnswer

    })

})