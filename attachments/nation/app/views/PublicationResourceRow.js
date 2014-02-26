$(function () {

    App.Views.PublicationResourceRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
          "click .destroy": function (event) {
             var publicationObject=new App.Models.Publication({
			_id:this.Id
			})
			publicationObject.fetch({
			async:false
			}) 
			var resources=publicationObject.get('resources')
			var index=resources.indexOf(this.model.get('_id'))
			if (index > -1) {
 			   resources.splice(index, 1);
			} 
			this.$el.hide()
			
			publicationObject.set({'resources':resources})
			publicationObject.save()
            }

        },

        vars: {},

        template: _.template($("#template-ResourceRow").html()),

        initialize: function (e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function () {
            var vars = this.model.toJSON()
             this.$el.append(this.template(vars))
        },


    })

})