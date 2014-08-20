$(function () {
    //ce82280dc54a3e4beffd2d1efa00c4e6
    App.Views.MemberLoginForm = Backbone.View.extend({

        className: "form login-form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButton2": "signup"
        },

        render: function () {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            // give the form a submit button
            var $button = $('<a class="login-form-button btn btn-block btn-lg btn-success" style="margin-left: -4px;margin-top: -21px; font-size:27px;" id="formButton">Sign In</button>')
            var $button2 = $('<div class="signup-div" ><a style="margin-left: -4px;margin-top: -21px; font-size:22px;" class="signup-form-button btn btn-block btn-lg btn-info" id="formButton2">Become A Member</button></div>')
            this.$el.append($button)
            this.$el.append($button2)
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        signup: function () {
            Backbone.history.navigate('member/add', {
                trigger: true
            })
        },
	setForm: function () {
            var memberLoginForm = this
            this.form.commit()
            var credentials = this.form.model
            var members = new App.Collections.Members()
            var member;
            members.login = credentials.get('login')
            members.fetch({success:function(){
                if (members.length>0) {
                	member = members.first()
                    if (member && member.get('password') == credentials.get('password')) {
                        if (member.get('status') == "active") {
                            //UPDATING MEMBER VISITIS
                            App.member = member
                            var vis = parseInt(member.get("visits"))
                            vis++
                            member.set("visits", vis)
                            member.once('sync', function () {})


                            memberLoginForm.logActivity(member)
                            
                                var date = new Date()
                                $.cookie('Member.login', member.get('login'), {
                                    path: "/apps/_design/bell"
                                })
                                $.cookie('Member._id', member.get('_id'), {
                                    path: "/apps/_design/bell"
                                })
                                $.cookie('Member.expTime', date, {
                                    path: "/apps/_design/bell"
                                })
                                
                                if(parseInt(member.get('visits'))==1 && member.get('roles').indexOf('SuperManager')!=-1)
              						{
              						 //$('#nav').hide()
              						 Backbone.history.navigate('configuration/add', {trigger: true})
              						}
              					else 
              					     memberLoginForm.trigger('success:login')
              				
							console.log(member.toJSON())
                            member.save(null,{ success: function(doc,rev){
              				}})
              				
  
                        } else {
                            alert("Your Account Is Deactivated")
                        }
                    } else {
                        alert('Login or Pass incorrect.')
                    }
                } else {
                    alert('Login or Pass incorrect.')
                }
            }});
        },
    logActivity:function(member){
        
        var that=this;
  		var logdb=new PouchDB('activitylogs');
      	var currentdate = new Date();
    	var logdate = this.getFormattedDate(currentdate);

        logdb.get(logdate, function(err, logModel) {
            if (!err) {
                //            console.log("logModel: ");
                //            console.log(logModel);
                //            alert("yeeyyyyyy");
                that.UpdatejSONlog(member, logModel, logdb, logdate);
            } else {
                that.createJsonlog(member, logdate, logdb);
            }
        });

//        logdb.query({map:function(doc){
//					 if(doc.logDate){
//						emit(doc.logDate,doc)
//					 }
//				}
//   			},{key:logdate},function(err,res){
//
//				if(!err){
//				     if(res.total_rows!=0){
//				          logModel=res.rows[0].value
//				          that.UpdatejSONlog(member,logModel,logdb)
//				     }else{
//				   		 that.createJsonlog(member,logdate,logdb)
//				    }
//                }
//		   });
		   
    },
    UpdatejSONlog:function(member, logModel, logdb, logdate){
//	            console.log(logModel)
			if(member.get('Gender')=='Male') {
				 visits=parseInt(logModel.male_visits)
				 visits++
                logModel.male_visits=visits
				}
			else{
				 visits=parseInt(logModel.female_visits)
				 visits++
                logModel.female_visits=visits
			}

            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                    console.log("FeedbackForm:: UpdatejSONlog:: updated daily log from pouchdb for today..");
                } else {
                    console.log("FeedbackForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
//                    alert("err making update to record");
                }
            });

//			logdb.put(model,function(reponce){
//			})
//			console.log(model)
    },
getFormattedDate:function(date) {
  		   var year = date.getFullYear();
  		   var month = (1 + date.getMonth()).toString();
               month = month.length > 1 ? month : '0' + month;
  		   var day = date.getDate().toString();
  		       day = day.length > 1 ? day : '0' + day;
       return  month + '/' + day + '/' + year;
},
createJsonlog:function(member,logdate,logdb){

		var docJson={		
				 logDate: logdate,
				 resourcesIds:[],
				 male_visits:0,
				 female_visits:0,
				 male_timesRated:[],
				 female_timesRated:[],
				 male_rating:[],
				 community:App.configuration.get('code'),
				 female_rating:[],
				 resources_opened:[],
				 male_opened:[],
				 female_opened:[]
			}
			
			if(member.get('Gender')=='Male') {
                visits=parseInt(docJson.male_visits)
                visits++
                docJson.male_visits=visits
            }
            else{
                visits=parseInt(docJson.female_visits)
                visits++
                docJson.female_visits=visits
            }

            logdb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("MemberLoginForm:: createJsonlog:: created activity log in pouchdb for today..");
                } else {
                    console.log("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    console.log(err);
//                    alert("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                }
            });

//			logdb.post(docJson, function (err, response) {
//  						console.log(err)
// 						console.log(response)
// 		});
    },
    
    })

})