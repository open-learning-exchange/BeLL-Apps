$(function () {

    App.Views.CommunitiesList = Backbone.View.extend({

        vars: {},

        events: {
            "click  #selectAllBells": "selectAllBells",
            "click  #UnSelectAllBells": "UnSelectAllBells",
            "click  #openMembersList": "openMembersList",
            "click #returnBack" : function (e) {
                history.back()
            }
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
                alert(App.languageDictValue.get("bells_selection_msg"));
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
            //nameOfCommunity
            var viewtext = '<table class="btable btable-striped"><th>' + App.languageDictValue.get("Bell_Name") + '</th><th>' + App.languageDictValue.get("Type") + '</th>'
            viewtext += '<tr><td><input type="checkbox" name="bellSelector" value="' + bellCode + '_' + bellName + '">' + bellName + '</td><td>' + App.languageDictValue.get("Nation") + '</td></tr>'
            $.ajax({
                type: 'GET',
                url: '/community/_design/bell/_view/getAllCommunityNames',
                dataType: 'json',
                success: function(response) {
                    for (var i = 0; i < response.rows.length; i++) {
                        var doc = response.rows[i].value;
                        var code, name;
                        if(doc.Code != undefined) {
                            code = doc.Code;
                            name = doc.Name;
                        } else {
                            code = doc.code;
                            name = doc.name;
                        }
                        viewtext += '<tr><td><input type="checkbox" name="bellSelector" value="' + code + '_' + name + '">' + name + '</td><td>' + App.languageDictValue.get("Community") + '</td></tr>'
                    }
                    viewtext += '</table><br>'
                    viewtext += '<button class="btn btn-info" id="selectAllBells">' + App.languageDictValue.get("Select_All") + '</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllBells">' + App.languageDictValue.get("Unselect_All") + '</button><button style="margin-left:10px" class="btn btn-info" id="openMembersList">' + App.languageDictValue.get("Get_Members_List") + '</button><button class="btn btn-info" style="margin-left:10px"  id="returnBack">' + App.languageDictValue.get("Back") + '</button>'
                    that.$el.html(viewtext);
                    if(App.languageDictValue.get('directionOfLang').toLowerCase() === "right")
                    {
                        that.$el.find("#UnSelectAllBells").css({"margin-right":"10px", "margin-left":""});
                        that.$el.find("#openMembersList").css({"margin-right":"10px", "margin-left":""});
                        that.$el.find("#returnBack").css({"margin-right":"10px", "margin-left":""});
                    }
        },
                data: {},
                async: false
            });

        }

    })

})