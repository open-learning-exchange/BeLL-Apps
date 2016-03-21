$(function () {

    App.Views.CommunitySurveysTable = Backbone.View.extend({
        authorName: null,
        tagName: "table",
        className: "table table-striped",
        communitySurveysCollection:[],
        add: function (model) {
            console.log(model);
            this.$el.append('<tr id="' + model._id + '"><td>' + model.birthYearOfMember+ '</td><td>' + model.genderOfMember+ '</td><td><a name="' +model._id +
            '" class="openCommunitySurvey btn btn-info" href="#openCommunitySurvey/' + model._id + '">Open</a></td></tr>');
        },
        events:{

        },
        render: function () {
            var that = this;
            this.$el.html('<tr><th>BirthYear</th><th>Gender</th><th>Actions</th></tr>');
            _.each(this.communitySurveysCollection,function(row){
                var survey = row;
                that.add(survey);
            });
        }
    })
})