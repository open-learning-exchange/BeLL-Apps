$(function() {

    App.Views.ConfigurationView = Backbone.View.extend({

        template: _.template($("#template-Configuration").html()),
        vars: {},
        events: {
            "click #saveLanguage": function(e) {
                var loginOfMem = $.cookie('Member.login');
                var lang;
                $.ajax({
                    url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                    type: 'GET',
                    dataType: 'jsonp',
                    async:false,
                    success: function (surResult) {
                        console.log(surResult);
                        var id = surResult.rows[0].id;
                        $.ajax({
                            url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                            type: 'GET',
                            dataType: 'jsonp',
                            async:false,
                            success: function (resultByDoc) {
                                console.log(resultByDoc);
                                lang=resultByDoc.rows[0].value.bellLanguage;
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
                var languageDictValue=App.Router.loadLanguageDocs(lang);
                var isChanged = false
                var selectedVal = $("#languageSelection").val()
                if (selectedVal != "") {
                    this.model.set('currentLanguage', selectedVal)
                    isChanged = true
                }
                if ($('#appversion').val() != "") {
                    this.model.set('version', $('#appversion').val())
                    isChanged = true
                }
                if ($('#notes').val() != "") {
                    this.model.set('notes', $('#notes').val())
                    isChanged = true
                }
                if (isChanged) {
                    var that = this
                    console.log(this.model.toJSON())
                    this.model.save(null, {
                        success: function(response, model) {
                            that.model.set("_rev", response.get("rev"))
                        }
                    })
                    alert(languageDictValue.attributes.Config_Saved)
                } else {
                    alert(languageDictValue.attributes.No_Changes)
                }
            }
        },
        render: function() {
            this.vars = this.model.toJSON()
            this.$el.html(this.template(this.vars))
            this.$el.append('<br>&nbsp;&nbsp;<button class="btn btn-success" id="saveLanguage" >Save</button>')
        }

    })

})