$(function () {

	App.Views.ActivityReport = Backbone.View.extend({
		vars: {},
		events: {
			/* Sync moved to nation
            "click #syncReport" : function(e){
					App.Router.syncLogActivitiy()
            }*/
        },
		template: $('#template-ActivityReport').html(),
		initialize: function () {

		},
		render: function () {
			var context = this;
			
        	
			$.ajax({
				url: '/members/_design/bell/_view/MaleCount?group=false',
				type: 'GET',
				dataType: "json",
				success: function (json) {
					context.vars = context.data
                    if (json.rows[0]) {
                        context.vars.MaleMembers = json.rows[0].value
                    }
                    else {
                        context.vars.MaleMembers = 0;
                        }
                            $.ajax({
                            url: '/members/_design/bell/_view/FemaleCount?group=false',
                            type: 'GET',
                            dataType: "json",
                            success: function (json) {
                                if(json.rows[0]){
                                    context.vars.FemaleMembers = json.rows[0].value
                                }
                                else{
                                    context.vars.FemaleMembers = 0;
                                }
                                context.vars.startDate = context.startDate
                                context.vars.endDate = context.endDate
                                context.vars.CommunityName = context.CommunityName
                                context.$el.html(_.template(context.template, context.vars));
                                 
                            }
                        })


				}
			})


		}
	})

});$(function () {

    App.Views.BecomeMemberForm = Backbone.View.extend({

        className: "form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
        },

        render: function () {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['status'].$el.hide()
            this.form.fields['yearsOfTeaching'].$el.hide()
            this.form.fields['teachingCredentials'].$el.hide()
            this.form.fields['subjectSpecialization'].$el.hide()
            this.form.fields['forGrades'].$el.hide()
            this.form.fields['visits'].$el.hide()
            // this.form.fields['roles'].$el.hide()



            var that = this
            //      this.form.fields['roles'].$el.change(function(){
            //        var values = new Array()
            //         $('input[type="checkbox"]:checked').each(function() {
            //                values.push(this.value)
            //         })    
            //          if(values.indexOf("lead") > -1){
            //              that.form.fields['yearsOfTeaching'].$el.show()
            //              that.form.fields['teachingCredentials'].$el.show()
            //              that.form.fields['subjectSpecialization'].$el.show()
            //              that.form.fields['forGrades'].$el.show()
            //           }
            //            else{
            //              that.form.fields['yearsOfTeaching'].$el.hide()
            //              that.form.fields['teachingCredentials'].$el.hide()
            //              that.form.fields['subjectSpecialization'].$el.hide()
            //              that.form.fields['forGrades'].$el.hide()
            //              
            //            }
            //        
            //      })
            // give the form a submit button
            var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
            this.$el.append($button)
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function () {
            if (this.form.validate() != null) {
                return
            }

            var that = this
            this.model.once('sync', function () {
                alert("Thank you for becoming a member")

                $.cookie('Member.login', that.model.get("login"), {
                    path: "/apps/_design/bell/lms"
                })
                $.cookie('Member._id', that.model.get("id"), {
                    path: "/apps/_design/bell/lms"
                })
                $.cookie('Member.login', that.model.get("login"), {
                    path: "/apps/_design/bell/personal"
                })
                $.cookie('Member._id', that.model.get("id"), {
                    path: "/apps/_design/bell/personal"
                })

                that.trigger('BecomeMemberForm:done')
            })
            // Put the form's input into the model in memory
            this.form.setValue({
                status: "active"
            })
            this.form.commit()
            var addMem = true
            var existing = new App.Collections.Members()
            existing.fetch({
                async: false
            })
            existing.each(function (m) {
                if (m.get("login") == that.model.get("login")) {
                    alert("Login already exist")
                    addMem = false
                }
            })


            // Send the updated model to the server
            if ($.inArray("lead", this.model.get("roles")) == -1) {
                that.model.set("yearsOfTeaching", null)
                that.model.set("teachingCredentials", null)
                that.model.set("subjectSpecialization", null)
                that.model.set("forGrades", null)
            }
            this.model.set("visits", 0)
            if (addMem) {
                this.model.save()
            }
        },


    })

});$(function () {

    App.Views.CalendarForm = Backbone.View.extend({
        className: "signup-form",
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)

            // give the form a submit button
            var $button
            if (this.update) {
                $button = $('<div class="signup-submit"><a class="addEvent-btn btn btn-success" style="width:" id="formButton">Update Event</button></div>')
            } else {
                $button = $('<div class="signup-submit"><a class="addEvent-btn btn btn-success" id="formButton">Add Event</button></div>')
            }
            this.$el.append($button)
        },
        setForm: function () {
            var that = this
            this.model.once('sync', function () {
                that.trigger('CalendarForm:done')
            })
            this.form.setValue('userId', $.cookie('Member._id'))
            if (this.form.validate() == null) {
                this.form.commit()
                this.model.save()
                if (this.update) {
                    alert("Event Successfully Updated!!!")
                } else {
                    alert("Event Successfully Created!!!")
                }
                Backbone.history.navigate('calendar', {
                    trigger: true
                })
            }

        },
    })

});$(function () {

    App.Views.CollectionRow = Backbone.View.extend({

        tagName: "tr",
       
        template: $("#template-CollectionRow").html(),

        initialize: function (e) {
         
        },

        render: function () {
            var vars = this.model.toJSON()
            vars.display=this.display
           	if(!vars.CollectionName)
           	vars.CollectionName="XYZ"
           	this.$el.append(_.template(this.template, vars))
        }

    })

});$(function() {
  App.Views.CollectionTable = Backbone.View.extend({

    tagName: "table",
	id:"collectionTable",
	display:false,
    className: "table table-striped",
    initialize:function(options){
    	
    //consoe.log(options)
    ///alert('here in collection table')
    },
	addOne: function(model){
      	 var collectionRow = new App.Views.CollectionRow({model: model})
      		 collectionRow.display=this.display
      		 collectionRow.render()  
      	this.$el.append(collectionRow.el)
    },
    events : {
		"click .clickonalphabets" : function(e)
		{
			this.collection.skip = 0
			var val = $(e.target).text()
			this.collection.startkey = val
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}	
		},
		"click #allresources" : function(e)
		{
			this.collection.startkey = ""
			this.collection.skip = 0
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
		"click #mergeCollection" :function(e){
		    this.displayMergeForm()
		},
		"click #nextButton" :function(e){
		    this.collection.skip += 20
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
		"click #preButton" :function(e){
		    this.collection.skip -= 20
			this.collection.fetch({async:false})
			if(this.collection.length>0){
				this.render()
			}
		},
		
	},
	displayMergeForm:function(){
	
	          $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                $('#invitationdiv').html('<h5 style="margin-left:40px;margin-top:40px">Select Collections to Merge<h5>')

                var viewText='<p style="margin-left:20px;"><label style="margin-left:20px"><b>Collections</b></label><select multiple="true" style="width:400px;" id="selectCollections">'
                    this.collection.each(function(coll){
                         viewText+='<option value="'+coll.get('_id')+'">'+coll.get('CollectionName')+'</option>'
                    
                    })
                viewText+='</select></p>'
                
                $('#invitationdiv').append(viewText)
                
                $('#invitationdiv').append('<br><label style="margin-left:40px"><b>Name</b></label><input id="collectionName" type="text"></input>')
                $('#invitationdiv select').multiselect().multiselectfilter()
                $('#invitationdiv select').multiselect('uncheckAll')
               
                $('#invitationdiv').append('<br><br>') 
                $('#invitationdiv').append('<button class="btn btn-success" style="margin-left:40px" id="continueMerging" onClick="continueMerging()">Continue</button>')
                $('#invitationdiv').append('<button class="btn btn-danger" style="margin-left:20px"  id="cancelMerging" onClick="cancelMerging()">Cancel</button>')
	},
    addAll: function(){
    
    	var header="<tr><th colspan='6'>Collections"
            if(this.display==true)
              header+="<a id='mergeCollection' style='margin-left:20px' class='btn btn-info small'>Merge</a>"
    	      header+="</th></tr>"
    	this.$el.html(header)
				var viewText="<tr></tr>"
			
				viewText+="<tr><td colspan=7>"
				viewText+='<a  id="allresources" >#</a>&nbsp;&nbsp;'
				var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			
		  		for(var i=0; i<str.length; i++)
		   		{
			  	    var nextChar = str.charAt(i);
			 	 	viewText+='<a  class="clickonalphabets" value="'+nextChar+'">'+ nextChar +'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		   		}
				viewText+="</td></tr>"
				this.$el.append(viewText)
    	
    	
    	  
  		this.collection.each(this.addOne, this)
  		
  		var nextPre='<tr><td>'
  		if(this.collection.length >= 20)
  		{
  		  if(this.collection.skip>=20)
  		   nextPre+='<button class="btn btn-success" id="preButton">Back</buttton>'
  		  
  		  nextPre+='<button class="btn btn-success" id="nextButton">Next</buttton>'
  		
  		}
  		nextPre+='</td></tr>'
  		this.$el.append(nextPre)
  		
    },

    render: function() {
        
        
	   
    	var roles=this.getRoles()
    	if(roles.indexOf('Manager')>=0)
    	{
    		this.display=true
    	}
    	else{
    		this.display=false
    	}
      this.addAll()
    },
     getRoles:function(){
        
            var loggedIn = new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            loggedIn.fetch({
                async: false
            })
            var roles = loggedIn.get("roles")
            
            return roles
        }

  })

})


;$(function () {

    App.Views.CommunityReportCommentView = Backbone.View.extend({

        tagName: "div",
        id: "comment-feedback",
        cId: null,
        initialize: function (e) {
            console.log(e)
            this.cId = e.CommunityReportId
            this.model = new App.Models.CommunityReportComment

        },

        events: {
            'click #submitFormButton': 'submit',
            'click #cancelFormButton': 'cancel'
        },
        cancel: function () {
            $('#debug').hide()
            this.remove()
        },
        submit: function () {
            if (this.form.getValue("comment").length != 0) {
                var now = new Date();
                now.getDate()
                this.form.setValue({
                    CommunityReportId: this.cId
                })
                this.form.setValue({
                    commentNumber: (this.collection.length + 1)
                })
                this.form.setValue({
                    memberLogin: $.cookie('Member.login')
                })
                this.form.setValue({
                    time: now.toString()
                })
                this.form.commit()
                this.model.save()
                this.form.setValue({
                    comment: ""
                })
                this.collection.fetch({
                    async: false
                })
                this.model.set({
                    "comment": ""
                })
                this.render()
            }
        },

        addOne: function (modl) {
            $('#comments').append('<div id=tile><b>Login:</b>' + modl.toJSON().memberLogin + '<br/><b>Time:</b>' + modl.toJSON().time + '<br/><b>Comment:</b>' + modl.toJSON().comment + '</div>')
            console.log(modl.toJSON())
        },

        render: function () {
            $('#debug').show()
            this.$el.html('&nbsp;')
            $('#comments').html('&nbsp;')
            this.collection.forEach(this.addOne, this)
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['CommunityReportId'].$el.hide()
            this.form.fields['commentNumber'].$el.hide()
            this.form.fields['memberLogin'].$el.hide()
            this.form.fields['time'].$el.hide()
            var $button = $('<div id="r-formButton"><button class="btn btn-primary" id="submitFormButton">Add Comment</button><button class="btn btn-info" id="cancelFormButton">Close</button></div>')
            this.$el.append($button)
            // $("#comments").animate({ scrollTop: $('#comments')[0].scrollHeight}, 3000);
        }

    })

});$(function () {

    App.Views.ConfigurationView = Backbone.View.extend({

        template: $('#template-Configuration').html(),
        template : _.template($("#template-Configuration").html()),
        vars: {},
        events:{
        	"click #saveLanguage" : function(e)
        	{
              	var isChanged = false
        		var selectedVal = $( "#languageSelection" ).val()
        		if(selectedVal!="")
        		{
        			this.model.set('currentLanguage',selectedVal)
        			isChanged = true
        		}
        		if($('#appversion').val()!="")
            	{
            		this.model.set('version' ,$('#appversion').val() )
            		isChanged = true
            	}
            	if($('#notes').val()!="")
            	{
            		this.model.set('notes' ,$('#notes').val() )	
            		isChanged = true
            	}
            	if(isChanged)
            	{        		
            		var that = this	
            		console.log(this.model.toJSON())
              		this.model.save(null,{success:function(response,model){
              			that.model.set("_rev",response.get("rev"))
              		}})
        			alert('Configuration saved.')
        		    location.reload()
            	}
            	else
            	{
            		alert("You have not changed any thing.")
            	}
        	}
        },
        render: function () {
        	this.vars = this.model.toJSON()
            this.$el.html(this.template(this.vars))
            this.$el.append('<br>&nbsp;&nbsp;<button class="btn btn-success" id="saveLanguage" >Save</button>')
        }

    })

});$(function () {

    App.Views.Configurations = Backbone.View.extend({
    
        initialize: function () {
            this.$el.html('<h3>Set Configurations<h3>')
        },
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            this.form = new Backbone.Form({
                model: this.model
            })

            this.$el.append(this.form.render().el);
            this.$el.append('<a style="margin-left:31px;" class="btn btn-success" id="formButton">Submit Configurations </a>');
        },
        setForm:function(){
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config=this.form.model;
            var config = new App.Collections.Configurations();
            config.fetch({async:false});
            var con=config.first();
            con.set('name',Config.get('name'));
            con.set('nationName',Config.get('nationName'));
            con.set('nationUrl',Config.get('nationUrl'));
            con.set('code',Config.get('code'));
            con.set('type',Config.get('type'));
            con.set('notes',Config.get('notes'));
            con.set('region', Config.get('region'));
            con.set('version', Config.get('version'));
            if(Config.get('selectLanguage') != "Select an Option") {
                con.set('currentLanguage', Config.get('selectLanguage'));
            }
            con.save(null,{ success: function(doc,rev){

                App.configuration = con;

                // Get Current Date
                var currentdate = new Date();
                var year = currentdate.getFullYear();
                var month = (1 + currentdate.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day = currentdate.getDate().toString();
                day = day.length > 1 ? day : '0' + day;
                var logcurrentdate = year + '/' + month + '/' + day;

                $.ajax({
                    type: 'GET',
                    url: '/activitylog/_design/bell/_view/getDocumentByDate?key="'+ logcurrentdate +'"',
                    dataType: 'json',
                    success: function (response) {
                        var logModel = response.rows[0].value;
                        logModel.community = App.configuration.get("code");

                        //Now Posting the Updated Activitylog Model
                        $.ajax({
                            type: 'PUT',
                            url: '/activitylog/'+ logModel._id +'/?rev=' + logModel._rev,
                            data: JSON.stringify(logModel),
                            async: false,
                            dataType: 'json',
                            success: function (response) {
                                console.log(response);
                            }
                        });
                    }
                });

                alert('Configurations are Successfully Added');
                Backbone.history.navigate('dashboard', {trigger: true});
            }});
        }

    })

});$(function () {

    App.Views.CourseInfoView = Backbone.View.extend({


        authorName: null,
        tagName: "table",

        className: "courseInfo-table",
        initialize: function () {
            this.$el.html('<th colspan="20">Course Information</th>')
        },

        add: function (model) {
            //Single Author Should not be displayed multiple times on The Screen

        },


        render: function () {
            var courseInfo = this.model.toJSON()
            var leaderInfo = this.leader.toJSON()
            

            this.$el.append('<tr><td>Name : </td><td>' + courseInfo.name + '</td></tr>')
            this.$el.append('<tr><td>Levels : </td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td>Description : </td><td>' + courseInfo.description + '</td></tr>')

            this.$el.append('<tr><td>Leader Name: </td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td>Leader Email : </td><td>' + leaderInfo.email + '</td></tr>')
            this.$el.append('<tr><td>Leader Phone Number : </td><td>' + leaderInfo.phone + '</td></tr>')
            var bgcolor = ''
            var fgcolor = ''
            if (courseInfo.backgroundColor == '')
                bgcolor = 'Not Set'
            this.$el.append('<tr><td>Background Color : </td><td><div style="border:2px solid black;width:50px;height:20px;background-color:' + courseInfo.backgroundColor + '"></div>' + bgcolor + '</td></tr>')
            if (courseInfo.foregroundColor == '')
                fgcolor = 'Not Set'
            this.$el.append('<tr><td>foreground Color :</td><td><div style="border:2px solid black;width:50px;height:20px;background-color:' + courseInfo.foregroundColor + '"></div>' + fgcolor + '</td></tr>')

        },

    })

});$(function () {

    App.Views.CourseLevelsTable = Backbone.View.extend({
        id: "accordion",
        vars: {},
        modl: null,
        template: _.template($("#template-courseLevelsTable").html()),
        events: {
            "click #takequiz": "quiz",
            "click #resourseOpened": function (e) {
                resid = e.target.attributes.rid.nodeValue
                var member = new App.Models.Member({
                    _id: $.cookie('Member._id')
                })
                member.fetch({
                    async: false
                })
                var pending = []
                if(member.get("pendingReviews")){
                    pending = member.get("pendingReviews")
                }
                pending.push(resid)
                member.set("pendingReviews", pending)
                member.save()
                ratingModel = new App.Models.Feedback()
                ratingModel.set('resourceId', resid)
                ratingModel.set('memberId', $.cookie('Member._id'))
                ratingView = new App.Views.FeedbackForm({
                    model: ratingModel,
                    resId: resid
                })
                $('#externalDiv').html('<div id="star"></div>')
                $('#star').append("Rating<br/>")
                $('#star').raty()
                $("#star > img").click(function () {
                    ratingView.setUserRating($(this).attr("alt"))
                });
                ratingView.render()
                $('#externalDiv').append(ratingView.el)
                $('#externalDiv').show()

            },
        },

        quiz: function (e) {
            var context=this
            var id = e.currentTarget.value
            step = new App.Models.CourseStep({
                _id: id
            })
            step.fetch({
                async: false
            })
            var JSONsteps=null;
//            if(step.toJSON().questions==undefined)
//            {
//            	var CourseStep=new PouchDB('coursestep');
//				CourseStep.get(e.currentTarget.value, function(err, doc) {
//
//				console.log(doc)
//              	JSONsteps=doc
//
//              	var ssids = context.modl.stepsIds
//				var index = ssids.indexOf(id)
//				var temp = new App.Views.takeQuizView({
//					questions: JSONsteps.questions,
//					answers: JSONsteps.answers,
//					options: JSONsteps.qoptions,
//					passP: JSONsteps.passingPercentage,
//					resultModel: context.modl,
//					stepIndex: index
//				})
//				temp.render()
//				$('div.takeQuizDiv').html(temp.el)
//				});
//            }
//            else
//            {
            JSONsteps=step.toJSON()

            var ssids = context.modl.get('stepsIds')
            var index = ssids.indexOf(id)
            var temp = new App.Views.takeQuizView({
                questions: JSONsteps.questions,
                answers: JSONsteps.answers,
                options: JSONsteps.qoptions,
                passP: JSONsteps.passingPercentage,
                resultModel: context.modl,
                stepIndex: index
            })
            temp.render()
            $('div.takeQuizDiv').html(temp.el)


//            }
        },

        initialize: function () {
            $('div.takeQuizDiv').hide()
        },
        addAll: function () {
            this.collection.each(this.addOne, this)
        },

        addOne: function (model) {
            //  var upto=0
//            if (model.get("resourceTitles")) {    
//                 max = model.get("resourceTitles").length
//                 
//                 for (var i = 0; i < max; i++) {
//                   var rtitle = model.get("resourceTitles")
//                   var rid = model.get("resourceId")
//                     var r = new App.Models.Resource({
//                         "_id": rid[upto]
//                     })
//                     r.fetch({
//                         async: false
//                     })
//                     if(r.get("hidden")==true)
//                     {
//                     	var index = model.get("resourceId").indexOf(r.get("_id").toString())  	
//                			if(index!=-1){
//                				model.get("resourceId").splice(index,1)
//                				model.get("resourceTitles").splice(index,1)
//                			}
//                					
//                     }else{
//                			upto++
//                		}
//                 }
//              }
            this.vars = model.toJSON()

            if (!this.vars.outComes) {

                this.vars.outComes = ''
                if (this.vars.questions && this.vars.questions.length > 0)
                    this.vars.outComes = ['Quiz']
            }
            else if(this.vars.outComes instanceof Array){}
            else{
                var temp=this.vars.outComes
                this.vars.outComes=new Array()
                this.vars.outComes[0]=temp

            }

            var index = 0
            var sstatus = this.modl.get('stepsStatus')
            var ssids = this.modl.get('stepsIds')
            var sr = this.modl.get('stepsResult')

            while (index < sstatus.length && ssids[index] != this.vars._id) {
                index++
            }

            if (index == sstatus.length) {
                this.vars.status = 'Error!!'
                this.vars.marks = 'Error!!'
            } else {
                this.vars.status = sstatus[index]
                this.vars.marks = sr[index]
                this.vars.index = index
            }
            var attachmentNames = new Array()
            var attachmentURLs = new Array()
            if(model.get('_attachments'))
            {
                for (i = 0; i < _.keys(model.get('_attachments')).length; i++) {

                    var attachmentURL = '/coursestep/' + model.get('_id') + '/'
                    var attachmentName = ''
                    if (typeof model.get('_attachments') !== 'undefined') {
                        attachmentURL = attachmentURL + _.keys(model.get('_attachments'))[i]
                        attachmentName = _.keys(model.get('_attachments'))[i]
                        attachmentNames.push(attachmentName)
                        attachmentURLs.push(attachmentURL)
                    }
                }
            }
            this.vars.attachmentNames = attachmentNames
            this.vars.attachmentURLs = attachmentURLs
            this.$el.append(this.template(this.vars))

        },

        setAllResults: function () {
            var context=this
            var memId=$.cookie('Member._id')
            var couId=this.collection.first().get("courseId")

        	var MemberCourseProgress=new PouchDB('membercourseprogress');
   	   		MemberCourseProgress.query({map:function(doc){
            	 if(doc.memberId && doc.courseId){
               		emit([doc.memberId,doc.courseId],doc)
         		 }
   			}
   			},{key:[memId,couId]},function(err,res){

                    var memberProgress=new App.Collections.membercourseprogresses()
                    memberProgress.memberId=memId
                    memberProgress.courseId=couId
                    memberProgress.fetch({async:false,
                        success:function(){
                            context.renderaccordian(memberProgress.first())
                        }

                    })
		   });
        },
        renderaccordian:function(model){

            var context=this
            context.modl=model

            var PassedSteps = 0
            var sstatus = context.modl.get('stepsStatus')
            var totalSteps = sstatus.length
            while (PassedSteps < totalSteps && sstatus[PassedSteps] != '0') {
                PassedSteps++
            }

            context.addAll()
            $("#accordion").accordion({
                header: "h3",
                heightStyle: "content"
            }).sortable({
                axis: "y",
                handle: "h3",
                stop: function (event, ui) {
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.children("h3").triggerHandler("focusout");
                }
            });



        },

//Before pouchDB work this function is used   
        /*settingArgs:function(){
         var memId=$.cookie('Member._id')
         var couId=this.collection.first().get("courseId")

         var res = new App.Collections.membercourseprogresses()
         res.courseId = couId
         res.memberId = memId
         setAllResults: function () {
         var memId=$.cookie('Member._id')
         var couId=this.collection.first().get("courseId")

         var MemberCourseProgress=new PouchDB('membercourseprogress');
         MemberCourseProgress.query({map:function(doc){
         if(doc.memberId && doc.courseId){
         emit([doc.memberId,doc.courseId],doc)
         }
         }
         },{key:[memId,couId]},function(err,res){

         console.log(res)
         console.log(err)
         alert('this is responce')


         });


         var res = new App.Collections.membercourseprogresses()
         res.courseId = this.collection.first().get("courseId")
         res.memberId = $.cookie('Member._id')
         res.fetch({
         async: false
         })
         console.log(res.toJSON())
         var PassedSteps = 0
         var totalSteps = 0
         if (res.length != 0) {
         this.modl = res.first()
         this.modl=this.modl.toJSON()
         PassedSteps = 0
         var sstatus = this.modl.stepsStatus
         totalSteps = sstatus.length
         while (PassedSteps < totalSteps && sstatus[PassedSteps] != '0') {
         PassedSteps++
         }
         }
         this.addAll()
         },
         */
        render: function () {

            if (this.collection.length < 1) {
                this.$el.append('<p style="font-weight:900;">No data related to selected course found</p>')
            } else {
                this.setAllResults()
            }

        }

    })

});$(function () {

    App.Views.CourseSearch = Backbone.View.extend({


        template: $('#template-Search').html(),

        vars: {},
        groupresult: null,
        resultArray: null,

        initialize: function () {
            this.groupresult = new App.Collections.SearchCourses()
            this.resultArray = []
            enablenext = 0
        },
        render: function () {
            var obj = this
            //this.$el.html(_.template(this.template, this.vars))
            //this.searchText = $("#searchText").val()
            // alert(searchText)
            if (searchText != "") {
                this.fetchRecords()
            }
        },

        fetchRecords: function () {
            var obj = this
            this.groupresult.fetch({
                success: function () {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.groupresult.models, searchText))


                    if (obj.resultArray.length != searchRecordsPerPage && obj.groupresult.models.length == limitofRecords) {
                        obj.fetchRecords()
                    } else if (obj.groupresult.models.length == 0) {
                        previousPageButtonPressed()

                    } else if (obj.groupresult.models.length < limitofRecords && obj.resultArray.length == 0 && skipStack.length == 1) {
                        $('#not-found').html("No Such Record Exist");
                        $("#selectAllButton").hide()


                    } else {
                        var ResultCollection = new Backbone.Collection();
                        if (obj.resultArray.length > 0) {
                            ResultCollection.set(obj.resultArray)
                            var SearchSpans = new App.Views.GroupsTable({
                                collection: ResultCollection
                            })
                            SearchSpans.resourceids = obj.resourceids
                            SearchSpans.render()
                            $('.body').append(SearchSpans.el)
                        }
                        else{
                                $('#not-found').html("No Such Record Exist");
                                $('#not-found').show()
                        }

                    }
                }
            })

        },
        searchInArray: function (resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount

            if (searchText != "") {
                _.each(resourceArray, function (result) {
                    if (result.get("name") != null) {
                        skip++
                        //console.log( skip+' '+result.get("title"))
                        if (result.get("name").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
                            if (resultArray.length < searchRecordsPerPage) {
                                resultArray.push(result)
                            } else {
                                enablenext = 1
                                skip--
                            }
                        } else if (resultArray.length >= searchRecordsPerPage) {
                            skip--
                        }
                    }
                })

            }
            return resultArray
        }

    })

});$(function () {
    App.Views.CourseStepsView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,

        addOne: function (model) {

        },
        render: function () {
            this.collection.each(this.addStep, this)

        },
        addStep: function (model) {

            this.$el.append('<tr><td></td><td><b>' + model.get('title') + '</b></br></br>' + model.get('description') + '</td></tr>')

        }

    })

});$(function () {
    App.Views.CoursesChartProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        grandpassed: null,
        grandremaining: null,
        events: {
            "click #Donut": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'hidden'
                document.getElementById('veticallable').style.visibility = 'hidden'
                this.$el.html('<a class="btn btn-info" id="Bar">Detailed View</a>')
                Morris.Donut({
                    element: 'graph',
                    data: [{
                        label: "Passed Steps",
                        value: this.grandpassed
                    }, {
                        label: "Remaining Steps",
                        value: this.grandremaining
                    }],
                    colors: ['#0B62A4', '#7A92A3']

                });
            },
            "click #Bar": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'visible'
                document.getElementById('veticallable').style.visibility = 'visible'

                this.$el.html('<a class="btn btn-info" id="Donut">Birdeye View</a>')
                Morris.Bar({
                    element: 'graph',
                    data: this.arrayOfData,
                    xkey: 'subject',
                    ykeys: ['passed', 'remaining'],
                    labels: ['passed', 'remaining'],
                    gridTextWeight: 900,
                    gridTextSize: 16,
                    axes: true,
                    grid: true,
                    stacked: true
                });
            }


        },


        addOne: function (model) {
            temp = new Object
            data = model.toJSON().stepsStatus
            total = model.toJSON().stepsStatus.length
            passed = 0
            remaining = 0
            for (var i = 0; i < total; i++) {
                if (data[i] != "1") {
                    remaining++
                    this.grandremaining++
                } else {
                    passed++
                    this.grandpassed++
                }
            }
            course = new App.Models.Group({
                _id: model.toJSON().courseId
            })
            course.fetch({
                async: false
            })
            if (total == 0) {
                temp.subject = (course.toJSON().name + " (No Steps)")
            } else {
                temp.subject = (course.toJSON().name)
            }

            temp.passed = passed
            temp.remaining = remaining
            this.arrayOfData.push(temp)
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {
                alert("No Data Found on Server")
            }
        },

        render: function () {
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()

            Morris.Bar({
                element: 'graph',
                data: this.arrayOfData,
                xkey: 'subject',
                ykeys: ['passed', 'remaining'],
                labels: ['passed', 'remaining'],
                gridTextWeight: 900,
                gridTextSize: 12,
                axes: true,
                grid: true,
                stacked: true,
                xLabelMargin: 5


            });
            this.$el.append('<a class="btn btn-info" id="Donut">Birdeye View</a>')
        }

    })

});$(function () {
    App.Views.CoursesStudentsProgress = Backbone.View.extend({

        tagName: "div",
        className: "Graphbutton",
        arrayOfData: new Array,
        grandpassed: null,
        grandremaining: null,
        totalRecords: null,
        startFrom: null,
        totalSpace: null,
        events: {
            "click #Donut": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'hidden'
                document.getElementById('veticallable').style.visibility = 'hidden'
                this.$el.html('<a class="btn btn-info" id="Bar">Detailed View</a>')
                Morris.Donut({
                    element: 'graph',
                    data: [{
                        label: "Passed Steps",
                        value: this.grandpassed
                    }, {
                        label: "Remaining Steps",
                        value: this.grandremaining
                    }],
                    colors: ['#0B62A4', '#7A92A3']

                });
            },
            "click #Bar": function () {
                $('#graph').html(' ')
                document.getElementById('horizontallabel').style.visibility = 'visible'
                document.getElementById('veticallable').style.visibility = 'visible'

                this.$el.html('<a class="btn btn-info" id="Donut">Birdeye View</a>')
                Morris.Bar({
                    element: 'graph',
                    data: this.arrayOfData,
                    xkey: 'subject',
                    ykeys: ['passed', 'remaining'],
                    labels: ['passed', 'remaining'],
                    gridTextWeight: 900,
                    gridTextSize: 16,
                    axes: true,
                    grid: true,
                    stacked: true
                });
            }


        },


        addOne: function (model) {
            var that = this
            temp = new Object

            data = model.toJSON().stepsStatus
            total = model.toJSON().stepsStatus.length
            passed = 0
            remaining = 0
            for (var i = 0; i < total; i++) {
                if (data[i] != "1") {
                    remaining++
                    this.grandremaining++
                } else {
                    passed++
                    this.grandpassed++
                }
            }
            student = new App.Models.Member({
                _id: model.toJSON().memberId
            })
            student.fetch({
                async: false
            })
            console.log(student.toJSON())
            if (student.toJSON().firstName != undefined) {
                temp.name = student.toJSON().firstName
                temp.passed = passed
                temp.remaining = remaining
                this.arrayOfData.push(temp)

                var assignmentpapers = new App.Collections.AssignmentPapers()
                assignmentpapers.senderId = model.get("memberId")
                assignmentpapers.courseId = model.get("courseId")
                assignmentpapers.fetch({
                    async: false
                })
                var marginLeft = this.startFrom + (this.totalSpace / 2) - 8
                var papers = '<table style="margin-top:14px;margin-left: ' + marginLeft + '%; position:absolute ">'

                assignmentpapers.each(function (m) {
                    var attchmentURL = '/assignmentpaper/' + m.get("_id") + '/'
                    var attachmentName = ''
                    if (typeof m.get('_attachments') !== 'undefined') {
                        attchmentURL = attchmentURL + _.keys(m.get('_attachments'))[0]
                        attachmentName = _.keys(m.get('_attachments'))[0]
                    }
                    papers = papers + '<tr><td><a href="' + attchmentURL + '" target="_blank" ><button class="btn btn-primary">Paper for Step No. ' + m.get("stepNo") + '</button></td></tr></a>'
                })
                papers = papers + '</table>'
                this.$el.append(papers)
                this.startFrom = this.startFrom + this.totalSpace
            }
        },

        BuildString: function () {
            if (this.collection.length != 0) {
                this.startFrom = 4
                this.totalRecords = this.collection.length
                this.totalSpace = 93 / this.collection.length
                this.collection.each(this.addOne, this)
            } else {
                alert("No Data Found on Server")
            }
        },
        render: function () {
            this.arrayOfData = []
            this.grandpassed = 0
            this.grandremaining = 0
            this.BuildString()

            Morris.Bar({
                element: 'graph',
                data: this.arrayOfData,
                xkey: 'name',
                ykeys: ['passed', 'remaining'],
                labels: ['passed', 'remaining'],
                gridTextWeight: 900,
                gridTextSize: 12,
                axes: true,
                grid: true,
                stacked: true,
                xLabelMargin: 5
            });
            //this.$el.append('<a class="btn btn-info" id="Donut">Birdeye View</a>')
        }

    })

});$(function() {

    App.Views.Dashboard = Backbone.View.extend({

        template: $('#template-Dashboard').html(),

        vars: {},
        nationConfiguration: null,
        latestVersion: null,
        nationConfigJson: null,
        events: {
            "click #updateButton": 'updateVersion',
            "click #showReleaseNotesDiv": function(e) {
                if ($('#releaseVersion').css('display') == 'none') {
                    $("#releaseVersion").slideDown("slow", function() {

                    });
                } else {
                    $("#releaseVersion").slideUp("slow", function() {
                        $('#appversion').val("")
                        $('#notes').val("")
                    });
                }
            },
            "click #cancelnotes": function(e) {
                $("#releaseVersion").slideUp("slow", function() {
                    $('#appversion').val("")
                    $('#notes').val("")
                });
            },
            "click #savenotes": function(e) {
                if ($('#appversion').val() == "") {
                    alert("Please enter version no.")
                    return
                }
                if ($('#notes').val() == "") {
                    alert("Please enter release notes.")
                    return
                }

                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                })
                var config = new configurations()
                config.fetch({
                    async: false
                })
                var con = config.first()
                con = (con.get('rows')[0]).doc
                var conTable = new App.Models.ReleaseNotes({
                    _id: con._id
                })
                conTable.fetch({
                    async: false
                })
                conTable.set('version', $('#appversion').val())
                conTable.set('notes', $('#notes').val())
                conTable.save(null, {
                    success: function(e) {
                        $("#releaseVersion").slideUp("slow", function() {
                            $('#appversion').val("")
                            $('#notes').val("")
                            alert('Notes successfully saved.')
                        })
                    }
                })


            },
            "click #viewReleaseNotes": function(e) {
                if ($('#showReleaseNotes').css('display') == 'none') {
                    $("#showReleaseNotes").slideDown("slow", function() {
                        $("textarea#shownotes").val(nationConfigJson.notes)

                    });
                } else {
                    $("#showReleaseNotes").slideUp("slow", function() {});
                }
            }
        },
        updateVersion: function(e) {
            var that = this;
            App.startActivityIndicator();

            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON().rows[0].doc
            currentConfig.version = this.latestVersion
            var nationName = currentConfig.nationName
            var nationURL = currentConfig.nationUrl

            //Checking whether the community is registered with any nation or not.
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true&key="' + App.configuration.get('code') + '"',
                type: 'GET',
                dataType: 'jsonp',
                success: function(result) {
                    if (result.rows.length > 0) {
                        // Replicate Application Code from Nation to Community
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            type: 'POST',
                            url: '/_replicate',
                            dataType: 'json',
                            data: JSON.stringify({
                                "source": 'http://' + nationName + ':oleoleole@' + nationURL + '/apps',
                                "target": "apps"
                            }),
                            async: false,
                            success: function(response) {

                                // Update version Number in Configuration of Community
                                $.ajax({

                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'multipart/form-data'
                                    },
                                    type: 'PUT',
                                    url: App.Server + '/configurations/' + currentConfig._id + '?rev=' + currentConfig._rev,
                                    dataType: 'json',
                                    data: JSON.stringify(currentConfig),
                                    success: function(response) {
                                        console.log("Configurations Updated")
                                    },

                                    async: false
                                });

                                //////////////////    Onward are the Ajax Request for all Updated Design Docs //////////////////
                                that.updateDesignDocs("activitylog");
                                that.updateDesignDocs("members");
                                that.updateDesignDocs("collectionlist");
                                that.updateDesignDocs("community");
                                that.updateDesignDocs("resources");
                                that.updateDesignDocs("coursestep");
                                that.updateDesignDocs("groups");
                                that.updateDesignDocs("publications");
                                //Following are the list of db's on which design_docs are not updating,
                                // whenever the design_docs will be changed in a db,that db's call will be un-commented.
                                //that.updateDesignDocs("assignmentpaper");
                                //that.updateDesignDocs("assignments");
                                //that.updateDesignDocs("calendar");
                                //that.updateDesignDocs("communityreports");
                                //that.updateDesignDocs("courseschedule");
                                //that.updateDesignDocs("feedback");
                                //that.updateDesignDocs("invitations");
                                //that.updateDesignDocs("mail");
                                //that.updateDesignDocs("meetups");
                                //that.updateDesignDocs("membercourseprogress");
                                //that.updateDesignDocs("nationreports");
                                //that.updateDesignDocs("publicationdistribution");
                                //that.updateDesignDocs("report");
                                //that.updateDesignDocs("requests");
                                //that.updateDesignDocs("resourcefrequency");
                                //that.updateDesignDocs("shelf");
                                //that.updateDesignDocs("usermeetups");
                            },
                            error: function() {
                                App.stopActivityIndicator()
                                alert("Not Replicated!")
                            }
                        });

                        // Update LastAppUpdateDate at Nation's Community Records
                        var communityModel = result.rows[0].value;
                        var communityModelId = result.rows[0].id;
                        //Replicate from Nation to Community
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            type: 'POST',
                            url: '/_replicate',
                            dataType: 'json',
                            data: JSON.stringify({
                                "source": 'http://' + nationName + ':oleoleole@' + nationURL + '/community',
                                "target": "community",
                                "doc_ids": [communityModelId]
                            }),
                            success: function(response) {
                                console.log("Successfully Replicated.");
                                var date = new Date();
                                var year = date.getFullYear();
                                var month = (1 + date.getMonth()).toString();
                                month = month.length > 1 ? month : '0' + month;
                                var day = date.getDate().toString();
                                day = day.length > 1 ? day : '0' + day;
                                var formattedDate = month + '-' + day + '-' + year;

                                communityModel.lastAppUpdateDate = month + '/' + day + '/' + year;
                                communityModel.version = currentConfig.version;
                                //Update the record in Community db at Community Level
                                $.ajax({

                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'multipart/form-data'
                                    },
                                    type: 'PUT',
                                    url: App.Server + '/community/' + communityModelId + '?rev=' + communityModel._rev,
                                    dataType: 'json',
                                    data: JSON.stringify(communityModel),
                                    success: function(response) {
                                        //Replicate from Community to Nation
                                        $.ajax({
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json; charset=utf-8'
                                            },
                                            type: 'POST',
                                            url: '/_replicate',
                                            dataType: 'json',
                                            data: JSON.stringify({
                                                "source": "community",
                                                "target": 'http://' + nationName + ':oleoleole@' + nationURL + '/community',
                                                "doc_ids": [communityModelId]
                                            }),
                                            success: function(response) {
                                                //console.log("Successfully Replicated.");
                                                alert("Updated Successfully");
                                                window.location.reload(false);
                                            },
                                            async: false
                                        });
                                    },

                                    async: false
                                });
                            },
                            async: false
                        });
                    } else {
                        alert(" The community is not authorized to update until it is properly configured with a nation");
                        window.location.reload(false);
                    }
                },
                error: function() {
                    console.log('http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?key="' + App.configuration.get('code') + '"');
                }
            });
        },

        updateDesignDocs: function(dbName) {
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON().rows[0].doc
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
                    "source": 'http://' + nationName + ':oleoleole@' + nationURL + '/' + dbName,
                    "target": dbName,
                    "doc_ids": ["_design/bell"]
                }),
                success: function(response) {
                    console.log(dbName + " DesignDocs successfully updated.");
                },
                async: false
            });
        },
        render: function() {

            var dashboard = this
            this.vars.mails = 0
            var clanguage = App.configuration.get("currentLanguage")
            var typeofBell = App.configuration.get("type")
            console.log(App.languageDict)
            console.log(clanguage)
            this.vars.languageDict = App.languageDict;

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
            groups.fetch({
                success: function(e) {
                    groupsSpans = new App.Views.GroupsSpans({
                        collection: groups
                    })
                    groupsSpans.render()

                    $('#cc').append(groupsSpans.el)

                    TutorsSpans = new App.Views.TutorsSpans({
                        collection: groups
                    })

                    TutorsSpans.render()
                    $('#tutorTable').append(TutorsSpans.el)
                }
            })

            // dashboard.$el.children('.groups').append(groupsDiv.el)

            shelfSpans = new App.Views.ShelfSpans()
            shelfSpans.render()

            UserMeetups = new App.Collections.UserMeetups()
            UserMeetups.memberId = $.cookie('Member._id')
            UserMeetups.fetch({
                async: false
            })
            MeetupSpans = new App.Views.MeetupSpans({
                collection: UserMeetups
            })
            MeetupSpans.render()
            $('#meetUpTable').append(MeetupSpans.el)



            //this.$el.children('.now').html(moment().format('dddd') + ' | ' + moment().format('LL'))
            // Time
            $('.now').html(moment().format('dddd | DD MMMM, YYYY'))
            // Member Name
            var member = App.member
            var attchmentURL = '/members/' + member.id + '/'
            if (typeof member.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(member.get('_attachments'))[0]
                document.getElementById("imgurl").src = attchmentURL
            }
            //////////////////////////////////////Issue No 73: Typo: Nation BeLL name (After) Getting Name from Configurations////////////////////////////////////
            var currentConfig;
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false,
                success: function() {
                    currentConfig = config.first().toJSON().rows[0].doc;
                }
            })
            var bell_Name = currentConfig.name;
            var typeofBell = currentConfig.type;

            //////////////////////////////////////code for Issue No#73 (before) getting name from URL///////////////////////////////////////////////////////////
            /*var temp = $.url().data.attr.host.split(".")
             temp = temp[0];
             if (temp.substring(0, 3) == "127") {
             temp = "local"
             }
             temp = temp.charAt(0).toUpperCase() + temp.slice(1);
             if (typeofBell === "nation") {
             temp = temp + " Nation Bell"
             } else {
             temp = temp + " Community Bell"
             }*/
            //******************************************************************************************************************************************************
            bell_Name = bell_Name.charAt(0).toUpperCase() + bell_Name.slice(1); //capitalizing the first alphabet of the name.
            if (typeofBell === "nation") //checking that is it a nation or community
            {
                bell_Name = bell_Name + " Nation Bell"
            } else {
                bell_Name = bell_Name + " Community Bell"
            }
            $('.bellLocation').html(bell_Name); //rendering the name on page
            if (!member.get('visits')) {
                member.set('visits', 1)
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
                if (typeofBell == 'nation') {
                    roles = roles + '<a href="../nation/index.html#dashboard">Manager</a>'
                } else {
                    roles = roles + '<a href="#communityManage">Manager</a>'
                }
            }
            $('.visits').html(temp)
            $('.name').html(member.get('firstName') + ' ' + member.get('lastName') + '<span style="font-size:15px;">' + roles + '</span>' + '&nbsp;<a href="#member/edit/' + $.cookie('Member._id') + '"><i class="fui-gear"></i></a>')
            dashboard.checkAvailableUpdates(member.get('roles'), dashboard)
            if ($.cookie('Member.login') === "admin") {
                var $buttonWelcome = $('<button id="welcomeButton" class="btn btn-hg btn-primary" onclick="document.location.href=\'#updatewelcomevideo\'">Update Welcome Video</button>');
                dashboard.$el.append($buttonWelcome);
            }

            //dashboard.$el.append('<div id="updates"></div>')
        },
        checkAvailableUpdates: function(roles, dashboard) {
            var context = this
            if ($.inArray('Manager', roles) == -1) {
                return
            }
            var configuration = App.configuration
            var nationName = configuration.get("nationName")
            var nationURL = configuration.get("nationUrl")
            var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + '/configurations/_all_docs?include_docs=true'

            nName = App.configuration.get('nationName')
            pass = App.password
            nUrl = App.configuration.get('nationUrl')
            currentBellName = App.configuration.get('name')
            var htmlreferance = this.$el

            var DbUrl = 'http://' + nName + ':' + pass + '@' + nUrl + '/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&key=["' + currentBellName + '",' + false + ']'


            $.ajax({
                url: nationConfigURL,
                type: 'GET',
                dataType: "jsonp",
                success: function(json) {
                    var nationConfig = json.rows[0].doc
                    nationConfigJson = nationConfig
                    if (typeof nationConfig.version === 'undefined') {
                        /////No version found in nation
                    } else if (nationConfig.version == configuration.get('version')) {
                        ///No updatea availabe
                    } else {
                        if (context.versionCompare(nationConfig.version, configuration.get('version')) < 0) {
                            console.log("Nation has lower application version than that of your community application")
                        } else if (context.versionCompare(nationConfig.version, configuration.get('version')) > 0) {
                            dashboard.latestVersion = nationConfig.version
                            dashboard.$el.append('<button class="btn systemUpdate" id="updateButton">System Update Available (' + nationConfig.version + ') </button>')
                            dashboard.$el.append('<button class="btn systemUpdate" id="viewReleaseNotes">View Release Notes </button>')
                        } else {
                            console.log("Nation is uptodate")
                        }
                    }
                },
                error: function(jqXHR, status, errorThrown) {
                    console.log('Error fetching application version from nation "' + configuration.nationName + '"');
                    console.log(status);
                    console.log(errorThrown);
                }
            });

            // make sure the couchdb that is being requested in this ajax call has its 'allow_jsonp' property set to true in the
            // 'httpd' section of couchdb configurations. Otherwise, the server couchdb will not respond as required by jsonp format
            $.ajax({
                url: DbUrl,
                type: 'GET',
                dataType: 'jsonp',
                success: function(json) {
                    var publicationDistribDocsFromNation = [],
                        tempKeys = [];
                    _.each(json.rows, function(row) {
                        publicationDistribDocsFromNation.push(row.doc);
                        tempKeys.push(row.doc.publicationId);
                    });
                    // fetch all publications from local/community server to see how many of the publications from nation are new ones
                    var newPublicationsCount = 0;
                    var publicationCollection = new App.Collections.Publication();
                    var tempUrl = App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true';
                    publicationCollection.setUrl(tempUrl);
                    publicationCollection.fetch({
                        success: function() {
                            var alreadySyncedPublications = publicationCollection.models;
                            for (var i in publicationDistribDocsFromNation) {
                                // if this publication doc exists in the list of docs fetched from nation then ignore it from new publications
                                // count
                                var index = alreadySyncedPublications.map(function(element) {
                                    return element.get('_id');
                                }).indexOf(publicationDistribDocsFromNation[i].publicationId);
                                if (index > -1) {
                                    // don't increment newPublicationsCount cuz this publicationId already exists in the already synced publications at
                                    // local server
                                } else {
                                    newPublicationsCount++;
                                }
                            }
                            if (newPublicationsCount > 0)
                                dashboard.$el.append('<a class="btn systemUpdate" id="newPublication" href="#publications/for-' + currentBellName + '">Publications (new ' + newPublicationsCount + ')</a>')
                        }
                    });
                },
                error: function(jqXHR, status, errorThrown) {
                    console.log(jqXHR);
                    console.log(status);
                    console.log(errorThrown);
                }
            });
        },
        //following function compare version numbers.
        /*<li>0 if the versions are equal</li>
         A negative integer iff v1 < v2
         A positive integer iff v1 > v2
         NaN if either version string is in the wrong format*/

        versionCompare: function(v1, v2, options) {
            var lexicographical = options && options.lexicographical;
            zeroExtend = options && options.zeroExtend;
            v1parts = v1.split('.');
            v2parts = v2.split('.');

            function isValidPart(x) {
                return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
            }

            if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
                return NaN;
            }

            if (zeroExtend) {
                while (v1parts.length < v2parts.length) v1parts.push("0");
                while (v2parts.length < v1parts.length) v2parts.push("0");
            }

            if (!lexicographical) {
                v1parts = v1parts.map(Number);
                v2parts = v2parts.map(Number);
            }

            for (var i = 0; i < v1parts.length; ++i) {
                if (v2parts.length == i) {
                    return 1;
                }

                if (v1parts[i] == v2parts[i]) {
                    continue;
                } else if (v1parts[i] > v2parts[i]) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (v1parts.length != v2parts.length) {
                return -1;
            }

            return 0;
        }
    })

});$(function () {

    App.Views.EventInfo = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "btable btable-striped resourceDetail",
        sid: null,
        rid: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyEvent": function (e) {
            
             var vars = this.model.toJSON()
             var mId=$.cookie('Member._id')
             
             this.model.destroy()
             
             alert("Event Successfully Deleted!!!")
                    Backbone.history.navigate('calendar', {
                        trigger: true
                    })
      
        }
        },
        initialize: function () {
            this.$el.append('<th colspan="2"><h6>Event Detail</h6></th>')
        },
        render: function () {
            var vars = this.model.toJSON()
            var date=new Date(vars.schedule)
                vars.schedule=date.toUTCString()
                
            console.log(vars)
            
            this.$el.append("<tr><td>Title</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>Description</td><td>" + vars.description + "</td></tr>")
            this.$el.append("<tr><td>Start Date</td><td>" + vars.startDate + "</td></tr>")
            this.$el.append("<tr><td>End Date</td><td>" + vars.endDate+ "</td></tr>")
            this.$el.append("<tr><td>Timing</td><td>" + vars.startTime + "-"+vars.endTime+"</td></tr>")
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyEvent">Destroy</button><a href="#calendar" style="margin-left:10px" class="btn btn-info">&lt;&lt; Calendar</a></td></tr>')

        },

    })

});$(function() {

    App.Views.FeedbackForm = Backbone.View.extend({

        tagName: "form",
        user_rating: 'null',
        events: {
            "click #formButton": "setForm",
            //"click #AddToShelf": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function() {
            var that = this;
            this.user_rating = 0;
            console.log(this.model);
            this.form = new Backbone.Form({
                model: this.model
            });
            var model = this.model;
            this.$el.append(this.form.render().el);
            this.form.fields['rating'].$el.hide();
            this.form.fields['memberId'].$el.hide();
            this.form.fields['resourceId'].$el.hide();
            this.form.fields['communityCode'].$el.hide();
            var $button = $('<a class="btn btn-success" style="margin-left:10px" id="formButton">Save</a>');
            $btnAddToShelf = $('<button class="btn btn-success" id="AddToShelf" style="margin-left:10px">Save And Add To My Library</button>');
            this.$el.append($button);
            this.$el.append($btnAddToShelf);
            //Issue#61: Update buttons Add Feedback form when rating a resource
            $btnAddToShelf.click(function() {
                that.setForm();
                if (that.user_rating > 0) {
                    AddToShelfAndSaveFeedback(model.get('resourceId'), escape(that.rtitle));
                }
            });
            //////////////////////////////////////////////////////////////////////
        },
        setFormFromEnterKey: function(event) {
            event.preventDefault();
            this.setForm();
        },
        setUserRating: function(userRating) {
            this.user_rating = userRating;
        },
        setForm: function() {
            // Put the form's input into the model in memory
            if (this.user_rating == 0) {
                alert("Please rate the resource first");
            } else {
                // Put the form's input into the model in memory
                if (this.form.getValue('comment').length == 0) {
                    this.form.setValue('comment', 'No Comment');
                }
                this.form.setValue('rating', this.user_rating);
                this.form.setValue('communityCode', App.configuration.get('code'));

                this.form.commit();
                var that = this;

                var feedbackModel = that.model;
                var member = new App.Models.Member();
                member.set('_id', $.cookie('Member._id'));
                member.fetch({
                    success: function(upModel, upRev) {
                        that.logActivity(upModel, feedbackModel);
                    }
                })
                var FeedBackDb = new PouchDB('feedback');
                FeedBackDb.post(that.model.toJSON(), function(err, info) {
                    if (!err) {
                        var Resources = new PouchDB('resources');
                        var resId = that.model.get("resourceId");
                        console.log(resId);
                        Resources.get(resId, function(err, resdoc) {
                            console.log(err);
                            console.log(resdoc);
                            if (!err) {
                                var numRating = parseInt(resdoc.timesRated);
                                numRating++;
                                var sumRating = parseInt(resdoc.sum) + parseInt(that.user_rating);
                                Resources.put({
                                        sum: sumRating,
                                        timesRated: numRating
                                    },
                                    resdoc._id, resdoc._rev,
                                    function(error, info) {
                                        console.log(error);
                                        console.log(info);
                                    })
                            } else {
                                Resources.post({
                                        _id: resId,
                                        sum: parseInt(that.user_rating),
                                        timesRated: 1
                                    },
                                    function(error, info) {
                                        console.log(error);
                                        console.log(info);
                                    }
                                )
                            }
                            console.log('Rating is successfully saved')
                            Backbone.history.navigate('resources', {
                                trigger: true
                            });
                        });
                        console.log(info);
                    } else {
                        console.log(err);
                    }
                })
                $('#externalDiv').hide();
            }
        },

        logActivity: function(member, feedbackModel) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);

            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
                } else {
                    that.createJsonlog(member, logdate, logdb, feedbackModel);
                }
            });
        },

        createJsonlog: function(member, logdate, logdb, feedbackModel) {
            var that = this;
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            };
            logdb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("FeedbackForm:: createJsonlog:: created activity log in pouchdb for today..");
                    logdb.get(logdate, function(err, logModel) {
                        if (!err) {
                            that.UpdatejSONlog(member, logModel, logdb, feedbackModel, logdate);
                        } else {
                            console.log("FeedbackForm:: createJsonlog:: Error fetching activitylog doc from Pouch after creating it");
                        }
                    });
                } else {
                    console.log("FeedbackForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    console.log(err);
                }
            });
        },

        UpdatejSONlog: function(member, logModel, logdb, feedbackModel, logdate) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            console.log(feedbackModel);
            memRating = parseInt(feedbackModel.get('rating'));
            var resId = feedbackModel.get('resourceId');
            var index = logModel.resourcesIds.indexOf(resId);
            if (index == -1) {
                logModel.resourcesIds.push(resId);
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_rating.push(memRating);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(1);
                        logModel.female_timesRated.push(0);
                    } else {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(0);
                    }
                } else {
                    if (superMgrIndex == -1) {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(memRating);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(1);
                    } else {
                        logModel.male_rating.push(0);
                        logModel.female_rating.push(0);
                        logModel.male_timesRated.push(0);
                        logModel.female_timesRated.push(0);
                    }
                }
            } else {
                if (member.get('Gender') == 'Male') {
                    if (superMgrIndex == -1) {
                        logModel.male_rating[index] = parseInt(logModel.male_rating[index]) + memRating;
                        logModel.male_timesRated[index] = (parseInt(logModel.male_timesRated[index])) + 1;
                    }
                } else {
                    if (superMgrIndex == -1) {
                        logModel.female_rating[index] = parseInt(logModel.female_rating[index]) + memRating;
                        logModel.female_timesRated[index] = (parseInt(logModel.female_timesRated[index])) + 1;
                    }
                }
            }

            logdb.put(logModel, logdate, logModel._rev, function(err, response) {
                if (!err) {
                    console.log("FeedbackForm:: UpdatejSONlog:: updated daily log from pouchdb for today..");
                } else {
                    console.log("FeedbackForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
                }
            });
        },

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        }
    })
});$(function () {

    App.Views.FeedbackRow = Backbone.View.extend({

        vars: {},

        tagName: "tr",

        events: {
            "click .destroy": function (e) {
                e.preventDefault()
                this.model.destroy()
                this.remove()
            },
            "click .browse": function (e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-FeedbackRow").html(),

        render: function () {
            var vars = this.model.toJSON()
            vars.memberName = "";
            this.$el.append(_.template(this.template, vars))
        }

    })

});$(function () {
    App.Views.FeedbackTable = Backbone.View.extend({

        tagName: "table",

        className: "btable btable-striped",

        addOne: function (model) {
            var feedbackRow = new App.Views.FeedbackRow({
                model: model
            })
            feedbackRow.render()
            this.$el.append(feedbackRow.el)
        },

        addAll: function () {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.$el.append('<tr><th>Comment</th><th>Rating</th></tr>')
            this.collection.each(this.addOne, this)
        },

        render: function () {
            this.addAll()
        }

    })

});$(function () {

    App.Views.GroupForm = Backbone.View.extend({

        className: "form",
        id: 'groupform',
        prevmemlist: null,
        btnText: 'Continue',
        events: {
            "click #sformButton": "setForm",
            "click #uformButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #inviteMemberButton": "MemberInvite",
            "click #coursescheduleButton": "CourseSchedule",
            "click #cancel": function () {
                window.history.back()
            },


        },

        CourseSchedule: function () {
            var form = new App.Views.CourseScheduleForm()
            form.courseId = this.model.id
            var model
            var cs = new App.Collections.CourseScheduleByCourse()
            cs.courseId = this.model.id
            cs.fetch({
                async: false
            })
            if (cs.length > 0) {
                model = cs.first()
                console.log(model)
                form.edit = true
                form.sid = model.get("_id")
                form.srevid = model.get("_rev")
            }
            form.render()
            App.$el.children('.body').html('<a id="BackToCourse" onclick = "location.reload()" class="btn btn-info"><< Back To Course</a>')
            App.$el.children('.body').append('<p id="scheduletitle">' + this.model.get("name") + '|Schedule</p>')
            App.$el.children('.body').append(form.el)
            $('#startTime').timepicker()
            $('#endTime').timepicker()
            $('#startDate').datepicker()
            $('#endDate').datepicker()
            $('#typeView').hide()
            $('.days').hide()

            if (cs.length > 0) {
                model = cs.first()
                $('#startTime').val(model.get("startTime"))
                $('#endTime').val(model.get("endTime"))
                $('#startDate').val(model.get("startDate"))
                $('#endDate').val(model.get("endDate"))
                $('#location').val(model.get("location"))
                $('#type').val(model.get("type"))
                if (model.get("type") == "Weekly") {
                    $('#weekDays').val(model.get("weekDays"))
                }
            }
            $('#type').on('change', function () {
                if (this.value == "Monthly") {
                    $('#typeView').show()
                    $('.days').hide()
                    $("#typeView").multiDatesPicker();
                } else if (this.value == "Weekly") {
                    $('.days').show()
                    $('#typeView').hide()
                } else {
                    $('.days').hide()
                    $('#typeView').hide()
                }
            });
        },
        MemberInvite: function () {
            if ($("textarea[name='description']").val().length > 0) {
                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                var inviteModel = new App.Models.InviFormModel()
                inviteModel.resId = this.model.get("_id")
                inviteModel.senderId = $.cookie('Member._id')
                inviteModel.type = this.model.get("kind")
                inviteModel.title = this.model.get("name")
                var inviteForm = new App.Views.InvitationForm({
                    model: inviteModel
                })
                inviteForm.description = this.model.get("description")
                inviteForm.render()
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el)
            } else {
                alert("Specify course description first")
            }
        },
        getRoles: function () {

            var member = new App.Models.Member()
            member.id = $.cookie('Member._id')
            member.fetch({
                async: false
            })
            return member.get('roles')

        },
        render: function () {

            $('#invitationdiv').hide()
            // members is required for the form's members field
            var groupForm = this
            if (this.model.get("_id") != undefined) {
                this.prevmemlist = this.model.get("members")
                this.model.on({
                    "change:statDate": this.sendMail,
                    "change:endDate": this.sendMail,
                    "change:startTime": this.sendMail,
                    "change:endTime": this.sendMail,
                    "change:location": this.sendMail
                });

            }
            if (!this.model.get("languageOfInstruction")) {
                this.model.set("languageOfInstruction", "")
            }
            this.model.schema.members.options = [];
            var memberList = new App.Collections.leadermembers();
            memberList.fetch({
                success: function () {
                    //create the form
                    var optns = []
                    optns.push({
                        label: "Select....",
                        val: "0000"
                    })
                    memberList.each(function (modl) {
                        var temp = {
                            label: modl.toJSON().firstName + " " + modl.toJSON().lastName,
                            val: modl.toJSON()._id
                        }
                        optns.push(temp)
                    })


                    groupForm.model.schema.courseLeader.options = optns

                    groupForm.form = new Backbone.Form({
                        model: groupForm.model                  // groupForm.model is a 'Group' model instance. 'Group' is basically a course
                    })
                    groupForm.$el.append(groupForm.form.render().el)

                    groupForm.form.fields['members'].$el.hide()
                    if (groupForm.model.get("_id") == undefined) {
                        groupForm.form.fields['Day'].$el.hide()
                    }

                    $('.field-backgroundColor input').spectrum({
                        clickoutFiresChange: true,
                        preferredFormat: 'hex'
                    })
                    $('.field-foregroundColor input').spectrum({
                        clickoutFiresChange: true,
                        preferredFormat: 'hex'
                    })
                    // give the form a submit button
                    var $sbutton = $('<a class="group btn btn-success" id="sformButton">Continue</button>')
                    var $ubutton = $('<a class="group btn btn-success" style="" id="uformButton">Update</button>')

                    var $button = $('<a style="margin-left:52%;margin-top: -100px;" role="button" id="ProgressButton" class="btn" href="#course/report/' + groupForm.model.get("_id") + '/' + groupForm.model.get("name") + '"> <i class="icon-signal"></i> Progress</a><a style="margin-top: -100px;"class="btn btn-success" id="inviteMemberButton">Invite Member</button><a style="margin-top: -100px;"class="btn btn-success" id="" href="#course/members/' + groupForm.model.get("_id") + '"> Members</a>')
                    if (groupForm.model.get("_id") != undefined) {
                        groupForm.$el.prepend($button)
                        groupForm.$el.append($ubutton)
                    } else {
                        groupForm.$el.append($sbutton)
                    }

                    groupForm.$el.append("<a class='btn btn-danger' style='margin-left : 20px;' id='cancel'>Cancel</a>")
                },
                async: false
            })

        },
        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },
	setForm: function () {
		var that = this

		var newEntery = 0

		this.model.once('sync', function () {
				Backbone.history.navigate('course/manage/' + that.model.get("id"), {
					trigger: true
				})
			})
			// Put the form's input into the model in memory
		var previousLeader = this.model.get('courseLeader')
		    this.form.commit()
		this.model.set("name", this.model.get("CourseTitle"))
			// Send the updated model to the server
		if (this.model.get("_id") == undefined) {

			newEntery = 1
			this.model.set("members", [$.cookie('Member._id')])
		}else {
			this.model.set("members", this.prevmemlist)
		}
		if (this.model.get('CourseTitle').length == 0) {
			alert("Course Title is missing")
		}
		//            else if (this.model.get("courseLeader") == 0000) {
		//                alert("Select Course Leader")
		//            } 
		else if (this.model.get("description").length == 0) {
			alert("Course description is missing")
		}
		else {
			var member = new App.Models.Member()
			member.id = $.cookie('Member._id')
			member.fetch({
				async: false
			})
			if (member.get('roles').indexOf("Leader") == -1) {
				member.get('roles').push("Leader")
				member.save()
			}

            var isNewLeaderAlreadyCourseMember = false;
			var leader = this.model.get('courseLeader')
			var courseMembers = this.model.get('members')
			var index = courseMembers.indexOf(previousLeader)
//			if (index != -1) {
//                courseMembers.splice(index, 1); // membercourseprogress for previous leader not deleted. y?
//            }
			if (courseMembers.indexOf(leader) == -1) { // new leader is not a member of the course already
				courseMembers.push(leader)
			} else {
                isNewLeaderAlreadyCourseMember = true;
            }
			this.model.set("members", courseMembers)
			console.log()
			var context = this

			this.model.save(null, {
				success: function (e) {
					console.log(context.model.get('courseLeader'))
                    var memprogress = new App.Models.membercourseprogress();
                    var stepsids = new Array();
                    var stepsres = new Array();
                    var stepsstatus = new Array();
					if (newEntery == 1) {
						memprogress.set("stepsIds", stepsids)
						memprogress.set("memberId", $.cookie("Member._id"))
						memprogress.set("stepsResult", stepsres)
						memprogress.set("stepsStatus", stepsstatus)
						memprogress.set("courseId", e.get("id"))
						memprogress.save()
						//0000 is value for --select-- 
						if (context.model.get('courseLeader') != $.cookie("Member._id")&&context.model.get('courseLeader')!='0000') {
							memprogress.set("stepsIds", stepsids)
							memprogress.set("memberId",context.model.get('courseLeader') )
							memprogress.set("stepsResult", stepsres)
							memprogress.set("stepsStatus", stepsstatus)
							memprogress.set("courseId", e.get("id"))
							memprogress.save()
						}
						alert("Course successfully Created.")
					}
					else { // the course already exists

                        if ( (leader !== previousLeader) && (isNewLeaderAlreadyCourseMember === false) ) {
                            // if the newly chosen leader is different from previous one and he/she is also from outside the course, i-e
                            // he/she was not a member of course before being selected as its leader, then two things should happen:
//                            // (i) previous-leader's membercourseprogress doc should be deleted
//                            var memberProgress = new App.Collections.membercourseprogresses();
//                            memberProgress.courseId = context.model.get("_id");
//                            memberProgress.memberId = previousLeader;
//                            memberProgress.fetch({
//                                async: false
//                            });
//                            memberProgress.each(function (m) {
//                                m.destroy();
//                            });
                            // (ii) new-leader's membercourseprogress doc should be created and initialised with default values
                            var csteps = new App.Collections.coursesteps();
                            csteps.courseId = context.model.get("_id"); // courseId
                            csteps.fetch({
                                success: function () {
                                    csteps.each(function (m) {
                                        stepsids.push(m.get("_id"))
                                        stepsres.push("0")
                                        stepsstatus.push("0")
                                    })
                                    memprogress.set("stepsIds", stepsids)
                                    memprogress.set("memberId", leader)
                                    memprogress.set("stepsResult", stepsres)
                                    memprogress.set("stepsStatus", stepsstatus)
                                    memprogress.set("courseId", csteps.courseId)
                                    memprogress.save({
                                        success: function () {
                                            alert('saved')
                                        }
                                    })
                                }
                            });
                        }

						//alert(that.model.get("_id"))
						///to get the latest rev.id 
						var groupModel = new App.Models.Group()
						groupModel.id = that.model.get("_id")
						groupModel.fetch({
								async: false
							})
							//alert(groupModel.get("rev"))
						that.model.set("_rev", groupModel.get("_rev"))
						alert("Course successfully Updated.")
					}
				}
			})
		}
	},
        sendMail: function (e) {

            memberList = e._previousAttributes.members

            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })

                var currentdate = new Date();
                var mail = new App.Models.Mail();
                mail.set("senderId", $.cookie('Member._id'));
                mail.set("receiverId", mem.get("_id"));
                mail.set("subject", "Change of Course Schedule | " + e.get("name"));
                var mailText = "<b>Schedule is changed </b><br><br>New Schedule is:<br> Duration:   " + e.get('startDate') + '  to  ' + e.get('endDate') + '<br>'
                mailText += "Timing:        " + e.get('startTime') + '  to  ' + e.get('endTime')
                mailText += "<br>Locatoin:      " + e.get('location')
                mail.set("body", mailText);
                mail.set("status", "0");
                mail.set("type", "mail");
                mail.set("sentDate", currentdate);
                mail.save()
            }

        },


    })

});$(function () {

    App.Views.GroupMembers = Backbone.View.extend({

        // tagName: "table",
        // className: "news-table",
        // authorName: null,
        vars: {},
        //template: $('#template-sendMail-CourseMember').html(),
        initialize: function () {},
        events: {
         "click  #selectAllMembers": "selectAllMembers",
         "click  .removeMember":"removeMember",
         "click #retrunBack" : function (e) {
			history.back()    
			}
        },
        selectAllMembers:function(){
        	if($("#selectAllMembers").text()=='Select All')
         	{
      			$("input[name='courseMember']").each( function () {
						$(this).prop('checked', true);
      			})
      			$("#selectAllMembers").text('Unselect All')
      		}
      		else{
      		 $("input[name='courseMember']").each( function () {
						$(this).prop('checked', false);
      			})
      		   $("#selectAllMembers").text('Select All')
      		
      		}

        
        },
        removeMember:function(e){
        
           var memberId=e.currentTarget.value
           var that=this
           var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
             		success:function(result){
                            members=result.get('members')
                            members.splice(members.indexOf(memberId),1)
                            
                            result.set('members',members)
                           
                            result.save()
                            memberCoursePro=new App.Collections.membercourseprogresses()
                            memberCoursePro.memberId=memberId
                            memberCoursePro.courseId=that.courseId
                            
                            memberCoursePro.fetch({async:false})
                            while (model = memberCoursePro.first()) {
  							    model.destroy();
			                }
                            that.render()
                            alert('Member is Removed From Course')
             		}
            })
            
          
        },
        render: function () {
            var courseModel = new App.Models.Group({
                _id: this.courseId
            })
            courseModel.fetch({
                async: false
            })
            var memberList = courseModel.get('members')

            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first().toJSON()
            var code = currentConfig.rows[0].doc.code
            var na = currentConfig.rows[0].doc.nationName.substring(3,5)

            this.$el.html('<h3 style="margin-left:5%">Course Members | ' + courseModel.get('name') + '</h3>')
            var viewtext = '<table class="btable btable-striped"><th>Photo</th><th colspan=3>Name</th>'

            for (var i = 0; i < memberList.length; i++) {
                var mem = new App.Models.Member({
                    _id: memberList[i]
                })
                mem.fetch({
                    async: false
                })
                var mail = mem.get('login') + '.' + code +na+ '@olebell.org'

                var src = "img/default.jpg"
                var attchmentURL = '/members/' + mem.id + '/'
                if (typeof mem.get('_attachments') !== 'undefined') {
                    attchmentURL = attchmentURL + _.keys(mem.get('_attachments'))[0]
                    src = attchmentURL
                }
                viewtext += '<tr><td><img width="45px" height="45px" src="' + src + '"/></td><td>' + mem.get('firstName') + ' ' + mem.get('lastName') + '</td><td><input type="checkbox" name="courseMember" value="' + mail + '">Send mail</td>'
    
                
                if($.cookie('Member._id')==courseModel.get('courseLeader'))
                {
                   viewtext+='<td><button class="btn btn-danger removeMember" value="' + mem.get('_id') + '">Remove</button></td>'
                }
                
                viewtext+='</tr>'

            }
            viewtext += '<tr><td></td><td></td><td><button class="btn"  id="selectAllMembers">Select All</button><button style="margin-left:10px" class="btn" onclick=showComposePopupMultiple("' + mail + '") id="sendMailButton">Send Mail</button><button class="btn" style="margin-left:10px"  id="retrunBack">Back</button></td></tr>'
            viewtext += '</table>'
            this.$el.append(viewtext)

        }

    })

});$(function () {

    App.Views.GroupRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {
            "click .destroy": function (e) {
                e.preventDefault()
                var cId = this.model.get("_id")
                var clevels = new App.Collections.CourseLevels()
                var model
                clevels.groupId = cId
                clevels.fetch({
                    success: function () {
                        while (model = clevels.first()) {
                            model.destroy();
                        }
                    }
                })
                console.log("Course Step Deleted")
                var stepResults = new App.Collections.StepResultsbyCourse()
                var model
                stepResults.courseId = cId
                stepResults.fetch({
                    success: function () {
                        while (model = stepResults.first()) {
                            model.destroy();
                        }
                    }
                })
                console.log("Course Progress Deleted")

                var ei = new App.Collections.EntityInvitation()
                var model
                ei.entityId = cId
                ei.fetch({
                    success: function () {
                        while (model = ei.first()) {
                            model.destroy();
                        }
                    }
                })
                var cs = new App.Models.CourseSchedule()
                cs.courseId = cId
                cs.fetch({
                    success: function () {
                        cs.destroy()
                    }
                })
                this.model.destroy()
                this.remove()
            },
            "click .browse": function (e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-GroupRow").html(),

        initialize: function (e) {
            //this.model.on('destroy', this.remove, this)
            this.roles = e.roles
        },

        render: function () {
        
        	if(this.courseId==null)
        	{
        	var vars = this.model.toJSON()
        	
        	vars.courseId=this.courseId    
            if(vars._id=='_design/bell')
               return
            
            if(!vars.members)
            {
            	vars.members = new Array()
            }
            if (vars.courseLeader != undefined && vars.courseLeader == $.cookie('Member._id')) {
                vars.isLeader = 1
            } else {
                vars.isLeader = 0
            }
			if (this.roles.indexOf("Manager") != -1 || vars.courseLeader == $.cookie('Member._id') || vars.members.indexOf($.cookie('Member._id'))!=-1)
			{
				vars.viewProgress = 1
			}
			else
			{
				vars.viewProgress = 0
			}
            if (this.roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1
            } else {
                vars.isAdmin = 0
            }
            this.$el.append(_.template(this.template, vars))
        	
        	}
        	else{
        	var vars = this.model.toJSON()
        	vars.viewProgress = 0
        	vars.isAdmin = 0
        	vars.isLeader = 0  
        	vars.courseId=this.courseId
        	this.$el.append(_.template(this.template, vars))
        	}
            
        }

    })

});$(function() {

    App.Views.GroupSpan = Backbone.View.extend({

        tagName: "td",

        className: 'course-box',

        template: $("#template-GroupSpan").html(),

        render: function() {
            if (this.model.keys().length < 5) {
                this.model.destroy()
                return
            }
            var vars = this.model.toJSON()
            var res = new App.Collections.membercourseprogresses()
            res.courseId = vars._id
            res.memberId = $.cookie('Member._id')
            res.fetch({
                async: false
            });
            var modl = ""
            var PassedSteps = 0
            var totalSteps = 0
            if (res.length != 0) {
                modl = res.first().toJSON()
                PassedSteps = 0
                temp = 0
                totalSteps = modl.stepsStatus.length
                while (temp < totalSteps) {
                    if (modl.stepsStatus[temp] == '1') {
                        PassedSteps++
                    }
                    temp++
                }
            }
            console.log('here is Group Span')
            if (totalSteps != 0) {
                vars.yes = '<br>(' + PassedSteps + '/' + totalSteps + ')'
            } else {
                vars.yes = "<br>(No Steps)"
            }
            this.$el.append(_.template(this.template, vars))
        }

    })

});$(function() {
    App.Views.GroupView = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        roles: null,
        events: {
            "click #admissionButton": function(e) {}
        },
        render: function() {
            console.log(this.model)
            this.addCourseDetails()
        },
        addCourseDetails: function() {
            var that = this
            var courseInfo = this.model.toJSON()

            var leaderInfo = this.courseLeader.toJSON()
            console.log(courseInfo)
            console.log(leaderInfo)
            this.$el.append('<tr><td><b>Name</b></td><td>' + courseInfo.CourseTitle + '</td></tr>')
            this.$el.append('<tr><td><b>Subject Level </b></td><td>' + courseInfo.subjectLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Grade Level </b></td><td>' + courseInfo.gradeLevel + '</td></tr>')
            this.$el.append('<tr><td><b>Description</b></td><td>' + courseInfo.description + '</td></tr>')

            this.$el.append('<tr><td><b>Leader Name </b></td><td>' + leaderInfo.firstName + ' ' + leaderInfo.lastName + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Email </b></td><td>' + leaderInfo.email + '</td></tr>')
            this.$el.append('<tr><td><b>Leader Phone Number </b></td><td>' + leaderInfo.phone + '</td></tr>')

            this.$el.append('<tr><td><b>schedule</b></td><td>Date :  ' + courseInfo.startDate + '-' + courseInfo.endDate + '<br>Time :  ' + courseInfo.startTime + '- ' + courseInfo.endTime + '</td></tr>')

            this.$el.append('<tr><td><b>Location </b></td><td>' + courseInfo.location + '</td></tr>')

            // $(document).on('Notification:submitButtonClicked', function (e) {});

        }
    })

});$(function() {
    App.Views.GroupsSpans = Backbone.View.extend({

        tagName: "tr",

        addOne: function(model) {
            var modelView = new App.Views.GroupSpan({
                model: model
            })
            modelView.render()
            $('#cc').append(modelView.el)
        },

        addAll: function() {

            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {

                $('#cc').append("<td class='course-box'>No Courses Accepted</td>")
            }
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {
	App.Views.GroupsTable = Backbone.View.extend({

		tagName: "table",

		className: "btable btable-striped",
		roles: null,
		addOne: function(model) {
			var groupRow = new App.Views.GroupRow({
				model: model,
				roles: this.roles
			})
			groupRow.courseId = this.courseId
			groupRow.render()
			this.$el.append(groupRow.el)
		},
		events: {
			"click .pageNumber": function(e) {
				this.collection.startkey = ""
				this.collection.skip = e.currentTarget.attributes[0].value
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},

		},

		addAll: function() {
			this.$el.html("<tr><th>Title</th><th colspan='0'>Actions</th></tr>")
			var manager = new App.Models.Member({
				_id: $.cookie('Member._id')
			})
			manager.fetch({
				async: false
			})
			this.roles = manager.get("roles")
			// @todo this does not work as expected, either of the lines
			// _.each(this.collection.models, this.addOne())

			this.collection.each(this.addOne, this)

			var groupLength;
			var context = this
			$.ajax({
				url: '/groups/_design/bell/_view/count?group=false',
				type: 'GET',
				dataType: "json",
				success: function(json) {
					groupLength = json.rows[0].value
					if (context.displayCollec_Resources != true) {
						var pageBottom = "<tr><td colspan=7>"
						var looplength = groupLength / 20

						for (var i = 0; i < looplength; i++) {
							if (i == 0)
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">Home</a>&nbsp&nbsp'
							else
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
						}
						pageBottom += "</td></tr>"
						context.$el.append(pageBottom)
					}

				}
			})
		},

		render: function() {
			this.collection.skip = 0
			this.addAll()
		}

	})

});$(function() {

    App.Views.InvitationForm = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv",

        },

        title: null,
        entityId: null,
        type: null,
        senderId: null,
        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
        },
        SetParams: function(ti, e, t, s) {
            this.title = ti
            this.entityId = e
            this.type = t
            this.senderId = s

        },
        render: function() {

            //members is required for the form's members field
            console.log(this.model)
            var members = new App.Collections.Members()
            var that = this
            var inviteForm = this
            inviteForm.on('InvitationForm:MembersReady', function() {
                console.log(that.model.schema)
                this.model.schema.members.options = members
                // create the form
                this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                this.form.fields['members'].$el.hide()
                this.form.fields['levels'].$el.hide()


                this.form.fields['invitationType'].$el.change(function() {
                    var val = that.form.fields['invitationType'].$el.find('option:selected').text()
                    if (val == "Members") {
                        that.form.fields['members'].$el.show()
                        that.form.fields['levels'].$el.hide()
                    } else if (val == "Level") {
                        that.form.fields['members'].$el.hide()
                        that.form.fields['levels'].$el.show()
                    } else {
                        that.form.fields['members'].$el.hide()
                        that.form.fields['levels'].$el.hide()
                    }
                })
                // give the form a submit button
                var $button = $('<a class="btn btn-success" id="formButton">Invite</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">Cancel</button>')
            })

            // Get the group ready to process the form
            members.once('sync', function() {
                inviteForm.trigger('InvitationForm:MembersReady')

            })

            members.fetch()

        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {

            var member = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            member.fetch({
                async: false
            })
            // Put the form's input into the model in memory
            this.form.commit()
            var memberList = new App.Collections.Members()
            memberList.fetch({
                async: false
            })

            var temp
            var that = this
            var currentdate = new Date();

            if (this.model.get("invitationType") == "All") {
                memberList.each(function(m) {
                    temp = new App.Models.Mail()
                    temp.set("senderId", that.model.senderId)
                    temp.set("receiverId", m.get("_id"))
                    temp.set("status", "0")
                    temp.set("subject", "Course Invitation | " + that.model.title)
                    temp.set("type", "course-invitation")
                    temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                    temp.set("sendDate", currentdate)
                    temp.set("entityId", that.model.resId)
                    temp.save()
                    //            temp = new App.Models.Invitation()
                    //            temp.set("title",that.model.title)
                    //            temp.set("senderId",that.model.senderId)
                    //            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                    //            temp.set("memberId",m.get("_id"))
                    //			temp.set("entityId",that.model.resId)
                    //            temp.set("type",that.model.type)
                    //            temp.save()
                })

            } else if (this.model.get("invitationType") == "Members") {
                memberList.each(function(m) {
                    var that2 = that;
                    if (that.model.get("members").indexOf(m.get("_id")) > -1) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Course Invitation | " + that.model.title)
                        temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                        temp.set("type", "course-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        //            temp = new App.Models.Invitation()
                        //            temp.set("title",that2.model.title)
                        //            temp.set("senderId",that2.model.senderId)
                        //            temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                        //            temp.set("memberId",m.get("_id"))
                        //            temp.set("entityId",that2.model.resId)
                        //            temp.set("type",that2.model.type)
                        temp.save()
                        console.log(temp);
                    }
                })
            } else {
                //Fetching The Members and then checking each levels whether they have the same level then incrementing the counnt and save

                memberList.each(function(m) {
                    var member_level = m.get("levels")
                    if (that.model.get("levels").indexOf(member_level[0]) > -1) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Course Invitation | " + that.model.title)
                        temp.set("body", that.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                        temp.set("type", "course-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        //                  temp = new App.Models.Invitation()
                        //                  temp.set("title",that.title)
                        //                  temp.set("senderId",that.senderId)
                        //                  temp.set("senderName",member.get("firstName")+" "+member.get("lastName"))
                        //                  temp.set("memberId",m.get("_id"))
                        //                  temp.set("entityId",that.resId)
                        //                  temp.set("type",that.type)
                        temp.save()
                    }
                });

            }

            $('#invitationdiv').fadeOut(1000)
            alert("Invitation sent successfully")
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

        },


    })

});$(function() {

    App.Views.LevelDetail = Backbone.View.extend({


        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click .remover": function(e) {
                var that = this
                var rid = e.currentTarget.value
                var rtitle = this.model.get("resourceTitles")
                var rids = this.model.get("resourceId")
                var index = rids.indexOf(rid)
                rids.splice(index, 1)
                rtitle.splice(index, 1)
                this.model.set("resourceId", rids)
                this.model.set("resourceTitles", rtitle)
                this.model.save(null, {
                    success: function(responseModel, responseRev) {
                        that.model.set("_rev", responseRev.rev)
                        $('#' + rid.replace("\.", "\\.")).remove();

                    }
                })
            },
            "click .removeAttachment": function(e) {
                var that = this
                var attachmentNo = e.currentTarget.value
                $.ajax({
                    url: '/coursestep/' + this.model.get('_id') + '/' + _.keys(this.model.get('_attachments'))[attachmentNo] + '?rev=' + this.model.get("_rev"),
                    type: 'DELETE',
                    success: function(response, status, jqXHR) {
                        alert('Successfully deleted.')
                        App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    }
                })

            },
            "click .levelResView": function(e) {
                var rid = e.currentTarget.attributes[0].value
                var levelId = this.model.get("_id")
                var revid = this.model.get("_rev")
                Backbone.history.navigate('resource/atlevel/feedback/' + rid + '/' + levelId + '/' + revid, {
                    trigger: true
                })

            },
            "click #addInstructions": function(e) {
                var fileinput = document.forms["fileAttachment"]["_attachments"]
                fileinput.click();
            },
            "change #_attachments": function(e) {
                var that = this
                var img = $('input[type="file"]')
                var extension = img.val().split('.')
                if (img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt' && extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' && extension[(extension.length - 1)] != 'png' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'mov' && extension[(extension.length - 1)] != 'mp3') {
                    alert("Invalid attatchment.")
                    return
                }
                //this.model.unset('_attachments')
                if ($('input[type="file"]').val()) {
                    this.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                } else {
                    ////no attachment
                    alert('no attachment')
                }
                this.model.on('savedAttachment', function() {
                    /////Attatchment successfully saved
                    alert("Assignement successfully submitted.")
                    App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    //                	this.$el.html('')
                    //                	this.model.fetch({async:false})
                    //                	this.render()
                }, this.model)

            },
        },
        render: function() {
            var i = 0
            var rtitle = this.model.get("resourceTitles")
            var rid = this.model.get("resourceId")
            var stepResources = '</BR><table class="table table-striped">'
            if (this.model.get("resourceTitles")) {
                for (i = 0; i < this.model.get("resourceTitles").length; i++) {
                    var r = new App.Models.Resource({
                        "_id": rid[i]
                    })
                    r.fetch({
                        async: false
                    })
                    if (!(r.get("hidden"))) {
                        if (r.get("_attachments")) {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td><a class='levelResView btn btn-info' href='/apps/_design/bell/bell-resource-router/index.html#open/" + rid[i] + "'  target='_blank' value='" + rid[i] + "'><i class='icon-eye-open'></i>View</a></td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>Remove </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        } else {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td>No Attachment</td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>Remove </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        }
                    }
                }
                stepResources = stepResources + '</table>'
                this.$el.append(stepResources)
                this.$el.append('<br/><br/><B>Instructions</B>&nbsp;&nbsp;<a class="btn btn-success"  style="" id="addInstructions">Add</a><br/><br/>')
                var uploadString = '<form method="post" id="fileAttachment">'
                uploadString = uploadString + '<input type="file" name="_attachments" id="_attachments" multiple="multiple" style="display: none" /> '
                uploadString = uploadString + '<input class="rev" type="hidden" name="_rev"></form>'
                this.$el.append(uploadString)
                if (!this.model.get('_attachments')) {
                    return
                }
                var tableString = '<table class="table table-striped">'
                for (i = 0; i < _.keys(this.model.get('_attachments')).length; i++) {

                    var attachmentURL = '/coursestep/' + this.model.get('_id') + '/'
                    var attachmentName = ''
                    if (typeof this.model.get('_attachments') !== 'undefined') {
                        attachmentURL = attachmentURL + _.keys(this.model.get('_attachments'))[i]
                        attachmentName = _.keys(this.model.get('_attachments'))[i]
                    }

                    tableString = tableString + ("<tr><td>" + attachmentName + "</td><td><a class='btn btn-info' href='" + attachmentURL + "'  target='_blank' ><i class='icon-eye-open'></i>View</a></td><td><button class='removeAttachment btn btn-danger' value='" + i + "'>Remove </button><input type='hidden'/>")
                }
                tableString = tableString + '</table>'
                this.$el.append(tableString)

            }
        }

    })

});$(function() {

    App.Views.LevelForm = Backbone.View.extend({

        className: "form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",

            "click #retrunBack": function(e) {
                history.back()
            },
            "click #addresources": function(e) {
                this.addResource = true
                this.setForm()
            },
        },

        render: function() {

            // members is required for the form's members field
            var levelForm = this
            // create the form
            this.form = new Backbone.Form({
                model: levelForm.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['courseId'].$el.hide()
            this.form.fields['questions'].$el.hide()
            this.form.fields['qoptions'].$el.hide()
            this.form.fields['answers'].$el.hide()
            this.form.fields['resourceId'].$el.hide()
            this.form.fields['resourceTitles'].$el.hide()
            // give the form a submit button
            var button = ('<a class="btn btn-success" id="retrunBack"> Back </button>')
            button += ('<a class="btn btn-success" id="formButton">Save</button>')
            button += ('<a class="btn btn-success" id="addresources">Add Resource</button>')
            this.$el.append(button)

        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var that = this
            this.model.once('sync', function() {
                var id = that.model.get("id")
                var rid = that.model.get("rev")
                var title = that.model.get("title")
                console.log(that.model)
                // Adding a Step to all the member progress course
                if (that.edit != true) {
                    var allcrs = new App.Collections.StepResultsbyCourse()
                    allcrs.courseId = that.model.get("courseId")
                    allcrs.fetch({
                        success: function() {
                            allcrs.each(function(m) {
                                var sids = m.get("stepsIds")
                                var sresults = m.get("stepsResult")
                                var sstatus = m.get("stepsStatus")
                                sids.push(that.model.get("id"))
                                sresults.push("0")
                                sstatus.push("0")
                                m.set("stepsIds", sids)
                                m.set("stepsResult", sresults)
                                m.set("stepsStatus", sstatus)
                                m.save()
                            })
                        }
                    })
                    if (that.addResource) {
                        window.location.href = '#search-bell/' + id + '/' + rid
                    } else {
                        Backbone.history.navigate('course/manage/' + that.model.get("courseId"), {
                            trigger: true
                        })
                    }
                } else {
                    Backbone.history.navigate('level/view/' + id + '/' + rid, {
                        trigger: true
                    })
                }
            })
            // Put the form's input into the model in memory
            this.form.commit()
            // Send the updated model to the server
            if (isNaN(this.model.get("allowedErrors"))) {
                alert("Not a valid Allowed Errors")
            } else if (isNaN(this.model.get("step"))) {
                alert("Not a valid Step Number")
            } else {
                if (!this.edit) {
                    this.model.set("questions", null)
                    this.model.set("answers", null)
                    this.model.set("qoptions", null)
                    this.model.set("resourceId", [])
                    this.model.set("resourceTitles", [])
                    //Checking that level added to the user may not already exist in the data base
                } else {
                    this.model.set("questions", this.ques)
                    this.model.set("answers", this.ans)
                    this.model.set("qoptions", this.opt)
                    this.model.set("resourceId", this.res)
                    this.model.set("resourceTitles", this.rest)
                }
                levels = new App.Collections.CourseLevels()
                levels.groupId = this.model.get("courseId")
                levels.fetch({
                    success: function() {
                        levels.sort()
                        var done = true

                        if (that.edit) {
                            if (that.previousStep != that.model.get("step")) {
                                levels.each(function(step) {
                                    if (step.get("step") == that.model.get("step"))
                                        done = false
                                })
                            }
                        } else {
                            levels.each(function(step) {
                                if (step.get("step") == that.model.get("step")) {
                                    done = false
                                }
                            })
                        }

                        if (done)
                            that.model.save()
                        else
                            alert("Step already exists")

                    }
                })
            }

        },


    })

});$(function() {

    App.Views.LevelRow = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .destroyStep": function(e) {
                this.trigger('levelDeleted')
                e.preventDefault()
                var that = this
                var courses = new App.Collections.StepResultsbyCourse()
                courses.courseId = this.model.get("courseId")
                courses.fetch({
                    success: function() {
                        courses.each(function(m) {
                            var stepids = m.get("stepsIds")
                            var stepres = m.get("stepsResult")
                            var stepstatus = m.get("stepsStatus")
                            var index = stepids.indexOf(that.model.get("_id"))
                            stepids.splice(index, 1)
                            stepres.splice(index, 1)
                            stepstatus.splice(index, 1)
                            m.set("stepsIds", stepids)
                            m.set("stepsResult", stepres)
                            m.set("stepsStatus", stepstatus)

                            console.log(m.toJSON())
                            m.save({
                                success: function() {
                                    console.log("Model Updated")
                                }
                            })
                        })
                    }
                })
                this.model.destroy()
                this.remove()

            },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-LevelRow").html(),

        initialize: function() {
            //this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON()
            this.$el.append(_.template(this.template, vars))
        }

    })

});$(function() {
    App.Views.LevelsTable = Backbone.View.extend({

        tagName: "table",

        changedSteps: null,

        className: "btable btable-striped",

        events: {
            "click #Rearrange": function(e) {
                if ($("input[type='radio']").is(":visible")) {
                    $("#Rearrange").text('Rearrange')
                    for (var i = 0; i < this.changedSteps.length; i++) {
                        this.collection.models[this.changedSteps[i]].save()
                    }
                    this.changedSteps.remove
                    $("input[type='radio']").hide()
                    $("#moveup").hide()
                    $("#movedown").hide()
                } else {
                    $("#Rearrange").text('Save')
                    $("input[type='radio']").show()
                    $("#moveup").show()
                    $("#movedown").show()
                }
            },
            "click #moveup": function(e) {
                var radio;
                var i = 0;
                var radioLevels = document.getElementsByName('stepRow');
                for (var j = 0; j < radioLevels.length; j++) {
                    if (radioLevels[j].checked) {
                        radio = radioLevels[j].parentNode.parentNode;
                        if (j > 0) {
                            this.collection.models[j].set('step', j)
                            this.collection.models[j - 1].set('step', j + 1)
                            this.changeColumnHtml(this.collection.models[j].get('step'), this.collection.models[j].get('title'), radioLevels[j].parentNode, true)
                            this.changeColumnHtml(this.collection.models[j - 1].get('step'), this.collection.models[j - 1].get('title'), radioLevels[j - 1].parentNode, false)
                            var tempModel = this.collection.models[j]
                            this.collection.models[j] = this.collection.models[j - 1]
                            this.collection.models[j - 1] = tempModel
                            if (this.changedSteps.indexOf(j) == -1) {
                                this.changedSteps.push(j)
                            }
                            if (this.changedSteps.indexOf(j - 1) == -1) {
                                this.changedSteps.push(j - 1)
                            }
                            //console.log(this.collection.models[j-1])
                        }
                        break;
                    }
                }

                var prev = radio.previousSibling;
                var par = radio.parentNode;
                if (prev) {

                    par.removeChild(radio);
                    par.insertBefore(radio, prev);
                }
                //$("input[type='radio']").attr('checked',false)
            },
            "click #movedown": function(e) {
                var radio;
                var i = 0;
                var radioLevels = document.getElementsByName('stepRow');
                for (var j = 0; j < radioLevels.length; j++) {
                    if (radioLevels[j].checked) {
                        radio = radioLevels[j].parentNode.parentNode;
                        if (j < radioLevels.length - 1) {
                            this.collection.models[j].set('step', j + 2)
                            this.collection.models[j + 1].set('step', j + 1)
                            this.changeColumnHtml(this.collection.models[j].get('step'), this.collection.models[j].get('title'), radioLevels[j].parentNode, true)
                            this.changeColumnHtml(this.collection.models[j + 1].get('step'), this.collection.models[j + 1].get('title'), radioLevels[j + 1].parentNode, false)
                            var tempModel = this.collection.models[j]
                            this.collection.models[j] = this.collection.models[j + 1]
                            this.collection.models[j + 1] = tempModel
                            if (this.changedSteps.indexOf(j) == -1) {
                                this.changedSteps.push(j)
                            }
                            if (this.changedSteps.indexOf(j + 1) == -1) {
                                this.changedSteps.push(j + 1)
                            }
                        }
                        break;
                    }
                }

                var next = radio.nextSibling;
                var par = radio.parentNode;
                if (next.nextSibling) {
                    par.removeChild(radio);
                    par.insertBefore(radio, next.nextSibling);
                } else {
                    par.removeChild(radio);
                    par.appendChild(radio);
                }
                console.log(this.collection.models)
            }
        },
        changeColumnHtml: function(stepNo, title, td, check) {

            if (check) {
                $(td).html('<input type="radio" name="stepRow" checked="checked" />&nbsp;&nbsp;Step ' + stepNo + ' : ' + title)
            } else {
                $(td).html('<input type="radio" name="stepRow" />&nbsp;&nbsp;Step ' + stepNo + ' : ' + title)
            }
        },
        addOne: function(model) {
            var that = this
            var lrow = new App.Views.LevelRow({
                model: model
            })
            lrow.on('levelDeleted', function() {
                var stepNo = lrow.model.get("step")
                for (var i = stepNo; i < that.collection.models.length; i++) {
                    that.collection.models[i].set('step', i)
                    that.updateModel(that.collection.models[i])
                }
                alert("Step successfully deleted.")
                that.collection.models.splice(stepNo - 1, 1)
                if (that.collection.models.length == 0) {
                    $('#moveup').hide()
                    $('#movedown').hide()
                    $('#Rearrange').hide()
                }
                $("#addstep").attr("onClick", "document.location.href=\'#level/add/" + that.groupId + "/nolevel/" + that.collection.models.length + "\' ");
                location.reload()
            })
            lrow.render()
            this.$el.append(lrow.el)
        },
        updateModel: function(model) {
            model.save({
                success: function() {}
            })
        },
        addAll: function() {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
        },
        initialize: function() {
            this.changedSteps = new Array()
        },
        render: function() {
            this.$el.append('<br/><button class="btn btn-success" id="addstep"  onclick = "document.location.href=\'#level/add/' + this.groupId + '/nolevel/' + this.collection.models.length + '\' ">Add Step</button>')
            if (this.collection.models.length > 0) {
                this.$el.append('&nbsp;&nbsp;&nbsp;<button class="btn btn-success" id="Rearrange" >Rearrange</button><br/><br/>')
            }
            this.$el.append('<button class="btn btn-success" id="moveup" >Up</button>&nbsp;&nbsp;&nbsp;')
            this.$el.append('<button class="btn btn-success" id="movedown" >Down</button>')
            this.addAll()
        }

    })

});$(function() {

    App.Views.ListCollectionView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv",
            "click #deleteButton": "deleteRecord",
            "click #invitationForm .bbf-form .field-IsMajor input": "nesttedHideShow"

        },
        nesttedHideShow: function(e) {
            if ($("#invitationForm .bbf-form .field-IsMajor input").is(':checked')) {
                $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'hidden')
            } else {
                $("#invitationForm .bbf-form .field-NesttedUnder").css('visibility', 'visible')
            }
        },
        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);
        },
        deleteCollectionNameFromResources: function(idOfCollection) {

            $.ajax({
                url: '/resources/_design/bell/_view/resourceOnTag?_include_docs=true&key="' + idOfCollection + '"',

                type: 'GET',
                dataType: 'json',
                success: function(resResult) {
                    var result = resResult.rows;
                    var tempResult = [];
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].value.Tag.length > 0) {
                            var index = result[i].value.Tag.indexOf(idOfCollection);
                            if (index > -1) {
                                result[i].value.Tag.splice(index, 1);
                            }
                        }
                        //  result[i].doc.sum = 0;
                        //result[i].doc.timesRated = 0;
                        tempResult.push(result[i].value);

                    }
                    $.couch.db('resources').bulkSave({
                        "docs": tempResult
                    }, {
                        success: function(data) {
                            alert("Successfully pushed resources back");
                        }
                    });
                },
                async : false
            });

        },
        deleteRecord: function() {
            $('.form .field-Tag select option[value=' + this.model.get("_id") + "]").remove();
            $('#' + this.model.get("_id")).parent('tr').remove();
            this.deleteCollectionNameFromResources(this.model.get("_id"));
            //Call from here method deleteCollectionNameFromResources/////////////////////////////////////
            this.model.set({
                'show': false
            })
            this.model.save({
                success: location.reload()
            })
        },
        render: function() {
            var inviteForm = this

            this.form = new Backbone.Form({
                model: inviteForm.model
            })
            this.$el.append(this.form.render().el)
            var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
            this.$el.append($button)
            this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
            if (this.model.get('_id') != undefined) {
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="deleteButton">Delete</button>')
            }
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },
        setForm: function() {

            // Put the form's input into the model in memory
            this.form.commit()
            var newTitle = this.model.get("CollectionName")
            var titleMatch = false
            var allres = new App.Collections.listRCollection()
            allres.fetch({
                async: false
            })
            allres.each(function(m) {

                if (m.get("show") == true && newTitle == m.get("CollectionName")) {
                    titleMatch = true
                }
            })
            if (titleMatch) {
                alert("Collection Name already exist")
                $('#invitationdiv').fadeOut(1000)

                document.getElementById('cont').style.opacity = 1.0
                document.getElementById('nav').style.opacity = 1.0
            } else {
                if (this.model.get('NesttedUnder') != '--Select--') {
                    this.model.set({
                        'IsMajor': false
                    })
                } else {
                    this.model.set({
                        'IsMajor': true
                    })
                }
                if (this.model.get('CollectionName').length > 0) {

                    var that = this

                    this.model.save(null, {
                        success: function(m) {
                            alert("Collection Saved Successfully")
                            if (that.model.get('_id') == undefined) {
                                if (that.model.get('NesttedUnder') == '--Select--') {
                                    if (that.model.get('IsMajor') == true) {
                                        $('.form .field-Tag select').append('<option class="MajorCategory" value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>')
                                    } else
                                        $('.form .field-Tag select').append('<option value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>')


                                } else {
                                    if ($('.form .field-Tag select option[value=' + that.model.get("NesttedUnder") + "]") != null) {
                                        $('.form .field-Tag select option[value=' + that.model.get("NesttedUnder") + "]").after('<option  value="' + that.model.get('id') + '">' + that.model.get('CollectionName') + '</option>');
                                    }
                                }
                                $('#invitationdiv').fadeOut(1000)

                                document.getElementById('cont').style.opacity = 1.0
                                document.getElementById('nav').style.opacity = 1.0
                                setTimeout(function() {
                                    $('#invitationdiv').hide()
                                }, 1000);

                                $('.form .field-Tag select').multiselect('refresh')
                            } else {
                                location.reload()
                            }
                        }
                    })

                } else {
                    alert("Enter collection name!")
                }

            }


        },

    })

});$(function() {

    App.Views.LogQuery = Backbone.View.extend({

        events: {
            "click #report_button": function(e) {
                var communityName = "Open BeLL"
                if ($("#community-select").val()) {
                    communityName = $("#community-select").val()
                }
                if ($("#start-date").val() && $("#end-date").val()) {
                    console.log("community: " + $("#community-select").val() + "\t" +
                        "Start-Date: " + $("#start-date").val() + "    " +
                        "End-Date: " + $("#end-date").val());
                    App.Router.LogActivity(communityName, $("#start-date").val(), $("#end-date").val())
                } else {
                    console.log("At least one of the criteria for report is missing");
                }
            }
        },
        template: $('#template-LogQuery').html(),
        initialize: function() {

        },
        render: function() {

            this.$el.html(_.template(this.template));

        }
    })

});$(function() {

    App.Views.MailView = Backbone.View.extend({
        code: null,
        vars: {},
        recordsPerPage: null,
        modelNo: null,
        nextButton: null,
        unopen: null,
        searchText: null,
        resultArray: null,
        inViewModel: null,
        showNextButton: null,
        template: _.template($("#template-mail").html()),
        templateMailView: _.template($("#template-view-mail").html()),

        events: {
            "click #replyMailButton": function(e) {
                // console.log(this.vars)
                // alert('this is vaarr')
                // if (this.vars.mailingList) {
                //  $("#recipients").val(this.vars.mailingList)
                // } else {
                $("#recipients").val(this.vars.login)
                //}
                $("#subject").val("Re : " + this.vars.subject)
                $("#mailbodytexarea").val("")
            },
            "click #mailComposeButton": function(e) {
                $("#subject").val("")
                $("#recipients").val("")
                $("#mailbodytexarea").val("")
            },
            "click #nextButton": function(e) {
                this.modelNo = 0
                this.resultArray = []
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #all-mails": function(e) {
                this.modelNo = 0
                skip = 0
                this.searchText = ""
                $("#search-text").val("")
                this.resultArray = []
                this.unopen = false
                this.fetchRecords()
                $("#nextButton").show()
                $("#previousButton").hide()
            },

            "click #unread-mails": "unReadMails",
            "click #backpage": function(e) {

                this.render()
                this.unReadMails()

            },
            "click .deleteBtn": function(e) {
                var modelNo = e.currentTarget.value
                alert(modelNo)
                var selectedModel = this.collection.at(modelNo)
                var model = new App.Models.Mail()
                model.id = selectedModel.get("id")
                model.fetch({
                    async: false
                })
                model.destroy()

                this.render()
                this.unReadMails()
            },
            "click #previousButton": function(e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.modelNo = 0
                    this.showNextButton = 1
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }

            },
            "click #invite-accept": function(e) {
                if (mailView.inViewModel.get('type') == "admissionRequest") {
                    mailView.admissionRequestAccepted(e.currentTarget.value)
                    return
                }
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                var vacancyFull = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>this Course Was Full.</div>"
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>You have accepted this invitation.</div>"

                if (mailView.inViewModel.get('type') == "Meetup-invitation") {
                    mailView.meetupRequestAccepted(e.currentTarget.value)
                    mailView.updateMailBody(body)
                    return
                }

                var gmodel = new App.Models.Group({
                    _id: e.currentTarget.value
                })
                gmodel.fetch({
                    async: false
                })

                var that = this

                //*************check Vacancies for the Course**************

                var num = gmodel.get("members").length
                if (gmodel.get("memberLimit"))
                    if (gmodel.get("memberLimit") < num) {
                        alert('This Course is full')
                        mailView.updateMailBody(vacancyFull)
                        return
                    }
                mailView.updateMailBody(body)
                if (gmodel.get("_id")) {
                    var memberlist = []
                    if (gmodel.get("members") != null) {
                        memberlist = gmodel.get("members")
                    }


                    if (memberlist.indexOf($.cookie('Member._id')) == -1) {
                        memberlist.push($.cookie('Member._id'))
                        gmodel.set("members", memberlist)

                        gmodel.save({}, {
                            success: function() {
                                var memprogress = new App.Models.membercourseprogress()
                                var csteps = new App.Collections.coursesteps();
                                var stepsids = new Array()
                                var stepsres = new Array()
                                var stepsstatus = new Array()
                                csteps.courseId = gmodel.get("_id")
                                csteps.fetch({
                                    success: function() {
                                        csteps.each(function(m) {
                                            stepsids.push(m.get("_id"))
                                            stepsres.push("0")
                                            stepsstatus.push("0")
                                        })
                                        memprogress.set("stepsIds", stepsids)
                                        memprogress.set("memberId", $.cookie("Member._id"))
                                        memprogress.set("stepsResult", stepsres)
                                        memprogress.set("stepsStatus", stepsstatus)
                                        memprogress.set("courseId", csteps.courseId)
                                        memprogress.save({
                                            success: function() {}
                                        })

                                    }
                                })
                                alert("Course added to your dashboard")
                                Backbone.history.navigate('dashboard', {
                                    trigger: true
                                })
                            }
                        })

                    } else {
                        alert("Course already added to your dashboard")
                        Backbone.history.navigate('dashboard', {
                            trigger: true
                        })
                    }
                }
            },


            "click #invite-reject": function(e) {
                if (mailView.inViewModel.get('type') == "admissionRequest") {
                    mailView.admissoinRequestRejected(e.currentTarget.value)
                    return
                }
                var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
                body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
                body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>You have rejected this invitation.</div>"

                mailView.updateMailBody(body)
            },
            "click #search-mail": function(e) {
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.searchText = $("#search-text").val()
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.fetchRecords()
            },
            "click #back": function(e) {
                //	this.viewButton(e)
                skip = 0
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                this.resultArray = []
                skipStack.push(skip)
                this.modelNo = 0
                this.render()
                this.fetchRecords()
            }
        },
        unReadMails: function(e) {
            this.modelNo = 0
            skip = 0
            this.searchText = ""
            $("#search-text").val("")
            this.resultArray = []
            this.unopen = true
            this.fetchRecords()
            $("#nextButton").show()
            $("#previousButton").hide()
        },
        renderAllMails: function(e) {

            mailView.modelNo = 0
            skip = 0
            this.searchText = ""
            mailView.resultArray = []
            mailView.unopen = false
            mailView.fetchRecords()

            $("#nextButton").show()
            $("#previousButton").hide()

        },
        viewButton: function(e) {
            var modelNo = e.currentTarget.value
            var model = mailView.collection.at(modelNo)
            var attchmentURL = '/mail/' + model.get("_id") + '/'
            var attachmentName = ''
            if (typeof model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(model.get('_attachments'))[0]
                attachmentName = _.keys(model.get('_attachments'))[0]
                //document.getElementById("memberImage").src = attchmentURL
            }
            mailView.inViewModel = model
            model.set("status", "1")
            // console.log(this)
            console.log(e)
            model.save()
            mailView.vars = model.toJSON()

            var member = new App.Models.Member()
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            mailView.vars.firstName = member.get('firstName')
            mailView.vars.lastName = member.get('lastName')
            mailView.vars.email = member.get('login') + '.' + mailView.code + mailView.nationName.substring(3, 5) + '@olebell.org'
            mailView.vars.modelNo = modelNo
            mailView.vars.login = mailView.vars.email
            if (attachmentName != "") {
                mailView.vars.isAttachment = 1
                mailView.vars.attchmentURL = attchmentURL
            } else {
                mailView.vars.isAttachment = 0
            }
            mailView.$el.html('')
            mailView.$el.append(mailView.templateMailView(mailView.vars))
        },
        deleteButton: function(e) {
            //alert(e.currentTarget.value)
            var modelNo = e.currentTarget.value
            var selectedModel = mailView.collection.at(modelNo)
            selectedModel.destroy()
            mailView.renderAllMails()
            // window.location.reload()
        },
        initialize: function(args) {
            this.code = args.community_code
            this.nationName = args.nationName
            this.modelNo = 0
            skip = 0
            this.unopen = true
            this.recordsPerPage = 5
            this.nextButton = 1
            this.searchText = ""
            this.delegateEvents()
            this.resultArray = []
            this.showNextButton = 0
        },
        addOne: function(model) {
            vars = model.toJSON()
            var member = new App.Models.Member()
            member.set("id", model.get('senderId'))
            member.id = model.get('senderId')
            member.fetch({
                async: false
            })
            if (member.id == undefined) {
                var name = "Error!!"
            } else {
                var name = member.get('firstName') + ' ' + member.get('lastName')
            }
            if (vars.subject) {
                var row = ""
                if (vars.status == 0) {

                    row = '<tr bgcolor="B4D3EC" style="color:black">'
                } else {
                    row = '<tr bgcolor="E7E7E7" style="color:#2D2D34">'
                }
                var deleteId = "delete" + this.modelNo
                var viewId = "view" + this.modelNo

                row = row + '<td>' + vars.subject + '</td><td align="center">' + name + '</td><td align="right"><button value="' + this.modelNo + '" id ="' + deleteId + '" class="btn btn-danger">Delete</button>&nbsp;&nbsp;<button value="' + this.modelNo + '" id="' + viewId + '" class="btn btn-primary" >View</button></td></tr>'
                $('#inbox_mails').append(row)
                this.modelNo++
                $("#" + deleteId).click(this.deleteButton)
                $("#" + viewId).click(this.viewButton)
                mailView = this
            }
        },

        addAll: function() {

            $('#inbox_mails').html('')
            if (skipStack.length <= 1) {
                $('#previousButton').hide()
            } else {
                $('#previousButton').show()
            }
            this.collection.forEach(this.addOne, this)
        },
        render: function() {
            this.$el.html(this.template(this.vars))
            this.$el.append('<div class="mail-table"><span style="float:right; margin-left:10px;"><button id="nextButton" class="btn btn-primary fui-arrow-right"></button></span> <span style="float:right;"><button id="previousButton" class="btn btn-primary fui-arrow-left"></button></span></div>')
            //$('#mailActions').html(this.template)


        },

        fetchRecords: function() {
            var obj = this
            var newCollection = new App.Collections.Mails({
                receiverId: $.cookie('Member._id'),
                unread: obj.unopen
            })

            newCollection.fetch({
                success: function() {
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(newCollection.models, obj.searchText))
                    if (obj.resultArray.length != limitofRecords && newCollection.models.length == limitofRecords) {
                        obj.fetchRecords()

                        return;
                    } else if (obj.resultArray.length == 0 && skipStack.length > 1) {
                        $("#nextButton").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        //  if (searchText != "")
                        {

                            $("#errorMessage").show();
                            return
                        }
                    }

                    var ResultCollection = new App.Collections.Mails()
                    if (obj.resultArray.length > 0) {
                        $("#errorMessage").hide();
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.addAll()
                        if (obj.showNextButton == 1) {
                            $("#nextButton").show()
                            obj.showNextButton = 0
                        }
                    }
                }
            })

        },
        searchInArray: function(resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount

            {
                _.each(resourceArray, function(result) {
                    if (result.get("subject") != null && result.get("body") != null) {
                        skip++
                        if (result.get("subject").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 || result.get("body").toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {

                            if (resultArray.length < limitofRecords) {
                                resultArray.push(result)
                            } else {
                                console.log('first')
                                skip--
                            }
                        } else if (resultArray.length >= limitofRecords) {
                            console.log('second')
                            skip--
                        }
                    }
                })

            }
            return resultArray
        },
        admissionRequestAccepted: function(courseId) {
            var course = new App.Models.Group();
            course.id = courseId
            course.fetch({
                async: false
            })
            var memId = mailView.inViewModel.get('senderId')
            course.get('members').push(memId)
            course.save(null, {
                success: function(model, idRev) {

                    var memprogress = new App.Models.membercourseprogress()
                    var csteps = new App.Collections.coursesteps();
                    var stepsids = new Array()
                    var stepsres = new Array()
                    var stepsstatus = new Array()
                    csteps.courseId = idRev.id
                    csteps.fetch({
                        success: function() {
                            csteps.each(function(m) {
                                stepsids.push(m.get("_id"))
                                stepsres.push("0")
                                stepsstatus.push("0")
                            })
                            memprogress.set("stepsIds", stepsids)
                            memprogress.set("memberId", memId)
                            memprogress.set("stepsResult", stepsres)
                            memprogress.set("stepsStatus", stepsstatus)
                            memprogress.set("courseId", csteps.courseId)
                            memprogress.save({
                                success: function() {
                                    alert('saved')
                                }
                            })

                        }
                    })

                }
            })
            var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
            //body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
            body = 'Admission request received from user "a" has been Accepted<br>'
            body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>You have accepted this request.</div>"

            mailView.inViewModel.save()

            var currentdate = new Date();
            var mail = new App.Models.Mail();
            mail.set("senderId", $.cookie('Member._id'));
            mail.set("receiverId", mailView.inViewModel.get('senderId'));
            mail.set("subject", "Admission Request Accepted | " + course.get('name'));
            mail.set("body", "Your admission request for \"" + course.get('name') + "\" has been accepted by the course leader.");
            mail.set("status", "0");
            mail.set("type", "mail");
            mail.set("sentDate", currentdate);
            mail.save()

            mailView.updateMailBody(body)
        },
        admissoinRequestRejected: function(courseId) {

            var course = new App.Models.Group();
            course.id = courseId
            course.fetch({
                async: false
            })

            var body = mailView.inViewModel.get('body').replace(/<(?:.|\n)*?>/gm, '')
            //body = body.replace('Accept', '').replace('Reject', '').replace('&nbsp;&nbsp;', '')
            body = 'Admission request received from user "a" has been Rejected<br>'
            body = body + "<div style='margin-left: 3%;margin-top: 174px;font-size: 11px;color: rgb(204,204,204);'>You have rejected this request.</div>"

            var currentdate = new Date();
            var mail = new App.Models.Mail();
            mail.set("senderId", $.cookie('Member._id'));
            mail.set("receiverId", mailView.inViewModel.get('senderId'));
            mail.set("subject", "Admission Request Rejected | " + courseId.get('name'));
            mail.set("body", "Your admission request for \"" + courseId.get('name') + "\" has been rejected by the course leader.");
            mail.set("status", "0");
            mail.set("type", "mail");
            mail.set("sentDate", currentdate);
            mail.save()

            mailView.updateMailBody(body)
        },
        meetupRequestAccepted: function(meetupId) {
            var UMeetup = new App.Collections.UserMeetups()
            UMeetup.memberId = $.cookie('Member._id')
            UMeetup.meetupId = meetupId

            UMeetup.fetch({
                async: false
            })
            if (UMeetup.length > 0) {
                alert("Your have already joined this Meetup")
                return
            }

            var meetup = new App.Models.MeetUp()
            meetup.id = meetupId
            meetup.fetch({
                async: false
            })

            console.log(meetup)

            if (!meetup.get('title')) {
                alert('Meetup No more Exist')
                return
            }
            var userMeetup = new App.Models.UserMeetup()

            userMeetup.set({
                memberId: $.cookie('Member._id'),
                meetupId: meetupId,
                meetupTitle: meetup.get('title'),

            })
            userMeetup.save()

            alert('Successfully Joined')

        },
        updateMailBody: function(body) {
            var model = new App.Models.Mail()
            model.id = mailView.inViewModel.get("id")
            model.fetch({
                async: false
            })
            model.set('body', body)
            model.save()
            $('#mail-body').html('<br/>' + body)
        },

    })


});$(function() {

    App.Views.ManageCommunity = Backbone.View.extend({

        events: {
            "click .SyncDbSelect": 'SyncDbSelect',
            "click #configuration": 'Configuration',
            "click .back": function(e) {
                alert('back')
            }

        },
        initialize: function() {
            this.$el.append('<th colspan="2"><h6>Meetup Detail</h6></th>')

        },

        processJsonp: function() {
            alert();
        },
        render: function() {

            // here we willn check the any new updated 
            this.$el.html('')
            nName = App.configuration.get('nationName')
            pass = App.password
            nUrl = App.configuration.get('nationUrl')
            currentBellName = App.configuration.get('name')
            var htmlreferance = this.$el

            this.$el.append('<div style="padding: 20px 20px 0px 20px; float: left;"> <a id="configuration"><button class="btn btn-primary" id="configbutton">Configurations</button></a> </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <button class="SyncDbSelect btn btn-primary" id="sync">Sync With Nation</button>  </div>')
            this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <a class="btn btn-primary" href="#publications/for-' + App.configuration.get('name') + '">Publications</a>  </div>')
            // /****************************************************************************************************************************************************
            //   this.$el.append('<div style="padding: 20px 20px 0px 0px; float: left;"> <button class="SyncMembersDb btn btn-primary" id="syncmembers">Sync Members Db With Nation</button>  </div>')
            //  ****************************************************************************************************************************************************/
        },
        syncDbs: function(e) {
            alert('this is sync db function in community manage')
        },
        SyncDbSelect: function() {
            $('#invitationdiv').fadeIn(1000)
            var inviteForm = new App.Views.listSyncDbView()

            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)
        },
        Configuration: function() {
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var configForm = new App.Views.Configurations({
                model: configModel
            })
            configForm.render();

            this.$el.html(configForm.el);
        }

    })

});$(function() {

    App.Views.MeetUpForm = Backbone.View.extend({

        className: "form",
        id: 'meetUpForm',
        prevmemlist: null,
        saved: null,
        btnText: 'Save',
        events: {
            "click #MeetUpformButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #InviteMembers": "MemberInvite",
            "click #MeetUpcancel": function() {
                window.history.back()
            }

        },
        MemberInvite: function() {

            var model = this.model
            console.log(model)

            if (!model.get('id')) {
                this.setForm()
                return
            }
            if ($("textarea[name='description']").val().length > 0) {

                $('#invitationdiv').fadeIn(1000)
                document.getElementById('cont').style.opacity = 0.1
                document.getElementById('nav').style.opacity = 0.1
                $('#invitationdiv').show()
                var inviteModel = new App.Models.InviMeetup()
                inviteModel.resId = model.get("id")
                inviteModel.senderId = $.cookie('Member._id')
                inviteModel.type = model.get("kind")
                inviteModel.title = model.get("title")
                inviteModel.description = model.get("description")
                var inviteForm = new App.Views.MeetupInvitation({
                    model: inviteModel
                })
                inviteForm.render()
                $('#invitationdiv').html('&nbsp')
                $('#invitationdiv').append(inviteForm.el)
            } else {
                alert("Specify Meetup description first")
            }
        },
        render: function() {

            $('#invitationdiv').hide()
            // members is required for the form's members field

            if (!this.model.get('_id'))
                this.$el.append('<h3>Start a New Meetup</h3>')
            else {
                this.$el.append('<h3>Edit Meetup | ' + this.model.get('title') + '</h3>')
                this.btnText = 'Update'
            }


            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            if (this.btnText != 'Update')
                this.form.fields['Day'].$el.hide();

            var $sbutton = $('<a class="btn btn-success" id="MeetUpformButton">' + this.btnText + '</a>')

            var $ubutton = $('<a class="btn btn-success" id="formButton">Cancel</a>')
            // var $button = $('<a class="btn btn-success" id="meetInvitation">Invite Member</button><a role="button" id="ProgressButton" class="btn" href="#course/report/' + this.model.get("_id") + '/' +this.model.get("name") + '"> <i class="icon-signal"></i> Progress</a>')
            this.$el.append($sbutton)
            //this.$el.append($button)
            if (this.btnText != 'Update')
                this.$el.append('<a class="btn btn-info" id="InviteMembers">Invite Members</a>')

            this.$el.append("<a class='btn btn-danger' id='MeetUpcancel'>Cancel</a>")

            console.log(this.model)

            /*  var picker = new Backbone.UI.TimePicker({
             model: this.model,
             content: 'Time',
             })
             */
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },
        setForm: function() {

            if (this.model.get('id')) {
                alert('Saved already')
                return
            }

            var that = this
            /* this.model.once('sync', function () {
             console.log(that.model)
             Backbone.history.navigate('meetups', {
             trigger: true
             })
             })
             */
            // Put the form's input into the model in memory
            this.form.commit()

            if (this.model.get("title").length == 0) {
                alert("Meetup title is missing")
            } else if (this.model.get("description").length == 0) {
                alert("Meetup Description is missing")
            } else if (this.model.get("meetupLocation").length == 0) {
                alert("Meetup Location is missing")
            } else {

                this.model.set('creator', $.cookie('Member._id'))
                this.model.save(null, {
                    success: function(responce) {


                        if (that.btnText == 'Save') {
                            var userMeetup = new App.Models.UserMeetup()
                            userMeetup.set({
                                memberId: $.cookie('Member._id'),
                                meetupId: responce.get('id'),
                                meetupTitle: responce.get('title'),

                            })
                            userMeetup.save()
                            that.MemberInvite(responce)
                        } else {
                            var userMeetup = new App.Collections.UserMeetups()
                            userMeetup.meetupId = responce.get('id')
                            userMeetup.memberId = $.cookie('Member._id')
                            userMeetup.fetch({
                                async: false
                            })
                            if (res = userMeetup.first()) {
                                res.set('meetupTitle', responce.get('title'))
                                res.save()
                                alert('Updated Successfully')

                            }
                            Backbone.history.navigate('meetups', {
                                trigger: true
                            })
                        }

                    }
                })



            }
        },


    })

});$(function() {

    App.Views.MeetUpRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {},

        template: $("#template-MeetUpRow").html(),

        initialize: function(e) {
            //this.model.on('destroy', this.remove, this)
            this.roles = e.roles
        },

        render: function() {

            var vars = this.model.toJSON()


            if (this.roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1
            } else {
                vars.isAdmin = 0
            }


            if (vars.creator && vars.creator == $.cookie('Member._id')) {
                vars.creator = 1
            } else {
                vars.creator = 0
            }

            if (vars._id != '_design/bell')
                this.$el.append(_.template(this.template, vars))
        }

    })

});$(function() {
	App.Views.MeetUpTable = Backbone.View.extend({

		tagName: "table",

		className: "btable btable-striped",
		roles: null,
		addOne: function(model) {
			var meetupRow = new App.Views.MeetUpRow({
				model: model,
				roles: this.roles
			})
			meetupRow.render()
			this.$el.append(meetupRow.el)
		},
		events: {
			"click .pageNumber": function(e) {
				this.collection.startkey = ""
				this.collection.skip = e.currentTarget.attributes[0].value
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},

		},
		addAll: function() {

			this.$el.html("<tr><th>Topic</th><th colspan='4'>Actions</th></tr>")
			var manager = new App.Models.Member({
				_id: $.cookie('Member._id')
			})
			manager.fetch({
				async: false
			})
			this.roles = manager.get("roles")
			// @todo this does not work as expected, either of the lines
			// _.each(this.collection.models, this.addOne())
			this.collection.each(this.addOne, this)
			var groupLength;
			var context = this
			$.ajax({
				url: '/meetups/_design/bell/_view/count?group=false',
				type: 'GET',
				dataType: "json",
				success: function(json) {
					meetupLength = json.rows[0].value
					if (context.displayCollec_Resources != true) {
						var pageBottom = "<tr><td colspan=7>"
						var looplength = meetupLength / 20

						for (var i = 0; i < looplength; i++) {
							if (i == 0)
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">Home</a>&nbsp&nbsp'
							else
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
						}
						pageBottom += "</td></tr>"
						context.$el.append(pageBottom)
					}

				}
			})
		},

		render: function() {
			this.addAll()
		}

	})

});$(function() {

    App.Views.MeetupDetails = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "table table-striped resourceDetail",
        sid: null,
        rid: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyMeetupItem": function(e) {

                var vars = this.model.toJSON()
                var mId = $.cookie('Member._id')

                var userMeetups = new App.Collections.UserMeetups()
                userMeetups.memberId = mId
                userMeetups.meetupId = vars._id

                userMeetups.fetch({
                    async: false
                })


                var model;
                while (model = userMeetups.first()) {
                    model.destroy();
                }

                alert("Successfully removed from My Meetups ")
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })


            }

        },
        initialize: function() {
            this.$el.append('<th colspan="2"><h6>Meetup Detail</h6></th>')
        },
        render: function() {
            var vars = this.model.toJSON()
            var date = new Date(vars.schedule)
            vars.schedule = date.toUTCString()

            console.log(vars)

            this.$el.append('<tr><td><b>Title  </b></td><td>' + vars.title + '   (' + vars.category + ')</td></tr>')
            this.$el.append('<tr><td><b>Category  </b></td><td>' + vars.category + '</td></tr>')
            this.$el.append('<tr><td><b>Description </b></td><td>' + vars.description + '</td></tr>')
            this.$el.append('<tr><td><b>Location </b></td><td>' + vars.meetupLocation + '</td></tr>')
            this.$el.append('<tr><td><b>Date </b></td><td>' + vars.startDate + ' --- ' + vars.endDate + '</td></tr>')
            this.$el.append('<tr><td><b>Time </b></td><td>' + vars.startTime + ' --- ' + vars.endTime + '</td></tr>')

            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyMeetupItem">Unjoin</button></td></tr>')

        },

    })

});$(function() {

    App.Views.MeetupInvitation = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv",

        },

        title: null,
        entityId: null,
        type: null,
        senderId: null,

        hidediv: function() {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

            Backbone.history.navigate('meetups', {
                trigger: true
            })

        },
        SetParams: function(ti, e, t, s) {
            this.title = ti
            this.entityId = e
            this.type = t
            this.senderId = s

        },
        render: function() {

            //members is required for the form's members field
            console.log(this.model)
            var members = new App.Collections.Members()
            var that = this
            var inviteForm = this
            inviteForm.on('InvitationForm:MembersReady', function() {

                console.log(that.model.schema)
                this.model.schema.members.options = members
                // create the form
                this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                this.form.fields['members'].$el.hide()

                this.form.fields['invitationType'].$el.change(function() {
                    var val = that.form.fields['invitationType'].$el.find('option:selected').text()
                    if (val == "Members") {
                        that.form.fields['members'].$el.show()
                    } else {
                        that.form.fields['members'].$el.hide()
                    }
                })
                // give the form a submit button
                var $button = $('<a class="btn btn-success" id="formButton">Invite</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">Cancel</button>')
            })

            // Get the group ready to process the form
            members.once('sync', function() {
                inviteForm.trigger('InvitationForm:MembersReady')

            })
            members.fetch()
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var member = new App.Models.Member({
                _id: $.cookie('Member._id')
            })
            member.fetch({
                async: false
            })
            // Put the form's input into the model in memory
            this.form.commit()
            var memberList = new App.Collections.Members()
            memberList.fetch({
                async: false
            })

            var temp
            var that = this
            var currentdate = new Date();
            if (this.model.get("invitationType") == "All") {
                memberList.each(function(m) {
                    temp = new App.Models.Mail()
                    temp.set("senderId", that.model.senderId)
                    temp.set("receiverId", m.get("_id"))
                    temp.set("status", "0")
                    temp.set("subject", "Meetup Invitation | " + that.model.title)
                    temp.set("type", "Meetup-invitation")
                    temp.set("body", that.model.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                    temp.set("sendDate", currentdate)
                    temp.set("entityId", that.model.resId)
                    temp.save()

                })

            } else if (this.model.get("invitationType") == "Members") {
                memberList.each(function(m) {
                    var that2 = that;
                    if (that.model.get("members").indexOf(m.get("_id")) > -1) {
                        temp = new App.Models.Mail()
                        temp.set("senderId", that.model.senderId)
                        temp.set("receiverId", m.get("_id"))
                        temp.set("status", "0")
                        temp.set("subject", "Meetup Invitation | " + that.model.title)
                        temp.set("body", that.model.description + '<br/><br/><button class="btn btn-primary" id="invite-accept" value="' + that.model.resId + '" >Accept</button>&nbsp;&nbsp;<button class="btn btn-danger" id="invite-reject" value="' + that.model.resId + '" >Reject</button>')
                        temp.set("type", "Meetup-invitation")
                        temp.set("sendDate", currentdate)
                        temp.set("entityId", that.model.resId)
                        temp.save()
                        console.log(temp);
                    }
                })
            }
            $('#invitationdiv').fadeOut(1000)
            alert("Invitation sent successfully")
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function() {
                $('#invitationdiv').hide()
            }, 1000);

            Backbone.history.navigate('meetups', {
                trigger: true
            })

        },


    })

});$(function() {

  App.Views.MeetupSpan = Backbone.View.extend({

    tagName: "td",

    className: 'meetup-box',

    template: $("#template-Meetup").html(),

    render: function() {

      var vars = this.model.toJSON()
      this.$el.append(_.template(this.template, vars))
    }

  })

});$(function() {
    App.Views.MeetupSpans = Backbone.View.extend({

        tagName: "tr",

        addOne: function(model) {
            var modelView = new App.Views.MeetupSpan({
                model: model
            })
            modelView.render()
            $('#meetUpTable').append(modelView.el)
        },

        addAll: function() {

            if (this.collection.length != 0) {
                this.collection.each(this.addOne, this)
            } else {

                $('#meetUpTable').append("<td class='course-box'>No MeetUp</td>")
            }
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {

    App.Views.MemberForm = Backbone.View.extend({

        className: "form",
        id: 'memberform',

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButtonCancel": function() {
                window.history.back()
            },
            "click #deactive": function(e) {
                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    location.reload();
                })
                this.model.save({
                    status: "deactive"
                }, {
                    success: function() {}
                });
            },
            "click #ptManager": function(e) {


            },
            "click #active": function(e) {
                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function() { /*this.model.fetch({async:false})*/ }
                });
            },
        },
        getRoles: function(userId) {

            var user = (userId) ? new App.Models.Member({
                "_id": userId
            }) : new App.Models.Member({
                "_id": $.cookie('Member._id')
            })
            user.fetch({
                async: false
            })
            var roles = user.get("roles")

            return roles
        },


        render: function() {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            var buttonText = ""
            this.$el.append(this.form.render().el)
            this.form.fields['status'].$el.hide()
            this.form.fields['yearsOfTeaching'].$el.hide()
            this.form.fields['teachingCredentials'].$el.hide()
            this.form.fields['subjectSpecialization'].$el.hide()
            this.form.fields['forGrades'].$el.hide()
            this.form.fields['visits'].$el.hide()

            this.form.setValue({
                community: App.configuration.get("name"),
                region: App.configuration.get("region"),
                nation: App.configuration.get("nationName")
            })

            $("input[name='community']").attr("disabled", true);
            $("input[name='region']").attr("disabled", true);
            $("input[name='nation']").attr("disabled", true);


            var $imgt = "<p id='imageText' style='margin-top: 15px;'></p>"
            if (this.model.id != undefined) {
                buttonText = "Update"

                $("input[name='login']").attr("disabled", true);
            } else {
                buttonText = "Register"
            }
            // give the form a submit button
            var $button = $('<div class="signup-submit"><a class="btn btn-success" id="formButton" style="margin-top: 10px;">' + buttonText + '</button><a class="btn btn-danger" id="formButtonCancel" style="margin-top: 10px;">Cancel</button></div>')
            //this.$el.append($button)
            var $upload = $('<form method="post" id="fileAttachment" ><input type="file" name="_attachments" style="margin-left: 170px;" id="_attachments" multiple="multiple" /> <input class="rev" type="hidden" name="_rev"></form>')
            var $img = $('<div id="browseImage" >' + $imgt + '<img style="width:100px;height:100px;border-radius:50px" id="memberImage"></div>')
            this.$el.append($img)
            this.$el.append($upload)
            this.$el.append($button)
            if (this.model.id != undefined) {
                if (this.model.get("status") == "active") {
                    $(".signup-submit").append('<a class="btn btn-danger" id="deactive" href="#" style="margin-top: 10px;">Resign</a>')
                } else {
                    $(".signup-submit").append('<a class="btn btn-success" id="active" style="margin-top: 10px;" href="#">Reinstate</a>')
                }
                var logUserroles = this.getRoles(false)
                if (logUserroles.indexOf("SuperManager") > -1) {
                    var thisUser = this.getRoles(this.model.id)
                    $('#memberform').append('<div style="margin-left: 170px;margin-top: -40px;"><input id="ptManager" type="checkbox" ><label for="ptManager">Promote To Manager</label></div>')
                    if (thisUser.indexOf("Manager") > -1) {
                        $('#ptManager').prop('checked', true);
                    }
                }
            }


            var attchmentURL = '/members/' + this.model.id + '/'
            if (typeof this.model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                document.getElementById("memberImage").src = attchmentURL
            }

        },

        validImageTypeCheck: function(img) {
            if (img.val() == "") {
                //alert("ERROR: No image selected \n\nPlease Select an Image File")
                return 1
            }
            var extension = img.val().split('.')
            console.log(extension[(extension.length - 1)])
            if (extension[(extension.length - 1)] == 'jpeg' || extension[(extension.length - 1)] == 'jpg' || extension[(extension.length - 1)] == 'png' || extension[(extension.length - 1)] == 'JPG') {
                return 1
            }
            alert("ERROR: Not a valid image file \n\n Valid Extensions are  [.jpg, .jpeg ]")
            return 0
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            if ($('#ptManager').attr('checked')) { // if promote to manager checkbox is ticked
                // then add the 'Manager' role to his/her roles array only if this person is not a manager already. following check added
                // by Omer Yousaf on 16 Jan, 2015.
                var index = this.model.toJSON().roles.indexOf('Manager');
                if (index < 0) { // 'Manager' does not exist in his/her roles array
                    this.model.toJSON().roles.push("Manager");
                }
            } else {
                var index = this.model.toJSON().roles.indexOf('Manager')
                if (index > -1) {
                    this.model.toJSON().roles.splice(index, 1)
                }
            }
            var that = this;
            if (this.form.validate() != null) {
                return
            }
            // Put the form's input into the model in memory
            if (this.validImageTypeCheck($('input[type="file"]'))) {
                // assign community, region and nation attribs in member model values from configuration doc
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                });
                var config = new configurations();
                config.fetch({
                    async: false
                });
                console.log('---***********---');
                console.log(config);
                console.log(config.first().toJSON());
                var configsDoc = config.first().toJSON().rows[0].doc;

                this.form.setValue({
                    status: "active",
                    community: configsDoc.code,
                    region: configsDoc.region,
                    nation: configsDoc.nationName
                });
                this.form.commit();
                // Send the updated model to the server
                if ($.inArray("lead", this.model.get("roles")) == -1) {
                    that.model.set("yearsOfTeaching", null)
                    that.model.set("teachingCredentials", null)
                    that.model.set("subjectSpecialization", null)
                    that.model.set("forGrades", null)
                }

                var addMem = true
                if (this.model.get("_id") == undefined) {
                    this.model.set("roles", ["Learner"])
                    this.model.set("visits", 0)
                    var existing = new App.Collections.Members()

                    existing.login = that.model.get("login")
                    existing.fetch({
                        async: false,
                        success: function() {
                            existing = existing.first()
                            if (existing != undefined) {
                                if (existing.toJSON().login != undefined) {
                                    alert("Login already exist")
                                    addMem = false
                                }
                            }
                        }

                    });

                }
                if (addMem) {
                    var memberModel = this.model;
                    this.model.save(null, {
                        success: function() {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                            } else {
                                if (that.model.attributes._rev == undefined) {
                                    // if true then its a new member signup
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                } else {
                                    alert("Successfully Updated!!!");
                                    Backbone.history.navigate('members', {
                                        trigger: true
                                    });
                                }
                            }
                            that.model.on('savedAttachment', function() {
                                if (that.model.attributes._rev == undefined) { // if true then its a new member signup
                                    // so capture this in activity logging
                                    // so capture this in activity logging
                                    var pouchActivityLogDb = new PouchDB('activitylogs');
                                    var currentdate = new Date();
                                    var logdate = that.getFormattedDate(currentdate);
                                    pouchActivityLogDb.get(logdate, function(err, pouchActivityLogRec) {
                                        if (!err) {
                                            that.UpdatejSONlog(logdate, pouchActivityLogRec, memberModel, pouchActivityLogDb);
                                        } else {
                                            that.createJsonlog(logdate, configsDoc, memberModel, pouchActivityLogDb);
                                        }
                                    });
                                } else {
                                    alert("Successfully Updated!!!");
                                    Backbone.history.navigate('members', {
                                        trigger: true
                                    })
                                }
                            }, that.model)
                        }
                    })
                }
            }
        },

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },

        createJsonlog: function(logdate, configsDoc, member, pouchActivityLogDb) {
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                female_new_signups: 0,
                male_new_signups: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: configsDoc.code,
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {
                docJson.male_new_signups = 1;
            } else {
                docJson.female_new_signups = 1;
            }
            pouchActivityLogDb.put(docJson, logdate, function(err, response) {
                if (!err) {
                    console.log("created activity log in pouchdb for today.. i-e " + logdate);
                    console.log(response);
                } else {
                    console.log("MyApp::MemberForm.js (view):: createJsonlog: error creating activity log doc in pouchdb..");
                    console.log(err);
                }
                alert("Successfully Registered!!!");
                Backbone.history.navigate('members', {
                    trigger: true
                });
            });
        },

        UpdatejSONlog: function(logdate, pouchActivityLogRec, member, pouchActivityLogDb) {
            if (member.get('Gender') == 'Male') {
                pouchActivityLogRec.male_new_signups = parseInt(((pouchActivityLogRec.male_new_signups) ? pouchActivityLogRec.male_new_signups : 0)) + 1;
            } else {
                pouchActivityLogRec.female_new_signups = parseInt(((pouchActivityLogRec.female_new_signups) ? pouchActivityLogRec.female_new_signups : 0)) + 1;
            }
            pouchActivityLogDb.put(pouchActivityLogRec, logdate, pouchActivityLogRec._rev, function(err, response) {
                if (!err) {
                    console.log("updated activity log in pouchdb for today.. i-e " + logdate);
                    console.log(response);
                } else {
                    console.log("MyApp::MemberForm.js (view):: UpdatejSONlog: err making update to record");
                    console.log(err);
                }
                alert("Successfully Registered!!!");
                Backbone.history.navigate('members', {
                    trigger: true
                });
            });
        }
    })

});$(function() {
    //ce82280dc54a3e4beffd2d1efa00c4e6
    App.Views.MemberLoginForm = Backbone.View.extend({

        className: "form login-form",

        events: {
            "keypress .bbf-form": "listenToEnterForSubmit",
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #formButton2": "signup",
            "click #welcomeButton": "showWelcomeVideo"
        },
        listenToEnterForSubmit: function(event) {
            if (event.keyCode == 13) {
                this.setForm();
            }
        },
        render: function() {
            var context = this;
            var welcomeResources = new App.Collections.Resources();
            welcomeResources.setUrl(App.Server + '/resources/_design/bell/_view/welcomeVideo');
            welcomeResources.fetch({
                success: function() {
                    if (welcomeResources.length > 0) {
                        var welcomeResourceId = welcomeResources.models[0].attributes.id;
                        // display "watch welcome video" button
                        var hrefWelcomeVid = "/apps/_design/bell/bell-resource-router/index.html#openres/" + welcomeResourceId;
                        //                        var $buttonWelcome = $('<a id="welcomeButton" class="login-form-button btn btn-block btn-lg btn-success" href="hmmm" target="_blank" style="margin-left: -4px;margin-top: -21px; font-size:27px;">Welcome</button>');
                        var $buttonWelcome = $('<a id="welcomeButton" class="login-form-button btn btn-block btn-lg btn-success" target="_blank" href="hmmm" style="margin-left: -4px;margin-top: -21px; font-size:27px;">Welcome</button>');
                        context.$el.append($buttonWelcome);
                        context.$el.find("#welcomeButton").attr("href", hrefWelcomeVid); // <a href="dummy.mp4" class="html5lightbox" data-width="880" data-height="640" title="OLE | Welcome Video">Welcome Video</a>
                    }
                },
                error: function() {
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

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        signup: function() {
            Backbone.history.navigate('member/add', {
                trigger: true
            })
        },
        setForm: function() {
            var memberLoginForm = this
            this.form.commit()
            var credentials = this.form.model
            var members = new App.Collections.Members()
            var member;
            members.login = credentials.get('login')
            members.fetch({
                success: function() {
                    if (members.length > 0) {
                        member = members.first();
                        if (member && member.get('password') == credentials.get('password') &&member.get('login') == credentials.get('login') ) {
                            if (member.get('status') == "active") {
                                //UPDATING MEMBER VISITS
                                App.member = member
                                var vis = parseInt(member.get("visits"))
                                vis++
                                member.set("visits", vis)
                                member.once('sync', function() {})

                                member.save(null, {
                                    success: function(doc, rev) {}
                                })

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

                                if (parseInt(member.get('visits')) == 1 && member.get('roles').indexOf('SuperManager') != -1) {
                                    //$('#nav').hide()
                                    Backbone.history.navigate('configuration/add', {
                                        trigger: true
                                    });
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
                }
            });
        },
        logActivity: function(member) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
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
        UpdatejSONlog: function(member, logModel, logdb, logdate) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            if (member.get('Gender') == 'Male') {
                var visits = parseInt(logModel.male_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.male_visits = visits
            } else {
                var visits = parseInt(logModel.female_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.female_visits = visits
            }
            logModel.community = App.configuration.get("code");

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
        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },
        createJsonlog: function(member, logdate, logdb) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            // alert(superMgrIndex);
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {

                var visits = parseInt(docJson.male_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.male_visits = visits
            } else {

                var visits = parseInt(docJson.female_visits)
                //    if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.female_visits = visits
            }
            docJson.community = App.configuration.get('code'),
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
});$(function() {

    App.Views.MemberRow = Backbone.View.extend({

        tagName: "tr",

        getFormattedDate: function(date) {
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },

        createJsonlog: function(logdb, logdate, gender) {
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (gender == 'Male') {
                docJson.male_deleted_count = parseInt(((docJson.male_deleted_count) ? docJson.male_deleted_count : 0)) + 1;
                docJson.female_deleted_count = parseInt(((docJson.female_deleted_count) ? docJson.female_deleted_count : 0)) + 0;
            } else {
                docJson.female_deleted_count = parseInt(((docJson.female_deleted_count) ? docJson.female_deleted_count : 0)) + 1;
                docJson.male_deleted_count = parseInt(((docJson.male_deleted_count) ? docJson.male_deleted_count : 0)) + 0;
            }
            docJson.community = App.configuration.get('code'),
                logdb.put(docJson, logdate, function(err, response) {
                    if (!err) {
                        alert("Deleted members successfully saved.");
                    } else {
                        alert("Deleted members count failed to save.");
                        console.log(err);
                    }
                });
        },

        UpdatejSONlog: function(logdb, logdate, logModel, gender) {
            if (gender == 'Male') {
                logModel.male_deleted_count = parseInt(((logModel.male_deleted_count) ? logModel.male_deleted_count : 0)) + 1;
                logModel.female_deleted_count = parseInt(((logModel.female_deleted_count) ? logModel.female_deleted_count : 0)) + 0;
            } else {
                logModel.female_deleted_count = parseInt(((logModel.female_deleted_count) ? logModel.female_deleted_count : 0)) + 1;
                logModel.male_deleted_count = parseInt(((logModel.male_deleted_count) ? logModel.male_deleted_count : 0)) + 0;
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                    alert("updated daily log from pouchdb for today..");
                } else {
                    alert("UpdatejSONlog:: err making update to record");
                    console.log(err);
                }
            });
        },

        events: {
            "click .destroy": function(e) {
                var that = this;
                var logdb = new PouchDB('activitylogs');
                var currentdate = new Date();
                var logdate = that.getFormattedDate(currentdate);
                var gender = this.model.get("Gender");
                logdb.get(logdate, function(err, logModel) {
                    if (!err) {
                        that.UpdatejSONlog(logdb, logdate, logModel, gender);
                    } else {
                        that.createJsonlog(logdb, logdate, gender);
                    }
                });
                e.preventDefault()
                this.model.destroy()
                this.remove()
            },

            "click #deactive": function(e) {

                e.preventDefault()

                var that = this
                this.model.on('sync', function() {
                    // rerender this view

                    //that.render()
                    location.reload();
                })

                this.model.save({
                    status: "deactive"
                }, {
                    success: function() {}
                });

                //  this.model.fetch({async:false})
            },
            "click #active": function(e) {

                e.preventDefault()
                var that = this
                this.model.on('sync', function() {
                    // rerender this view

                    //that.render()
                    location.reload();
                })
                this.model.save({
                    status: "active"
                }, {
                    success: function() { /*this.model.fetch({async:false})*/ }
                });

            },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-MemberRow").html(),

        initialize: function() {
            //this.model.on('destroy', this.remove, this)
        },

        render: function() {
            if (!this.model.get("visits")) {
                this.model.set("visits")
            }
            var vars = this.model.toJSON()
            vars.community_code = this.community_code

            if ((this.model.get("_id") == $.cookie('Member._id')) && !this.isadmin) {
                vars.showdelete = false
                vars.showedit = true
            } else if (!this.isadmin) {
                vars.showdelete = false
                vars.showedit = false
            } else {
                vars.showdelete = true
                vars.showedit = true
            }
            vars.src = "img/default.jpg"
            var attchmentURL = '/members/' + this.model.id + '/'
            if (typeof this.model.get('_attachments') !== 'undefined') {
                attchmentURL = attchmentURL + _.keys(this.model.get('_attachments'))[0]
                vars.src = attchmentURL
            }
            this.$el.html(_.template(this.template, vars))
        }


    })

});$(function() {
	App.Views.MembersTable = Backbone.View.extend({

		tagName: "table",

		className: "btable btable-striped",

		addOne: function(model) {
			var memberRow = new App.Views.MemberRow({
				model: model
			})
			memberRow.isadmin = this.isadmin
			memberRow.community_code = this.community_code
			memberRow.render()
			this.$el.append(memberRow.el)
		},
		events: {
			"click .pageNumber": function(e) {
				this.collection.startkey = ""
				this.collection.skip = e.currentTarget.attributes[0].value
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},

		},

		addAll: function() {
			this.$el.html("<tr><th>Photo</th><th>Last Name</th><th>First Name</th><th>Visits</th><th>Email</th><th>Bell-Email</th><th>Actions</th></tr>")
			// @todo this does not work as expected, either of the lines
			// _.each(this.collection.models, this.addOne())

			console.log(this.collection)

			this.collection.each(this.addOne, this)

			var groupLength;
			var context = this
			$.ajax({
				url: '/members/_design/bell/_view/count?group=false',
				type: 'GET',
				dataType: "json",
				success: function(json) {
					memberLength = json.rows[0].value
					if (context.displayCollec_Resources != true) {
						var pageBottom = "<tr><td colspan=7>"
						var looplength = memberLength / 20

						for (var i = 0; i < looplength; i++) {
							if (i == 0)
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">Home</a>&nbsp&nbsp'
							else
								pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
						}
						pageBottom += "</td></tr>"
						context.$el.append(pageBottom)
					}

				}
			})
		},

		render: function() {
			this.addAll()
		}

	})

});$(function() {
    App.Views.MembersView = Backbone.View.extend({

        //     tagName: "",
        //     className: "",
        searchText: "",

        events: {
            "click .Search": function(e) {
                this.renderTable($('#searchText').val().toLowerCase())
            },

        },

        render: function() {
            this.$el.html('<h3 style="float:right"><input id="searchText" style="margin-right:15px;height:28px;width:170px" type="Text" placeholder="Last Name"><button style="margin-top:-10px;" class="Search btn btn-info">Search</button></h3>');
            this.$el.append('<h3>Members<a style="margin-left:20px" class="btn btn-success" href="#member/add">Add a New Member</a></h3>');
            this.$el.append('<div id="memberTable"></div>');
            this.renderTable(searchText);
        },
        renderTable: function(searchText) {
            App.startActivityIndicator()
            var that = this
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()


            code = cofigINJSON.code
            nationName = cofigINJSON.nationName

            var roles = App.Router.getRoles()
            members = new App.Collections.Members()
            members.searchText = searchText
            members.fetch({
                success: function(response) {
                    membersTable = new App.Views.MembersTable({
                        collection: response
                    })
                    membersTable.community_code = code + nationName.substring(3, 5)
                    if (roles.indexOf("Manager") > -1) {
                        membersTable.isadmin = true
                    } else {
                        membersTable.isadmin = false
                    }
                    membersTable.render()
                    $('#memberTable').html(membersTable.el)
                    App.stopActivityIndicator()
                },
                error: function() {
                    App.stopActivityIndicator()
                }
            })

        }

    })

});    $(function () {

        App.Views.PublicationTable = Backbone.View.extend({
            authorName: null,
            tagName: "table",
            className: "table table-striped",
            collectionInfo:[],
            add: function (publicationDistribID, model, isAlreadySynced) {
                // carry the publication in a variable global to this (PublicationTable) view for use in event handling
                this.collectionInfo[model._id]= model; //[model.resources,model.courses,model.IssueNo]
                if (isAlreadySynced) {
                    this.$el.append('<tr id="' + publicationDistribID + '"><td>' + model.IssueNo+ '</td><td><a name="' +model._id +
                        '" class="synPublication btn btn-info">Sync publication</a></td></tr>');
                } else {
                    this.$el.append('<tr id="' + publicationDistribID + '"><td>' + model.IssueNo+ '</td><td><a name="' +model._id +
                        '" class="synPublication btn btn-info">Sync publication</a><label>&nbsp&nbspNot Synced</label></td></tr>');
                }
            },
            events:{
              "click .synPublication": 'synPublication'
            },
            render: function () {
                this.$el.html('<tr><th>Issue Number</th><th>Actions</th></tr>');
                var that=this;
            var nationName = App.configuration.get('nationName'),
                nationPassword = App.password;
            var nationUrl = App.configuration.get('nationUrl'),
                currentBellName = App.configuration.get('name');
                var DbUrl = 'http://' + nationName + ':' + nationPassword + '@' + nationUrl +
                            '/publicationdistribution/_design/bell/_view/getPublications?include_docs=true&key=["'+currentBellName+'",'+false+']';
                // make sure the couchdb that is being requested in this ajax call has its 'allow_jsonp' property set to true in the
                // 'httpd' section of couchdb configurations. Otherwise, the server couchdb will not respond as required by jsonp format
                // to send publication-distribution records from nation whose 'viewed' property is false
                $.ajax({
                url: DbUrl,
                type: 'GET',
                dataType: 'jsonp',
                    success: function (json) {
                        var keys='';
                        var publicationToPubDistributionMap = {};
                        _.each(json.rows,function(row){
                            publicationToPubDistributionMap[row.doc.publicationId] = row.doc._id;
                            keys += '"' + row.doc.publicationId + '",';
                        });
                        if (keys != '') {
                            keys = keys.substring(0, keys.length - 1);
                            var pubsForCommunityUrl = 'http://' + nationName + ':' + nationPassword + '@' + nationUrl +
                                '/publications/_all_docs?include_docs=true&keys=[' + keys + ']';
                            $.ajax({
                            url: pubsForCommunityUrl,
                            type: 'GET',
                            dataType: 'jsonp',
                                success: function (jsonNationPublications) {
                                    // fetch all publications from local/community server to see how many of the publications from nation are new ones
                                    var publicationCollection = new App.Collections.Publication();
                                    var tempUrl = App.Server + '/publications/_design/bell/_view/allPublication?include_docs=true';
                                    publicationCollection.setUrl(tempUrl);
                                    publicationCollection.fetch({
                                        success: function () {
                                            _.each(jsonNationPublications.rows,function(row){
                                                var publicationFromNation = row.doc;
                                                var alreadySyncedPublications = publicationCollection.models;
                                                var index = alreadySyncedPublications.map(function(element) {
                                                    return element.get('_id');
                                                }).indexOf(publicationFromNation._id);
                                                var nationPublicationDistributionDocId = publicationToPubDistributionMap[publicationFromNation._id];
                                                var isAlreadySynced = false;
                                                if (index > -1) { // its a new or yet-to-be-synced publication from nation, so display it as new
                                                    isAlreadySynced = true;
                                                    that.add(nationPublicationDistributionDocId, publicationFromNation, isAlreadySynced);
                                                } else { // its an already synced publication. display it without the new/unsynced mark
                                                    that.add(nationPublicationDistributionDocId, publicationFromNation, isAlreadySynced);
                                                }
                                            });
                                        }
                                    });
                                },
                                error: function(jqXHR, status, errorThrown){
                                console.log(jqXHR);
                                console.log(status);
                                console.log(errorThrown);
                                }
                            });
                        }
                    },
                    error: function(jqXHR, status, errorThrown){
                    console.log(jqXHR);
                    console.log(status);
                    console.log(errorThrown);
                    }
                });
            },
            synPublication:function(e){
                var that = this;
                var pubId = e.currentTarget.name;
                var pubDistributionID = $(e.currentTarget).closest('tr').attr('id');
                var publicationToSync = this.collectionInfo[pubId];
                $.couch.allDbs({
                    success: function(data) {
                        if(data.indexOf('tempresources') != -1 ){
                            $.couch.db("tempresources").drop({
                                success: function(data) {
                                    console.log(data);
                                    that.syncCourses(pubDistributionID, publicationToSync);
                                },
                                error: function(status) {
                                    console.log(status);
                                }
                            });
                        }
                        else {
                            that.syncCourses(pubDistributionID, publicationToSync);
                        }
                    },
                    async: false,
                });
                //this.syncCourses(pubDistributionID, publicationToSync);
            },
            syncCourses:function(pubDistributionID, publicationToSync){
            var resourcesIdes = publicationToSync.resources,
                courses = publicationToSync.courses,
                IssueNo = publicationToSync.IssueNo;
            var nationUrl = App.configuration.get('nationUrl'),
                nationName = App.configuration.get('nationName');
                // courses contains courseID and stepIDs(which contains stepID and resouceIDs(which contains ids of resources in the step))
            var cumulativeCourseIDs = [],
                cumulativeCourseStepIDs = [],
                cumulativeResourceIDs = [];
                for (var indexOfCourse in courses){
                    var courseInfo = courses[indexOfCourse];
                    cumulativeCourseIDs.push(courseInfo['courseID']);
                    var courseSteps = courseInfo['stepIDs'];
                    for (var indexOfCourseStep in courseSteps) {
                        var courseStepInfo = courseSteps[indexOfCourseStep];
                        cumulativeCourseStepIDs.push(courseStepInfo['stepID']);
                        var resourceIDs = courseStepInfo['resourceIDs'];
                        for (var indexOfResourceID in resourceIDs) {
                            cumulativeResourceIDs.push(resourceIDs[indexOfResourceID]);
                        }
                    }
                }
                for (var indexOfNonCourseResourceID in resourcesIdes) {
                    cumulativeResourceIDs.push(resourcesIdes[indexOfNonCourseResourceID]);
                }
                console.log("Syncing Resources and Courses..");
                console.log('http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources');
                console.log(cumulativeResourceIDs);
                App.startActivityIndicator();
                $.couch.db("tempresources").create({
                    success: function(data) {
                        console.log(data);
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            type: 'POST',
                            url: '/_replicate',
                            dataType: 'json',
                            data: JSON.stringify({
                                "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources',
                                "target": 'tempresources',
                                'doc_ids': cumulativeResourceIDs
                            }),
                            async: false,
                            success: function (response) {
                                console.log(response);
                                //Resource Rating work here.
                                $.ajax({
                                    url: '/tempresources/_all_docs?include_docs=true',
                                    type:  'GET',
                                    dataType: 'json',
                                    success: function (resResult) {
                                        var result = resResult.rows;
                                        var tempResult = [];
                                        for (var i = 0; i<result.length; i++){
                                            result[i].doc.sum = 0;
                                            result[i].doc.timesRated = 0;
                                            tempResult.push(result[i].doc);
                                        }
                                    $.couch.db('tempresources').bulkSave({
                                        "docs": tempResult
                                    }, {
                                                success: function(data) {
                                                    $.couch.replicate("tempresources", "resources", {
                                                        success: function(data) {
                                                            alert("Resources successfully synced");
                                                            $.couch.db("tempresources").drop({
                                                                success: function(data) {
                                                                    console.log(data);
                                                                },
                                                                error: function(status) {
                                                                    console.log(status);
                                                                }
                                                            });
                                                            alert('Publication "'+IssueNo+'" Resources successfully synced');
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                            alert("Unable to sync Resources");
                                                            $.couch.db("tempresources").drop({
                                                                success: function(data) {
                                                                    console.log(data);
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                        }
                                                            });
                                                        }
                                                    }, {
                                                        create_target: true
                                                    });
                                                },
                                                error: function(status) {
                                                    $.couch.db("tempresources").drop({
                                                        success: function(data) {
                                                            console.log(data);
                                                        },
                                                        error: function(status) {
                                                            console.log(status);
                                                        }
                                                    });
                                                    alert("Error!");
                                                }
                                    });
                                    },
                                    error: function() {
                                        alert("Unable to get resources.");
                                        $.couch.db("tempresources").drop({
                                            success: function(data) {
                                                console.log(data);
                                            },
                                            error: function(status) {
                                                console.log(status);
                                            }
                                        });
                                    },
                                    async: false
                                });
                                //End of Resource Rating work.
                                //alert('Publication "'+IssueNo+'" Resources successfully synced');
                                $.ajax({
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json; charset=utf-8'
                                    },
                                    type: 'POST',
                                    url: '/_replicate',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/groups',
                                        "target": 'groups',
                                        'doc_ids': cumulativeCourseIDs
                                    }),
                                    success: function (response) {
                                        $.ajax({
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json; charset=utf-8'
                                            },
                                            type: 'POST',
                                            url: '/_replicate',
                                            dataType: 'json',
                                            data: JSON.stringify({
                                                "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/coursestep',
                                                "target": 'coursestep',
                                                'doc_ids': cumulativeCourseStepIDs
                                            }),
                                            success: function (response) {
                                                // mark this publication as synced at community couchdb. ideally, we should inform the nation about it as well
                                                // but currently we are only able to make get requests cross-domain (from community application to nation couchdb
                                                // in our case) and informing the nation couchdb will probably require a cross-domain put or post request to work.
                                                $.couch.db("publications").saveDoc(publicationToSync, {
                                                    success: function (response) {
                                                        console.log("adding publication# " + publicationToSync.IssueNo + " doc at community for bookkeeping");
                                                        console.log(response);
                                                    },
                                                    error: function (jqXHR, textStatus, errorThrown) {
                                                        console.log(errorThrown);
                                                    }
                                                });
                                                //My code for lastPublicationsSyncDate
                                                // Update LastAppUpdateDate at Nation's Community Records
                                                $.ajax({
                                                    url:'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true&key="' + App.configuration.get('code') + '"',
                                                    type: 'GET',
                                                    dataType: 'jsonp',
                                                    success: function(result){
                                                        var communityModel = result.rows[0].value;
                                                        var communityModelId = result.rows[0].id;
                                                        //Replicate from Nation to Community
                                                        $.ajax({
                                                            headers: {
                                                                'Accept': 'application/json',
                                                                'Content-Type': 'application/json; charset=utf-8'
                                                            },
                                                            type: 'POST',
                                                            url: '/_replicate',
                                                            dataType: 'json',
                                                            data: JSON.stringify({
                                                                "source": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
                                                                "target": "community",
                                                                "doc_ids": [communityModelId]
                                                            }),
                                                            success: function(response){
                                                                console.log("Successfully Replicated.");
                                                                var date = new Date();
                                                                var year = date.getFullYear();
                                                                var month = (1 + date.getMonth()).toString();
                                                                month = month.length > 1 ? month : '0' + month;
                                                                var day = date.getDate().toString();
                                                                day = day.length > 1 ? day : '0' + day;
                                                                var formattedDate = month + '-' + day + '-' + year;
                                                                communityModel.lastPublicationsSyncDate = month + '/' + day + '/' + year;
                                                                //Update the record in Community db at Community Level
                                                                $.ajax({

                                                                    headers: {
                                                                        'Accept': 'application/json',
                                                                        'Content-Type': 'multipart/form-data'
                                                                    },
                                                                    type: 'PUT',
                                                                    url: App.Server + '/community/' + communityModelId + '?rev=' + communityModel._rev,
                                                                    dataType: 'json',
                                                                    data: JSON.stringify(communityModel),
                                                                    success: function (response) {
                                                                        //Replicate from Community to Nation
                                                                        $.ajax({
                                                                            headers: {
                                                                                'Accept': 'application/json',
                                                                                'Content-Type': 'application/json; charset=utf-8'
                                                                            },
                                                                            type: 'POST',
                                                                            url: '/_replicate',
                                                                            dataType: 'json',
                                                                            data: JSON.stringify({
                                                                                "source": "community",
                                                                                "target": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
                                                                                "doc_ids": [communityModelId]
                                                                            }),
                                                                            success: function(response){
                                                                                alert("Successfully Replicated Publications.")
                                                                                App.stopActivityIndicator();
                                                                            },
                                                                            async: false
                                                                        });
                                                                    },

                                                                    async: false
                                                                });
                                                            },
                                                            async: false
                                                        });
                                                    },
                                                    error: function(){
                                                        console.log('http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?key="' + App.configuration.get('code') + '"');
                                                    }
                                                });
                                                //End of my code.
                                            },
                                            error: function(jqXHR, status, errorThrown){
                                                console.log('Error syncing/replicating Publication "'+IssueNo+'" course-steps');
                                            console.log(status);
                                            console.log(errorThrown);
                                            App.stopActivityIndicator();
                                            alert('Failed to sync course-steps');
                                            }
                                        });
                                    },
                                    error: function(jqXHR, status, errorThrown){
                                        console.log('Error syncing/replicating Publication "'+IssueNo+'" courses');
                                    console.log(status);
                                    console.log(errorThrown);
                                    App.stopActivityIndicator();
                                    alert('Failed to sync courses');
                                    }
                                })
                            },
                            error: function(jqXHR, status, errorThrown){
                                console.log('Error syncing/replicating Publication "'+IssueNo+'" resources');
                                console.log(status);    console.log(errorThrown);
                                $.couch.db("tempresources").drop({
                                    success: function(data) {
                                        console.log(data);
                                    },
                                    error: function(status) {
                                        console.log(status);
                                    }
                                });
                                App.stopActivityIndicator();
                                alert('Failed to sync resources');
                            }
                        });
                    }
                });
            },
            synResources:function(nationUrl,nationName,resourcesIdes,IssueNo){
                console.log("Syncing Resources..");
                console.log('http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources');
                console.log(resourcesIdes);
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    type: 'POST',
                    url: '/_replicate',
                    dataType: 'json',
                    data: JSON.stringify({
                        "source": 'http://'+ nationName +':'+App.password+'@'+ nationUrl + '/resources',
                        "target": 'resources',
                        'doc_ids': resourcesIdes
                    }),
                    success: function (response) {
                        console.log(response);
                        alert('Publication "'+IssueNo+'" Resources successfully Synced');
                    },
                    error: function(jqXHR, status, errorThrown){
                        console.log('Error syncing/replicating Publication "'+IssueNo+'" resources');
                        console.log(status);
                        console.log(errorThrown);
                    }
                })
            }
        })
    });$(function() {

    App.Views.QuizView = Backbone.View.extend({

        template: $('#make-Quiz').html(),
        vars: {},
        quizQuestions: null,
        questionOptions: null,
        answers: null,
        currentQuestion: null,
        events: {
            "click .EditQuestiontoView": "EditQuestiontoView",
            'click #delete-quiz-question': "deleteQuestion",
            "click #cancel-edit-question": function(e) {
                this.render()
                this.displayQuestionsInView()
            },
            "click #cancel-quiz": function() {
                Backbone.history.navigate('level/view/' + this.levelId + '/' + this.revId, {
                    trigger: true
                })
            },
            "click #cancel-new-question": function() {
                $('textarea#quizQuestion').val("")
                $('#option1').val("")
                $('#option2').val("")
                $('#option3').val("")
                $('#option4').val("")
                $('#option5').val("")
                $('input[name=options]:checked').each(function() {
                    this.checked = false;
                });
            },
            "click #save-new-question": function(e) {
                this.savequestion()
            },
            "click #save-edit-question": function(e) {
                this.savequestion()
                this.render()
                this.displayQuestionsInView()
            },
            "click #save-quiz": function(e) {
                var cstep = new App.Models.CourseStep({
                    "_id": this.levelId,
                    "_rev": this.revId
                })
                cstep.fetch({
                    async: false
                })
                cstep.set("questions", this.quizQuestions)
                cstep.set("qoptions", this.questionOptions)
                cstep.set("answers", this.answers)
                var that = this
                cstep.save(null, {
                    success: function(cstepModel, modelRev) {
                        alert('Quiz Successfully Saved')
                        Backbone.history.navigate('level/view/' + modelRev.id + '/' + modelRev.rev, {
                            trigger: true
                        })
                    }
                })
            }
        },
        savequestion: function(e) {
            if (!this.validQuestionAndOptions()) {
                alert('invalid inputs')
            } else {
                this.saveQuestionAndOptions()
                $("#question-no").html("Question :")
                $('textarea#quizQuestion').val("")
                $('#option1').val("")
                $('#option2').val("")
                $('#option3').val("")
                $('#option4').val("")
                $('#option5').val("")
                $('input[name=options]:checked').each(function() {
                    this.checked = false;
                });
            }
        },
        displayQuestionInView: function(questionNo) {
            var number = questionNo
            number++
            $("#question-no").html("Question " + number + ':')
            $('textarea#quizQuestion').val(this.quizQuestions[questionNo])
            $('#option1').val(this.questionOptions[questionNo * 5])
            $('#option2').val(this.questionOptions[questionNo * 5 + 1])
            $('#option3').val(this.questionOptions[questionNo * 5 + 2])
            $('#option4').val(this.questionOptions[questionNo * 5 + 3])
            $('#option5').val(this.questionOptions[questionNo * 5 + 4])
            $('input[name=options]:checked').each(function() {
                this.checked = false;
            });
            var answer = this.questionOptions.indexOf(this.answers[questionNo])
            if (answer >= 0) {
                var rem = answer % 5;
                var radios = document.getElementsByName('options')
                radios[rem].checked = true
            }
        },
        saveQuestionAndOptions: function() {
            this.quizQuestions[this.currentQuestion] = $('textarea#quizQuestion').val()
            this.questionOptions[this.currentQuestion * 5] = $('#option1').val()
            this.questionOptions[this.currentQuestion * 5 + 1] = $('#option2').val()
            this.questionOptions[this.currentQuestion * 5 + 2] = $('#option3').val()
            this.questionOptions[this.currentQuestion * 5 + 3] = $('#option4').val()
            this.questionOptions[this.currentQuestion * 5 + 4] = $('#option5').val()
            this.answers[this.currentQuestion] = $('#' + $('input[name=options]:checked').val()).val()
            this.displayQuestionsInView()
        },
        displayQuestionsInView: function() {
            $('#listofquestions').html('')
            for (var questionNumber = 0; questionNumber < this.quizQuestions.length; questionNumber++) {
                this.AddQuestiontoView(questionNumber)
            }
            // 		   console.log(this.quizQuestions)
            // 		   console.log(this.questionOptions.length)
            // 		   console.log(this.answers.length)
            // 		   console.log(this.quizQuestions.length)

            this.currentQuestion = this.quizQuestions.length
        },
        AddQuestiontoView: function(questionNumber) {
            var html = '<tr><td colspan="6"><h6>Question# ' + (questionNumber + 1) + '&nbsp&nbsp<a name=' + questionNumber + ' class="EditQuestiontoView btn btn-info">Edit</a>&nbsp&nbsp<button value="' + questionNumber + '" class="btn btn-danger" id="delete-quiz-question" >Delete</button></h6>' + this.quizQuestions[questionNumber] + '</td></tr>'
            html += '<tr>'
            html += '<td><b>Options</b></td>'
            html += '<td>' + this.questionOptions[questionNumber * 5] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 1] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 2] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 3] + '</td>'
            html += '<td>' + this.questionOptions[questionNumber * 5 + 4] + '</td>'
            html += '<td><b>' + this.answers[questionNumber] + '<b></td>'
            html += '</tr>'
            html += '<tr><td colspan="7"><div id="' + questionNumber + '"></div></td></tr>'
            $('#listofquestions').append(html)

        },
        EditQuestiontoView: function(e) {
            this.currentQuestion = e.currentTarget.name
            this.displayQuestionInView(this.currentQuestion)
            $('#question-div').appendTo("#" + this.currentQuestion);
            $('#save-edit-question').show()
            $('#cancel-edit-question').show()

            $('#save-new-question').hide()
            $('#cancel-new-question').hide()
        },
        deleteQuestion: function(e) {
            this.currentQuestion = e.currentTarget.value
            this.quizQuestions.splice(this.currentQuestion, 1);
            this.questionOptions.splice(this.currentQuestion * 5, 5)
            this.answers.splice(this.currentQuestion, 1)
            this.render()
            this.displayQuestionsInView()
        },
        validQuestionAndOptions: function() {
            var check = 0
            if (typeof $('textarea#quizQuestion').val() === 'undefined' || $('textarea#quizQuestion').val() == '') {
                return false
            } else if (typeof $('#option1').val() === 'undefined' || $('#option1').val() == '') {
                return false
            } else if (typeof $('#option2').val() === 'undefined' || $('#option2').val() == '') {
                return false
            } else if (typeof $('#option3').val() === 'undefined' || $('#option3').val() == '') {
                return false
            } else if (typeof $('#option4').val() === 'undefined' || $('#option4').val() == '') {
                return false
            } else if (typeof $('#option5').val() === 'undefined' || $('#option5').val() == '') {
                return false
            } else if (typeof $('input[name=options]:checked').val() === 'undefined' || $('input[name=options]:checked').val() == '') {
                return false
            } else {
                return true
            }
        },
        initialize: function() {
            this.quizQuestions = new Array()
            this.questionOptions = new Array()
            this.answers = new Array()
            this.currentQuestion = 0
        },
        render: function() {
            var obj = this
            this.vars.courseTitle = this.ltitle
            this.$el.html(_.template(this.template, this.vars))
            $('#save-edit-question').hide()
            $('#cancel-edit-question').hide()

        },
    })

});$(function() {

    App.Views.ReportForm = Backbone.View.extend({

        className: "form",
        hide: false,
        events: {
            "click .save": "saveForm",
            "click #cancel": function() {
                window.history.back()
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function() {
            var vars = {}

            // prepare the header

            if (_.has(this.model, 'id')) {

                vars.header = 'Title "' + this.model.get('title') + '"'
                vars.hidesave = true
                var tempAttachments = this.model.get('_attachments');
                var fields = _.map(
                    _.pairs(tempAttachments),
                    function(pair) {
                        return {
                            key: pair[0],
                            value: pair[1]
                        };
                    }
                );
                vars.resourceAttachments = fields;

            } else {
                vars.header = 'New Report'
                vars.hidesave = false
                vars.resourceAttachments = "No File Selected.";

            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.form.render()
            //this.form.fields['uploadDate'].$el.hide()
            if (this.edit == false) {
                alert("here")
                //this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
            }
            //this.form.fields['addedBy'].$el.attr("disabled",true)
            //this.form.fields['averageRating'].$el.hide()
            var that = this
            if (_.has(this.model, 'id')) {
                //if(this.model.get("Level") == "All"){
                // that.form.fields['toLevel'].$el.hide();
                //that.form.fields['fromLevel'].$el.hide();
                //that.hide = true
            }


            // @todo Why won't this work?
            vars.form = "" //$(this.form.el).html()

            // render the template
            this.$el.html(this.template(vars))
            // @todo this is hackey, should be the following line or assigned to vars.form
            $('.fields').html(this.form.el)
            $('#progressImage').hide();
            //$this.$el.children('.fields').html(this.form.el) // also not working

            return this
        },

        saveForm: function() {
            // @todo validate 
            //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
            // Put the form's input into the model in memory


            var addtoDb = true
            var previousTitle = this.model.get("title")
            var newTitle
            var isEdit = this.model.get("_id")
            this.form.commit()
            // Send the updated model to the server
            newTitle = this.model.get("title")
            var that = this
            var savemodel = false
            if (this.model.get("title").length == 0) {
                alert("Resource Title is missing")
            } else if ((this.model.get("Tag") == "News") && !this.model.get("author")) {
                alert("Please Specify Author For This News Resource")
            } else {
                $('#gressImage').show();
                this.model.set(' uploadDate', new Date().getTime())
                if (this.model.get("Level") == "All") {
                    this.model.set('toLevel', 0)
                    this.model.set('fromLevel', 0)
                } else {
                    if (parseInt(this.model.get("fromLevel")) > parseInt(this.model.get("toLevel"))) {
                        alert("Invalid range specified ")
                        addtoDb = false
                    }
                }
                if (isEdit == undefined) {
                    var that = this
                    var allres = new App.Collections.Reports()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function(m) {
                        if (that.model.get("title") == m.get("title")) {
                            alert("Title already exist")
                            addtoDb = false
                        }
                    })
                }
                if (addtoDb) {
                    if (isEdit == undefined) {
                        this.model.set("sum", 0)
                    } else {
                        this.model.set("title", previousTitle)
                    }
                    this.model.save(null, {
                        success: function() {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                if (isEdit != undefined) {
                                    if (previousTitle != newTitle) {
                                        var titleMatch = false
                                        var allres = new App.Collections.Resources()
                                        allres.fetch({
                                            async: false
                                        })
                                        allres.each(function(m) {
                                            if (newTitle == m.get("title")) {
                                                titleMatch = true
                                            }
                                        })
                                        if (!titleMatch) {
                                            var new_res = new App.Models.Resource()
                                            new_res.set("title", newTitle)
                                            new_res.set("description", that.model.get("description"))
                                            new_res.set("articleDate", that.model.get("articleDate"))
                                            new_res.set("addedBy", that.model.get("addedBy"))
                                            new_res.set("openWith", that.model.get("openWith"))
                                            new_res.set("openWhichFile", that.model.get("openWhichFile"))
                                            new_res.set("uploadDate", that.model.get("uploadDate"))
                                            new_res.set("openUrl", that.model.get("openUrl"))
                                            new_res.save()
                                            new_res.on('sync', function() {
                                                new_res.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                                new_res.on('savedAttachment', function() {
                                                    alert("Resource Updated Successfully")
                                                    Backbone.history.navigate("#resources", {
                                                        trigger: true
                                                    })
                                                    that.trigger('processed')
                                                    $('#progressImage').hide();
                                                }, new_res)
                                            })
                                        } else {
                                            alert("Resource title Already exist")
                                        }
                                    } else {
                                        alert("Cannot update model due to identical title")
                                    }
                                } else {
                                    that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                }
                            } else {
                                that.model.trigger('processed')
                            }

                            that.model.on('savedAttachment', function() {
                                this.trigger('processed')
                                $('#progressImage').hide();
                            }, that.model)
                        }
                    })
                }
            }

        },

        statusLoading: function() {
            alert("asdf")
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

});$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                alert("deleting")
                this.model.destroy()
                event.preventDefault()
            },
            "click #open": function(event) {
                if (this.model.get("views") == undefined) {
                    this.model.set('views', 1)
                    this.model.save()
                } else {
                    this.model.set('views', this.model.get("views") + 1)
                    this.model.save()
                }

            },
            "click #commentButton": function(e) {
                var coll = new App.Collections.CommunityReportComments()
                coll.CommunityReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                var viw = new App.Views.CommunityReportCommentView({
                    collection: coll,
                    CommunityReportId: e.target.attributes[0].nodeValue
                })
                viw.render()
                $('#debug').append(viw.el)
            }

        },

        vars: {},

        template: _.template($("#template-ReportRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()

            if (vars.views == undefined) {
                vars.views = 0
            }

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()

            this.$el.append(this.template(vars))


        },


    })

});$(function() {

    App.Views.ReportsTable = Backbone.View.extend({

        tagName: "table",
        isManager: null,
        className: "btable btable-striped",

        //template: $('#template-ResourcesTable').html(),

        initialize: function() {
            //this.$el.append(_.template(this.template))
        },
        addOne: function(model) {
            var reportRowView = new App.Views.ReportsRow({
                model: model
            })
            reportRowView.isManager = this.isManager
            reportRowView.render()
            this.$el.append(reportRowView.el)
        },

        addAll: function() {
            this.$el.append('<tr><th>Time</th><th>Title</th><th>Author</th><th>Views</th><th colspan="5">Actions</th></tr>')
            this.collection.forEach(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {

  App.Views.RequestRow = Backbone.View.extend({

    tagName: "tr",
    template: $("#template-RequestRow").html(),

    render: function() {
      var vars = this.model.toJSON()
      var user = new App.Models.Member({
        _id: vars.senderId
      })
      user.fetch({
        async: false
      })
      user = user.toJSON()
      vars.name = user.firstName + " " + user.lastName
      this.$el.html(_.template(this.template, vars))
    }

  })

});$(function() {
	App.Views.RequestTable = Backbone.View.extend({

		tagName: "table",
		className: "table table-striped",
		id: "requestsTable",
		addOne: function(model) {
			if (model.toJSON()._id != "_design/bell") {
				var modelView = new App.Views.RequestRow({
					model: model
				})
				modelView.render()
				this.$el.append(modelView.el)
			}
		},

		addAll: function() {

			if (this.collection.length != 0) {
				this.$el.append("<tr><th>User</th><th>Category</th><th>Request</th></tr>")
				this.collection.each(this.addOne, this)
			} else {

				this.$el.append("<th>No Requests</th>")
			}
		},

		render: function() {
			this.addAll()
		}

	})

});$(function() {

    App.Views.RequestView = Backbone.View.extend({

        tagName: "div",
        id: "site-request",
        type: null,
        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function() {
            document.getElementById('nav').style.visibility = "visible"
            Backbone.history.navigate('AllRequests', {
                trigger: true
            })
        },
        cancelform: function() {
            $('#site-request').animate({
                height: 'toggle'
            })
            this.form.setValue({
                request: ""
            })
            var that = this
            setTimeout(function() {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },
        setForm: function() {
            var configurations = Backbone.Collection.extend({

                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()
            var date1 = new Date()
            console.log(date1)
            var datestring = ("0" + (date1.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + date1.getDate().toString()).substr(-2) + "/" + (date1.getFullYear().toString()).substr(2)
            if (this.form.getValue("request").length != 0) {
                this.form.setValue({
                    status: '0'
                })
                this.form.setValue({
                    senderId: ($.cookie('Member._id'))
                })
                this.form.setValue({
                    date: datestring
                })
                this.form.setValue({
                    sendFrom: cofigINJSON.rows[0].doc.type
                })
                this.form.setValue({
                    sendFromName: cofigINJSON.rows[0].doc.name
                })
                this.form.setValue({
                    response: ""
                })
                this.form.setValue({
                    type: this.type
                })
                this.form.commit()
                this.model.save()
                console.log(this.model.toJSON())
                alert("Request Successfully Sent")
                this.form.setValue({
                    request: ""
                })
            }
            $('#site-request').animate({
                height: 'toggle'
            })
            var that = this
            setTimeout(function() {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },

        render: function() {
            document.getElementById('nav').style.visibility = "hidden"
            var modl = new App.Models.request()
            this.model = modl
            this.form = new Backbone.Form({
                model: modl
            })
            if (this.type == "Course") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to enroll in a course on the following subject</span>')
            } else if (this.type == "Resource") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to have the following resource in BELL</span>')
            } else if (this.type == "Meetup") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to join a Meetup on the following topic</span>')
            } else {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">Error!!!!</span>')
            }
            this.$el.append(this.form.render().el)
            this.form.fields['senderId'].$el.hide()
            this.form.fields['status'].$el.hide()
            this.form.fields['response'].$el.hide()
            this.form.fields['type'].$el.hide()
            this.form.fields['sendFrom'].$el.hide()
            this.form.fields['sendFromName'].$el.hide()
            this.form.fields['date'].$el.hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View All</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
            this.$el.append($button)
        }


    })
});$(function() {

	App.Views.ResourceForm = Backbone.View.extend({

		className: "form",
		id: 'resourceform',
		hide: false,
		events: {
			/**********************************************************************/
			//Issue#43: Add A Resource: Change Order of tabindex
			/**********************************************************************/
            'keydown input[name="title"]':"getFocusForTitle",
            'keydown input[name="author"]':"getFocusForAuthor",
            'keydown input[name="Year"]':"getFocusForYear",
            'keydown select[name="language"]':"getFocusForLanguage",
            'keydown input[name="Publisher"]':"getFocusForPublisher",
            "keydown #_attachments":"getFocusForBrowse",
			"keydown  .save":"getFocusForSave",
       
			"click .save": "saveForm",
			"click #cancel": function() {
				window.history.back()
			},
			"click #add_newCoellection": function() {
				App.Router.AddNewSelect('Add New')
			},
			"click #saveUpdatedWelcomeVideoForm": "saveUpdatedWelcomeVideoForm"
		},
        getFocusForTitle : function(e){

            if(e.keyCode==9) //tab is pressed
            {
                e.preventDefault();
          
                $.trim($('[name="title"]').val());
            
                $('[name="author"]').focus();
            }
        },

        getFocusForAuthor : function(e){

        
            if(e.keyCode==9) //tab is pressed
            {
            
                e.preventDefault();
            
                $.trim($('[name="author"]').val());
               
                $('[name="Year"]').focus();
            }
        },
		/*******************************************************************/
		/*Issue No: 43 remove "Add New" button on Add New Resource page from the tabindex and instead have
		 the "Save" button highlighted after the "Browse" button is highlighted. (route:resource/add)
		 Date: 21 Sept, 2015*/
		/**********************************************************************/
        getFocusForBrowse : function(e){
            if(e.keyCode==9) //tab is pressed
            {
               // alert("Tab is pressed on uplaoad attachment button");
                 e.preventDefault();
				var $focused = $(':focus');
			//	$('[name="save"]').focus();
				$(".save").attr("tabindex",0);
			//	$(".save").prop('autofocus', 'true');
				$('.save').addClass("myTabIndexClass");
				$('.myTabIndexClass').focus();
				$focused = $(':focus');
				//$focused.click()

            }
        },
		getFocusForSave : function(e){
			if(e.keyCode==9) //tab is pressed
			{
				//alert("Tab is pressed on Save button");
				e.preventDefault();
				var $focused = $(':focus');
				$("#cancel").attr("tabindex",0);
				$('#cancel').focus();
				$focused = $(':focus');
				//$focused.click()
				e.preventDefault();
			}
		},
		/**********************************************************************/
        getFocusForYear : function(e){

       
            if(e.keyCode==9) //tab is pressed
            {
              
                e.preventDefault();
              
                $.trim($('[name="Year"]').val());
            
                $('[name="language"]').focus();
            }
        },
        getFocusForLanguage : function(e){

            if(e.keyCode==9) //tab is pressed
            {
             //  
                e.preventDefault();
             
                $('[name="Publisher"]').focus();
            }
        },
        getFocusForPublisher : function(e){

            if(e.keyCode==9) //tab is pressed
            {
              
                e.preventDefault();
             
                $('[name="linkToLicense"]').focus();
            }
        },
        getFocusForLinkToLicense : function (e)
        {

            if(e.keyCode==9) //tab is pressed
            {
          
                e.preventDefault();
               
                $.trim($('[name="Publisher"]').val());
              
                $('[name="resourceType"]').focus();
            }
        },
        getFocusForResourceType : function (e)
        {

            if(e.keyCode==9) //tab is pressed
            {
    
                e.preventDefault();
          
                $('[name="subject"]').focus();
            }
        },
		template: _.template($('#template-form-file').html()),

		render: function() {
			var vars = {}
			if (_.has(this.model, 'id')) {
				vars.header = 'Details "' + this.model.get('title') + '"';
				var tempAttachments = this.model.get('_attachments');
				var fields = _.map(
					_.pairs(tempAttachments),
					function(pair) {
						return {
							key: pair[0],
							value: pair[1]
						};
					}
				);
				vars.resourceAttachments = fields;
				vars.resourceTitle = this.model.get('title');
				vars.resourceUrl = this.model.get('url');


			} else {
				vars.header = 'New Resource';
				vars.resourceAttachments = "No File Selected.";
				vars.resourceUrl = "";
			}

			// prepare the form
			this.form = new Backbone.Form({
				model: this.model
			})
			this.form.render()
			this.form.fields['uploadDate'].$el.hide()
			if (this.edit == false) {
				this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
			}
			this.form.fields['addedBy'].$el.attr("disabled", true)
			this.form.fields['averageRating'].$el.hide()
			var that = this
			if (_.has(this.model, 'id')) {
				if (this.model.get("Level") == "All") {
					that.hide = true
				}
			}
			// @todo Why won't this work?
			vars.form = "" //$(this.form.el).html()
			this.$el.html(this.template(vars))
			// @todo this is hackey, should be the following line or assigned to vars.form
			$('.fields').html(this.form.el)
			this.$el.append('<button class="btn btn-success" id="add_newCoellection" >Add New</button>')
			$('#progressImage').hide();
			//$this.$el.children('.fields').html(this.form.el) // also not working
            $('[name="title"]').focus();
			return this
		},
		saveUpdatedWelcomeVideoForm: function() {
			// mark this resource with welcome-video flag
			if (this.model.get("isWelcomeVideo") === undefined) {
				this.model.set("isWelcomeVideo", true);
			}
			this.form.commit();
			this.model.set("Level", null);
			this.model.set("subject", null);
			var formContext = this;
			// id a new video file has been linked/uploaded, change the "addedBy" field to have the name of the current user
			// if no new file has been linked/uploaded, don't take any action
			var uploadedFileName = $('input[type="file"]').val();
			this.model.save(null, {
				success: function(res) {
					if (uploadedFileName) {
						formContext.model.unset('_attachments');
						App.startActivityIndicator();
						// set the handler for successful response on processing the video update form
						formContext.model.on('savedAttachment', function() {
							App.stopActivityIndicator();
							this.trigger('processed');
						}, formContext.model);
						formContext.model.saveAttachment("#fileAttachment", "#_attachments", "#fileAttachment .rev");
						formContext.form.fields['addedBy'].setValue($.cookie('Member.login'));
					} else {
						return;
					}
				}
			});
		},
		renderAddOrUploadWelcomeVideoForm: function() {
			var formHeader = $('<h3> Edit Welcome Video Form </h3><br><br><br><br>');
			this.$el.append(formHeader);
			this.form = new Backbone.Form({
				model: this.model
			});
			this.$el.append(this.form.render().el);
			// hide the 'decision' and 'submitted by' subschemas from rendering when form has not been submitted
			for (var field in this.form.fields) {
				this.form.fields[field].$el.hide();
			}
			this.form.fields['addedBy'].$el.show();
            this.form.fields['resourceType'].$el.show();
			this.form.fields['addedBy'].editor.el.disabled = true;
			this.form.fields['uploadDate'].$el.show();
			this.form.fields['openWith'].$el.show();
			this.form.fields['resourceFor'].$el.show();
			// get attachments of welcome video doc
			var tempAttachments = this.model.get('_attachments');
			var fields = _.map(
				_.pairs(tempAttachments),
				function(pair) {
					return {
						key: pair[0],
						value: pair[1]
					};
				}
			);
			for (var field in fields) { // field is index and fields is the array being traversed
				var label = $("<label>").text(fields[field].key); // fields[field].value has info like {content_type: "video/mp4", length: 16501239, etc}
				this.$el.append(label);
			}
			this.$el.append('<br><br>');
			// add a label followed by input box/button for allowing uploading of new welcome video, followed by label anming the
			// name of the video currently being used as welcome video
			this.$el.append('<form method="post" id="fileAttachment"></form>');
			this.$el.find("#fileAttachment").append('<label for="_attachments">Upload Welcome Video</label>');
			this.$el.find("#fileAttachment").append('<input type="file" name="_attachments" id="_attachments" style="line-height: 28px;" multiple="multiple" label=" :" />');
			this.$el.find("#fileAttachment").append('<input class="rev" type="hidden" name="_rev">');
			this.$el.append('<button class="addNation-btn btn btn-success" id="saveUpdatedWelcomeVideoForm">Submit</button>');
			this.$el.append('<a class="btn btn-danger" id="cancel">Cancel</a>');
		},
		saveForm: function() {

			// @todo validate
			//if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
			// Put the form's input into the model in memory
			var previousTitle = this.model.get("title")
			var isEdit = this.model.get("_id")
			var formContext = this
			this.form.commit()

			if (this.model.get('openWith') == 'PDF.js') {
				this.model.set('need_optimization', true)
			}
			// Send the updated model to the server
			var newTitle = this.model.get("title")
			if (this.model.get("title").length == 0) {
				alert("Resource Title is missing")
			} else if (this.model.get("subject") == null) {
				alert("Resource Subject is missing")
			} else if (this.model.get("Level") == null) {
				alert("Resource Level is missing")
			} else {
				if (isEdit) {
					var addtoDb = true
					if (previousTitle != newTitle) {
						if (this.DuplicateTitle()) {
							addtoDb = false
						}
					}
					if (addtoDb) {
						this.model.save(null, {
							success: function(res) {

								if ($('input[type="file"]').val()) {
									formContext.model.unset('_attachments')
									App.startActivityIndicator()
									formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

								} else {
									window.history.back()
								}
							}
						})
					}
				} else {
					if (!this.DuplicateTitle()) {
						this.model.set("sum", 0)
						this.model.set("timesRated", 0)
						this.model.save(null, {
							success: function(res) {
								if ($('input[type="file"]').val()) {
									App.startActivityIndicator()
									formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

								} else {
									window.history.back()
								}
							}
						})
					}
				}
			}
			this.model.on('savedAttachment', function() {
				this.trigger('processed')
			}, formContext.model)



		},
		DuplicateTitle: function() {
			var checkTitle = new App.Collections.Resources()
			checkTitle.title = this.model.get("title")
			checkTitle.fetch({
				async: false
			})
			checkTitle = checkTitle.first()
			if (checkTitle != undefined)
				if (checkTitle.toJSON().title != undefined) {
					alert("Title already exist")
					return true
				}
			return false
		},
		statusLoading: function() {
			this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
		}

	})

});$(function() {

	App.Views.ResourceRow = Backbone.View.extend({

		tagName: "tr",
		id: null,
		admn: null,
		events: {
			"click .destroy": function(event) {
				if (confirm('Are you sure you want to delete this resource?')) {
					var that = this
					////Deleting from the resource
					var shelfResources = new App.Collections.shelfResource()
					shelfResources.deleteResource = 1
					shelfResources.resourceId = this.model.get("_id")
					shelfResources.fetch({
						async: false
					})
					var model;
					while (model = shelfResources.first()) {
						model.destroy();
					}
					//////Deleting resources feedback
					var resourcesFeedback = new App.Collections.ResourceFeedback()
					resourcesFeedback.resourceId = this.model.get("_id")
					resourcesFeedback.fetch({
						async: false
					})
					while (model = resourcesFeedback.first()) {
						model.destroy();
					}
					//////Deleting resources from course setp
					var courseSteps = new App.Collections.coursesteps()
					courseSteps.getAll = 1
					courseSteps.resourceId = this.model.get("_id")
					courseSteps.fetch({
						async: false
					})
					courseSteps.each(function(m) {

						if (!m.get("resourceId")) {
							m.set("resourceId", [])
						}
						var index = m.get("resourceId").indexOf(that.model.get("_id").toString())
						if (index != -1) {
							m.get("resourceId").splice(index, 1)
							m.get("resourceTitles").splice(index, 1)
							m.save()
						}

					})

					this.model.destroy()
					alert("Resource Successfully deleted.")
					event.preventDefault()
				}
			},
			"click .removeFromCollection": function(event) {

				var tagId = window.location.href.split('#')[1].split('/')[1]
				var resTags = this.model.get('Tag')
				var index = resTags.indexOf(tagId)
				if (index > -1)
					resTags.splice(index, 1)

				var that = this
				this.model.set('Tag', resTags)

				this.model.save(null, {
					success: function(response, revInfo) {

						that.remove()
						alert('Removed Successfully From Collection')

					}
				})

			},

			"click .hides": function(event) {
				$(this.el).html("")
				this.model.set({
					"hidden": true
				})
				this.model.save()
				App.startActivityIndicator()
				var shelfResources = new App.Collections.shelfResource()
				shelfResources.deleteResource = 1
				shelfResources.resourceId = this.model.get("_id")
				shelfResources.fetch({
					async: false
				})
				shelfResources.each(function(item) {
					item.set({
						"hidden": true
					})
					item.save()
				});
				App.stopActivityIndicator()
				var newmodel = new App.Models.Resource({
					"_id": this.model.get('_id')
				})
				newmodel.fetch({
					async: false
				})
				this.model = newmodel
				this.render()
			},
			"click .unhide": function(event) {

				$(this.el).html("")
				this.model.set({
					"hidden": false
				})
				this.model.save()
				App.startActivityIndicator()
				var shelfResources = new App.Collections.shelfResource()
				shelfResources.deleteResource = 1
				shelfResources.resourceId = this.model.get("_id")
				shelfResources.fetch({
					async: false
				})
				shelfResources.each(function(item) {
					item.set({
						"hidden": false
					})
					item.save()
				});
				App.stopActivityIndicator()
				var newmodel = new App.Models.Resource({
					"_id": this.model.get('_id')
				})
				newmodel.fetch({
					async: false
				})
				this.model = newmodel
				this.render()

			},
			"click .trigger-modal": function() {
				$('#myModal').modal({

					show: true
				})
			},
			"click .resFeedBack": function(event) {
				var resourcefreq = new App.Collections.ResourcesFrequency()
				resourcefreq.memberID = $.cookie('Member._id')
				resourcefreq.fetch({
					async: false
				})

				if (resourcefreq.length == 0) {
					var freqmodel = new App.Models.ResourceFrequency()
					freqmodel.set("memberID", $.cookie('Member._id'))
					freqmodel.set("resourceID", [this.model.get("_id")])
					freqmodel.set("reviewed", [0])
					freqmodel.set("frequency", [1])
					freqmodel.save()
					return
				} else {
					var freqmodel = resourcefreq.first()
					var index = freqmodel.get("resourceID").indexOf(this.model.get("_id").toString())
					if (index != -1) {
						var freq = freqmodel.get('frequency')
						freq[index] = freq[index] + 1
						freqmodel.save()
					} else {
						freqmodel.get("resourceID").push(this.model.get("_id"))
						freqmodel.get("frequency").push(1)
						if (!freqmodel.get("reviewed")) {
							freqmodel.set("reviewed", [0])
						} else {
							freqmodel.get("reviewed").push(0)
						}
						freqmodel.save()
						return
					}
				}

				$('ul.nav').html($('#template-nav-logged-in').html()).hide()
				//                 var member = new App.Models.Member({
				//                 	_id: $.cookie('Member._id')
				//                 })
				//                 member.fetch({
				//                     async: false
				//                 })
				//                 var pending=[]
				//                pending= member.get("pendingReviews")
				//                pending.push(this.model.get("_id"))
				//     		   	member.set("pendingReviews",pending)
				//     		   	member.save()
				Backbone.history.navigate('resource/feedback/add/' + this.model.get("_id") + '/' + this.model.get("title"), {
					trigger: true
				})
			},
		},

		vars: {},

		template: _.template($("#template-ResourceRow").html()),

		initialize: function(e) {
			this.model.on('destroy', this.remove, this)
		},
		render: function() {
			var vars = this.model.toJSON()
			//console.log(vars)
			var Details = ""

			if (vars.author != undefined && vars.author != "") {
				Details = Details + "<b>Author </b>" + vars.author + ' , '
			}

			if (vars.Year != undefined && vars.Year != "") {
				Details = Details + "<b>Year </b>" + vars.Year + ' , '
			}

			if (vars.openWith != undefined) {
				Details = Details + "<b>Media </b>"
				Details = Details + vars.openWith + ' , '

			}

			if (vars.language != undefined) {
				if (vars.language.length > 0) {
					Details = Details + '<b>Language </b>' + vars.language + " , "
				}
			}

			if (vars.subject != undefined) {
				Details = Details + "<b>Subject(s) </b>"
				if ($.isArray(vars.subject)) {
					for (var i = 0; i < vars.subject.length; i++) {
						Details = Details + vars.subject[i] + ' / '
					}

				} else {
					Details = Details + vars.subject + ' / '

				}
				Details = Details.substring(0, Details.length - 3)
				Details = Details + ' , '
			}

			if (vars.Level != undefined) {
				Details = Details + "<b>Level(s) </b>"
				if ($.isArray(vars.Level)) {
					for (var i = 0; i < vars.Level.length; i++) {
						Details = Details + vars.Level[i] + ' / '
					}

				} else {
					Details = Details + vars.Level + ' / '

				}

				Details = Details.substring(0, Details.length - 3)
				Details = Details + ' , '

			}

			if (vars.Publisher != undefined && vars.Publisher != "") {
				Details = Details + "<b>Publisher/Attribution </b>" + vars.Publisher + ' , '
			}

			if (vars.linkToLicense != undefined && vars.linkToLicense != "") {
				Details = Details + "<b>Link To License </b>" + vars.linkToLicense + ' , '
			}

			if (vars.resourceFor != undefined && vars.resourceFor != "") {
				Details = Details + "<b> Resource For </b>" + vars.resourceFor + ' , '
			}
            ////////////////////////////////////////////////Code for Issue No 60 Adding a drop-down////////////////////////////////
            if (vars.resourceType != undefined && vars.resourceType != "") {
                Details = Details + "<b> Resource Type </b>" + vars.resourceType + ' , '
            }
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

			if (vars.Tag != undefined) {
				//console.log(this.collections)
				if ($.isArray(vars.Tag)) {
					if (vars.Tag.length > 0)
						Details = Details + "<b>Collection </b>"

					for (var i = 0; i < vars.Tag.length; i++) {
						if (this.collections.get(vars.Tag[i]) != undefined)
							Details = Details + this.collections.get(vars.Tag[i]).toJSON().CollectionName + " / "
					}
				} else {
					if (vars.Tag != 'Add New')
						Details = Details + "<b>Collection </b>" + vars.Tag + ' / '
				}
			}
			Details = Details.substring(0, Details.length - 3)
			Details = Details + ' , '

			Details = Details.substring(0, Details.length - 3)

			vars.Details = Details
			if (vars.hidden == undefined) {
				vars.hidden = false
			}

			if (this.model.get("sum") != 0) {
				vars.totalRatings = this.model.get("timesRated")
				vars.averageRating = (parseInt(this.model.get("sum")) / parseInt(vars.totalRatings))
			} else {
				vars.averageRating = "Sum not found"
				vars.totalRatings = 0
			}

			if (this.isManager > -1) {
				vars.Manager = 1
			} else {
				vars.Manager = 0
			}
			if (this.displayCollec_Resources == true) {
				vars.removeFormCollection = 1
			} else {
				vars.removeFormCollection = 0
			}
			this.$el.append(this.template(vars))


		}


	})

});$(function() {

    App.Views.ResourcesDetail = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "btable btable-striped resourceDetail",
        sid: null,
        rid: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyShelfItem": function(e) {

                var vars = this.model.toJSON()
                var rId = vars._id
                var mId = $.cookie('Member._id')

                var memberShelfResource = new App.Collections.shelfResource()
                memberShelfResource.resourceId = rId
                memberShelfResource.memberId = mId
                memberShelfResource.fetch({
                    async: false
                })
                memberShelfResource.each(
                    function(e) {
                        e.destroy()
                    })
                alert("Resource Successfully removed from Shelf ")
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })

            }
        },
        initialize: function() {
            this.$el.append('<th colspan="2"><h6>Resource Detail</h6></th>')
        },
        SetShelfId: function(s, r) {
            this.sid = s
            this.rid = r
        },
        render: function() {
            var vars = this.model.toJSON()
            this.$el.append("<tr><td>Title</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>Subject</td><td>" + vars.subject + "</td></tr>")
            this.$el.append("<tr><td>Tag</td><td>" + vars.Tag + "</td></tr>")
            this.$el.append("<tr><td>Level</td><td>" + vars.Level + "</td></tr>")
            if (vars.author) {
                this.$el.append("<tr><td>Author</td><td>" + vars.author + "</td></tr>")
            } else {
                this.$el.append("<tr><td>Author</td><td>No Author Defined</td></tr>")
            }
            //if the model has the Attachments
            if (vars._attachments) {
                                /**********************************************************************/
                                //Issue No: 54 (Update buttons on the My Library page on Dashboard)
                                //Date: 18th Sept, 2015
                                 /**********************************************************************/
                this.$el.append("<tr><td>Attachment</td><td><a class='btn open'  target='_blank' style='background-color:#1ABC9C;position: absolute;display: inline-block; line-height: 25px;margin-top: 35px;margin-left:-620px;width: 65px;height:26px;font-size: large' href='/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id + "'>View</a></td></tr>")

            } else {
                this.$el.append("<tr><td>Attachment</td><td>No Attachment</td></tr>")
            }
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyShelfItem">Remove</button></td></tr>')

        },

    })

});$(function() {

	App.Views.ResourcesTable = Backbone.View.extend({

		tagName: "table",
		isAdmin: null,
		className: "table table-striped",
		//template: $('#template-ResourcesTable').html(),
		events: {
			"click #backButton": function(e) {
				if (this.collection.skip > 0) {
					this.collection.skip = parseInt(this.collection.skip) - 20
				}
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},
			"click #nextButton": function(e) {
				this.collection.skip = parseInt(this.collection.skip) + 20
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},
			"click .clickonalphabets": function(e) {
				this.collection.skip = 0
				var val = $(e.target).text()
				this.collection.startkey = val
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}

			},
			"click #allresources": function(e) {
				this.collection.startkey = ""
				this.collection.skip = 0
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},
			"click .pageNumber": function(e) {
				this.collection.startkey = ""
				this.collection.skip = e.currentTarget.attributes[0].value
				this.collection.fetch({
					async: false
				})
				if (this.collection.length > 0) {
					this.render()
				}
			},
		},
		initialize: function() {
			//this.$el.append(_.template(this.template))

		},
		addOne: function(model) {
			var resourceRowView = new App.Views.ResourceRow({
				model: model,
				admin: this.isAdmin
			})
			resourceRowView.isManager = this.isManager
			resourceRowView.displayCollec_Resources = this.displayCollec_Resources

			resourceRowView.collections = this.collections

			resourceRowView.render()
			this.$el.append(resourceRowView.el)
		},

		addAll: function() {
			if (this.collection.length == 0) {
				this.$el.append("<tr><td width: 630px;>No resource found</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
			}
			if (this.isadmin > -1) {
				this.isAdmin = 1
			} else {
				this.isAdmin = 0
			}
			this.collection.forEach(this.addOne, this)
		},
		render: function() {

			if (this.displayCollec_Resources != true) {

				this.$el.html("")
				if (this.removeAlphabet == undefined) {
					var viewText = "<tr></tr>"
					viewText += "<tr><td colspan=7  style='cursor:default' >"
					viewText += '<a  id="allresources">#</a>&nbsp;&nbsp;'
					var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

					for (var i = 0; i < str.length; i++) {
						var nextChar = str.charAt(i);
						viewText += '<a  class="clickonalphabets"  value="' + nextChar + '">' + nextChar + '</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
					}
					viewText += "</td></tr>"
					this.$el.append(viewText)

				}
			}

			this.$el.append('<br/><br/>')
			this.$el.append("<tr><th style='width: 430px;'>Title</th><th colspan='6'>Actions</th></tr>")
			this.addAll()

			var text = '<tr><td>'

			if (this.collection.skip != 0) {
				text += '<a class="btn btn-success" id="backButton" >Back</a>&nbsp;&nbsp;'
			}

			if (this.collection.length >= 20)
				text += '<a class="btn btn-success" id="nextButton">Next</a>'

			text += '</td></tr>'
			this.$el.append(text)



			var resourceLength;
			var context = this
			if (this.removeAlphabet == undefined) {
				$.ajax({
					url: '/resources/_design/bell/_view/count?group=false',
					type: 'GET',
					dataType: "json",
					success: function(json) {
						if (json.rows[0]) {
							resourceLength = json.rows[0].value;
						}
						if (context.displayCollec_Resources != true) {
							var pageBottom = "<tr><td colspan=7><p style='width: 940px; word-wrap: break-word;'>"
							var looplength = resourceLength / 20
							for (var i = 0; i < looplength; i++) {
								if (i == 0)
									pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">Home</a>&nbsp&nbsp'
								else
									pageBottom += '<a  class="pageNumber" value="' + i * 20 + '">' + i + '</a>&nbsp&nbsp'
							}
							pageBottom += "</p></td></tr>"
							context.$el.append(pageBottom)
						}

					}
				})

			}



		}

	})

});$(function() {

    App.Views.Search = Backbone.View.extend({

        events: {
            "keypress #searchText": "SearchByEnter",
            "click #searchR": "searchResult",
            "click #addRestoPub": "addResourceToPublication",
            "click #next_button": function(e) {
                App.startActivityIndicator()
                this.groupresult.skip = this.groupresult.skip + 20;
                this.groupresult.fetch({
                    async: false
                })
                App.stopActivityIndicator()
                var obj = this
                if (this.groupresult.length > 0) {
                    var SearchSpans = new App.Views.SearchSpans({
                        collection: this.groupresult
                    })
                    SearchSpans.resourceids = obj.resourceids
                    SearchSpans.render()
                    $('#srch').html(SearchSpans.el)
                    $("#previous_button").show()

                    if (this.groupresult.length < 20) {
                        $("#next_button").hide();
                    }
                } else {
                    this.groupresult.skip = this.groupresult.skip - 20;
                    $("#next_button").hide();
                }
            },
            "click #previous_button": function(e) {
                App.startActivityIndicator()
                this.groupresult.skip = this.groupresult.skip - 20;
                this.groupresult.fetch({
                    async: false
                })
                App.stopActivityIndicator()
                var obj = this
                if (this.groupresult.length > 0) {
                    var SearchSpans = new App.Views.SearchSpans({
                        collection: this.groupresult
                    })
                    SearchSpans.resourceids = obj.resourceids
                    SearchSpans.render()
                    $('#srch').html(SearchSpans.el)
                    $("#next_button").show()
                } else {
                    $("#previous_button").hide();
                }
                if (this.groupresult.skip <= 0) {
                    $("#previous_button").hide();
                }
            }
        },
        template: $('#template-Search').html(),

        vars: {},
        groupresult: null,
        resultArray: null,

        initialize: function() {
            //this.groupresult = new App.Collections.SearchResource()
            this.groupresult = new App.Collections.Resources()
            this.resultArray = []
            enablenext = 0;
        },
        SearchByEnter: function(e) {
            if (e.keyCode == 13) {
                if(this.vars.addResource == true) {
                    this.searchResult();
                }
                else {
                    ResourceSearch();
                }
            }
        },
        render: function() {
            var obj = this
            var collections = App.collectionslist
            this.vars.tags = collections.toJSON()
            this.vars.addResource = this.addResource
            if (typeof this.Publications != 'undefined') {

                this.vars.Publications = this.Publications
            } else {
                this.vars.Publications = false
            }
            this.$el.html(_.template(this.template, this.vars))
            if (searchText != "" || (this.collectionFilter) || (this.subjectFilter) || (this.levelFilter) || (this.languageFilter) || (this.mediumFilter) || (this.ratingFilter && this.ratingFilter.length > 0)) {
                App.startActivityIndicator()
                this.getSearchedRecords();
            }
        },
        getSearchedRecords: function() {
            var mapFilter = {};
            var filters = new Array()
            if (this.collectionFilter && searchText.replace(" ", "") == '' && !(this.subjectFilter)) {
                for (var i = 0; i < this.collectionFilter.length; i++) {
                    filters.push(this.collectionFilter[i])
                }
            } else {
                if (this.collectionFilter && (searchText.replace(" ", "") != '' || this.subjectFilter)) {
                    mapFilter["Tag"] = this.collectionFilter;
                }
            }
            if (this.subjectFilter && searchText.replace(" ", "") == '') {
                for (var i = 0; i < this.subjectFilter.length; i++) {
                    filters.push(this.subjectFilter[i].toLowerCase())
                }
            } else {
                if (this.subjectFilter && searchText.replace(" ", "") != '') {
                    mapFilter["subject"] = this.subjectFilter;
                }
            }
            if (this.levelFilter && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.levelFilter.length; i++) {
                    filters.push(this.levelFilter[i].toLowerCase())
                }
            } else {
                if (this.levelFilter && (this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["Level"] = this.levelFilter;
                }
            }
            if (this.mediumFilter && !(this.levelFilter) && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.mediumFilter.length; i++) {
                    filters.push(this.mediumFilter[i].toLowerCase())
                }
            } else {
                if (this.mediumFilter && (this.levelFilter || this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["Medium"] = this.mediumFilter;
                }
            }
            if (this.languageFilter && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.languageFilter.length; i++) {
                    filters.push(this.languageFilter[i])
                }
            } else {
                if (this.languageFilter && (searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["language"] = this.languageFilter;
                }
            }
            if (this.ratingFilter.length > 0 && !(this.mediumFilter) && !(this.levelFilter) && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.ratingFilter.length; i++) {
                    filters.push(parseInt(this.ratingFilter[i]))
                }
            } else {
                if (this.ratingFilter.length > 0 && (this.mediumFilter || this.levelFilter || this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["timesRated"] = this.ratingFilter;
                }
            }
            var prefix, prex, searchTxt, searchText_Coll_Id;
            var searchTextArray = [];
            if (searchText != '') {
                // var prefix = searchText.replace(/[!(.,;):&]+/gi, "").toLowerCase().split(" ")
                prefix = searchText.replace(/[!(.,'";):&]+/gi, "").toLowerCase()
                filters.push(prefix);
                /* Get Collection Id from collection list database by passing the name of collection*/
                $.ajax({
                    url: '/collectionlist/_design/bell/_view/collectionByName?_include_docs=true&key="' + prefix + '"',
                    type: 'GET',
                    dataType: 'json',
                    success: function(collResult) {
                        console.log(collResult);
                        if (collResult.rows.length > 0) {
                            searchText_Coll_Id = collResult.rows[0].id;
                            filters.push(searchText_Coll_Id);
                            // console.log(id);
                        }
                    },
                    error: function() {
                        alert("Unable to get collections.");

                    },
                    async: false
                });
                /****************************************************************************************/
                /****************************************************************************************/
                searchTxt = searchText.replace(/[" "-]+/gi, "").toLowerCase()
                if (searchTxt != null) {
                    filters.push(searchTxt)
                }

                //prefix = searchText.replace(/[!(.,;):&]+/gi, "").toLowerCase().split(" ")
                prefix = searchText.replace(/[!(.,;'"):&]+/gi, "").toLowerCase()
                prex = prefix.replace(/[-]+/gi, " ");
                filters.push(prex);
                prefix = prefix.replace(/[-]+/gi, " ").split(" ")
                searchTextArray = prefix;
                for (var idx in prefix) {
                    if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a" && prefix[idx] != "and" && prefix[idx] != "&")
                        filters.push(prefix[idx])
                }
                /*****************************************************************************************************/
            }


            var fil = JSON.stringify(filters);
            console.log(fil)
            this.groupresult.skip = 0
            this.groupresult.collectionName = fil;
            this.groupresult.fetch({
                async: false
            })
            //Checking the AND Conditions here
            var resultModels;
            //if (mapFilter != null) {
            if (this.groupresult.models.length > 0 && !this.isEmpty(mapFilter)) {
                /*var language = mapFilter["language"];
                 var models = [];
                 for (var i = 0; i < this.groupresult.models.length; i++) {
                 var tempRes = this.groupresult.models[i];
                 if (tempRes.attributes.language == language) {
                 models.push(tempRes);
                 }
                 }
                 this.groupresult.models = models;
                 if (models.length == 0) {
                 this.groupresult.length = 0;
                 }*/
                var tempResultModels = this.groupresult.models;
                resultModels = this.checkANDConditions(mapFilter, tempResultModels);
            }
            //}
            if (this.groupresult.models.length > 0 && searchText != '' && this.isEmpty(mapFilter)) {
                if (searchText_Coll_Id != null || searchText_Coll_Id != undefined) {
                    var collection_id = searchText_Coll_Id;
                }
                var tempModels = this.groupresult.models;
                resultModels = this.checkSearchTextCompleteMatch(searchTextArray, collection_id, tempModels);
            }
            if (resultModels != null) {
                this.groupresult.models = resultModels;
                if (resultModels.length == 0) {
                    this.groupresult.length = 0;
                } else {
                    this.groupresult.length = resultModels.length;
                }
            }
            //End of the checking AND Conditions here
            App.stopActivityIndicator()
            var obj = this
            if (obj.addResource == true) {
                if (this.groupresult.length > 0) {
                    var SearchSpans = new App.Views.SearchSpans({
                        collection: this.groupresult
                    })

                    SearchSpans.resourceids = obj.resourceids
                    SearchSpans.render()
                    $('#srch').append(SearchSpans.el)

                }
            } else {
                var loggedIn = App.member
                //console.log(App.member)
                //alert('check')
                var roles = loggedIn.get("roles")
                var SearchResult = new App.Views.ResourcesTable({
                    collection: this.groupresult
                })
                SearchResult.removeAlphabet = true
                SearchResult.isManager = roles.indexOf("Manager")
                SearchResult.resourceids = obj.resourceids
                SearchResult.collections = App.collectionslist
                SearchResult.render()
                $('#srch').html('<h4>Search Result <a style="float:right" class="btn btn-info" onclick="backtoSearchView()">Back To Search</a></h4>')
                $('#srch').append(SearchResult.el)
            }

        },
        isEmpty: function(map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },
        checkANDConditions: function(map_filter, resultModels) {
            var matchedResults;
            var models = [];
            for (var i = 0; i < resultModels.length; i++) {
                matchedResults = [];
                var model = resultModels[i];
                for (var key in map_filter) {
                    var value = map_filter[key];
                    if (Array.isArray(model.attributes[key])) {
                        var arrayValCheck = false;
                        for (var j = 0; j < value.length; j++) {
                            var val = value[j];
                            if (model.attributes[key].indexOf(val) > -1) {
                                arrayValCheck = true;
                            }
                        }
                        matchedResults.push(arrayValCheck);
                    } else {
                        var stringValCheck = false;
                        if (key != "timesRated") {
                            for (var k = 0; k < value.length; k++) {
                                var val = value[k];
                                if (model.attributes[key] == val) {
                                    stringValCheck = true;
                                }
                            }
                        } else {
                            for (var k = 0; k < value.length; k++) {
                                var val = value[k];
                                var modelRating = Math.ceil(model.attributes.sum / model.attributes[key]);
                                if (modelRating == val) {
                                    stringValCheck = true;
                                }
                            }
                        }
                        matchedResults.push(stringValCheck);
                    }
                }
                if (matchedResults.indexOf(false) == -1) {
                    models.push(model);
                }
            }
            return models;
        },
        checkSearchTextCompleteMatch: function(search_text, coll_id, resultModels) {
            var matchedResults, matchingTitle, matchingPublisher, matchingAuthor;
            var models = [];
            for (var i = 0; i < resultModels.length; i++) {
                matchedResults = [];
                matchingTitle = [];
                matchingPublisher = [];
                matchingAuthor = [];
                var model = resultModels[i];
                for (var st = 0; st < search_text.length; st++) {
                    if (model.attributes.title.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.title.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.title.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                        matchingTitle.push(true);
                    } else {
                        matchingTitle.push(false);
                    }
                    if (model.attributes.Publisher.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.Publisher.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.Publisher.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                        matchingPublisher.push(true);
                    } else {
                        matchingPublisher.push(false);
                    }
                    if (model.attributes.author.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.author.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.author.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                        matchingAuthor.push(true);
                    } else {
                        matchingAuthor.push(false);
                    }
                    for (var j = 0; j < model.attributes.subject.length; j++) {
                        if (model.attributes.subject[j].toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.subject[j].replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.subject[j].replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                            matchedResults.push(true);
                        }
                    }
                    if (model.attributes.Tag) {
                        for (var k = 0; k < model.attributes.Tag.length; k++) {
                            if (model.attributes.Tag[k].indexOf(coll_id) > -1) {
                                matchedResults.push(true);
                            }
                        }
                    }
                }
                if (matchingTitle.indexOf(false) == -1 || matchingPublisher.indexOf(false) == -1 || matchingAuthor.indexOf(false) == -1) {
                    matchedResults.push(true);
                }
                if (matchedResults.indexOf(true) > -1) {
                    models.push(model);
                }
            }
            return models;
        },

        addResourceToStepView: function() {

            var obj = this
            var ResultCollection = new Backbone.Collection();
            if (obj.resultArray.length > 0) {
                ResultCollection.set(obj.resultArray)
                var SearchSpans = new App.Views.SearchSpans({
                    collection: ResultCollection
                })

                SearchSpans.resourceids = obj.resourceids
                SearchSpans.render()
                $('#srch').append(SearchSpans.el)

            }

        },
        searchResult: function() {
            searchText = $("#searchText").val()
            var collectionFilter = new Array()
            var subjectFilter = new Array()
            var levelFilter = new Array()
            ratingFilter.length = 0

            collectionFilter = $("#multiselect-collections-search").val()
            subjectFilter = $("#multiselect-subject-search").val()
            levelFilter = $("#multiselect-levels-search").val()
            mediumFilter = $('#multiselect-medium-search').val()

            $("input[name='star']").each(function() {
                if ($(this).is(":checked")) {
                    ratingFilter.push($(this).val());
                }
            })

            if (searchText != "" || (collectionFilter) || (subjectFilter) || (levelFilter) || (mediumFilter) || (ratingFilter && ratingFilter.length > 0)) {

                this.collectionFilter = collectionFilter
                this.levelFilter = levelFilter
                this.subjectFilter = subjectFilter
                this.ratingFilter = ratingFilter
                this.mediumFilter = mediumFilter
                this.addResource = true
                App.$el.children('.body').html(search.el)
                this.render()
                $("#searchText2").val(searchText)
                $("#srch").show()
                $(".row").hide()
                $(".search-bottom-nav").show()
                $(".search-result-header").show()
                $("#selectAllButton").show()
            }
            $('#previous_button').hide()
            $('#searchText').focus();
            $("#searchText").val(searchText)

        },
        addResourceToPublication: function() {
            if (typeof grpId === 'undefined') {
                document.location.href = '../nation/index.html#publication'
            }
            var rids = new Array()
            var publication = new App.Models.Publication({
                "_id": grpId
            })
            publication.fetch({
                async: false
            })
            $("input[name='result']").each(function() {
                if ($(this).is(":checked")) {
                    var rId = $(this).val();
                    if (publication.get("resources") != null) {
                        rids = publication.get("resources")
                        if (rids.indexOf(rId) < 0)
                            rids.push(rId)
                    } else {
                        rids.push(rId)
                    }

                }
            });
            publication.set("resources", rids)
            publication.save()
            publication.on('sync', function() {
                alert("Your Resources have been added successfully")
                window.location = '../nation/index.html#publicationdetail/' + publication.get('_id')
            })


        }

    })

});$(function() {

  App.Views.SearchSpan = Backbone.View.extend({

    tagName: "tr",

    className: 'search-box',

    template: $("#template-Search-box").html(),

    render: function() {


      var vars = this.model.toJSON()
      if (!vars.Tag)
        vars.Tag = ''
      // alert('testing purpose in search span')
      if (vars.name) {
        vars.title = "CourseSearchBox"
        vars.Tag = "CourseSearchBox"
      } else {
        vars.name = "ResourceSearchBox"
      }

      this.$el.append(_.template(this.template, vars))

    }
  })
});$(function() {
    App.Views.SearchSpans = Backbone.View.extend({

        addOne: function(model) {
            if (this.resourceids) {
                if ($.inArray(model.get("id"), this.resourceids) == -1) {
                    this.renderView(model)
                }
            } else {
                this.renderView(model)
            }
        },
        renderView: function(model) {
            var modelView = new App.Views.SearchSpan({
                model: model
            })
            modelView.render()
            this.$el.append(modelView.el)
            //$('#srch').append(modelView.el)
        },
        addAll: function() {
            this.collection.each(this.addOne, this)
        },

        render: function() {
            this.addAll()
        }

    })

});$(function() {

  App.Views.ShelfSpan = Backbone.View.extend({

    tagName: "td",

    className: 'shelf-box',

    template: $("#template-ShelfSpan").html(),

    render: function() {

      var vars = this.model.toJSON()
      alert('test')
      console.log(vars)
      alert('shelf span in')
      this.$el.append(_.template(this.template, vars))
    }

  })

});$(function() {
    App.Views.ShelfSpans = Backbone.View.extend({

        tagName: "tr",
        render: function() {
            //Using the Existing Member Dictionary to Display the Records
            var empty = true;
            var allhidden = true;
            for (var key in App.ShelfItems) {
                empty = false;
                break;
            }
            if (!empty) {
                $.each(App.ShelfItems, function(key, value) {

                    var arr = value.toString().split("+")
                    if (arr[0] != 'true') {
                        $('#ur').append('<td class="shelf-box"><a href="#resource/detail/' + key + '/' + arr[2] + '/' + arr[3] + '">' + arr[1] + '</a></td>')
                    }
                });
                $.each(App.ShelfItems, function(key, value) {

                    var arr = value.toString().split("+")
                    if (arr[0] != 'true')
                        allhidden = false
                });

            }
            if (allhidden) {
                $('#ur').append('<td class="shelf-box">No Item In the Shelf</td>')
            }
        }

    })

});/**
 * Created by omer.yousaf on 1/27/2015.
 */
$(function() {

    App.Views.TrendActivityReport = Backbone.View.extend({
        vars: {},
        events: {
            /* Sync moved to nation
             "click #syncReport" : function(e){
             App.Router.syncLogActivitiy()
             }*/
        },
        template: $('#template-TrendActivityReport').html(),

        initialize: function() {

        },
        render: function() {
            var context = this;
            context.vars = context.data
            context.vars.startDate = context.startDate
            context.vars.endDate = context.endDate
            context.vars.CommunityName = context.CommunityName
            context.$el.html(_.template(context.template, context.vars));
        }
    })

});$(function() {

	App.Views.TutorSpan = Backbone.View.extend({

		tagName: "td",

		className: 'tutor-box',

		template: $("#template-Tutor").html(),

		render: function() {
			///Temporary
			if ($.cookie('Member._id') == "821d357b8f3ba3c09836c91bebcb29d7") {
				var vars = {}
				vars.leaderEmail = this.model
				vars._id = "none"
			} else {
				var vars = this.model.toJSON()
				if (!vars.leaderEmail) {
					vars.leaderEmail = "Undefined"
				}
			}
			this.$el.append(_.template(this.template, vars))
		}

	})

});$(function() {
	App.Views.TutorsSpans = Backbone.View.extend({

		tagName: "tr",

		addOne: function(model) {
			var modelView = new App.Views.TutorSpan({
				model: model
			})
			modelView.render()
			$('#tutorTable').append(modelView.el)
		},

		addAll: function() {

			////temporary
			if ($.cookie('Member._id') == "821d357b8f3ba3c09836c91bebcb29d7") {
				var temp = ["English", "Algebra", "Midwifery"]
				for (var i = 0; i < 3; i++) {
					this.addOne(temp[i], this)
				}
			} else {

				if (this.collection.length != 0) {
					this.collection.each(this.addOne, this)
				} else {

					$('#tutorTable').append("<td class='course-box'>No Tutor</td>")
				}
			}
		},

		render: function() {
			//this.addAll()
			$('#tutorTable').append("<td class='course-box'> functionality is under construction </td>")
		}

	})

});$(function() {

	window.isActivityLogChecked = false;
	App.Views.listSyncDbView = Backbone.View.extend({
		id: "invitationForm",

		events: {
			"click #cancelButton": "hidediv",
			"click #formButton": "syncData",
			"click #selectAll": "selectAll"
		},
		hidediv: function() {
			$('#invitationdiv').fadeOut(1000)

			setTimeout(function() {
				$('#invitationdiv').hide()
			}, 1000);
		},
		render: function() {

			// <input type="checkbox" value="Resources" name="syncData">Resources<br>
			//<input type="checkbox" value="Application" name="syncData" >Application<br><br><br>
			// added "Members Db" checkbox
			var $button = $('<h6>Select Item(\'s) To Sync</h6><br><br><input type="checkbox" value="ActivityReports" name="syncData">Log Activity Reports<br><input type="checkbox" value="Reports" name="syncData">Reports<br><input type="checkbox" value="ResourcesFeedbacks" name="syncData">Resources Feedbacks<br><input type="checkbox" value="ApplicationFeedbacks" name="syncData">Application Feedbacks<br><input type="checkbox" value="MembersDb" name="syncData">Members Database<br>')

			this.$el.append($button)
			this.$el.append('<button class="btn btn-info" id="selectAll" style="width:110px">Select All</button><button style="margin-left:10px; width:110px" class="btn btn-success" id="formButton" style="width:110px">Send</button>')
			this.$el.append('<button class="btn btn-warning" id="cancelButton" style="width:110px;margin-left:10px">Cancel</button>')
		},
		selectAll: function() {
			if ($("#selectAll").text() == 'Select All') {
				$("input[name='syncData']").each(function() {
					$(this).prop('checked', true);
				})
				$("#selectAll").text('Unselect All')
			} else {
				$("input[name='syncData']").each(function() {
					$(this).prop('checked', false);
				})
				$("#selectAll").text('Select All')

			}
		},
		syncData: function() {
			var context = this
			App.startActivityIndicator()
			$("input[name='syncData']").each(function() {
				if ($(this).is(":checked")) {
					if ($(this).val() == 'Resources') {
						context.ReplicateResource()
					} else if ($(this).val() == 'ActivityReports') {
						isActivityLogChecked = true;
						context.syncLogActivitiy()
					} else if ($(this).val() == 'Reports') {
						context.syncReports()
					} else if ($(this).val() == 'ResourcesFeedbacks') {
						context.syncResourcesFeedbacks()
					} else if ($(this).val() == 'ApplicationFeedbacks') {
						context.syncApplicationFeedbacks()
					}
					//**************************************************************************************************
					//Replicate Members db from community to nation
					else if ($(this).val() == 'MembersDb') {
						context.syncMembersDb()
					}
					//**************************************************************************************************
					if ($(this).val() == 'Application') {
						context.checkAvailableUpdates()
					}
				}
			})
			$('#invitationdiv').fadeOut(1000)
			setTimeout(function() {
				$('#invitationdiv').hide()
			}, 1000);
		},
		ReplicateResource: function() {

			App.startActivityIndicator()

			var that = this
			var temp = $.url().attr("host").split(".")
			var currentHost = $.url().attr("host")

			var nationURL = ''
			var nationName = ''
			var type = ''

			var configurations = Backbone.Collection.extend({

				url: App.Server + '/configurations/_all_docs?include_docs=true'
			})
			var config = new configurations()
			config.fetch({
				async: false
			})
			var currentConfig = config.first()
			var cofigINJSON = currentConfig.toJSON()

			type = cofigINJSON.rows[0].doc.type
			nationURL = cofigINJSON.rows[0].doc.nationUrl
			nationName = cofigINJSON.rows[0].doc.nationName
			App.$el.children('.body').html('Please Wait…')
			var waitMsg = ''
			var msg = ''
			$.ajax({
				url: 'http://' + nationName + ':' + App.password + '@' + nationURL + ':5984/communities/_all_docs?include_docs=true',
				type: 'GET',
				dataType: "jsonp",
				success: function(json) {
					for (var i = 0; i < json.rows.length; i++) {
						var community = json.rows[i]
						var communityurl = community.doc.url
						var communityname = community.doc.name
						msg = waitMsg
						waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
						App.$el.children('.body').html(waitMsg)
						that.synchCommunityWithURL(communityurl, communityname)
						waitMsg = msg
						waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.'
						App.$el.children('.body').html(waitMsg)
					}
					if (type != "nation") {
						msg = waitMsg
						waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
						that.synchCommunityWithURL(nationURL, nationName)
						waitMsg = msg
						waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.<br>Replication completed.'
					}
				}
			})
		},
		synchCommunityWithURL: function(communityurl, communityname) {
			console.log('http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources')
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "resources",
					"target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources'
				}),
				success: function(response) {

				},
				async: false
			})
		},
		syncReports: function() {

			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "communityreports",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/communityreports'
				}),
				success: function(response) {
					alert("Successfully Replicated Reports")
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error (Try Later)")
				}
			})
		},
		syncLogActivitiy: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "activitylog",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/activitylog'
				}),
				success: function(response) {
					$.ajax({
						url: 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true&key="' + App.configuration.get('code') + '"',
						type: 'GET',
						dataType: 'jsonp',
						success: function(result) {
							var communityModel = result.rows[0].value;
							var communityModelId = result.rows[0].id;
							//Replicate from Nation to Community
							$.ajax({
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								type: 'POST',
								url: '/_replicate',
								dataType: 'json',
								data: JSON.stringify({
									"source": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
									"target": "community",
									"doc_ids": [communityModelId]
								}),
								success: function(response) {
									console.log("Successfully Replicated.");
									var date = new Date();
									var year = date.getFullYear();
									var month = (1 + date.getMonth()).toString();
									month = month.length > 1 ? month : '0' + month;
									var day = date.getDate().toString();
									day = day.length > 1 ? day : '0' + day;
									var formattedDate = month + '-' + day + '-' + year;
									communityModel.lastActivitiesSyncDate = month + '/' + day + '/' + year;
									//Update the record in Community db at Community Level
									$.ajax({

										headers: {
											'Accept': 'application/json',
											'Content-Type': 'multipart/form-data'
										},
										type: 'PUT',
										url: App.Server + '/community/' + communityModelId + '?rev=' + communityModel._rev,
										dataType: 'json',
										data: JSON.stringify(communityModel),
										success: function(response) {
											//Replicate from Community to Nation
											$.ajax({
												headers: {
													'Accept': 'application/json',
													'Content-Type': 'application/json; charset=utf-8'
												},
												type: 'POST',
												url: '/_replicate',
												dataType: 'json',
												data: JSON.stringify({
													"source": "community",
													"target": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
													"doc_ids": [communityModelId]
												}),
												success: function(response) {
													alert("Successfully Replicated Log Activity Reports")
													App.stopActivityIndicator();
												},
												async: false
											});
										},

										async: false
									});
								},
								async: false
							});
						},
						error: function() {
							console.log('http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?key="' + App.configuration.get('code') + '"');
						}
					});

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error (Try Later)")
				}
			})


		},

		syncResourcesFeedbacks: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "feedback",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/feedback'
				}),
				success: function(response) {
					alert("Successfully Replicated Resources Feedbacks")
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error (Try Later)")
				}
			})


		},

		syncApplicationFeedbacks: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "report",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/report'
				}),
				success: function(response) {
					alert("Successfully Replicated Application Feedbacks")
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error (Try Later)")
				}
			})
		},
		//******************************************************************************************************************
		//Replicate Members Db from community to nation
		syncMembersDb: function() {
			/*$.couch.replicate("members", 'http://'+ App.configuration.get('nationName') +':'+App.password+'@'+ App.configuration.get('nationUrl') + '/members' , "filter:_design/bell/adminFilter", {
			 success: function(data) {
			 alert("Members database replicated successfully.");
			 if(isActivityLogChecked == false) {
			 App.stopActivityIndicator();
			 }
			 },
			 error: function(status) {
			 alert("Members database replication failed.");
			 }
			 }, {
			 create_target: true
			 });*/
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "members",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/members',
					"filter": "bell/adminFilter"
				}),
				success: function(response) {
					alert("Members database replicated.")
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("Error (Try Later)")
				}
			})
		},
		//*************************************************************************************************************
		//following function compare version numbers.
		/*<li>0 if the versions are equal</li>
		 A negative integer iff v1 < v2
		 A positive integer iff v1 > v2
		 NaN if either version string is in the wrong format*/

		versionCompare: function(v1, v2, options) {
			var lexicographical = options && options.lexicographical;
			zeroExtend = options && options.zeroExtend;
			v1parts = v1.split('.');
			v2parts = v2.split('.');

			function isValidPart(x) {
				return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
			}

			if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
				return NaN;
			}

			if (zeroExtend) {
				while (v1parts.length < v2parts.length) v1parts.push("0");
				while (v2parts.length < v1parts.length) v2parts.push("0");
			}

			if (!lexicographical) {
				v1parts = v1parts.map(Number);
				v2parts = v2parts.map(Number);
			}

			for (var i = 0; i < v1parts.length; ++i) {
				if (v2parts.length == i) {
					return 1;
				}

				if (v1parts[i] == v2parts[i]) {
					continue;
				} else if (v1parts[i] > v2parts[i]) {
					return 1;
				} else {
					return -1;
				}
			}

			if (v1parts.length != v2parts.length) {
				return -1;
			}

			return 0;
		},
		checkAvailableUpdates: function() {
			var context = this;
			var configuration;
			var configurationModel = new App.Collections.Configurations()
			configurationModel.fetch({
				success: function(res) {
					configuration = res.first()

				},
				async: false
			})
			var nationName = configuration.get("nationName")
			var nationURL = configuration.get("nationUrl")
			var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true'

			// console.log(nationConfig)
			// alert('check')
			//alert('http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true')
			$.ajax({
				url: nationConfigURL,
				type: 'GET',
				dataType: "jsonp",
				success: function(json) {
					var nationConfig = json.rows[0].doc
					nationConfigJson = nationConfig
					if (typeof nationConfig.version === 'undefined') {
						/////No version found in nation
					} else if (nationConfig.version == configuration.get('version')) {
						///No updatea availabe
					} else {
						if (context.versionCompare(nationConfig.version, configuration.get('version')) < 0) {
							console.log("Nation is at low level")
						} else if (context.versionCompare(nationConfig.version, configuration.get('version')) > 0) {
							context.updateApp()
						} else {
							console.log("Nation is uptodate")
						}
					}
				}
			})
			return;
		},
		updateApp: function() {

			var configurations = Backbone.Collection.extend({
				url: App.Server + '/configurations/_all_docs?include_docs=true'
			})
			var config = new configurations()
			config.fetch({
				async: false
			})
			var currentConfig = config.first().toJSON().rows[0].doc
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
					"source": 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/apps',
					"target": "apps"
				}),
				success: function(response) {
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
				success: function(response) {
					console.log(response)
					alert("Successfully updated to latest version.")
				},
				async: false
			})

		}
	})

});$(function() {

    App.Views.meetupView = Backbone.View.extend({


        authorName: null,
        tagName: "table",

        className: "btable btable-striped",
        initialize: function() {
            this.$el.html('<h3 colspan="20">Meetup | ' + this.model.get('title') + '</h3>')
        },
        events: {

            'click  #joinMeetUp': 'joinMeetUp',
            'click #meetupsInvitation': 'MemberInvite'

        },

        MemberInvite: function() {

            $('#invitationdiv').fadeIn(1000)
            document.getElementById('cont').style.opacity = 0.1
            document.getElementById('nav').style.opacity = 0.1
            $('#invitationdiv').show()
            var inviteModel = new App.Models.InviMeetup()
            inviteModel.resId = this.model.get("_id")
            inviteModel.senderId = $.cookie('Member._id')
            inviteModel.type = this.model.get("kind")
            inviteModel.title = this.model.get("title")
            inviteModel.description = this.model.get("description")
            var inviteForm = new App.Views.MeetupInvitation({
                model: inviteModel
            })
            inviteForm.render()
            $('#invitationdiv').html('&nbsp')
            $('#invitationdiv').append(inviteForm.el)

        },
        add: function(model) {
            //Single Author Should not be displayed multiple times on The Screen

        },
        joinMeetUp: function() {

            var UMeetup = new App.Collections.UserMeetups()
            UMeetup.memberId = $.cookie('Member._id')
            UMeetup.meetupId = this.model.get('_id')

            UMeetup.fetch({
                async: false
            })
            if (UMeetup.length > 0) {
                alert("Your have already joined this Meetup")
                return
            }


            var UserMeetUp = new App.Models.UserMeetup()
            UserMeetUp.set('memberId', $.cookie('Member._id'))
            UserMeetUp.set('meetupId', this.model.get('_id'))
            UserMeetUp.set('meetupTitle', this.model.get('title'))
            UserMeetUp.save()
            alert('successfully Added to your Meetups')
            Backbone.history.navigate('dashboard', {
                trigger: true
            })
        },


        render: function() {

            $('#invitationdiv').hide()
            var meetupInfo = this.model.toJSON()
            var date = new Date(meetupInfo.schedule)
            meetupInfo.schedule = date.toUTCString()

            this.$el.append('<tr><td><b>Title  </b></td><td>' + meetupInfo.title + '   (' + meetupInfo.category + ')</td></tr>')
            this.$el.append('<tr><td><b>Category  </b></td><td>' + meetupInfo.category + '</td></tr>')
            this.$el.append('<tr><td><b>Description </b></td><td>' + meetupInfo.description + '</td></tr>')
            this.$el.append('<tr><td><b>Location </b></td><td>' + meetupInfo.meetupLocation + '</td></tr>')
            this.$el.append('<tr><td><b>Date </b></td><td>' + meetupInfo.startDate + ' --- ' + meetupInfo.endDate + '</td></tr>')
            this.$el.append('<tr><td><b>Time </b></td><td>' + meetupInfo.startTime + ' --- ' + meetupInfo.endTime + '</td></tr>')

            this.$el.append('<tr><td><a class="btn btn-success" id="joinMeetUp">Join Meetup</a><a style="margin-left:20px" class="btn btn-info" id="meetupsInvitation">Invite Members</a><a style="margin-left:20px" class="btn btn-info" href="#meetups">Back</a></td><td></td></tr>')
        }

    })

});$(function() {

    App.Views.navBarView = Backbone.View.extend({
        tagName: "ul",
        className: "nav",
        id: "itemsinnavbar",
        authorName: null,
        template1: _.template($('#template-nav-logged-in').html()),
        template0: _.template($('#template-nav-log-in').html()),
        initialize: function(option) {
            if (option.isLoggedIn == 0) {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
            var temp = Backbone.history.location.href
            temp = temp.split('#')

            var version = ''

            if (!App.configuration) {
                var config = new App.Collections.Configurations()
                config.fetch({
                    async: false
                })
                var con = config.first()
                App.configuration = con
            }

            if (!App.languageDict) {
                var clanguage = App.configuration.get("currentLanguage");
                // fetch dict for the current/selected language from the languages db/table
                var languages = new App.Collections.Languages();
                languages.fetch({
                    async: false
                });

                var languageDicts = languages.first().toJSON();
                var languageDict = languageDicts[clanguage];
                App.languageDict = languageDicts[clanguage];
                //                $.ajax({
                //                    type: 'GET',
                //                    url: '/languages/_all_docs?include_docs=true',
                //                    dataType: 'json',
                //                    success: function (response) {
                //                        var languageDicts = response.rows[0].doc; // put json of all dictionaries in var
                //                        // now get the selected language dict from that var
                //                        App.languageDict = languageDicts[clanguage];
                //                    },
                //                    data: {},
                //                    async: false
                //                });
            }

            version = App.configuration.get('version')
            this.data = {
                uRL: temp[1],
                versionNO: version,
                languageDict: App.languageDict
            }
            this.$el.append(this.template(this.data))
            if (!App.member && $.cookie('Member._id')) {
                var member = new App.Models.Member()
                member.set('_id', $.cookie('Member._id'))
                member.fetch({
                    async: false, // by default it is true
                    success: function(model, response) {
                        App.member = model;
                    },
                    error: function() {
                        App.Router.expireSession();
                        Backbone.history.stop();
                        App.start();
                    }
                });

            }
        },

        render: function() {}

    })

});$(function() {

    App.Views.siteFeedback = Backbone.View.extend({

        tagName: "div",
        id: "site-feedback",
        authorName: null,

        initialize: function() {},

        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function() {
            Backbone.history.navigate('siteFeedback', {
                trigger: true
            })
        },
        cancelform: function() {
            $('#site-feedback').animate({
                height: 'toggle'
            })
            this.unsetForm()
        },
        setForm: function() {
            if ($('#comment').val().length != 0 && $('input[name="category"]:checked').val()) {
                var temp = Backbone.history.location.href
                var now = new Date();
                now.getDate()
                temp = temp.split('#')
                var peri = '';
                if ($("#priority").is(':checked')) {
                    peri = 'urgent'
                }
                this.model.set({
                    comment: $('#comment').val(),
                    category: $('input[name="category"]:checked').val(),
                    priority: peri,
                    PageUrl: "Personal:" + temp[1],
                    Resolved: '0',
                    memberLogin: $.cookie('Member.login'),
                    time: now.toString(),
                    communityCode: App.configuration.get('code')
                })
                this.model.save()
                alert("Feedback Successfully Sent")
                this.unsetForm()
            }

            $('#site-feedback').animate({
                height: 'toggle'
            })
        },
        unsetForm: function() {
            $('#comment', this.$el).val("")
            $('input[name="category"]').attr('checked', false)
            $("#priority").attr('checked', false)
        },

        render: function() {
            this.$el.append('<br/><br/><div class="form-field" ><input name="PageUrl" id="PageUrl" type="text"></div>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><input name="priority" value="urgent" id="priority" type="checkbox"><label for="priority">urgent</label></div>')
            this.$el.append('<div class="form-field" style="margin-top: -19px;margin-left: 115px;"> <input type="radio" name="category" value="Bug">&nbsp Bug &nbsp&nbsp&nbsp<input type="radio" name="category" value="Question">&nbsp Question &nbsp&nbsp&nbsp<input type="radio" name="category" value="Suggestion">&nbsp Suggestion &nbsp&nbsp&nbsp</div><br/><br/>')
            this.$el.append('<div class="form-field" style="margin-left:23px;"><textarea †rows="7" type="text" name="comment" placeholder="Give us your feedback on the current page ... " id="comment"></textarea></div>')
            this.$el.append('<div class="form-field"><input name="Resolved" id="Resolved" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="memberLogin" id="memberLogin" type="text"></div>')
            this.$el.append('<div class="form-field"><input name="time" id="time" type="text"></div>')
            $('#PageUrl', this.$el).hide()
            $('#Resolved', this.$el).hide()
            $('#memberLogin', this.$el).hide()
            $('#time', this.$el).hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
            this.$el.append($button)
        }
    })
});$(function() {

    App.Views.siteFeedbackPage = Backbone.View.extend({

        tagName: "table",
        className: " table-feedback notification-table table-striped",
        authorName: null,
        searchText: null,
        Resolved: null,
        stack: null,
        category: null,
        urgent: null,
        applyFilters: null,
        resultArray: null,
        events: {
            //"change #select_category" : function(e){
            //console.log(e)
            //console.log(e.currentTarget.value)
            //},
            "click #see-all": function(e) {
                this.applyFilters = "0"
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #switch": function(e) {
                this.applyFilters = "1"
                this.category = $('#select_category').val()
                this.urgent = $('#select_urgent').val()
                if ($('#select_status').val() == "Resolved") {
                    this.Resolved = "1"
                } else {
                    this.Resolved = "0"
                }
                while (skipStack.length > 0) {
                    skipStack.pop();
                }
                searchText = ""
                this.resultArray = []
                skip = 0
                skipStack.push(skip)
                this.fetchRecords()
            },
            "click #search_feedback": function(e) {
                this.applyFilters = "0"
                searchText = $("#searchText").val()
                if (searchText != "") {
                    while (skipStack.length > 0) {
                        skipStack.pop();
                    }
                    this.resultArray = []
                    skip = 0
                    skipStack.push(skip)
                    this.fetchRecords()
                }
            },
            "click #previousButton": function(e) {
                if (skipStack.length > 1) {
                    skipStack.pop()
                    skip = skipStack.pop()
                    skipStack.push(skip)
                    this.resultArray = []
                    this.fetchRecords()
                } else {
                    $("#previousButton").hide()
                }
            },
            "click #next_button": function(e) {

                skipStack.push(skip)
                this.resultArray = []
                this.fetchRecords()
            },
        },

        initialize: function() {
            this.resultArray = []
            this.category = "Bug"
            this.Resolved = "1"
            this.applyFilters = "0"
            this.searchText = ""
            if (url == "unknown") {
                url = "siteFeedback"
            }
            if ($("#comments") != null) {
                $('#debug').append('<div id="comments"></div>')
            }
        },

        addAll: function() {
            this.$el.html('<h4>Keyword:&nbsp;<input class="form-control" type="text" placeholder="Search in comment" value="" size="30" id="searchText" style="height:24px;margin-top:1%;"></input>&nbsp;<span><button class="btn btn-info" id="search_feedback">Search</button>&nbsp;<button class="btn btn-info" id="see-all">See All</button></span>&nbsp;<img id="progress_img" src="vendor/progress.gif" width="3%"></h4><br/>')
            this.$el.append('<Select id="select_category"><option>Bug</option><option>Question</option><option>Suggestion</option></select>&nbsp;&nbsp<select id="select_status"><option>Unresolve</option><option>Resolved</option></select>&nbsp;&nbsp<select id="select_urgent"><option>Normal</option><option>Urgent</option></select>&nbsp;&nbsp<button class="btn btn-info" id="switch">Apply Filters</button><br/><br/>')
            this.$el.append('<th ><h4>Feedback</h4></th><th ><h4>Status</h4></th>')
            $("#progress_img").hide()
            console.log(this.collection.toJSON())
            this.collection.forEach(this.addOne, this)
            this.$el.append('<br/><br/><input type="button" class="btn btn-hg btn-primary" id="previousButton" value="< Previous"> &nbsp;&nbsp;&nbsp;<button class="btn btn-hg btn-primary" id="next_button" >Next  ></button>')
        },

        addOne: function(model) {
            if (!model.get("category")) {
                model.set("category", "Bug")
            }
            if (!model.get("priority")) {

                model.set("priority", [])
            }
            if (model.toJSON()._id != "_design/bell") {
                var revRow = new App.Views.siteFeedbackPageRow({
                    model: model
                })
                revRow.render()
                this.$el.append(revRow.el)
            }

        },
        render: function() {
            this.addAll()
            //alert('in render')
            if (skipStack.length <= 1) {
                $("#previousButton").hide()
            }
            if (this.collection.length < 5) {
                $("#next_button").hide()
            }
        },
        fetchRecords: function() {
            $("#progress_img").show()
            var obj = this
            this.collection.fetch({
                success: function() {
                    //alert(obj.resultArray.length + ' skip : ' + skip)
                    obj.resultArray.push.apply(obj.resultArray, obj.searchInArray(obj.collection.models, searchText))
                    //alert(obj.resultArray.length + ' skip : ' + skip)

                    if (obj.resultArray.length != limitofRecords && obj.collection.models.length == limitofRecords) {
                        obj.fetchRecords()
                        return;
                    } else if (obj.resultArray.length == 0 && obj.collection.models.length == 0 && skipStack.length > 1) {

                        $("#next_button").hide()
                        skipStack.pop()
                        return;
                    }

                    if (obj.resultArray.length == 0 && skipStack.length == 1) {
                        if (searchText != "") {
                            alert('No result found')
                        }
                        //obj.render()
                        // $('#not-found').html("No Such Record Exist");
                        //  $("#selectAllButton").hide() 
                    }
                    var ResultCollection = new App.Collections.siteFeedbacks()
                    //if(obj.resultArray.length > 0)
                    {
                        ResultCollection.set(obj.resultArray)
                        obj.collection = ResultCollection
                        obj.$el.html('')
                        obj.render()
                    }
                }
            })

        },

        filterResult: function(model) {

            var temp = model.get("PageUrl")
            if (!temp) {
                temp = ''
            }
            var temp2 = temp.split('/')
            var ul = temp2[0]
            for (var i = 1; i < temp2.length; i++) {
                if (temp2[i].length != 32) {
                    ul = ul + "/" + temp2[i]
                } else {
                    i = temp.length
                }
            }
            if (ul == url) {
                return true
            } else {
                console.log(url)
                return false
            }
        },

        checkFilters: function(result) {
            console.log(result)

            if (this.filterResult(result)) {
                if (this.applyFilters == "0") {
                    return true
                } else if (this.Resolved == result.get("Resolved") && this.category == result.get("category")) {
                    if (this.urgent == "Normal" && result.get("priority").length == 0) {
                        return true
                    } else if (this.urgent == "Urgent" && result.get("priority").length > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        searchInArray: function(resourceArray, searchText) {
            var that = this
            var resultArray = []
            var foundCount
            _.each(resourceArray, function(result) {
                if (result.get("comment") != null) {
                    skip++

                    //alert(that.Resolved+' '+result.get("Resolved") + ' ' + that.category + ' ' +  result.get("category"))
                    if (!result.get("category")) {
                        result.set("category", "Bug")
                    }
                    //   alert(result.get("urgent").length)
                    if (!result.get("priority")) {
                        result.set("priority", [])
                    }
                    //    console.log(result)
                    //    alert(result.get("urgent").length)
                    if (result.get("comment").toLowerCase().indexOf(searchText.toLowerCase()) >= 0 && that.checkFilters(result)) {
                        if (resultArray.length < limitofRecords) {
                            resultArray.push(result)
                        } else {
                            enablenext = 1
                            skip--
                        }
                    } else if (resultArray.length >= limitofRecords) {
                        skip--
                    }


                }
            })

            return resultArray
        }

    })

});$(function() {

    App.Views.siteFeedbackPageRow = Backbone.View.extend({
        template0: $("#template-siteReviewRowAdmin").html(),
        template1: $("#template-siteReviewRownoAdmin").html(),
        tagName: "tr",
        authorName: null,
        events: {
            "click #resolveButton": "resolve",
            "click #commentButton": "comment"
        },
        comment: function(e) {
            console.log(e.target.attributes[0].nodeValue)
            var coll = new App.Collections.reportsComment()
            coll.feedbackId = e.target.attributes[0].nodeValue
            coll.fetch({
                async: false
            })
            var viw = new App.Views.addComment({
                collection: coll,
                commentId: e.target.attributes[0].nodeValue
            })
            viw.render()
            $('#debug').append(viw.el)
        },
        resolve: function(e) {
            console.log(e)
            e.preventDefault()
            this.model.on('sync', function() {
                location.reload();
            })
            this.model.save({
                Resolved: "1"
            }, {
                success: function() {}
            });
        },

        initialize: function() {
            if ($.cookie('Member.login') == 'admin') {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
        },

        render: function() {

            var vars = this.model.toJSON()
            if (this.model.get("priority").length == 0) {
                vars.urgent = "Normal"
            } else {
                vars.urgent = "Urgent"
            }
            console.log(vars)
            this.$el.html(_.template(this.template, vars))
        }

    })

})

$(function() {

    App.Views.siteFeedbackPageRow = Backbone.View.extend({
        template0: $("#template-siteReviewRowAdmin").html(),
        template1: $("#template-siteReviewRownoAdmin").html(),
        tagName: "tr",
        authorName: null,
        events: {
            "click #resolveButton": "resolve",
            "click #commentButton": "comment"
        },
        comment: function(e) {
            console.log(e.target.attributes[0].nodeValue)
            var coll = new App.Collections.reportsComment()
            coll.feedbackId = e.target.attributes[0].nodeValue
            coll.fetch({
                async: false
            })
            var viw = new App.Views.addComment({
                collection: coll,
                commentId: e.target.attributes[0].nodeValue
            })
            viw.render()
            $('#debug').append(viw.el)
        },
        resolve: function(e) {
            console.log(e)
            e.preventDefault()
            this.model.on('sync', function() {
                location.reload();
            })
            this.model.save({
                Resolved: "1"
            }, {
                success: function() {}
            });
        },

        initialize: function() {
            if ($.cookie('Member.login') == 'admin') {
                this.template = this.template0
            } else {
                this.template = this.template1
            }
        },

        render: function() {

            var vars = this.model.toJSON()
            if (this.model.get("priority").length == 0) {
                vars.urgent = "Normal"
            } else {
                vars.urgent = "Urgent"
            }
            console.log(vars)
            this.$el.html(_.template(this.template, vars))
        }

    })

});$(function() {

    App.Views.takeQuizView = Backbone.View.extend({
        Questions: {},
        Optns: {},
        Score: 0,
        Correctanswers: {},
        Givenanswers: new Array(),
        index: -1,
        TotalCount: 0,
        tagName: 'form',
        id: 'questionForm',
        mymodel: null,
        events: {
            "click #exitPressed": function(e) {
                $('div.takeQuizDiv').hide()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";
            },
            "click #finishPressed": function(e) {
                $('div.takeQuizDiv').hide()
                location.reload()
                document.getElementById('cont').style.opacity = "1";
                document.getElementById('nav').style.opacity = "1";

            },

            "click #nextPressed": function(e) {
                if ($("input:radio[name='optn']:checked").val() != undefined) {
                    this.Givenanswers.push(decodeURI($("input:radio[name='optn']:checked").val()))
                    console.log(this.Givenanswers)
                    console.log(this.Correctanswers)
                    if (this.Givenanswers[this.index] == this.Correctanswers[this.index]) {
                        console.log("corre")
                        this.Score++
                    }
                    this.renderQuestion()
                } else {
                    alert("no option selected")
                }
            }
        },


        initialize: function() {
            this.Correctanswers = this.options.answers
            this.Questions = this.options.questions
            this.Optns = this.options.options
            this.stepId = this.options.stepId
            this.TotalCount = this.Questions.length
            this.pp = parseInt(this.options.passP)
            console.log(this.pp)
            this.myModel = this.options.resultModel
            this.stepindex = this.options.stepIndex
            this.Givenanswers = []

            console.log('==============================')
            console.log(this.Correctanswers, "Correctanswers")
            console.log(this.Questions, "Questions")
            console.log(this.Optns, "Optns")
            console.log(this.stepId, "stepId")
            console.log(this.TotalCount, "TotalCount")
            console.log(this.pp, "pp")
            console.log(this.myModel, "myModel")
            console.log(this.stepindex, "stepindex")
            console.log(this.Givenanswers, "Givenanswers")
            console.log('==============================')


        },
        /*
         animateIn:function(){
         document.getElementById("tQuizDiv").style.left="-512%"
         $('div.takeQuizDiv').animate({left:'0%'},2000)
         if(this.index==-1)
         {
         $('div.takeQuizDiv').animate({left:'2%'},100)
         $('div.takeQuizDiv').animate({left:'-1.5%'},100)
         $('div.takeQuizDiv').animate({left:'1.5%'},100)
         $('div.takeQuizDiv').animate({left:'-1%'},100)
         $('div.takeQuizDiv').animate({left:'1%'},100)
         $('div.takeQuizDiv').animate({left:'-0.5%'},100)
         $('div.takeQuizDiv').animate({left:'0.5%'},100)
         $('div.takeQuizDiv').animate({left:'0%'},100)
         }
         },
         animateOut:function(){
         $('div.takeQuizDiv').animate({left:'125%'},1000)
         },
         */
        renderQuestion: function() {
            console.log((this.index + 1))
            console.log(this.TotalCount)
            if ((this.index + 1) != this.TotalCount) {
                this.index++
                var temp = this.index * 5
                this.$el.html('&nbsp')
                this.$el.append('<div class="Progress" style="float:right;"><p>' + (this.index + 1) + '/' + this.TotalCount + '</p> </div>')
                this.$el.append('<div class="quizText"><textarea disabled>' + this.Questions[this.index] + '</textarea> </div>')
                o0 = encodeURI(this.Optns[temp])
                o1 = encodeURI(this.Optns[temp + 1])
                o2 = encodeURI(this.Optns[temp + 2])
                o3 = encodeURI(this.Optns[temp + 3])
                o4 = encodeURI(this.Optns[temp + 4])
                this.$el.append('<div class="quizOptions"><input type="radio" name="optn" value=' + o0 + '>' + this.Optns[temp] + '<br><input type="radio" name="optn" value=' + o1 + '>' + this.Optns[temp + 1] + '<br>' + '<input type="radio" name="optn" value=' + o2 + '>' + this.Optns[temp + 2] + '<br>' + '<input type="radio" name="optn" value=' + o3 + '>' + this.Optns[temp + 3] + '<br>' + '<input type="radio" name="optn" value=' + o4 + '>' + this.Optns[temp + 4] + '</div>')
                this.$el.append('<div class="quizActions" ><button class="btn btn-danger" id="exitPressed">Exit</button><button class="btn btn-primary" id="nextPressed">Next</button></div>')
            } else {
                this.$el.html('&nbsp')
                var quizScore = (Math.round((this.Score / this.TotalCount) * 100))
                console.log(quizScore)
                this.$el.append('<div class="quizText"><h4>You Scored ' + Math.round((this.Score / this.TotalCount) * 100) + '%<h4></div>')
                this.$el.append('<div class="quizActions" ><button class="btn btn-info" id="finishPressed">Finish</button></div>')
                var sstatus = this.myModel.get('stepsStatus')
                var sp = this.myModel.get('stepsResult')
                if (this.pp <= quizScore) {
                    sstatus[this.stepindex] = "1"
                    this.myModel.set('stepsStatus', sstatus)
                }
                sp[this.stepindex] = quizScore.toString()
                this.myModel.set('stepsResult', sp)

                this.myModel.save(null, {
                    success: function(res, revInfo) {
                        console.log("Result Saved!")
                    },
                    error: function() {
                        console.log("Not Saved")
                    }

                });

                if (this.pp <= quizScore) {
                    this.$el.append('</BR><p>You have Passed this Level</p>')
                } else {
                    this.$el.append('</BR><p>You are unable to pass this Level. Read carefully and try again</p>')
                }

            }
        },

        start: function() {
            $('div.takeQuizDiv').show()
            // this.animateIn()
            this.renderQuestion()
        },

        render: function() {
            document.getElementById('cont').style.opacity = "0.1";
            document.getElementById('nav').style.opacity = "0.1";
            this.start()
        }


    })

})