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
            var levelname = $('#levelSelect').val()
            var coursecareerpath = $('#careerPath').val()
            var res = $('input:checked[name="multiselect_LCourse"]').val()
          /*  if ($("input[name = 'LCourse[]']").val() != undefined) {
                var res = [];
                $("input[name = 'LCourse[]']:checked").each(function(index) {
                    if($(this).is(':checked')==true){
                        res.push(decodeURI($(this).val()));
                    }
                });
            }
                console.log(res)*/
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
                savecoursecareer.set('CoursePathName',coursecareerpath);
                savecoursecareer.set('Courselist',res);
                savecoursecareer.set('CourseIds',arrcourseId);
                savecoursecareer.set('MemberID',$.cookie('Member._id'));
                savecoursecareer.save(null, {
                    error: function() {
                        console.log("Not Saved")
                    }
                });
             
            location.reload();
             var Collection = new App.Collections.CourseCareerPath()
                Collection.Level_Name=this.levelname
        },

        render: function() { 
            var arrcourses = []
            for(var i = 0; i <this.collection.models.length-1; i++){
                var courseslist = this.collection.models[i].attributes.CourseTitle
                console.log(courseslist)
                arrcourses.push(courseslist)
            }
            this.vars.Courselist = arrcourses
            this.vars.Course_Length = this.collection.models.length-1
            this.$el.html(_.template(this.template,this.vars))
        },
    })

})
