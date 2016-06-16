$(function() {
    App.Views.CommunityRequestsTable = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",


        vars: {},
        pendingCollections: [],

        addPendingOne: function(community) {
            var row = "<td>" + community.name + "</td><td>" + community.lastAppUpdateDate + "</td><td>" + community.version + "</td><td>" + community.lastPublicationsSyncDate + "</td><td>" + community.lastActivitiesSyncDate + "</td><td>0</td><td>0</td>" +
                "<td><a role='button' class='btn btn-info' href='#communityDetails/" +
                community._id + "/pending'> <i class='icon-pencil icon-white'></i>View Details</a>&nbsp&nbsp&nbsp<label>Request Pending</label></td>";
                this.$el.append(row);
        },

        addOne: function(model) {
            if (model.get('_id') !== '_design/bell') { // only render if its NOT a design doc
                var CommunityRow = new App.Views.CommunityRequestRow({
                    model: model
                })
                CommunityRow.render()
                this.$el.append(CommunityRow.el)
            }
        },

        addAll: function() {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this);
            for(var i = 0 ; i < this.pendingCollections.length ; i++) {
                this.addPendingOne(this.pendingCollections[i]);
            }
        },

        render: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            App.languageDictValue = App.Router.loadLanguageDocs(lang);
            this.$el.append('<tr><th>' + App.languageDictValue.get("Community") + '</th><th>' + App.languageDictValue.get("Last_App") + '<br>' + App.languageDictValue.get("Update") + '</th><th>' + App.languageDictValue.get("Version_No") + '</th><th>' + App.languageDictValue.get("Last_Publications") + '<br>' + App.languageDictValue.get("Sync") + '</th><th>' + App.languageDictValue.get("Last_Activities") + '<br>' + App.languageDictValue.get("Sync") + '</th><th>' + App.languageDictValue.get("Total_Member") + '<br>' + App.languageDictValue.get("Visits") + '</th><th>' + App.languageDictValue.get("Total_Resource") + '<br>' + App.languageDictValue.get("View_s") + '</th></th><th colspan="2">' + App.languageDictValue.get("Actions") + '</th></tr>');
            this.addAll()
        }

    })

})