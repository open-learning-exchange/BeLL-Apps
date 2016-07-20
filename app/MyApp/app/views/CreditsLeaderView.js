/**
 * Created by Sadia.Rasheed on 7/19/2016.
 */
$(function () {

    App.Views.CreditsLeaderView = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",

        events:{
        },
        add: function (courseModel) {
            this.$el.append('<tr><td>' + courseModel.get('CourseTitle')+ '</td><td><a class="btn btn-success" href="#credits/edit/' + courseModel.get('_id') + '" style="margin-left:10px" id="detailsButton"  >' + "Open" + '</a></td></tr>')
        },
        render: function () {

            var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            });
            this.add(courseModel);

        },
        addHeading: function(){
            this.$el.html('<tr><th>' + 'Course Names' + '</th><th>' + 'Action' + '</th></tr>');
        }

    })
})
