$(function () {

    App.Views.CollectionRow = Backbone.View.extend({

        tagName: "tr",
       
        template: $("#template-CollectionRow").html(),

        initialize: function (e) {
         
        },

        render: function () {
            var vars = this.model.toJSON()
            vars.display=this.display
           	if(!vars.CollectionName)
           	vars.CollectionName="XYZ"
           	this.$el.append(_.template(this.template, vars))
        }

    })

})