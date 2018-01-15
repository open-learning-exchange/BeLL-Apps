$(function() {
    //This form/view is binded with Configuration model
    App.Views.Configurations = Backbone.View.extend({
        className: "addNation-form",
        initialize: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            this.$el.html('<h3 style="margin: 0px 38px;"">' + languageDictValue.get("Set_Configurations") + '</h3>');

        },
        events: {
            "click #formButton": "setForm"
        },
        render: function() {
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el);
            var availableLanguages=App.Router.getAvailableLanguages();
            for(var key in availableLanguages){
                this.$el.find('.field-selectLanguage .bbf-editor select').append($('<option>', {
                    value: key,
                    text:availableLanguages[key]
                }));
            }
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            this.$el.find('.field-selectLanguage .bbf-editor select').prepend('<option id="defaultLang" disabled="true" selected style="display:none"></option>');
            var configCollection = new App.Collections.Configurations();
            configCollection.fetch({
                async: false
            });
            var configModel = configCollection.first();
            var currentConfig = configModel.toJSON();
            var clanguage= currentConfig.currentLanguage;
            clanguage= App.Router.getNativeNameOfLang(clanguage);
            this.$el.find('#defaultLang').text(clanguage);
            this.$el.find('.field-name label').text(languageDictValue.get("Name"));
            this.$el.find('.field-code label').text(languageDictValue.get("Code"));
            this.$el.find('.field-type label').text(languageDictValue.get("Type"));
            this.$el.find( ".field-type .bbf-editor select option" ).each(function( index ) {
                var temp = $(this).text();
                temp = temp.charAt(0).toUpperCase() + temp.slice(1);
                $(this).text(languageDictValue.get(temp));
            });
            this.$el.find('.field-region label').text(languageDictValue.get("Region"));
            this.$el.find('.field-nationName label').text(languageDictValue.get("Nation_Name"));
            this.$el.find('.field-nationUrl label').text(languageDictValue.get("Nation_Url"));
            this.$el.find('.field-version label').text(languageDictValue.get("Version"));
            this.$el.find('.field-notes label').text(languageDictValue.get("Notes"));
            this.$el.find('.field-selectLanguage label').text(languageDictValue.get("Select_Language"));
            this.$el.find('#accept label').text(languageDictValue.get("Auto_Approve"));
            this.$el.append('<a style="display: table;margin: 0 auto" class="btn btn-success" id="formButton">' + languageDictValue.get("Submit_Configurations") + '</a>');
        },
        setForm: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang = App.Router.getLanguage(loginOfMem);
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config = this.form.model;
            var config = new App.Collections.Configurations();
            var members = new App.Collections.Members();
            var member;
            config.fetch({
                async: false
            });
            var con = config.first();
            con.set('name', Config.get('name'));
            con.set('nationName', Config.get('nationName'));
            con.set('nationUrl', Config.get('nationUrl'));
            var membersDoc=[];
            if (con.get('code') != Config.get('code'))
            {
                members.fetch({
                    async:false,
                    success:function () {
                        if(members.length>0)
                        {
                            for(var i=0; i <members.length ; i++) {
                                member = members.models[i];
                                if(con.get('code')== member.get('community'))
                                {
                                    member.set('community',Config.get('code'));
                                    membersDoc.push(member);
                                }
                            }
                            $.couch.db("members").bulkSave({"docs": membersDoc}, {
                                success: function(data) {
                                },
                                error: function(status) {
                                    console.log(status);
                                }
                            });
                        }
                    }
                });
            }
            con.set('code', Config.get('code'));
            con.set('type', Config.get('type'));
            con.set('notes', Config.get('notes'));
            con.set('version', Config.get('version'));
            con.set('subType', 'dummyy');
            con.set('accept', Config.get('accept')); // accept = true means automatic approval
           // con.set('flagDoubleUpdate' , true); //flag Double update
            if(Config.get('selectLanguage') != "Select an Option") {
                con.set('currentLanguage', Config.get('selectLanguage'));
            }
            con.save(null, {
                success: function(doc, rev) {
                    App.configuration = con;
                    alert(languageDictValue.attributes.Config_Added_Success);
                    Backbone.history.navigate('dashboard', {
                        trigger: true
                    });
                }
            });
        }
    })
})