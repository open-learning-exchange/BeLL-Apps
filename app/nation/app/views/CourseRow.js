$(function() {

    App.Views.CourseRow = Backbone.View.extend({

        tagName: "tr",
        roles: null,
        events: {
            "click .addtoPublication": "addtoPublication",
            "click .browse": function(e) {
            }
        },

        template: $("#template-CourseRow").html(),

        initialize: function(e) {
            this.roles = e.roles
        },

        render: function() {
            var vars = this.model.toJSON();
            vars.languageDict=App.languageDictValue;
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
                            alert(App.languageDictValue.attributes.Duplicate_Course_In_Pub);
                            return;
                        }
                    }
                    // add the courseId, the course-step-Ids, and the resourceIds of resources referenced in those course-steps
                    // courseId: we already have. so fetch course-tep-Ids now
                    var fullCourseRef = {};
                    fullCourseRef['courseID'] = courseId;
                    fullCourseRef['stepIDs'] = [];
                    var courseSteps = new App.Collections.CourseLevels();
                    courseSteps.courseId = courseId;
                    courseSteps.fetch({
                        success: function(resp, responseInfo) {
                            courseSteps.each(function(courseStep) { // is array.each a javascript construct?
                                var courseStepSingle = {
                                    'stepID': courseStep.get('_id')
                                };
                                courseStepSingle['questionIDs'] = ((courseStep.get('questionslist').length > 0) ? courseStep.get('questionslist') : []); // courseSteps[i].questionIDs refers to an array of questionIDs
                                courseStepSingle['resourceIDs'] = ((courseStep.get('resourceId').length > 0) ? courseStep.get('resourceId') : []); // courseSteps[i].resourceId refers to an array of resourceIds
                                fullCourseRef['stepIDs'].push(courseStepSingle);
                            });
                            courses.push(fullCourseRef);
                            response.set({
                                "courses": courses
                            });
                            response.save(null, { // should this save call happen inside or outside coursesteps.fetch()?
                                success: function() {
                                    alert(App.languageDictValue.attributes.Added_Success);
                                }
                            });
                        },
                        error: function(err) {
                            console.log(err);
                            alert(App.languageDictValue.attributes.AddCourse_To_pubs_Failed);
                        }
                    });
                }
            });
        }
    })
})