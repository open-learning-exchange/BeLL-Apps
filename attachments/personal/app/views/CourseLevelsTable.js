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
                            var pending=[]
                           pending= member.get("pendingReviews")
                           pending.push(resid)
                		   member.set("pendingReviews",pending)
                		   member.save()
                	console.log(member.get("pendingReviews"))     
                ratingModel = new App.Models.Feedback()
                ratingModel.set('resourceId', resid)
                ratingModel.set('memberId', $.cookie('Member._id'))
                ratingView = new App.Views.FeedbackForm({
                    model: ratingModel,resId:resid
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

            }
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
            this.vars = model.toJSON()
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