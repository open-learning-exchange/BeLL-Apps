$(function() {

    App.Views.CourseCareerPath = Backbone.View.extend({
        template: $('#template-courseCareerPath').html(),
        vars: {},
        events: {
        },
        
        initialize: function() {
            
        },
        render: function() {
            this.$el.html(_.template(this.template,this.vars))
        }


    })

})
