$(function () {

    App.Views.ListCollectionView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv",

        },

        title: null,
        entityId: null,
        type: null,
        senderId: null,
        
        hidediv: function () {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        },
        SetParams: function (ti, e, t, s) {
            this.title = ti
            this.entityId = e
            this.type = t
            this.senderId = s

        },
        render: function () {

            //members is required for the form's members field
            console.log(this.model)
            var members = new App.Collections.Members()
            var that = this
            var inviteForm = this
            inviteForm.on('InvitationForm:MembersReady', function () {
            
                
                // create the form
                this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                // give the form a submit button
                var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">Cancel</button>')
            })

            // Get the group ready to process the form
            members.once('sync', function () {
                inviteForm.trigger('InvitationForm:MembersReady')

            })
            members.fetch()
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function () {
            
            // Put the form's input into the model in memory
            this.form.commit()
            console.log(this.model.toJSON())
            $('.form .field-Collection select').append('<option>'+this.model.get('CollectionName')+'</option>');
            this.model.save()
            $('#invitationdiv').fadeOut(1000)
            alert("Collection Saved Successfully")
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);

        },


    })

})