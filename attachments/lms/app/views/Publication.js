$(function () {

    App.Views.Publication = Backbone.View.extend({

        template: $('#template-Publication').html(),
        render: function () {
            this.$el.html(_.template(this.template))
            
        }

    })

})