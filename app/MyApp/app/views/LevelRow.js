$(function() {

    App.Views.LevelRow = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .destroyStep": function(e) {
                var that = this
                var courses = new App.Collections.StepResultsbyCourse()
                courses.courseId = this.model.get("courseId")
                courses.fetch({
                    success: function() {
                        courses.each(function(m) {
                            var stepids = m.get("stepsIds")
                            var stepres = m.get("stepsResult")
                            var stepstatus = m.get("stepsStatus")
                            var sattempts = [];
                            if(m.get("pqAttempts")){
                                sattempts = m.get("pqAttempts")
                            }
                            var index = stepids.indexOf(that.model.get("_id"))
                            stepids.splice(index, 1)
                            stepres.splice(index, 1)
                            stepstatus.splice(index, 1)
                            if(sattempts.length > 0) {
                                sattempts.splice(index, 1)
                            }
                            m.set("stepsIds", stepids)
                            m.set("stepsResult", stepres)
                            m.set("stepsStatus", stepstatus)
                            if( m.get("pqAttempts")) {
                                m.set("pqAttempts", sattempts)
                            }
                            m.save({
                                success: function() {

                                }
                            })
                        })
                    }
                })
                this.model.destroy()
                this.remove()
                this.trigger('levelDeleted')

            },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        template: $("#template-LevelRow").html(),

        initialize: function() {
            //this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON();
            vars.languageDict=App.languageDict;
            this.$el.append(_.template(this.template, vars))
        }

    })

})