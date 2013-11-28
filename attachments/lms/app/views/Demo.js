$(function() {

  App.Views.Demo = Backbone.View.extend({

    template: $('#template-demo').html(),

    vars: {},

    render: function() {
      var dashboard = this
        
      // Member Name
      var member = new App.Models.Member()
      var that = this
      this.vars = member.toJSON()
      member.id = $.cookie('Member._id')
      member.fetch({success: function() {
      	that.vars.visits = member.get("visits")+1
      	that.$el.html(_.template(that.template, that.vars))
	console.log(member.get("visits"));
      	var vis = member.get('visits')
      	member.set({"visits": vis + 1 })
      	member.save({success:function(){
                        
        }})
       // $('.name').html(member.get('firstName') + ' ' + member.get('lastName')+'<a href="#member/edit/'+$.cookie('Member._id')+'">[Edit]</a>')
      }})
      
    }

  })

})

