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
            vars.CourseTitle = vars.attributes.Courses
            vars.CourseIds = vars.attributes.CourseIds
            vars.viewCourse=App.languageDict.attributes.View+' '+App.languageDict.attributes.Course;
            vars.progress=App.languageDict.attributes.Progress;
            var mem = vars.attributes.MemberID;
            var memberModel = new App.Models.Member({
                _id: mem
            })
            memberModel.fetch({
                async: false
            });
            var roles = memberModel.attributes.roles
            if (roles.indexOf("Manager") != -1 || vars.isLeader!=0  || memberModel.indexOf($.cookie('Member._id'))!=-1) {
                    vars.viewProgress = 1
            } else {
                vars.viewProgress = 0
            }
            if (roles.indexOf("Manager") != -1) {
                vars.isAdmin = 1;
            } else {
                vars.isAdmin = 0;
                vars.showCreditButton =false;
            }
            vars.showCreditButton = true;
            this.$el.append(_.template(this.template, vars));
        }

    })

})
