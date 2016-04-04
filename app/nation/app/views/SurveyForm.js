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

            vars.header = App.languageDictValue.get('New_Survey');
            vars.languageDict=App.languageDictValue;            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            });
            vars.form = "";
            vars.languageDict=App.languageDictValue;
            vars.rlength = this.rlength;
            this.$el.html(this.template(vars));
            this.$el.find('.fields').append(this.form.render().el);
            $('.form .field-resources').hide();

            return this;
        },

        saveForm: function() {
            var isEdit = this.model.get("_id")
            var addtoDb = true
            this.form.commit()
            if (this.model.get("SurveyNo") == undefined) {
                alert(App.languageDictValue.get('missing_surveyNo'));
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allsurv = new App.Collections.Surveys();
                    allsurv.fetch({
                        async: false
                    })
                    allsurv.each(function(m) {
                        if (that.model.get("SurveyNo") == m.get("SurveyNo")) {
                            alert(App.languageDictValue.get('duplicate_surveyNo'));
                            addtoDb = false
                        }
                    })
                }

                if (addtoDb) {
                    this.form.commit()
                    this.model.save(null, {
                        success: function(e) {
                            alert(App.languageDictValue.get('survey_Saved_Successfully'));
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