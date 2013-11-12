$(function() {
  App.Views.MembersTable = Backbone.View.extend({

    tagName: "table",

    className: "table table-striped",

    addOne: function(model){
      var memberRow = new App.Views.MemberRow({model: model})
      memberRow.render()  
      this.$el.append(memberRow.el)
    },

    addAll: function(){
      // @todo this does not work as expected, either of the lines
      // _.each(this.collection.models, this.addOne())
      this.collection.each(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})$(function() {

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



