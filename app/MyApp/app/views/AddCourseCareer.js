$(function() {

    App.Views.AddCourseCareer = Backbone.View.extend({
        template: $('#template-addCourseCareer').html(),
        vars: {},
        events: {
            "click #AddCareerPath": function() {
               this.saveCareerPath();  
            },
            "click #CancelCoursePath": function(e) {
            },
            "click #Delete": function(e) {
                var a = $(e.target).attr('data-id')
                var career = new App.Models.CoursecareerPath({
                    _id: a
                })
                career.fetch({
                    async: false
                })
                career.destroy()
                alert(App.languageDict.attributes.Selected);
                location.reload();
            },
            "click #careerEdit": function(e) {
                var currentId = $(e.target).attr("data-id");
                $('#AddCareerPath').hide();
                var courseCareer = new App.Models.CoursecareerPath({
                    _id : currentId
                })
                courseCareer.fetch({
                    async: false
                });
                $('#careerPath').val(courseCareer.attributes.CoursePathName);
                $('#UpdateCareerPath').css('display','');
                $('#UpdateCareerPath').attr('data-id',currentId);
                console.log($('#UpdateCareerPath').attr('data-id'))
            },
            "click #UpdateCareerPath": function(e) {
                this.saveCareerPath($('#UpdateCareerPath').attr('data-id'));
            },
        },

        initialize: function() {
            
        },

        saveCareerPath: function(previousId){
            var selectedCourseId = []
            var selectedCourseName = []
            if(previousId){
                var courseCareer = new App.Models.CoursecareerPath({
                    _id : previousId
                })
                courseCareer.fetch({
                    async: false
                });
                $('#LCourse option:selected').each(function(){
                    if ($(this).length) {
                        selectedCourseId.push($(this).val());
                        selectedCourseName.push($(this).text());
                    }
                });
                var courseCareerTitle = $('#careerPath').val()
                courseCareer.set('CoursePathName',courseCareerTitle);
                courseCareer.set('Courses',selectedCourseName);
                courseCareer.set('CourseIds',selectedCourseId);
                courseCareer.set('MemberID',$.cookie('Member._id'));
                courseCareer.save(null, {
                    error: function() {
                        console.log("Not Saved")
                    }
                })
                location.reload();
            } else {
            $('#LCourse option:selected').each(function(){ 
                if ($(this).length) {
                    selectedCourseId.push($(this).val());
                    selectedCourseName.push($(this).text());
                }
            });
            var courseCareerTitle = $('#careerPath').val()
            var savecoursecareer = new App.Models.CoursecareerPath()
            savecoursecareer.set('CoursePathName',courseCareerTitle);
            savecoursecareer.set('Courses',selectedCourseName);
            savecoursecareer.set('CourseIds',selectedCourseId);
            savecoursecareer.set('MemberID',$.cookie('Member._id'));
            savecoursecareer.save(null, {
                error: function() {
                    console.log("Not Saved")
                }
            })
        }
        },


        render: function() {
            var arrcourses = []
            var arrCourseIds = []
            for(var i = 0; i <this.collection.models.length-1; i++){
                var courseslist = this.collection.models[i].attributes.CourseTitle
                var courseId = this.collection.models[i].attributes._id
                arrcourses.push(courseslist)
                arrCourseIds.push(courseId)
            }
            var courseCareers = new App.Collections.CourseCareerPath()
            courseCareers.memberId = $.cookie('Member._id');
            courseCareers.fetch({
                async:false
            });
            this.vars.careerList = [];
            for(var i = 0; i < (courseCareers.length); i++) {
                if(courseCareers.models[i].attributes._id !== "_design/bell"){
                    this.vars.careerList.push(courseCareers.models[i].attributes);
                }
            }
            this.vars.Courselist = arrcourses
            this.vars.Courseid = arrCourseIds
            this.vars.Course_Length = this.collection.models.length-1
            this.$el.html(_.template(this.template,this.vars))
        },
    })

})
