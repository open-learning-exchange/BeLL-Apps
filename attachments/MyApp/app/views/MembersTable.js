$(function() {
  App.Views.MembersTable = Backbone.View.extend({

    tagName: "table",

    className: "btable btable-striped",

    addOne: function(model){
      var memberRow = new App.Views.MemberRow({model: model})
      memberRow.isadmin = this.isadmin
      memberRow.community_code=this.community_code 
      memberRow.render()  
      this.$el.append(memberRow.el)
    },

    addAll: function(){
    this.$el.append("<tr><th>Photo</th><th>Name</th><th>Visits</th><th>Email</th><th>Bell-Email</th><th>Actions</th></tr>")
      // @todo this does not work as expected, either of the lines
      // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})