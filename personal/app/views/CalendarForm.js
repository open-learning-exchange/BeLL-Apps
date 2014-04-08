$(function () {

    App.Views.CalendarForm = Backbone.View.extend({
        className: "signup-form",
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            // create the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)

            // give the form a submit button
            var $button
            if (this.update) {
                $button = $('<div class="signup-submit"><a class="addEvent-btn btn btn-success" id="formButton">Update Event</button></div>')
            } else {
                $button = $('<div class="signup-submit"><a class="addEvent-btn btn btn-success" id="formButton">Add Event</button></div>')
            }
            this.$el.append($button)
        },
        setForm: function () {
            var that = this
            this.model.once('sync', function () {
                that.trigger('CalendarForm:done')
            })
            this.form.setValue('userId', $.cookie('Member._id'))
            if (this.form.validate() == null) {
                this.form.commit()
                this.model.save()
                if (this.update) {
                    alert("Event Successfully Updated!!!")
                } else {
                    alert("Event Successfully Created!!!")
                }
                Backbone.history.navigate('calendar', {
                    trigger: true
                })
            }

        },
    })

})