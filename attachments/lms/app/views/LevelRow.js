$(function () {

    App.Views.LevelRow = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .destroyStep": function (e) {
                this.trigger('levelDeleted')
                e.preventDefault()
                var that = this
                var courses = new App.Collections.StepResultsbyCourse()
                courses.courseId = this.model.get("courseId")
                courses.fetch({
                    success: function () {
                        courses.each(function (m) {
                            var stepids = m.get("stepsIds")
                            var stepres = m.get("stepsResult")
                            var stepstatus = m.get("stepsStatus")
                            var index = stepids.indexOf(that.model.get("_id"))
                            stepids.splice(index, 1)
                            stepres.splice(index, 1)
                            stepstatus.splice(index, 1)
                            m.set("stepsIds", stepids)
                            m.set("stepsResult", stepres)
                            m.set("stepsStatus", stepstatus)

                            console.log(m.toJSON())
                            m.save({
                                success: function () {
                                    console.log("Model Updated")
                                }
                            })
                        })
                    }
                })
                this.model.destroy()
                this.remove()

            },
            "click .browse": function (e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-LevelRow").html(),

        initialize: function () {
            //this.model.on('destroy', this.remove, this)
        },

        render: function () {
            var vars = this.model.toJSON()
            this.$el.append(_.template(this.template, vars))
        }

    })

})