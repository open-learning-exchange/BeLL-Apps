$(function () {

    App.Views.CourseLevelsTable = Backbone.View.extend({
        id: "accordion",
        vars: {},
        modl: null,
        template: _.template($("#template-courseLevelsTable").html()),
        events: {
            "click #takeCourseTest": "test",
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

        test: function (e) {
            $.cookie("sectionNo", $.url().attr('fragment').split('/')[2] + '/' + $("#accordion").accordion("option", "active"));
            var memberEnroll = new App.Collections.membercourseprogresses()
            memberEnroll.courseId = this.collection.courseId,
            memberEnroll.memberId = this.attributes.membersid
            memberEnroll.fetch({
                async:false
            })
            memberProgressRecord = memberEnroll.first();
            var Attempt = memberProgressRecord.get('pqAttempts')
            var sp = memberProgressRecord.get('stepsResult')  
            var context = this
            var id = e.currentTarget.value
            var wrapper = $(e.currentTarget).parents('div.ui-accordion-content');
            step = new App.Models.CourseStep({
                _id: id
            })
            step.fetch({
                async: false
            })
            var JSONsteps = null;
            JSONsteps = step.toJSON()
            var ssids = context.modl.get('stepsIds')
            var index = ssids.indexOf(id)
            var temp = new App.Views.takeTestView({ 
                coursestructure: JSONsteps.coursestructure,
                questionlist: JSONsteps.questionslist,
                passP: JSONsteps.passingPercentage,
                resultModel: context.modl,
                stepIndex: index,
                stepId: JSONsteps._id
            })
            temp.render()
            $('div.takeTestDiv').html('')
            $(wrapper).find('div.takeTestDiv').html(temp.el)
        },
            
        initialize: function () {
            $('div.takeTestDiv').html('')
            $('div.takeTestDiv').hide()
        },

        addAll: function () {
            this.collection.each(this.addOne, this)
        },

        addOne: function (model) {
            this.vars = model.toJSON();
            this.vars.languageDict = App.languageDict;
            var index = 0
            var sstatus = this.modl.get('stepsStatus')
            var ssids = this.modl.get('stepsIds')
            var sr = this.modl.get('stepsResult')
            var totalattempt = this.modl.get('pqAttempts')
            while (index < sstatus.length && ssids[index] != this.vars._id) {
                index++
            }
            this.vars.lastAttemptStatus = App.languageDict.attributes.UnAttempted;
            if (index == sstatus.length) {
                this.vars.status = App.languageDict.attributes.Error
                this.vars.marks = App.languageDict.attributes.Error
            } else {
                this.vars.status = filterInt(sstatus[index][totalattempt[index]])
                this.vars.marks = sr[index][totalattempt[index]]
                this.vars.lastAttempt = totalattempt[index]
                if (sstatus[index].length > 1) {
                    this.vars.lastAttemptStatus = App.languageDict.attributes.Attempted;
                }
                if ((sr[index] instanceof Array) && (sr[index][totalattempt[index]] != 'undefined')) {
                    this.vars.lastAttemptStatus = App.languageDict.attributes.UnReviewed;
                    if ((sstatus[index] instanceof Array) && (sstatus[index][totalattempt[index]] != 'undefined') && (sstatus[index][totalattempt[index]] != null)) {
                        this.vars.lastAttemptStatus = App.languageDict.attributes.Reviewed;
                    }
                }
                this.vars.lastAttemptsMarks = sr[index][totalattempt[index]]
                this.vars.index = index
            }
            var attachmentNames = new Array()
            var attachmentURLs = new Array()
            if(model.get('_attachments')) {
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
            var context = this
            var memId = $.cookie('Member._id')
            var couId = this.collection.first().get("courseId")
            var MemberCourseProgress = new PouchDB('membercourseprogress');
            MemberCourseProgress.query({map:function(doc){
                if(doc.memberId && doc.courseId){
                    emit([doc.memberId,doc.courseId],doc)
                }
            }},
            {key:[memId,couId]},
            function(err,res){
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

        renderaccordian:function(model) {
            var context = this
            context.modl = model
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
