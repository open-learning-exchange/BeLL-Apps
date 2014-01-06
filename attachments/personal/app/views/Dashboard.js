$(function() {

  App.Views.Dashboard = Backbone.View.extend({

    template: $('#template-Dashboard').html(),

    vars: {},

    render: function() {
      var dashboard = this
      this.vars.imgURL = "img/header_slice.png"
           var a= new App.Collections.MailUnopened({receiverId:$.cookie('Member._id')})
         a.fetch({async:false})
          this.vars.mails=a.length

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
		var temp=$.url().data.attr.host.split(".")
			temp=temp[0].substring(3)
			if(temp==""){
				temp="local "	
			}
		    temp=temp+" Community Bell"
		        $('.bellLocation').html(temp)
			if(parseInt(member.get('visits'))==0){
				temp="Error!!"
			}
			else{
				console.log(member)
                                temp=member.get('visits')+ " visits"
			}
			var roles = "&nbsp;-&nbsp;"
			var temp1 = 0
			if(member.get("roles").indexOf("Learner")!=-1)
			{
				roles = roles + "Learner"
				temp1 = 1
			}
			if(member.get("roles").indexOf("Leader")!=-1)
			{
				if(temp1==1)
				{
					roles = roles + ",&nbsp;"
				}
				roles = roles + "Leader"
				temp1 = 1
			}
			if(member.get("roles").indexOf("Manager")!=-1)
			{
				if(temp1 ==1)
				{
					roles = roles + ",&nbsp;"
				}
				roles = roles + "Manager"
			}
		        $('.visits').html(temp)
        $('.name').html(member.get('firstName') + ' ' + member.get('lastName')+ roles +'&nbsp;<a href="#member/edit/'+$.cookie('Member._id')+'"><i class="fui-gear"></i></a>')
      })
      member.fetch()

    }

  })

})

