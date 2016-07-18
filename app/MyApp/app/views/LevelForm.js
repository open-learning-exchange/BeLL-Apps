$(function() {

    App.Views.LevelForm = Backbone.View.extend({

        className: "form",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",

            "click #retrunBack": function(e) {
                history.back()
            },
            "click #addresources": function(e) {
                this.addResource = true
                this.setForm()
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
            this.form.fields['questions'].$el.hide()
            this.form.fields['qoptions'].$el.hide()
            this.form.fields['answers'].$el.hide()
            this.form.fields['resourceId'].$el.hide()
            this.form.fields['resourceTitles'].$el.hide()
            // give the form a submit button
            var button = ('<a class="btn btn-success" id="retrunBack"> '+App.languageDict.attributes.Back+' </button>')
            button += ('<a class="btn btn-success" id="formButton">'+App.languageDict.attributes.Save+'</button>')
            button += ('<a class="btn btn-success" id="addresources">'+App.languageDict.attributes.Add_Resource+'</button>')
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
                        success: function() {
                            allcrs.each(function(m) {
                                var sids = m.get("stepsIds")
                                var sresults = m.get("stepsResult")
                                var sstatus = m.get("stepsStatus")
                                sids.push(that.model.get("id"))
                                if(that.model.get("outComes").length == 2) {
                                    var arr = [];
                                    arr.push("0")
                                    arr.push("0")
                                    sresults.push(arr)
                                    sstatus.push(arr)

                                } else {
                                sresults.push("0")
                                sstatus.push("0")
                                }
                                m.set("stepsIds", sids)
                                m.set("stepsResult", sresults)
                                m.set("stepsStatus", sstatus)
                                m.save()
                            })
                        }
                    })
                    if (that.addResource) {
                        window.location.href = '#search-bell/' + id + '/' + rid
                    } else {
                        Backbone.history.navigate('course/manage/' + that.model.get("courseId"), {
                            trigger: true
                        })
                    }
                } else {
                    var allcrs = new App.Collections.StepResultsbyCourse()
                    allcrs.courseId = that.model.get("courseId")
                    allcrs.fetch({
                        success: function() {
                            allcrs.each(function(m) {
                                var sids = m.get("stepsIds")
                                var sresults = m.get("stepsResult")
                                var sstatus = m.get("stepsStatus")
                                var stepIndex = sids.indexOf(that.model.get("id"))
                                if(that.model.get("outComes").length == 2) {
                                    var arr = [];
                                    arr.push("0")
                                    arr.push("0")
                                    sresults[stepIndex] = arr;
                                    sstatus[stepIndex] = arr;
                                } else {
                                    sresults[stepIndex] = '0';
                                    sstatus[stepIndex] = '0';
                                }
                                m.set("stepsResult", sresults)
                                m.set("stepsStatus", sstatus)
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
            else if (this.model.get("outComes") == undefined || this.model.get("outComes").length == 0) {
                alert("Please select outcomes")
            }
             else if (isNaN(this.model.get("step"))) {
                alert(App.languageDict.attributes.InvalidStepNumber)
            } else {
                if (!this.edit) {
                    this.model.set("questions", null)
                    this.model.set("answers", null)
                    this.model.set("qoptions", null)
                    this.model.set("resourceId", [])
                    this.model.set("resourceTitles", [])
                    //Checking that level added to the user may not already exist in the data base
                } else {
                    this.model.set("questions", this.ques)
                    this.model.set("answers", this.ans)
                    this.model.set("qoptions", this.opt)
                    this.model.set("resourceId", this.res)
                    this.model.set("resourceTitles", this.rest)
                }
                levels = new App.Collections.CourseLevels()
                levels.groupId = this.model.get("courseId")
                levels.fetch({
                    success: function() {
                        levels.sort()
                        var done = true

                        if (that.edit) {
                            if (that.previousStep != that.model.get("step")) {
                                levels.each(function(step) {
                                    if (step.get("step") == that.model.get("step"))
                                        done = false
                                })
                            }
                        } else {
                            levels.each(function(step) {
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