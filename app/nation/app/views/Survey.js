$(function() {

    App.Views.Survey = Backbone.View.extend({

        template: $('#template-Survey').html(),
        vars:{},
        render: function() {
            this.vars.languageDict=App.languageDictValue;
            this.$el.html(_.template(this.template,this.vars))

        }

    })

})