$(function () {

    App.Views.ListCollectionView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #formButton": "setForm",
            "submit form": "setFormFromEnterKey",
            "click #cancelButton": "hidediv",

        },
        hidediv: function () {
            $('#invitationdiv').fadeOut(1000)
            document.getElementById('cont').style.opacity = 1.0
            document.getElementById('nav').style.opacity = 1.0
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        },
        render: function () {
            var inviteForm = this
            
		    this.form = new Backbone.Form({
                    model: inviteForm.model
                })
                this.$el.append(this.form.render().el)
                var $button = $('<a class="btn btn-success" id="formButton">Save</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-danger" id="cancelButton">Cancel</button>')
            
            
          
            
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setForm: function () {

            // Put the form's input into the model in memory
            this.form.commit()
            if (this.model.get('NesttedUnder') == '--Select--') {
                $('.form .field-Collection select').append('<option>' + this.model.get('CollectionName') + '</option>')
                this.model.save()

            } else {
                if ($('.form .field-Collection select optgroup[label=' + this.model.get("NesttedUnder") + "]") != null) {
                    $('.form .field-Collection select optgroup[label=' + this.model.get("NesttedUnder") + "]").append('<option>' + this.model.get('CollectionName') + '</option>');
                    this.model.save()
                }
            }
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