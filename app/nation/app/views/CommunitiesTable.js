$(function() {
    App.Views.CommunitiesTable = Backbone.View.extend({

        tagName: "table",

        className: "table table-striped",


        vars: {},

        addOne: function(model) {
            if (model.get('_id') !== '_design/bell') { // only render if its NOT a design doc
                var CommunityRow = new App.Views.CommunityRow({
                    model: model
                })
                CommunityRow.render()
                this.$el.append(CommunityRow.el)
            }
        },

        addAll: function() {
            // @todo this does not work as expected, either of the lines
            // _.each(this.collection.models, this.addOne())
            this.collection.each(this.addOne, this)
        },

        render: function() {

            var loginOfMem = $.cookie('Member.login');
            var lang;
            $.ajax({
                url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                type: 'GET',
                dataType: 'json',
                async:false,
                success: function (surResult) {
                    console.log(surResult);
                    var id = surResult.rows[0].id;
                    $.ajax({
                        url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                        type: 'GET',
                        dataType: 'json',
                        async:false,
                        success: function (resultByDoc) {
                            console.log(resultByDoc);
                            lang=resultByDoc.rows[0].value.bellLanguage;
                            App.languageDictValue = App.Router.loadLanguageDocs(lang);
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                },
                error:function(err){
                    console.log(err);
                }
            });
            this.$el.append('<tr><th>' + App.languageDictValue.get("Community") + '</th><th>' + App.languageDictValue.get("Last_App") + '<br>' + App.languageDictValue.get("Update") + '</th><th>' + App.languageDictValue.get("Version_No") + '</th><th>' + App.languageDictValue.get("Last_Publications") + '<br>' + App.languageDictValue.get("Sync") + '</th><th>' + App.languageDictValue.get("Last_Activities") + '<br>' + App.languageDictValue.get("Sync") + '</th><th>' + App.languageDictValue.get("Total_Member") + '<br>' + App.languageDictValue.get("Visits") + '</th><th>' + App.languageDictValue.get("Total_Resource") + '<br>' + App.languageDictValue.get("View_s") + '</th></th><th colspan="2">' + App.languageDictValue.get("Actions") + '</th></tr>');
            this.addAll()
        }

    })

})