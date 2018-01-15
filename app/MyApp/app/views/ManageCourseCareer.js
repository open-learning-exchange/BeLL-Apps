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
               alert('saved')
            },
        },

        initialize: function() {},
        saveMultipelCareer:function(){
            var selectedCareerIds = []
            $('#LCourse option:selected').each(function(){ 
                if ($(this).length) {
                    selectedCareerIds.push($(this).val());
                }
            });
            var courseCareer = new App.Models.CoursecareerPath({
                _id : this.model.attributes._id
            })
            courseCareer.fetch({
                async: false
            });
            courseCareer.set('requiredCareerPathIds',selectedCareerIds);
            courseCareer.save(null, {
                error: function() {
                    console.log("Not Saved")
                }
            });
            location.reload()
        },
        render: function() {
            var multiplecareer = new App.Collections.CourseCareerPath();
            multiplecareer.fetch({
                async: false
            });
            this.vars.careerList = [];
            this.vars.careerListIds = [];
            for(var i = 1; i< multiplecareer.length; i++){
                if(multiplecareer.models[i].attributes._id != this.model.get('_id') ){
                    this.vars.careerList.push(multiplecareer.models[i].attributes.CoursePathName);
                    this.vars.careerListIds.push(multiplecareer.models[i].attributes._id);
                } 
            }
            $('#careerPathList').hide()
            this.vars.careerlength = multiplecareer.length-2
            this.vars.CourseCareerName = this.model.get('CorsePathName');
            this.vars.CouseLists = this.model.get('Courses');
            this.$el.html(_.template(this.template,this.vars))
        },
    })

})
