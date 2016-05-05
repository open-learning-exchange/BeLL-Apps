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
            var arrayOfPubs=[];
            for(var i=0;i<this.collection.length;i++)
            {
               arrayOfPubs.push(this.collection.models[i].attributes);
            }
            arrayOfPubs.sort(this.sortByPropertyInDecreasingOrder('SurveyNo'));
            for(var i=0;i<this.collection.length;i++)
            {
                this.collection.models[i].attributes = arrayOfPubs[i];
                this.collection.models[i].id=arrayOfPubs[i]._id;
            }
            this.addAll()
        },
        sortByPropertyInDecreasingOrder: function(property) {
            'use strict';
            return function (a, b) {
                var sortStatus = 0;
                if (a[property] < b[property]) {
                    sortStatus = 1;
                } else if (a[property] > b[property]) {
                    sortStatus = -1;
                }

                return sortStatus;
            };
        }
    })

})