/**
 * Created by Sadia.Rasheed on 7/19/2016.
 */
$(function () {

    App.Views.CreditsLeaderView = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",

        events:{
        },
        add: function (courseModel, memberId) {
            this.$el.append('<tr><td>' + courseModel.get('CourseTitle')+ '</td><td><a class="btn btn-success" href="#creditsDetails/' + courseModel.get('_id') + '/' + memberId+ '" style="margin-left:10px" id="detailsButton"  >' + "Open" + '</a></td></tr>')
        },
        render: function () {
            var learnerIds;
            var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
                success: function (groupDoc) {
                    learnerIds = groupDoc.get('members');
                },
                async: false

            });
            var learnerCollection = App.Router.getLearnersList(learnerIds);
            var member = learnerCollection.models[0]
            var memberId = member.get('_id')
            console.log("member id :" + memberId);
            this.add(courseModel,memberId );
        },
        addHeading: function(){
            this.$el.html('<tr><th>' + 'Course Names' + '</th><th>' + 'Action' + '</th></tr>');
        }

    })
})
