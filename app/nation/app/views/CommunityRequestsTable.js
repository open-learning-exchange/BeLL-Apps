$(function() {
    App.Views.CommunityRequestsTable = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",
        vars: {},
        pendingCollections: [],

        addPendingOne: function(model) {
            if (model._id !== '_design/bell') { // only render if its NOT a design doc
                var CommunityRow = new App.Views.CommunityRequestRow({
                    model: model,
                    startDate: this.options.startDate,
                    name : this.options.name
                })
                CommunityRow.render()
                this.$el.append(CommunityRow.el)
            }
        },

        addOne: function(model) {
            if (model.get('_id') !== '_design/bell') { // only render if its NOT a design doc
                var CommunityRow = new App.Views.CommunityRequestRow({
                    model: model,
                    startDate: this.options.startDate,
                    name: this.options.name
                })
                CommunityRow.render()
                this.$el.append(CommunityRow.el)
            }
        },

        addAll: function (name) {
            this.collection.each(this.addOne, this);
            if (name == "CommunityRequest") {
                for (var i = 0 ; i < this.pendingCollections.length ; i++) {
                    this.addPendingOne(this.pendingCollections[i]);
                }
            }
        },

        render: function () {
            var name = this.options.name;
            if (name == "CommunityRequest") {
                var loginOfMem = $.cookie('Member.login');
                var lang = App.Router.getLanguage(loginOfMem);
                App.languageDictValue = App.Router.loadLanguageDocs(lang);
            } 
            this.$el.append('<tr><th>' + App.languageDictValue.get("Community") + '</th><th>' + App.languageDictValue.get("Last_App") + '<br>' + App.languageDictValue.get("Update") + '</th><th>' + App.languageDictValue.get("Version_No") + '</th><th>' + App.languageDictValue.get("Last_Publications") + '<br>' + App.languageDictValue.get("Sync") + '</th><th>' + App.languageDictValue.get("Last_Activities") + '<br>' + App.languageDictValue.get("Sync") + '</th><th>' + App.languageDictValue.get("Total_Member") + '<br>' + App.languageDictValue.get("Visits") + '</th><th>' + App.languageDictValue.get("Total_Resource") + '<br>' + App.languageDictValue.get("View_s") + '</th></th><th colspan="2">' + App.languageDictValue.get("Actions") + '</th></tr>');
            this.addAll(name)
        }
    })
})