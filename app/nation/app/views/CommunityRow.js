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
            var community = this.model;

            var row = "<td>" + community.get('Name') + "</td><td>" + community.get('lastAppUpdateDate') + "</td><td>" + community.get('version') + "</td><td>" + community.get('lastPublicationsSyncDate') + "</td><td>" + community.get('lastActivitiesSyncDate') + "</td><td>" + "10" + "</td><td>" + "15" + "</td>" +
                "<td><a  class='btn btn-success' id='addComm' href='#'>Generate Report</a>&nbsp&nbsp&nbsp<a role='button' class='btn btn-info' href='#addCommunity/" +
                community.get('_id') + "'> <i class='icon-pencil icon-white'></i>Edit</a>&nbsp&nbsp&nbsp<a role='button' class='btn btn-danger destroy' href='#addCommunity/" +
                community.get('_id') + "'> <i class='icon-remove icon-white'></i>Delete</a></td>";
            this.$el.append(row);
        }

    })

})
