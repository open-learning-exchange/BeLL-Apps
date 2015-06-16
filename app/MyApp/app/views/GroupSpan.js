$(function() {

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

})