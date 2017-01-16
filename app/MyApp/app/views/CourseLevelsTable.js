$(function () {

    App.Views.CourseLevelsTable = Backbone.View.extend({
        id: "accordion",
        vars: {},
        modl: null,
        template: _.template($("#template-courseLevelsTable").html()),
        events: {
            "click #takequiz": "quiz",
            "click #newtakequiz": "quiz",
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
                $('#star').append(App.languageDict.attributes.Rating+"<br/>")
                $('#star').raty()
                $("#star > img").click(function () {
                    ratingView.setUserRating($(this).attr("alt"))
                });
                ratingView.render()
                $('#externalDiv').append(ratingView.el)
                $('#externalDiv').show()

            }
        },

        quiz: function (e) {
            $.cookie("sectionNo", $.url().attr('fragment').split('/')[2] + '/' + $("#accordion").accordion("option", "active"));
            var context=this
            var id = e.currentTarget.value
            step = new App.Models.CourseStep({
                _id: id
            })
            step.fetch({
                async: false
            })
            var JSONsteps=null;
            JSONsteps=step.toJSON()
            var ssids = context.modl.get('stepsIds')
            var index = ssids.indexOf(id)
            console.log(JSONsteps);
            if (typeof JSONsteps.coursestructure !== "undefined" &&  JSONsteps.coursestructure == "true") {
               var temp = new App.Views.takeQuizView({ 
                coursestructure: JSONsteps.coursestructure,
                questionlist: JSONsteps.questionslist,
                passP: JSONsteps.passingPercentage,
                resultModel: context.modl,
                stepIndex: index,
                stepId: JSONsteps._id
                })
            }
            else{
                var temp = new App.Views.takeQuizView({ 
                questions: JSONsteps.questions,
                answers: JSONsteps.answers,
                options: JSONsteps.qoptions,
                passP: JSONsteps.passingPercentage,
                resultModel: context.modl,
                stepIndex: index 
                })   
            }
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
            this.vars = model.toJSON();
            this.vars.languageDict=App.languageDict;
            if (!this.vars.outComes || this.vars.outComes.length==0) {
                this.vars.outComes = ''
                if (this.vars.questions && this.vars.questions.length >0){
                    this.vars.outComes = ['Quiz'];
                }

            }
            else if(this.vars.outComes instanceof Array){
                for ( var i =0;i< this.vars.outComes.length; i++)
                {
                    var textOfOutcomes = 'Take_' + this.vars.outComes[i];
                    this.vars.outComesText = textOfOutcomes;

                }

            }
            else{
                var temp=this.vars.outComes
                this.vars.outComes=new Array()
                this.vars.outComes[0]=temp;

            }

           // var textOfOutcomes='Take_'+this.vars.outComes[0];
           // this.vars.outComesText=App.languageDict.get(textOfOutcomes);
           // this.vars.outComes[0]=App.languageDict.get(this.vars.outComes[0]);

         //   this.vars.outComesText = textOfOutcomes;
          //  this.vars.outComes[0] =this.vars.outComes[0];
            var index = 0
            var sstatus = this.modl.get('stepsStatus')
            var ssids = this.modl.get('stepsIds')
            var sr = this.modl.get('stepsResult')

            while (index < sstatus.length && ssids[index] != this.vars._id) {
                index++
            }

            if (index == sstatus.length) {
                this.vars.status = App.languageDict.attributes.Error
                this.vars.marks =  App.languageDict.attributes.Error
            } else {
                var tempStatus = [];

                if(sstatus[index].length > 1) {
                    var paper = filterInt(sstatus[index][0])
                    var quiz = filterInt(sstatus[index][1])
                    tempStatus.push(paper);
                    tempStatus.push(quiz);
                    this.vars.status = tempStatus
                    this.vars.marks = sr[index]
                } else {
                this.vars.status = filterInt(sstatus[index])
                this.vars.marks = sr[index]
                }

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
            if(!$.cookie("sectionNo") || $.url().attr('fragment').split('/')[2] != $.cookie("sectionNo").split('/')[0]) {
                $.cookie("sectionNo", $.url().attr('fragment').split('/')[2] + '/' + 0)
            }
            $("#accordion").accordion({
                active: parseInt($.cookie("sectionNo").split('/')[1]),
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
        render: function () {

            if (this.collection.length < 1) {
                this.$el.append('<p style="font-weight:900;">'+App.languageDict.attributes.Error_UserCourse_Details+'</p>')
            } else {
                this.setAllResults();
            }

        }

    })

})