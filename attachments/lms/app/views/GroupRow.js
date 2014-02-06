$(function () {

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
            var vars = this.model.toJSON()
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

    })

})