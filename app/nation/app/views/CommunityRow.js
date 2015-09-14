$(function() {

    App.Views.CommunityRow = Backbone.View.extend({

        tagName: "tr",

        events: {
            "click .destroy": function(e) {

                if (confirm('Are you sure you want to delete this Community?')) {
                    e.preventDefault()
                    this.model.destroy()
                    this.remove()
                }else{
                    e.preventDefault()

                    App.startActivityIndicator();
                    Backbone.history.navigate('listCommunity', {
                        trigger: true
                    });
                    App.stopActivityIndicator();
                }
                    },
            "click .browse": function(e) {
                e.preventDefault()
                $('#modal').modal({
                    show: true
                })
            }
        },

        //template : $("#template-GroupRow").html(),

        initialize: function() {

        },

        render: function() {
            var that = this;
            var community = this.model;
            var communityCode = community.attributes.Code;
            var temp = $.url().data.attr.host.split(".")
            var nationName = temp[0];
            var nationUrl = $.url().data.attr.authority;
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var startDate = that.changeDateFormat(that.turnDateToYYYYMMDDFormat(firstDay));
            var endDate = that.changeDateFormat(that.turnDateToYYYYMMDDFormat(lastDay));
            /////////////////////////////////////////////////////////////
            $.ajax({
                url: 'http://' + nationName + ':oleoleole@' + nationUrl + '/activitylog/_design/bell/_view/getDocByCommunityCodeWithValue?_include_docs=true&&startkey=["' + communityCode + '","' + startDate + '"]&endkey=["' +
                communityCode + '","' + endDate + '"]',
                type: 'GET',
                dataType: 'jsonp',
                success: function (result) {
                    var memberVisits = 0;
                    var resourceViews = 0;
                    var activitylogModels;
                    activitylogModels = result.rows;
                    if (activitylogModels.length > 0) {
                        memberVisits = 0;
                        resourceViews = 0;
                        for(var i = 0; i < activitylogModels.length ; i++) {
                            var femaleVisits = activitylogModels[i].value.female_visits;
                            var maleVisits = activitylogModels[i].value.male_visits;
                            console.log(femaleVisits + " " + maleVisits);
                            memberVisits = memberVisits + femaleVisits + maleVisits;
                            console.log("Female Visits: " + femaleVisits + " " + "Male Visits: " + maleVisits + " " + "Total: " + femaleVisits + maleVisits);
                        }
                    }
                    var row = "<td>" + community.get('Name') + "</td><td>" + community.get('lastAppUpdateDate') + "</td><td>" + community.get('version') + "</td><td>" + community.get('lastPublicationsSyncDate') + "</td><td>" + community.get('lastActivitiesSyncDate') + "</td><td>" + memberVisits + "</td><td>" + resourceViews + "</td>" +
                        "<td><a  class='btn btn-success' id='addComm' href='#'>Generate Report</a>&nbsp&nbsp&nbsp<a role='button' class='btn btn-info' href='#addCommunity/" +
                        community.get('_id') + "'> <i class='icon-pencil icon-white'></i>Edit</a>&nbsp&nbsp&nbsp<a role='button' class='btn btn-danger destroy' href='#addCommunity/" +
                        community.get('_id') + "'> <i class='icon-remove icon-white'></i>Delete</a></td>";
                    that.$el.append(row);
                },
                error: function(){
                    console.log("Unable to get communities list.");
                }
            });
            /////////////////////////////////////////////////////////////
        },
        turnDateToYYYYMMDDFormat: function(date) {
            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            // CONVERT mm AND dd INTO chars
            var mmChars = mm.split('');
            var ddChars = dd.split('');
            // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
            var dateString = yyyy + '/' + (mmChars.length === 2 ? mm : "0" + mmChars[0]) + '/' + (ddChars.length === 2 ? dd : "0" + ddChars[0]);
            return dateString;
        },
        changeDateFormat: function(date) {
            var datePart = date.match(/\d+/g),
                year = datePart[0],
                month = datePart[1],
                day = datePart[2];
            return year + '/' + month + '/' + day;
        }

    })

})
