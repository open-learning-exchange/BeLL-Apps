$(function () {

    App.Views.CourseRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {
            "click .destroy": function (e) {
                e.preventDefault()
                var cId = this.model.get("_id")
                var clevels = new App.Collections.CourseLevels()
                var model
                if (confirm(App.languageDict.attributes.Confirm_Course)) {
                clevels.courseId = cId
                clevels.fetch({
                    success: function () {
                        while (model = clevels.first()) {
                            model.destroy();
                        }
                    }
                })
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
                }
            },
            "click .browse": function (e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-CourseRow").html(),

        initialize: function (e) {
            this.roles = e.roles
        },

        render: function () {
            var vars = this.model.toJSON();
            vars.manage=App.languageDict.attributes.Manage;
            vars.viewCourse=App.languageDict.attributes.View+' '+App.languageDict.attributes.Course;
            vars.progress=App.languageDict.attributes.Progress;
            vars.deleteLabel=App.languageDict.attributes.DeleteLabel;
            vars.showOpenButton = true;
            if(this.courseId==null) {
                vars.courseId=this.courseId
                if(vars._id=='_design/bell')
                    return
                if(!vars.members) {
                    vars.members = new Array()
                }
                vars.link = "#badgesDetails/"+ vars._id;
                if (vars.courseLeader != undefined) {
                    if (vars.courseLeader.indexOf($.cookie('Member._id')) > -1 ) {
                        vars.link = "#creditsDetails/" + vars._id;
                        vars.isLeader = 1;
                    } else {
                        vars.isLeader = 0;
                    }
                } else {
                    vars.isLeader = 0;
                }
                if (this.roles.indexOf("Manager") != -1 || vars.isLeader!=0 || vars.members.indexOf($.cookie('Member._id'))!=-1) {
                    vars.viewProgress = 1
                } else {
                    vars.viewProgress = 0
                }
                if (this.roles.indexOf("Manager") != -1) {
                    vars.isAdmin = 1;
                    vars.link = "#creditsDetails/" + vars._id;
                    if(vars.members.indexOf($.cookie('Member._id')) < 0) {
                        vars.showOpenButton = false;
                    }
                } else {
                    vars.isAdmin = 0;
                }
                this.$el.append(_.template(this.template, vars))
            } else {
                vars.viewProgress = 0
                vars.isAdmin = 0
                vars.isLeader = 0
                vars.courseId=this.courseId;
                this.$el.append(_.template(this.template, vars))
            }
        }
    })
})