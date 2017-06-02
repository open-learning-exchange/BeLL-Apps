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
            var levelname = $('#level').val()
            var coursetitle = $('#LCourse').val()
            var arrcourseId = []
            for(var i = 0; i <this.collection.models.length; i++){
                if(coursetitle === this.collection.models[i].attributes.CourseTitle){
                    var courseid = this.collection.models[i].attributes._id
                    arrcourseId.push(courseid)
                }
            }
            var savecoursecareer = new App.Models.CoursecareerPath()
                savecoursecareer.set('Level_Name',levelname);
                savecoursecareer.set('Courses',coursetitle);
                savecoursecareer.set('CourseIds',arrcourseId);
                savecoursecareer.set('MemberID',$.cookie('Member._id'));
                savecoursecareer.save(null, {
                    error: function() {
                        console.log("Not Saved")
                    }
                });
                location.reload();
        },

        render: function() {
            console.log(this.collection.models)
            var arrcourses = []
            for(var i = 0; i <this.collection.models.length; i++){
                var courseslist = this.collection.models[i].attributes.CourseTitle
                console.log(courseslist)
                arrcourses.push(courseslist)
            }
            this.$el.find('.multipleCourse').append('<div class="btn btn-info" id="finishPressed">'+App.languageDict.attributes.Finish+'</div>&nbsp&nbsp');
            this.vars.Courselist = arrcourses
            this.vars.Course_Length = this.collection.models.length
            this.$el.html(_.template(this.template,this.vars))
        },


    })

})
