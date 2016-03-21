$(function() {

    App.Views.Configurations = Backbone.View.extend({

        initialize: function() {
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
            this.$el.html('<h3>' + languageDictValue.get("Set_Configurations") + '</h3>')
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
            this.$el.append('<a style="margin-left:31px;" class="btn btn-success" id="formButton">' + languageDictValue.get("Submit_Configurations") + '</a>');
        },
        setForm: function() {
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
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config = this.form.model;
            var config = new App.Collections.Configurations();
            config.fetch({
                async: false
            });
            var con = config.first();
            con.set('name', Config.get('name'));
            con.set('nationName', Config.get('nationName'));
            con.set('nationUrl', Config.get('nationUrl'));
            con.set('code', Config.get('code'));
            con.set('type', Config.get('type'));
            con.set('notes', Config.get('notes'));
            con.set('version', Config.get('version'));
            con.set('subType', 'dummyy');
           // con.set('flagDoubleUpdate' , true); //flag Double update
            if(Config.get('selectLanguage') != "Select an Option") {
                con.set('currentLanguage', Config.get('selectLanguage'));
            }
            con.save(null, {
                success: function(doc, rev) {
                    App.configuration = con;
                    console.log(App.configuration.get('name'))
                    alert(languageDictValue.attributes.Config_Added_Success);
                    Backbone.history.navigate('dashboard', {
                        trigger: true
                    });
                }
            });
        }
    })
})