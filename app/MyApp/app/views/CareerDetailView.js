$(function() {

    App.Views.CareerDetailView = Backbone.View.extend({
        template: $('#template-CareerDetailView').html(),
        vars: {},
        events: {
        },
        
        initialize: function() {
        },

        render: function (){
            var vars = this.model
            console.log(vars)
            vars.viewCourse=App.languageDict.attributes.View+' '+App.languageDict.attributes.Course;
            vars.progress=App.languageDict.attributes.Progress;
            var courseLeader = vars.attributes.courseLeader
            for(var i = 0; i < courseLeader.length; i++) {
                var memberModel = new App.Models.Member()
                    _id: courseLeader[i];
                memberModel.fetch({
                    async: false
                });
            }
            console.log(memberModel)
            var roles = memberModel.attributes.roles
            console.log(roles)
            if (vars.attributes.courseLeader != undefined) {
                if (vars.attributes.courseLeader.indexOf($.cookie('Member._id')) > -1 ) {
                    vars.link = "#creditsDetails/" + vars._id;
                    vars.isLeader = 1;
                } else {
                    vars.isLeader = 0;
                }
            }else {
                vars.isLeader = 0;
            }
            if (roles.indexOf("Manager") != -1 || vars.isLeader!=0 ) {
                    vars.viewProgress = 1
            } else {
                vars.viewProgress = 0
            }
            if (roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1;
                vars.link = "#creditsDetails/" + vars._id;
            } else {
                vars.isAdmin = 0;
                vars.showCreditButton =false;
            }


            vars.viewProgress = true;
            vars.isAdmin = 0
            vars.isLeader = 0
            vars.courseId=vars.id;
            vars.CourseTitle = vars.attributes.CourseTitle
            vars.showCreditButton = true;
            vars.link = "#creditsDetails/" + vars._id;
            vars.viewProgress = 0
            this.$el.append(_.template(this.template, vars));
        }

    })

})
