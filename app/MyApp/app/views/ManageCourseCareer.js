$(function() {

    App.Views.ManageCourseCareer = Backbone.View.extend({
        template: $('#template-careerPathManage').html(),
        vars: {},
        events: {
            "click #requiredCareer":function(){
                $('#careerPathList').show()
            },
            "click #AddMultipleCareerPath":function(){
               this.saveMultipelCareer()
            },
        },

        initialize: function() {
            
        },

        saveMultipelCareer:function(){
            var selectedCourseName = []
            $('#LCourse option:selected').each(function(){ 
                if ($(this).length) {
                    selectedCourseName.push($(this).val());
                }
            });
            var multiplecareer = new App.Collections.CourseCareerPath();
            multiplecareer.fetch({
                async: false
            });
            console.log(selectedCourseName)
            console.log(multiplecareer)
            var arrcoursename = []
           /* for(var i =0; i <multiplecareer.length; i++ ){
                for (var j =0; j<selectedCourseName.length; i++){
                    var coursesname = multiplecareer.models[i].attributes._id
                    arrcoursename.push(coursesname)
                }
                
            }*/
            console.log(arrcoursename)
        },
        render: function() {
            console.log(this.model.get('_id'))
            var multiplecareer = new App.Collections.CourseCareerPath();
            multiplecareer.fetch({
                async: false
            });
            this.vars.careerList = [];
            for(var i = 1; i< multiplecareer.length; i++){
                if(multiplecareer.models[i].attributes._id != this.model.get('_id') ){
                    this.vars.careerList.push(multiplecareer.models[i].attributes.CoursePathName);
                } 
            }
            $('#careerPathList').hide()
            this.vars.careerlength = multiplecareer.length-2
            this.vars.CourseCareerName = this.model.get('CoursePathName');
            this.vars.CouseLists = this.model.get('Courses');
            console.log(this.model.get('CoursePathName'))
            this.$el.html(_.template(this.template,this.vars))
        },
    })

})
