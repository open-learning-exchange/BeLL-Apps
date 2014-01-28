$(function () {

    App.Views.Dashboard = Backbone.View.extend({

        template: $('#template-Dashboard').html(),

        vars: {},
        latestVersion : null,
		events : {
		 "click #updateButton" : function(e){
		 	var configurations=Backbone.Collection.extend({
    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	    var config=new configurations()
    	      config.fetch({async:false})
    	    var currentConfig=config.first().toJSON().rows[0].doc
    	    currentConfig.version = this.latestVersion
    	   var nationName = currentConfig.nationName
    	    var nationURL = currentConfig.nationUrl
    	   $.ajax({
            	headers: {
                	'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                },
            	type: 'POST',
                url: '/_replicate',
                dataType: 'json',
                data: JSON.stringify({
                	"source": 'http://'+ nationName +':oleoleole@'+ nationURL + ':5984/apps',
                    "target": "apps"
            	}),
                success: function (response) {
                	console.log(response)
                },
                async: false
            })
    	   
		 	$.ajax({
            	headers: {
                	'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
            	type: 'PUT',
                url: App.Server + '/configurations/' + currentConfig._id + '?rev=' + currentConfig._rev,
                dataType: 'json',
                data: JSON.stringify(currentConfig),
                success: function (response) {
                	console.log(response)
                	alert("Successfully updated to latest version.")
                },
                async: false
            })
		 }
		},
        render: function () {
            var dashboard = this
            this.vars.imgURL = "img/header_slice.png"
            var a = new App.Collections.MailUnopened({
                receiverId: $.cookie('Member._id')
            })
            a.fetch({
                async: false
            })
            this.vars.mails = a.length

            this.$el.html(_.template(this.template, this.vars))
            
            groups = new App.Collections.MemberGroups()
            groups.memberId = $.cookie('Member._id')
            groups.fetch({async:false})
			groupsSpans = new App.Views.GroupsSpans({
            	collection: groups
            })
            groupsSpans.render()
            // dashboard.$el.children('.groups').append(groupsDiv.el)
            $('#cc').append(groupsSpans.el)
            shelfSpans = new App.Views.ShelfSpans()
            shelfSpans.render()

            //this.$el.children('.now').html(moment().format('dddd') + ' | ' + moment().format('LL'))
            // Time
            $('.now').html(moment().format('dddd | DD MMMM, YYYY'))
            // Member Name
            var member = new App.Models.Member()
            member.id = $.cookie('Member._id')

            member.on('sync', function () {
                var attchmentURL = '/members/' + member.id + '/'
                if (typeof member.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
                    document.getElementById("imgurl").src = attchmentURL
                }
                var temp = $.url().data.attr.host.split(".")
                temp = temp[0].substring(3)
                if (temp == "") {
                    temp = "local "
                }
                temp = temp + " Community Bell"
                $('.bellLocation').html(temp)
                if(!member.get('visits'))
                {
                	member.set('visits',1)
                	member.save()
                }
                if (parseInt(member.get('visits')) == 0) {
                    temp = "Error!!"
                } else {
                    temp = member.get('visits') + " visits"
                }
                var roles = "&nbsp;-&nbsp;"
                var temp1 = 0
                if (member.get("roles").indexOf("Learner") != -1) {
                    roles = roles + "Learner"
                    temp1 = 1
                }
                if (member.get("roles").indexOf("Leader") != -1) {
                    if (temp1 == 1) {
                        roles = roles + ",&nbsp;"
                    }
                    roles = roles + "Leader"
                    temp1 = 1
                }
                if (member.get("roles").indexOf("Manager") != -1) {
                    if (temp1 == 1) {
                        roles = roles + ",&nbsp;"
                    }
                    roles = roles + "Manager"
                }
                $('.visits').html(temp)
                $('.name').html(member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '</span>' + '&nbsp;<a href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>')
                dashboard.checkAvailableUpdates(member.get('roles'),dashboard)
                //dashboard.$el.append('<div id="updates"></div>')
            })
            member.fetch()

        },
        checkAvailableUpdates: function(roles,dashboard)
		{
			if($.inArray('Manager',roles)==-1)
			{
				return
			}
			var configurations=Backbone.Collection.extend({
    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	    var config=new configurations()
    	      config.fetch({async:false})
    	    var currentConfig=config.first().toJSON()
    	    console.log(currentConfig.rows[0].doc)
    	    if(currentConfig.rows[0].doc.type=='nation')
    	    {
    	    	return
    	    }
    	    var nationName = currentConfig.rows[0].doc.nationName
    	    var nationURL = currentConfig.rows[0].doc.nationUrl
			$.ajax({
    			url : 'http://'+ nationName +':oleoleole@'+nationURL+':5984/configurations/_all_docs?include_docs=true',
    			type : 'GET',
    			dataType : "jsonp",
    			success : function(json) {
    				var nationConfig = json.rows[0].doc
	    			 if(typeof nationConfig.version === 'undefined')
	    			 {
	    			 	/////No version found in nation
	    			 }
	    			 else if(nationConfig.version == currentConfig.rows[0].doc.version)
	    			 {
	    			 	///No updatea availabe
	    			 }
	    			 else
	    			 {
	    			 	////updates availabe
	    			 	dashboard.latestVersion = nationConfig.version
	    			 	dashboard.$el.append('<button class="btn systemUpdate" id="updateButton">System Update Available ('+ nationConfig.version +'). Press to update. </button>')
	    			 }
    			},
    			async : false
  			 })

		},
    })

})