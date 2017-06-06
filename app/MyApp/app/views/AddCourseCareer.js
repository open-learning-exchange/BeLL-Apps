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
            var courseCareerTitle = $('#careerPath').val()
            var savecoursecareer = new App.Models.CoursecareerPath()
            savecoursecareer.set('CoursePathName',courseCareerTitle);
            savecoursecareer.set('Courses',selectedCourseName);
            savecoursecareer.set('CourseIds',selectedCourseId);
            savecoursecareer.set('MemberID',$.cookie('Member._id'));
            savecoursecareer.save(null, {
                success: function() {
                    var coursecareer = new App.Collections.CourseCareerPath()
                    coursecareer.memberId = $.cookie('Member._id');
                    coursecareer.CoursePathName = courseCareerTitle
                    coursecareer.fetch({
                        async:false
                    });
                    console.log(coursecareer)
                    var manageCaoursecareer = new App.Views.ManageCourseCareer({
                        collection:coursecareer
                    });
                    manageCaoursecareer.render()

                        $('#ManageCourseCareer').append(manageCaoursecareer.el)
                        Backbone.history.navigate('courseCareerPath/add', {
                            trigger: true
                        })
                }


            });
              
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
            console.log(courseCareers)
            this.vars.careerList = [];
            for(var i = 0; i < (courseCareers.length); i++) {
                if(courseCareers.models[i].attributes._id !== "_design/bell"){
                    this.vars.careerList.push(courseCareers.models[i].attributes);
                }
            }
            console.log(this.vars.careerList)
            this.vars.Courselist = arrcourses
            this.vars.Courseid = arrCourseIds
            this.vars.Course_Length = this.collection.models.length-1
            this.$el.html(_.template(this.template,this.vars))
        },
    })

})
