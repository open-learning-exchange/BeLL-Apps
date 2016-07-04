/**
 * Created by Sadia.Rasheed on 7/1/2016.
 */
$(function () {

    App.Views.CourseCreditsMainPage = Backbone.View.extend({
        tagName: "table",
        className: "table table-striped",

        events:{
            //@todo: This needs to be done that is why I have commented this for now
            "click #detailsButton": "creditDetails",
        },
        add: function () {
                this.$el.append('<tr><td>' + "Course1"+ '</td><td><a class="btn btn-success" style="margin-left:10px" id="detailsButton"  >' + "Open" + '</a></td></tr>')
        },
        render: function () {
            var that = this;
            this.$el.html('<tr><th>' + 'Course Names' + '</th><th>' + 'Action' + '</th></tr>');
            this.add();
            this.add();

        },
       // @todo: This needs to be done that is why I have commented this for now
      creditDetails: function(){
           creditDetails();
        }

    })
})
