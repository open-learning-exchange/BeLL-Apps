$(function() {

    App.Views.AddCourseCareer = Backbone.View.extend({
        template: $('#template-addCourseCareer').html(),
        vars: {},
        events: {
            "click #AddCareerPath": function() {
               this.saveCareerPath();  
            },
            "click #CancelCOursePath": function(e) {
                this.saveCareerPath();
            },
        },

        initialize: function() {
            
        },

        saveCareerPath: function(){
            var selectedCourseId = []
            var selectedCourseName = []
            $('#LCourse option:selected').each(function(){ 
                if ($(this).length) {
                    selectedCourseId.push($(this).val());
                    selectedCourseName.push($(this).text());
                }
            });
            console.log(selectedCourseId, selectedCourseName)
            var levelname = $('#levelSelect').val()
            var courseCareerTitle = $('#careerPath').val()
            var savecoursecareer = new App.Models.CoursecareerPath()
            savecoursecareer.set('Level_Name',levelname);
            savecoursecareer.set('CoursePathName',courseCareerTitle);
            savecoursecareer.set('Courses',selectedCourseName);
            savecoursecareer.set('CourseIds',selectedCourseId);
            savecoursecareer.set('MemberID',$.cookie('Member._id'));
            savecoursecareer.save(null, {
                error: function() {
                    console.log("Not Saved")
                }
            });
                //location.reload();
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
            for(var i = 0; i < (courseCareers.length -1 ); i++) {
                this.vars.careerList.push(courseCareers.models[i].attributes);
            }
            this.vars.Courselist = arrcourses
            this.vars.Courseid = arrCourseIds
            this.vars.Course_Length = this.collection.models.length-1
            $el.html(_.template(this.template,this.vars))
        },
    })

})
