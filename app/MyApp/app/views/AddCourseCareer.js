$(function() {

    App.Views.AddCourseCareer = Backbone.View.extend({
        template: $('#template-addCourseCareer').html(),
        vars: {},
        searchText: "",
        events: {
            "click .Search": function(e) {
             this.renderTable($('#searchText').val().toLowerCase())
            },
            "click #buttonCareer": function(){
                alert('Hello')
            },
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
        renderTable: function(searchText) {
            App.startActivityIndicator()
            var that = this
            var career = new App.Collections.CourseCareerPath()
            career.CoursePathName = searchText
            career.fetch({
                success: function(response){
                    var careerTable = new App.Views.AddCourseCareer({
                        collection: response
                    })
                    $(".btable").append("<tr><td>"+career.models[0].attributes.CoursePathName+"</td><td><ul><li>"+career.models[0].attributes.Courses+"</ul></li></td><td></td></tr>")
                    App.stopActivityIndicator()
                },

                error: function() {
                    App.stopActivityIndicator()
                }
            })
            console.log(career)

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
                console.log(courseCareer)
                $('#LCourse option:selected').each(function(){
                    if ($(this).length) {
                        selectedCourseId.push($(this).val());
                        selectedCourseName.push($(this).text());
                    }
                });
                var courseCareerTitle = $('#careerPath').val()
                courseCareer.set('CareerPathName',courseCareerTitle);
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
             var selectedCareerIds = []
            $('#LCareer option:selected').each(function(){
                    if ($(this).length) {
                        selectedCareerIds.push($(this).val());
                    }
                });
            savecoursecareer.set('requiredCareerPathIds',selectedCareerIds);
                savecoursecareer.save(null, {
                    error: function() {
                        console.log("Not Saved")
                    }
                });
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
            ////PushRequired ID
            this.vars.CareerList = [];
            this.vars.careerListIds = [];
            for(var j = 1; j< courseCareers.length; j++){
                    this.vars.CareerList.push(courseCareers.models[j].attributes.CoursePathName);
                    this.vars.careerListIds.push(courseCareers.models[j].attributes._id);

            }
            this.vars.careerlength =courseCareers.length-2
            this.$el.html(_.template(this.template,this.vars))
        },
    })

})
