$(function() {

    App.Views.GroupRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {
            "click .addtoPublication": "addtoPublication",
            "click .browse": function(e) {

            }
        },

        template: $("#template-GroupRow").html(),

        initialize: function(e) {
            this.roles = e.roles
        },

        render: function() {

            var vars = this.model.toJSON()

            if (vars._id == '_design/bell')
                return

            this.$el.append(_.template(this.template, vars))


        },
        addtoPublication: function(e) {
            var courseId = e.currentTarget.name
            var publication = new App.Models.Publication({
                _id: this.publicationId
            })
            publication.fetch({
                success: function(response) {
                    courses = response.get('courses');
                    if (courses == undefined) {
                        courses = []
                    }
                    for (var j in courses) {
                        if (courses[j]['courseID'] === courseId) { // if courseId matches with id of an already added course's id, return
                            alert(App.languageDict.attributes.Duplicate_Course_In_Pub);
                            return;
                        }
                    }
                    //                         if(courses.indexOf(courseId)!=-1){
                    //                            alert("This Course Already Exists In This Publication")
                    //                            return
                    //                         }
                    // add the courseId, the course-step-Ids, and the resourceIds of resources referenced in those course-steps
                    // courseId: we already have. so fetch course-tep-Ids now
                    var fullCourseRef = {};
                    fullCourseRef['courseID'] = courseId;
                    fullCourseRef['stepIDs'] = [];
                    var courseSteps = new App.Collections.CourseLevels();
                    courseSteps.groupId = courseId;
                    courseSteps.fetch({
                        success: function(resp, responseInfo) {
                            courseSteps.each(function(courseStep) { // is array.each a javascript construct?
                                var courseStepSingle = {
                                    'stepID': courseStep.get('_id')
                                };
                                courseStepSingle['resourceIDs'] = ((courseStep.get('resourceId').length > 0) ? courseStep.get('resourceId') : []); // courseSteps[i].resourceId refers to an array of resourceIds
                                fullCourseRef['stepIDs'].push(courseStepSingle);
                            });
                            courses.push(fullCourseRef);
                            response.set({
                                "courses": courses
                            });
                            response.save(null, { // should this save call happen inside or outside coursesteps.fetch()?
                                success: function() {
                                    alert(App.languageDict.attributes.Added_Success);
                                }
                            });
                        },
                        error: function(err) {
                            console.log(err);
                            alert(App.languageDict.attributes.AddCourse_To_pubs_Failed);
                        }
                    });
                    //					 courses.push(courseId)
                    //					 response.set({"courses":courses})
                    //					 response.save(null,{success:function(){
                    //					        alert("Added Successfully")
                    //						 }})
                }
            });
        }
    })
})