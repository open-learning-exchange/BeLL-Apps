$(function() {
  App.Views.SearchSpans = Backbone.View.extend({

    addOne: function(model){
     if(this.resourceids){
          if( $.inArray(model.get("id"), this.resourceids) == -1 ){
              this.renderView(model)
            }
       }
       else{
        this.renderView(model)
       }
    },
    renderView : function(model){
              var modelView = new App.Views.SearchSpan({model: model})
              modelView.render()  
              this.$el.append(modelView.el)
              //$('#srch').append(modelView.el)
    },
    addAll: function(){
      this.collection.each(this.addOne, this)
    },

    render: function() {
      this.addAll()
    }

  })

})


