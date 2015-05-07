$(function () {
    //ce82280dc54a3e4beffd2d1efa00c4e6
    App.Views.MemberLoginForm = Backbone.View.extend({

        className: "form login-form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButton2": "signup",
            "click #welcomeButton": "showWelcomeVideo"
        },

        render: function () {
            var context = this;
            var welcomeResources = new App.Collections.Resources();
            welcomeResources.setUrl(App.Server + '/resources/_design/bell/_view/welcomeVideo');
            welcomeResources.fetch({
                success: function () {
                    if(welcomeResources.length > 0) {
                        var welcomeResourceId = welcomeResources.models[0].attributes.id;
                        // display "watch welcome video" button
                        var hrefWelcomeVid = "/apps/_design/bell/bell-resource-router/index.html#openres/" + welcomeResourceId;
//                        var $buttonWelcome = $('<a id="welcomeButton" class="login-form-button btn btn-block btn-lg btn-success" href="hmmm" target="_blank" style="margin-left: -4px;margin-top: -21px; font-size:27px;">Welcome</button>');
                        var $buttonWelcome = $('<a id="welcomeButton" class="login-form-button btn btn-block btn-lg btn-success" target="_blank" href="hmmm" style="margin-left: -4px;margin-top: -21px; font-size:27px;">Welcome</button>');
                        context.$el.append($buttonWelcome);
                        context.$el.find("#welcomeButton").attr( "href", hrefWelcomeVid);// <a href="dummy.mp4" class="html5lightbox" data-width="880" data-height="640" title="OLE | Welcome Video">Welcome Video</a>
                    }
                },
                error: function () {
                    console.log("Error in fetching welcome video doc from db");
                },
                async: false
            });
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

        showWelcomeVideo: function() {

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
                	member = members.first();
                    if (member && member.get('password') == credentials.get('password')) {
                        if (member.get('status') == "active") {
                            //UPDATING MEMBER VISITS
                            App.member = member
                            var vis = parseInt(member.get("visits"))
                            var superMgrIndex =  member.get('roles').indexOf('SuperManager');
                            alert(superMgrIndex );
                          //  alert(member.get('roles')[superMgrIndex ] == "SuperManager");
                           if (superMgrIndex == -1) {
                            vis++
                      }
                            member.set("visits", vis)
                            member.once('sync', function () {})

                            member.save(null,{ success: function(doc,rev){
                            }})

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
                            $.cookie('Member.roles', member.get('roles'), {
                                path: "/apps/_design/bell"
                            })

                            if(parseInt(member.get('visits'))==1 && member.get('roles').indexOf('SuperManager')!=-1){
                                //$('#nav').hide()
                                Backbone.history.navigate('configuration/add', {trigger: true});
                                return;
                            }


                            // warn the admin user if they have not changed default password after installation
//                            if ((member.get('login') === "admin") && (member.get('password') === 'password')) {
//                                    alert("Please change the password for this admin account for better security of the account and the application.");
////                                    var fragment = 'member/edit/' +
//                                    Backbone.history.navigate('member/edit/' + member.get('_id'), {trigger: true});
//
//                            }
//
//                            else {
                                memberLoginForm.trigger('success:login');
                           // }
//							console.log(member.toJSON())
                        } else {
                            alert("Your Account Is Deactivated")
                        }
                    } else {
                        alert('Login or Password Incorrect')
                    }
                } else {
                    alert('Login or Password Incorrect.')
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
        },
        UpdatejSONlog:function(member, logModel, logdb, logdate){
            var superMgrIndex =  member.get('roles').indexOf('SuperManager');
			if(member.get('Gender')=='Male'  ) {
				 var visits=parseInt(logModel.male_visits)
              //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1 ) {
                    visits++
                }
                logModel.male_visits=visits
				}

			else{
				 var visits=parseInt(logModel.female_visits)
              //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1 ) {
                    visits++
                }
                logModel.female_visits=visits
			}
            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                    console.log("MemberLoginForm:: updated daily log from pouchdb for today..");
                } else {
                    console.log("MemberLoginForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
//                    alert("err making update to record");
                }
            });
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
            var superMgrIndex =  member.get('roles').indexOf('SuperManager');
            alert(superMgrIndex);
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

                var visits=parseInt(docJson.male_visits)
              //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1 ) {
                    visits++
                }
                docJson.male_visits=visits
            }
            else{

                var visits=parseInt(docJson.female_visits)
            //    if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1 ) {
                    visits++
                }
                docJson.female_visits=visits
            }
            logdb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("MemberLoginForm:: created activity log in pouchdb for today..");
                } else {
                    console.log("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    console.log(err);
//                    alert("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                }
            });
        }
    })
})
