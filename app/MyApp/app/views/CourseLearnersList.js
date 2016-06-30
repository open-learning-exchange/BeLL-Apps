$(function () {

    App.Views.CourseLearnersList = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",

        events:{

        },

        add: function (model) {
            var that = this;
            this.$el.append('<tr id="' + model.get('_id') + '"><td>' + model.get('firstName') + ' ' + model.get('lastName') + '</td><td><a name="' + model.get('_id') +
                '" class="btn btn-info" href="#creditsDetails/' + that.Id + '/' + model.get('_id') +
                '">' + 'Open' + '</a></td></tr>');
        },

        render: function () {
            var that = this;
            this.$el.html('<tr><th>' + 'Name' + '</th><th>' + 'Actions' + '</th></tr>');
            for(var i = 0 ; i < this.collection.length ; i++) {
                var learnerDoc = this.collection.models[i];
                that.add(learnerDoc);
            }
        }
    })
})