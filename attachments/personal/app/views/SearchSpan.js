$(function() {

  App.Views.SearchSpan = Backbone.View.extend({

    tagName: "tr",

    className: 'search-box',

    template : $("#template-Search-box ").html(),

    render: function () {
    
      var vars = this.model.toJSON()


      if(vars.Tag=="News"){
	      
	      vars.title='<a  class="search-href" href="/apps/_design/bell/bell-resource-router/index.html#open/'+vars._id+'" target="_blank"><i class="icon-list"></i>'+vars.title;
	      var ul="/apps/_design/bell/bell-resource-router/index.html#open/"+vars._id;

	}	
      this.$el.append(_.template(this.template, vars))
    }

  })
})

