$(function () {

    App.Views.CommunitiesList = Backbone.View.extend({

        vars: {},

        events: {
            "click #returnBack" : function (e) {
                history.back()
            },
            "change #communitySelector":"openMembersList"
        },

        openMembersList: function (e) {
            var communityChosen = $('#communitySelector').val();
            App.Router.MembersList(this.surveyId, communityChosen);
        },

        render: function () {
            var select = $("<select id='communitySelector'>");
            var label = $("<label>").text('Select Community: ');
            this.$el.html(label);
            var communityNames = [];
            $.ajax({
                type: 'GET',
                url: '/community/_design/bell/_view/getAllCommunityNames',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        communityNames[i] = response.rows[i].value;
                        select.append("<option value=" + communityNames[i] + ">" + response.rows[i].key + "</option>");
                    }
                },
                data: {},
                async: false
            });
            this.$el.append(select);
            this.$el.append('<br>');
            var button = $('<button class="btn btn-info" id="returnBack">Back</button>');
            this.$el.append(button);
        },

    })

})