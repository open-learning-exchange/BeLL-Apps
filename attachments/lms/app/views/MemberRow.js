$(function() {

  App.Views.MemberRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroy" : function(e) {
        e.preventDefault()
        this.model.destroy()
        this.remove()
      },
      "click #deactive" : function(e){
          
          e.preventDefault()
         
          var that = this
          this.model.on('sync', function() {
          // rerender this view

          //that.render()
           location.reload(); 
        })
        
          this.model.save( {status : "deactive"}, {success :function(){}});
          
        //  this.model.fetch({async:false})
       },
      "click #active" : function(e){
        
          e.preventDefault()
          var that = this
          this.model.on('sync', function() {
          // rerender this view
            
             //that.render()
              location.reload(); 
        })
        this.model.save( {status : "active"}, {success :function(){/*this.model.fetch({async:false})*/}});
         
       },
      "click .browse" : function(e) {
        e.preventDefault()
        $('#modal').modal({show:true})
      }
    },

    template : $("#template-MemberRow").html(),

    initialize: function() {
      //this.model.on('destroy', this.remove, this)
    },

    render: function () {
      var vars = this.model.toJSON()
      console.log(vars)
      this.$el.html(_.template(this.template, vars))
    }

  })

})
