$(function() {

    App.Views.NationApplicationView = Backbone.View.extend({

        className: "addNation-form",
        vars: {},
        events: {
            "click #formButton": "setForm"
        },
        render: function() {
            var formHeader = $('<h3> Nation Application Form </h3><br>');
            this.$el.append(formHeader);
            this.form = new Backbone.Form({
                model: this.model
            });
            //            this.form.render();
            this.$el.append(this.form.render().el);
            // hide the 'decision' and 'submitted by' subschemas from rendering when form has not been submitted
            this.form.fields['decision'].$el.hide();
            this.form.fields['submittedBy'].$el.hide();
            var $button = $('<button class="addNation-btn btn btn-success" id="formButton">Submit</button>');
            this.$el.append($button);
        },
        turnApplicationSubmittedByDisplayOn: function() {
            this.form.fields['submittedBy'].$el.show();
        },
        turnApplicationStatusDisplayOn: function() {

            //            this.form.model.get('decision').status = "Pending Approval";
            //            $('#status').val = "Pending Decision";
            //            this.form.fields['decision'].schema.subSchema.status = 'pending';
            this.form.fields['decision'].$el.show();
            //            $('input[name=status]').val('Pending approval');
        },
        makeFormSubmitButtonDisappear: function() {
            $('#formButton').hide();
        },
        setForm: function() {
            var errors = this.form.commit({
                validate: true
            });
            if (errors) {
                return;
            }
            // set user's id into the form
            this.form.model.get('submittedBy').memberId = $.cookie('Member._id');
            var date = new Date();
            this.form.model.get('submittedBy').date = date;
            this.form.model.get('decision').status = "Pending approval";
            this.model.save(null, {
                success: function(model, response) {
                    console.log("success");
                    alert("Your application has been submitted successfully");
                    //                    Backbone.history.navigate('nations', {trigger: true});
                },
                error: function(model, response) {
                    console.log("error");
                }
            });
        }
    })
})