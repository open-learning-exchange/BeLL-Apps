$(function() {

    App.Views.AddCourseCareer = Backbone.View.extend({
        template: $('#template-addCourseCareer').html(),
        vars: {},
        events: {
        },

        "click #AddCareerPath": function(e) {
            this.saveCareerPath();
         },
        "click #CancelCOursePath": function(e) {
            this.saveCareerPath();
         },
        initialize: function() {
            
        },

        saveCareerPath: function(){
            alert("What's up");
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
