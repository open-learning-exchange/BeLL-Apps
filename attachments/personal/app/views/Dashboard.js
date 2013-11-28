$(function() {

  App.Views.Dashboard = Backbone.View.extend({

    template: $('#template-Dashboard').html(),

    vars: {},

    render: function() {
      var dashboard = this
      this.vars.imgURL = "img/OLE_Home_Resized_Header.png"
      this.$el.html(_.template(this.template, this.vars))
      groups = new App.Collections.MemberGroups()
      groups.memberId = $.cookie('Member._id')
      groups.fetch({success: function() {
       groupsSpans = new App.Views.GroupsSpans({collection: groups})
        groupsSpans.render()
        // dashboard.$el.children('.groups').append(groupsDiv.el)
        $('#cc').append(groupsSpans.el)
      }})
       
        shelfSpans= new App.Views.ShelfSpans()
        shelfSpans.render()
        
      //this.$el.children('.now').html(moment().format('dddd') + ' | ' + moment().format('LL'))
      // Time
      $('.now').html(moment().format('dddd | DD MMMM, YYYY'))
      // Member Name
      var member = new App.Models.Member()
      member.id = $.cookie('Member._id')
      
      member.on('sync', function() {
      	var attchmentURL = '/members/' + member.id + '/' 
      if(typeof member.get('_attachments') !== 'undefined'){
   			attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
   			document.getElementById("imgurl").src=attchmentURL
 		}

        $('.name').html(member.get('firstName') + ' ' + member.get('lastName')+'<a href="#member/edit/'+$.cookie('Member._id')+'">[Edit]</a>')
      })
      member.fetch()

    }

  })

})

