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
            },
             "click .movetolibrary": function (event) {
                var publicationObject=new App.Models.Publication({
			_id:this.Id
			})
			publicationObject.recPub=true
			publicationObject.fetch({
			async:false
			}) 
			var resources=publicationObject.get('resources')
			var index=resources.indexOf(this.model.get('_id'))

			if (index > -1) {
 			   resources.splice(index, 1);
			} 
			publicationObject.set({'resources':resources})
			publicationObject.save()
			var resource = new App.Models.Resource(
				{
					_id: (resources[index])
				})
				resource.pubResource=true
				resource.fetch({
				async:false
				})
				resource.url=App.Server + '/resources'
				resource.save()
				this.$el.hide()
            }

        },

        vars: {},

        template: _.template($("#template-PubResourceRow").html()),

        initialize: function (e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function () {
            var vars = this.model.toJSON()
             this.$el.append(this.template(vars))
        },


    })

})