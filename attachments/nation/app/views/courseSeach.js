$(function () {

    App.Views.courseSeach = Backbone.View.extend({

        className: "form",
        events: {
            "click .save": "saveForm",
            "click #cancel": function () {
              window.location.href='#publication'
            }
        },

       //template: _.template($('#template-form-file').html()),

        render: function () {
              this.$el.append('<lable>key Word</lable><input type="text" id="SeachCourseText" >')
        },

    })

})