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
            var arrayOfPubs=[];
            for(var i=0;i<this.collection.length;i++)
            {
                arrayOfPubs.push(this.collection.models[i].attributes);
            }
            arrayOfPubs.sort(this.sortByPropertyInDecreasingOrder('IssueNo'));
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