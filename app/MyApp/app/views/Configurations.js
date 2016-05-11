$(function () {

    App.Views.Configurations = Backbone.View.extend({

        initialize: function () {
            this.$el.html('<h3>' + App.languageDict.get("Set_Configurations") + '</h3>')
        },
        events: {
            "click #formButton": "setForm"
        },

        render: function () {
            this.form = new Backbone.Form({
                model: this.model
            })

            this.$el.append(this.form.render().el);
            var availableLanguages=getAvailableLanguages();
            for(var key in availableLanguages){
                this.$el.find('.field-selectLanguage .bbf-editor select').append($('<option>', {
                    value: key,
                    text:availableLanguages[key]
                }));
            }
            var configurations = Backbone.Collection.extend({
                url: App.Server + '/configurations/_all_docs?include_docs=true'
            })
            var config = new configurations()
            config.fetch({
                async: false
            })
            var con = config.first();
            var currentConfig = config.first().toJSON().rows[0].doc;
            var clanguage= currentConfig.currentLanguage;
            this.$el.find('.field-selectLanguage .bbf-editor select').prepend('<option id="defaultLang" disabled="true" selected style="display:none"></option>');
            clanguage= getNativeNameOfLang(clanguage);
            $('.field-selectLanguage').find('.bbf-editor').find('select').val(clanguage);
            this.$el.find('#defaultLang').text(clanguage);
            this.$el.find('.field-name label').text(App.languageDict.get("Name"));
            this.$el.find('.field-code label').text(App.languageDict.get("Code"));
            this.$el.find('.field-type label').text(App.languageDict.get("Type"));
            this.$el.find( ".field-type .bbf-editor select option" ).each(function( index ) {
                var temp = $(this).text();
                $(this).text(App.languageDict.get(temp));
            });
            this.$el.find('.field-region label').text(App.languageDict.get("Region"));
            this.$el.find('.field-nationName label').text(App.languageDict.get("Nation_Name"));
            this.$el.find('.field-nationUrl label').text(App.languageDict.get("Nation_Url"));
            this.$el.find('.field-version label').text(App.languageDict.get("Version"));
            this.$el.find('.field-notes label').text(App.languageDict.get("Notes"));
            this.$el.find('.field-selectLanguage label').text(App.languageDict.get("Select_Language"));
            this.$el.append('<a style="margin-left:31px;" class="btn btn-success" id="formButton">' + App.languageDict.get("Submit_Configurations") + '</a>');
            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));

        },
        setForm:function(){
            alert('Hello');
            var memberLoginForm = this;
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config=this.form.model;
            var config = new App.Collections.Configurations();
            config.fetch({async:false});
            var con=config.first();
            con.set('name',Config.get('name'));
            con.set('nationName',Config.get('nationName'));
            con.set('nationUrl',Config.get('nationUrl'));
            con.set('code',Config.get('code'));
            con.set('type',Config.get('type'));
            con.set('notes',Config.get('notes'));
            con.set('region', Config.get('region'));
            if(Config.get('version') != "") {
                con.set('version', Config.get('version'));
            }
            con.set('subType', 'dummyy');
            con.set('countDoubleUpdate'  , 0   );
            if(Config.get('selectLanguage') != "Select an Option") {
                con.set('currentLanguage', Config.get('selectLanguage'));
            }
            if(parseInt(App.member.get('visits')) ==0)
            {
                alert(App.member.get('_id'));
                var members = new App.Collections.Members();
                members.fetch({
                    id:App.member.get('_id'),
                    async:false,
                    success:function(){
                        var member=members.first();
                        member.set('community',con.get('code'));
                        var vis = parseInt(member.get("visits"));
                        vis++;
                        member.set('visits',vis);
                        if (!(member.get('roles').indexOf("Manager") > -1) && member.get("FirstName")!='Default' &&
                            member.get('LastName')!='Admin')
                        {
                            member.set("lastLoginDate",new Date());
                        }
                        if(member.get('bellLanguage')===undefined || member.get('bellLanguage')==="" || member.get('bellLanguage')===null)
                        {
                            member.set("bellLanguage", App.configuration.get("currentLanguage"));
                        }
                        member.once('sync', function() {})

                        member.save(null, {
                            success: function(doc, rev) {}
                        });
                        //call log activity function here...
                        memberLoginForm.logActivity(member);
                        var date = new Date()
                        $.cookie('Member.login', member.get('login'), {
                            path: "/apps/_design/bell"
                        })
                        $.cookie('Member._id', member.get('_id'), {
                            path: "/apps/_design/bell"
                        })
                        $.cookie('Member.expTime', date, {
                            path: "/apps/_design/bell"
                        })
                        $.cookie('Member.roles', member.get('roles'), {
                            path: "/apps/_design/bell"
                        })
                        memberLoginForm.trigger('success:login');
                    }
                });
            }
            con.save(null,{ success: function(doc,rev){

                App.configuration = con;

                // Get Current Date
                var currentdate = new Date();
                var year = currentdate.getFullYear();
                var month = (1 + currentdate.getMonth()).toString();
                month = month.length > 1 ? month : '0' + month;
                var day = currentdate.getDate().toString();
                day = day.length > 1 ? day : '0' + day;
                var logcurrentdate = year + '/' + month + '/' + day;

                $.ajax({
                    type: 'GET',
                    url: '/activitylog/_design/bell/_view/getDocumentByDate?key="'+ logcurrentdate +'"',
                    dataType: 'json',
                    success: function (response) {
                        var logModel = response.rows[0].value;
                        logModel.community = App.configuration.get("code");

                        //Now Posting the Updated Activitylog Model
                        $.ajax({
                            type: 'PUT',
                            url: '/activitylog/'+ logModel._id +'/?rev=' + logModel._rev,
                            data: JSON.stringify(logModel),
                            async: false,
                            dataType: 'json',
                            success: function (response) {
                                console.log(response);
                            }
                        });
                    }
                });
                alert(App.languageDict.attributes.Config_Added_Success);
                Backbone.history.navigate('dashboard');
                window.location.reload();
            }});
        },
        logActivity: function(member) {
            var that = this;
            var logdb = new PouchDB('activitylogs');
            var currentdate = new Date();
            var logdate = this.getFormattedDate(currentdate);
            logdb.get(logdate, function(err, logModel) {
                if (!err) {
                    //            console.log("logModel: ");
                    //            console.log(logModel);
                    //            alert("yeeyyyyyy");
                    that.UpdatejSONlog(member, logModel, logdb, logdate);
                } else {
                    that.createJsonlog(member, logdate, logdb);
                }
            });
        },
        getFormattedDate: function(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return month + '/' + day + '/' + year;
    }

    })

})