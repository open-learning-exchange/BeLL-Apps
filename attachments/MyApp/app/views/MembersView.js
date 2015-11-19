$(function() {
    App.Views.MembersView = Backbone.View.extend({

        //     tagName: "",
        //     className: "",
        searchText: "",

        events: {
            "click .Search": function(e) {
                this.renderTable($('#searchText').val().toLowerCase())
            },

        },

        render: function() {

            this.$el.html('<h3 style="float:right"><input id="searchText" style="margin-right:15px;height:28px;width:170px" type="Text" placeholder="Last Name"><button style="margin-top:-10px;" class="Search btn btn-info">Search</button></h3>');
            this.$el.append('<h3>Members<a style="margin-left:20px" class="btn btn-success" href="#member/add">Add a New Member</a></h3>');
            this.$el.append('<div id="memberTable"></div>');
            this.renderTable(searchText);
        },
        renderTable: function(searchText) {

            App.startActivityIndicator()
            var that = this
            var config = new App.Collections.Configurations()
            config.fetch({
                async: false
            })
            var currentConfig = config.first()
            var cofigINJSON = currentConfig.toJSON()


            code = cofigINJSON.code
            nationName = cofigINJSON.nationName

            var roles = App.Router.getRoles()
            members = new App.Collections.Members()
            members.searchText = searchText
            members.fetch({
                success: function(response) {
                    membersTable = new App.Views.MembersTable({
                        collection: response
                    })
                    membersTable.community_code = code + nationName.substring(3, 5)
                    if (roles.indexOf("Manager") > -1) {
                        membersTable.isadmin = true
                    } else {
                        membersTable.isadmin = false
                    }
                    membersTable.render()
                    $('#memberTable').html(membersTable.el)
                    App.stopActivityIndicator()
                },
                error: function() {
                    App.stopActivityIndicator()
                }
            })

        }

    })

})