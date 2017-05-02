$(function() {

    App.Collections.Mails = Backbone.Collection.extend({

        initialize: function(e) {
            if (e) {
                if (e.senderId && e.type) {
                    this.url = App.Server + '/mail/_design/bell/_view/GetPasswordResetStatusWithSenderID?include_docs=true&key="' + e.senderId + '"'
                } else if (e.senderId) {
                    this.url = App.Server + '/mail/_design/bell/_view/sentbox?include_docs=true&key="' + e.senderId + '"&limit=5&skip=' + e.skip
                } else if (e.receiverId && e.unread) {
                    this.url = App.Server + '/mail/_design/bell/_view/unopen?include_docs=true&key="' + e.receiverId + '"&limit=5&skip=' + skip
                } else if (e.receiverId && !e.unread) {
                    this.url = App.Server + '/mail/_design/bell/_view/inbox?include_docs=true&key="' + e.receiverId + '"&limit=5&skip=' + skip
                } else {
                    this.url = App.Server + '/mail/_all_docs?include_docs=true&limit=5&skip=' + skip
                }
            } else {
                this.url = App.Server + '/mail/_all_docs?include_docs=true&limit=5&skip=' + skip
            }
        },

        parse: function(response) {
            var docs = _.map(response.rows, function(row) {
                return row.doc
            })
            return docs
        },

        model: App.Models.Mail


    })

})