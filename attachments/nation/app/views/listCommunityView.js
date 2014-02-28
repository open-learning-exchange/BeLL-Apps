$(function () {

    App.Views.listCommunityView = Backbone.View.extend({

        id: "invitationForm",

        events: {
            "click #cancelButton": "hidediv",
            "click #formButton":"syncData"
        },
        hidediv: function () {
            $('#invitationdiv').fadeOut(1000)
            
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        },
        render: function () {
                
                var $button = $('<h6>Select Community(\'ies)</h6><select multiple id="comselect"></select><br><br><a class="btn btn-success" id="formButton">Send</button>')
                this.$el.append($button)
                this.$el.append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                this.$el.append('<a class="btn btn-warning" id="cancelButton">Cancel</button>')
        },
        syncData: function(){

        	alert("Sending data")
        	$('#invitationdiv').fadeOut(1000)
            setTimeout(function () {
                $('#invitationdiv').hide()
            }, 1000);
        }
    })

})