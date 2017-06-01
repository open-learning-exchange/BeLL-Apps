$(function() {

    App.Views.AddCourseCareer = Backbone.View.extend({
        template: $('#template-addCourseCareer').html(),
        vars: {},
        events: {
        },
         "click .back_button":function()
            {  
                Backbone.history.navigate('courseCareerPath' + this.levelId + '/' + this.revId, {
                    trigger: true
                })
            },
        initialize: function() {
            
        },
        render: function() {
            this.$el.html(_.template(this.template,this.vars))
        }


    })

})
