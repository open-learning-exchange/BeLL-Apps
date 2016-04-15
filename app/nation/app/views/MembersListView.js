$(function () {

    App.Views.MembersListView = Backbone.View.extend({

        vars: {},

        events: {
            "click  #selectAllMembers": "selectAllMembers",
            "click  #UnSelectAllMembers": "UnSelectAllMembers",
            "click  #sendSurveyToSelectedList": "SendSurveyToSelectedListOfMembers",
            "click #retrunBack" : function (e) {
                history.back()
            }
        },
        selectAllMembers:function(){
            $("input[name='surveyMember']").each( function () {
                $(this).prop('checked', true);
            });
        },

        UnSelectAllMembers:function(){
            $("input[name='surveyMember']").each( function () {
                $(this).prop('checked', false);
            });
        },

        SendSurveyToSelectedListOfMembers:function(){
            alert(this.surveyId);
        },

        render: function () {
            this.$el.html('<h3 style="margin-left:5%">Survey No: | ' + 'Title' + '</h3>')
            var viewtext = '<table class="btable btable-striped"><th colspan=3>Name</th>'
            viewtext += '<tr><td><input type="checkbox" name="surveyMember" value="' + 'test1' + '">' + 'test1' + ' ' + 'test11' + '</td></tr>'
            viewtext += '<tr><td><input type="checkbox" name="surveyMember" value="' + 'test2' + '">' + 'test2' + ' ' + 'test22' + '</td></tr>'
            viewtext += '<tr><td><button class="btn btn-info" id="selectAllMembers">Select All</button><button style="margin-left:10px" class="btn btn-info" id="UnSelectAllMembers">UnSelect All</button><button style="margin-left:10px" class="btn btn-info" id="sendSurveyToSelectedList">Send Survey</button><button class="btn btn-info" style="margin-left:10px"  id="retrunBack">Back</button></td></tr>'
            viewtext += '</table>'
            this.$el.append(viewtext)
        }

    })

})