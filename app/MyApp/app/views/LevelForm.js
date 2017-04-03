$(function() {

    App.Views.LevelForm = Backbone.View.extend({
        className: "form",
        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #retrunBack": function (e) {
                history.back()
            }
        },

        render: function() {
            // members is required for the form's members field
            var levelForm = this
            // create the form
            this.form = new Backbone.Form({
                model: levelForm.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['courseId'].$el.hide()
            this.form.fields['resourceId'].$el.hide()
            this.form.fields['resourceTitles'].$el.hide()
            this.form.fields['questionslist'].$el.hide()
            this.form.fields['totalMarks'].$el.hide()
            this.form.fields['stepMethod'].$el.hide()
            this.form.fields['stepGoals'].$el.hide()


            // give the form a submit button
            var button = '';
            if(this.edit)
                button += ('<a class="btn btn-success" id="retrunBack"> ' + App.languageDict.attributes.Back + ' </button>')
            button += ('<a class="btn btn-success" id="formButton">' + App.languageDict.attributes.Save + '</button>')
            this.$el.append(button)
        },

        setFormFromEnterKey: function(event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function() {
            var that = this
            this.model.once('sync', function() {
                var id = that.model.get("id")
                var rid = that.model.get("rev")
                var title = that.model.get("title")
                // Adding a Step to all the member progress course
                if (that.edit != true) {
                    var allcrs = new App.Collections.StepResultsbyCourse()
                    allcrs.courseId = that.model.get("courseId")
                    allcrs.fetch({
                        success: function () {
                            allcrs.each(function (m) {
                                var sids = m.get("stepsIds")
                                var sresults = m.get("stepsResult")
                                var sstatus = m.get("stepsStatus")
                                var pqattempts = m.get("pqAttempts");
                                if (sids.indexOf(that.model.get("id")) < 0) {
                                    sids.push(that.model.get("id"))
                                    sresults.push("")
                                    sstatus.push("0")
                                    if (pqattempts != undefined) {
                                        pqattempts.push(0);
                                    }
                                    m.set("stepsIds", sids)
                                    m.set("stepsResult", sresults)
                                    m.set("stepsStatus", sstatus)
                                    if (pqattempts != undefined) {
                                        m.set("pqAttempts", pqattempts)
                                    }
                                    m.save()
                                }
                            })
                        }
                    })
                    location.reload()
                } else {
                    var allcrs = new App.Collections.StepResultsbyCourse()
                    allcrs.courseId = that.model.get("courseId")
                    allcrs.fetch({
                        success: function () {
                            allcrs.each(function (m) {
                                var sids = m.get("stepsIds")
                                var sresults = m.get("stepsResult")
                                var sstatus = m.get("stepsStatus")
                                var pqattempts = m.get("pqAttempts");
                                var stepIndex = sids.indexOf(that.model.get("id"))
                                sresults[stepIndex] = "";
                                sstatus[stepIndex] = '0';
                                if (pqattempts != undefined) {
                                    pqattempts[stepIndex] = 0;
                                }
                                m.set("stepsResult", sresults)
                                m.set("stepsStatus", sstatus)
                                if (pqattempts != undefined) {
                                    m.set("pqAttempts", pqattempts)
                                }
                                m.save()
                            })
                        }
                    })
                    Backbone.history.navigate('level/view/' + id + '/' + rid, {
                        trigger: true
                    })
                }
            })
            // Put the form's input into the model in memory
            this.form.commit()
            // Send the updated model to the server
            if(this.model.get("title") == undefined || $.trim(this.model.get("title"))  == "") {
                alert(App.languageDict.attributes.Title_Error)
            }
            else if (this.model.get("description") == undefined || $.trim(this.model.get("description"))  == "") {
                alert(App.languageDict.attributes.Description_Error)
            }
             else if (isNaN(this.model.get("step"))) {
                alert(App.languageDict.attributes.InvalidStepNumber)
            } else {
                if (!this.edit) {
                    this.model.set("resourceId", [])
                    this.model.set("resourceTitles", [])
                    //Checking that level added to the user may not already exist in the data base
                } else {
                    this.model.set("resourceId", this.res)
                    this.model.set("resourceTitles", this.rest)
                    this.model.set("questionslist", this.ques1)
                }
                levels = new App.Collections.CourseLevels()
                levels.courseId = this.model.get("courseId")
                levels.fetch({
                    success: function() {
                        levels.sort()
                        var done = true
                        
                        if (that.edit) {
                            if (that.previousStep != that.model.get("step")) {
                                levels.each(function (step) {
                                    if (step.get("step") == that.model.get("step"))
                                        done = false
                                })
                            }
                        } else {
                            levels.each(function (step) {
                                if (step.get("step") == that.model.get("step")) {
                                    done = false
                                }
                            })
                        }

                        if (done)
                        {
                            that.model.set("title", $.trim(that.model.get("title")));
                            that.model.set("description", $.trim(that.model.get("description")));
                            that.model.save()
                        }
                        else
                            alert(App.languageDict.attributes.DuplicateSteps)
                    }
                })
            }

        }


    })

})