$(function () {

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
                pending = member.get("pendingReviews")
                pending.push(resid)
                member.set("pendingReviews", pending)
                member.save()
                console.log(member.get("pendingReviews"))
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

            step = new App.Models.CourseStep({
                _id: e.currentTarget.value
            })
            step.fetch({
                async: false
            })
            console.log(step.toJSON())

            var ssids = this.modl.get("stepsIds")
            var index = ssids.indexOf(e.currentTarget.value)
            var statusArray = this.modl.get("stepsStatus")
            var temp = new App.Views.takeQuizView({
                questions: step.toJSON().questions,
                answers: step.toJSON().answers,
                options: step.toJSON().qoptions,
                passP: step.toJSON().passingPercentage,
                resultModel: this.modl,
                stepIndex: index
            })
            temp.render()
            $('div.takeQuizDiv').html(temp.el)

        },

        initialize: function () {
            $('div.takeQuizDiv').hide()
        },
        addAll: function () {
            this.collection.each(this.addOne, this)
        },

        addOne: function (model) {
            
            console.log(model)
            
            var upto=0
            if (model.get("resourceTitles")) {
            
            max = model.get("resourceTitles").length
                for (var i = 0; i < max; i++) {
                var rtitle = model.get("resourceTitles")
            var rid = model.get("resourceId")
                    var r = new App.Models.Resource({
                        "_id": rid[upto]
                    })
                    r.fetch({
                        async: false
                    })
                    if(r.get("hidden")==true)
                    {
                    	
                    	var index = model.get("resourceId").indexOf(r.get("_id").toString())
                    	
               			if(index!=-1)
               			{
               				model.get("resourceId").splice(index,1)
               				model.get("resourceTitles").splice(index,1)
               			}
               			
                    		
                    }
                    else{
               			upto++
               			}
                }
             }
             
             
             
             
            this.vars = model.toJSON()
        
            if (!this.vars.outComes)
            {
                this.vars.outComes = ''
            if (this.vars.questions && this.vars.questions.length > 0)
                this.vars.outComes = ['Quiz']
            }
            else if(this.vars.outComes instanceof Array)
            {}
            else{
            var temp=this.vars.outComes
               this.vars.outComes=new Array()
               this.vars.outComes[0]=temp 
          
            }
            
            
            
            var index = 0
            var sstatus = this.modl.get("stepsStatus")
            var ssids = this.modl.get("stepsIds")
            var sr = this.modl.get("stepsResult")

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
            var res = new App.Collections.membercourseprogresses()
            res.courseId = this.collection.first().get("courseId")
            res.memberId = $.cookie('Member._id')
            res.fetch({
                async: false
            })
            var PassedSteps = 0
            var totalSteps = 0
            if (res.length != 0) {
                this.modl = res.first()
                PassedSteps = 0
                var sstatus = this.modl.get("stepsStatus")
                totalSteps = sstatus.length
                while (PassedSteps < totalSteps && sstatus[PassedSteps] != '0') {
                    PassedSteps++
                }
            }
        },

        render: function () {

            if (this.collection.length < 1) {
                this.$el.append('<p style="font-weight:900;">No data related to selected course found</p>')
            } else {
                this.setAllResults()
                this.addAll()
            }

        }

    })

})