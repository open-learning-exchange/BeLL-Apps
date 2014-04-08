$(function() {

  App.Views.CommunityForm = Backbone.View.extend({
    
    className: "addNation-form",
    vars:{},

    events: {
      "click #formButton": function()
      {
      	document.getElementById("addCommunity").submit();
      }, 
      "submit form" : "setForm" , 
    },
    template: $('#template-addCommunity').html(),

    
  render: function() {
  
      	var Nation = this.model
      	 this.$el.append(_.template(this.template, this.vars))
      	if(this.model.id!=undefined){
	  				buttonText="Update"
	  			
	  			$('#nation-name').val(Nation.get('Name'))
	  			$('#nation-url').val(Nation.get('Url'))
	  			$('#org-name').val(Nation.get('SponserName'))
	  			$('#org-sponseraddress').val(Nation.get('SponserAddress'))
	  			$('#org-firstname').val(Nation.get('ContactFirstname'))
	  			
	  			$('#org-middlename').val(Nation.get('ContactMiddlename'))
          		$('#org-lastname').val(Nation.get('ContactLastname'))
          		
          		$('#org-phone').val(Nation.get('ContactPhone'))
          		$('#org-email').val(Nation.get('ContactEmail'))
          		$('#leader-firstname').val(Nation.get('LeaderFirstname'))
          		$('#leader-middlename').val(Nation.get('LeaderMiddlename'))
          		$('#leader-lastname').val(Nation.get('LeaderLastname'))
          		$('#leader-phone').val(Nation.get('LeaderPhone'))
          		$('#org-email').val(Nation.get('LeaderEmail'))
          		$('#leader-ID').val(Nation.get('LeaderId'))
          		$('#leader-password').val(Nation.get('LeaderPassword'))
          		$('#urg-name').val(Nation.get('UrgentName'))
          		$('#urg-phone').val(Nation.get('UrgentPhone'))
          		$('#auth-name').val(Nation.get('AuthName'))
          		$('#auth-date').val(Nation.get('AuthDate'))
       	}
       	var that = this
      
   
    },
    setForm:function(){
          this.model.set({
         		 Name:$('#nation-name').val(),
          		 Url:$('#nation-url').val(),
          		 SponserName:$('#org-name').val(),
          		 SponserAddress:$('#org-sponseraddress').val(),
          		 ContactFirstname:$('#org-firstname').val(),
          		 ContactMiddlename:$('#org-middlename').val(),
          		 ContactLastname:$('#org-lastname').val(),
          		 ContactPhone:$('#org-phone').val(),
          		 ContactEmail:$('#org-email').val(),
          		 LeaderFirstname:$('#leader-firstname').val(),
          		 LeaderMiddlename:$('#leader-middlename').val(),
          		 LeaderLastname:$('#leader-lastname').val(),
          		 LeaderPhone:$('#leader-phone').val(),
          		 LeaderEmail:$('#org-email').val(),
          		 LeaderId:$('#leader-ID').val(),
          		 LeaderPassword:$('#leader-password').val(),
          		 UrgentName:$('#urg-name').val(),
          		 UrgentPhone:$('#urg-phone').val(),
          		 AuthName:$('#auth-name').val(),
          		 AuthDate:$('#auth-date').val(),
          });
        
           
          this.model.save()
            alert("Successfully Saved")
            App.startActivityIndicator()
            Backbone.history.navigate('listCommunity',{trigger:true});
            App.stopActivityIndicator()		 
                         /*    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'jsonp',
                        data: JSON.stringify({
                            "source": "community_code",
                            "target": "http://10.10.2.79:5984/community_code"
                        }),
                        success: function (response) {
                            console.log(response)
                        },
                        async: false
                    });
                   
            
          	var myDonut = this.model.toJSON()
          	var m = JSON.stringify(myDonut)
          	alert(m)
          	$.ajax({
    			url : 'http://10.10.2.69:5984/community',
    			type : 'POST',
    			dataType : "jsonp",
    			data : m , 
    			success : function(json) {
    				console.log(json)
    				alert('ddkkkkddd')
    			}
    		})
          // $.ajax({
//                         headers: {
//                             'Accept': 'application/json',
//                             'Content-Type': 'application/json; charset=utf-8'
//                         },
//                         type: 'POST',
//                         url: 'http://10.10.2.79:5984/community_code',
//                         dataType: 'jsonp',
//                         data: JSON.stringify(myDonut),
//                         success: function (response) {
//                             
//                         	console.log(data)
//                             console.log(response)
//                         },
//                         async: false
//                     });
 				//$.post('community_code',)  */ 	 
            	 
            	 
            	 
       		//}
       		// else{
//        		alert('not validate');
//        		
//        		}
       }

  })

})
