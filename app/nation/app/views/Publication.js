$(function() {

    App.Views.Publication = Backbone.View.extend({

        template: $('#template-Publication').html(),
        vars:{},
        render: function() {
            this.vars.languageDict=App.languageDictValue;
            this.$el.html(_.template(this.template,this.vars))
        }
    })

})