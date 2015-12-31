$(function() {

    App.Views.Survey = Backbone.View.extend({

        template: $('#template-Survey').html(),
        render: function() {
            this.$el.html(_.template(this.template))

        }

    })

})