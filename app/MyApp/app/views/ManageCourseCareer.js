$(function() {

    App.Views.ManageCourseCareer = Backbone.View.extend({
        template: $('#template-careerPathManage').html(),
        vars: {},

        initialize: function() {
            
        },

        render: function() {
            console.log(this.collection)
            this.$el.html(_.template(this.template,this.vars))
        },
    })

})
