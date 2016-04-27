$(function () {

    App.Views.CommunitiesList = Backbone.View.extend({

        vars: {},

        events: {
            "click  #selectAllBells": "selectAllBells",
            "click  #UnSelectAllBells": "UnSelectAllBells",
            "click  #openMembersList": "openMembersList",
            "click #returnBack" : function (e) {
                history.back()
            },
        },

        selectAllBells:function(){
            $("input[name='bellSelector']").each( function () {
                $(this).prop('checked', true);
            });
        },

        UnSelectAllBells:function(){
            $("input[name='bellSelector']").each( function () {
                $(this).prop('checked', false);
            });
        },

        openMembersList: function (e) {
            var selectedBellCodes = [];
            var selectedBellNames = [];
            $("input[name='bellSelector']").each(function() {
                if ($(this).is(":checked")) {
                    var bellCode = $(this).val().split('_')[0];
                    var bellName = $(this).val().split('_')[1];
                    selectedBellCodes.push(bellCode);
                    selectedBellNames.push(bellName);
                }
            })
            if(selectedBellCodes.length > 0) {
                App.Router.MembersList(this.surveyId, selectedBellCodes, selectedBellNames);
            } else {
                alert("Please select bells first");
                return;
            }
        },

        render: function () {
            this.showCommunitiesList();
        },

        showCommunitiesList: function () {
            var that = this;
            var config = new App.Collections.Configurations();
            var bellName, bellCode;
            config.fetch({
                async: false,
                success: function(){
                    bellCode = config.first().attributes.code;
                    bellName = config.first().attributes.name;
                }
            });
            var viewtext = '<table class="btable btable-striped"><th>Bell Name</th><th>Type</th>'
            viewtext += '<tr><td><input type="checkbox" name="bellSelector" value="' + bellCode + '_' + bellName + '">' + bellName + '</td><td>' + 'Nation' + '</td></tr>'
            $.ajax({
                type: 'GET',
                url: '/community/_design/bell/_view/getAllCommunityNames',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        viewtext += '<tr><td><input type="checkbox" name="bellSelector" value="' + response.rows[i].value + '_' + response.rows[i].key + '">' + response.rows[i].key + '</td><td>' + 'Community' + '</td></tr>'
                    }
                    viewtext += '</table><br>'
                    viewtext += '<button class="btn btn-info" id="selectAllBells">Select All</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllBells">UnSelect All</button><button style="margin-left:10px" class="btn btn-info" id="openMembersList">Get Members List</button><button class="btn btn-info" style="margin-left:10px"  id="returnBack">Back</button>'
                    that.$el.html(viewtext);
                },
                data: {},
                async: false
            });

        },

    })

})