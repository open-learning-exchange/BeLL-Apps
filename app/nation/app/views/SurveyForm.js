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

                vars.header = 'New Survey'

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            });
            vars.form = "";
            vars.rlength = this.rlength;
          //  this.form.render();
            //this.form.render().el;
            this.$el.html(this.template(vars));
           // this.form.render();
            this.$el.find('.fields').append(this.form.render().el);
          //  $('.fields').html(this.form.render().el);
//            $('.fields').html(this.form.el);
            $('.form .field-resources').hide();
          //  $('#progressImage').hide();

            return this;
        },

        saveForm: function() {
            var languageDictValue=App.Router.loadLanguageDocs();
            alert(languageDictValue.attributes.Functionality_Under_Construction);
            //The following code is necessary, so please do not play with it.
            /*var isEdit = this.model.get("_id")
            var addtoDb = true
            this.form.commit()
            if (this.model.get("SurveyNo") == undefined) {
                alert("Survey Number is missing")
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
            }*/

        },
        statusLoading: function() {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})