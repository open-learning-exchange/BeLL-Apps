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

                    courses = response.get('courses')
                    if (courses == undefined) {
                        courses = []
                    }
                    if (courses.indexOf(courseId) != -1) {
                        alert("This Course Already Exists In This Publication")
                        return
                    }

                    courses.push(courseId)

                    response.set({
                        "courses": courses
                    })
                    response.save(null, {
                        success: function() {
                            alert("Added Successfully")
                        }
                    })

                }
            })


        }

    })

})