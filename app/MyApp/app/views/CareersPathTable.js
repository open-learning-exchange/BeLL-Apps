$(function(){
	App.Views.CareersPathTable = Backbone.View.extend({
		addOne: function(model) {
			//console.log(model)
            // if (this.CourseIds) {
            //     if ($.inArray(model.get("id"), this.CourseIds) == -1) {
            //         this.renderView(model)
            //     }
            // } else {
                this.renderView(model)
            // }
        },
        renderView: function(model) {
           
            //$('#srch').append(modelView.el)
        },
        addAll: function() {
            this.addOne()
            var careerLength;
            var context = this
            console.log(this.collection.models[0].attributes._id)
            var modelView = new App.Views.CareersPathTable({
            })
            modelView.render()
            this.$el.append(modelView.el)
        },

        render: function() {
            this.addAll()
        }

	})
})