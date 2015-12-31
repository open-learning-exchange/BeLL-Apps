$(function() {

    App.Views.SurveyForm = Backbone.View.extend({

        className: "form",
        events: {
            "click .save": "saveForm",
            "click #cancel": function() {
                window.location.href = '#survey'
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function() {

            var vars = {}

                vars.header = 'Survey No. will be here'

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            vars.form = ""
            //vars.rlength = this.rlength
            this.form.render()
            this.$el.html(this.template(vars))

            $('.fields').html(this.form.el)
            $('.form .field-resources').hide();
            $('#progressImage').hide();

            return this
        },

        saveForm: function() {
            var isEdit = this.model.get("_id")
            var addtoDb = true
            this.form.commit()
            if (this.model.get("IssueNo") == undefined) {
                alert("Publication Issue is missing")
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allsurv = new App.Collections.Surveys();
                    allsurv.fetch({
                        async: false
                    })
                    allsurv.each(function(m) {
                        if (that.model.get("SurveyNo") == m.get("SurveyNo")) {
                            alert("SurveyNo already exist")
                            addtoDb = false
                        }
                    })
                }

                if (addtoDb) {
                    this.form.commit()
                    this.model.save(null, {
                        success: function(e) {
                            alert("Survey Saved!")
                            window.location.href = '#surveydetail/' + e.toJSON().id;
                        }
                    })
                }
            }

        },
        statusLoading: function() {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})