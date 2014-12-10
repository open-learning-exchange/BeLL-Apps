$(function() {

  App.Views.PublicationCoursesTable = Backbone.View.extend({

    tagName: "table",
	isManager:null,
    className: "table table-striped",

    initialize: function(){
    
    },
    addOne: function(model){
      var publicationCourseRowView = new App.Views.PublicationCourseRow({model: model})
      publicationCourseRowView.Id=this.Id
      publicationCourseRowView.render()
      this.$el.append(publicationCourseRowView.el)
    },

    addAll: function(){
        this.$el.append('<tr><th>Course Title</th><th colspan="2">Actions</th></tr>')
        if(this.collection.length==0)
          this.$el.append('<tr><td colspan="2"> No Course in this publication <td></tr>')
          
          this.collection.forEach(this.addOne, this)
    },

    render: function() {
       this.addAll()
    }

  })

})

