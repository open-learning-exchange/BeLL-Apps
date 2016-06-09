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
        setForm:function() {
            var memberLoginForm = this;
            this.form.commit();
            if (this.form.validate() != null) {
                return
            }
            var Config = this.form.model;
            var config = new App.Collections.Configurations();
            var members = new App.Collections.Members();
            var member;
            config.fetch({async: false});
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
        createJsonlog: function(member, logdate, logdb) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            // alert(superMgrIndex);
            var docJson = {
                logDate: logdate,
                resourcesIds: [],
                male_visits: 0,
                female_visits: 0,
                male_timesRated: [],
                female_timesRated: [],
                male_rating: [],
                community: App.configuration.get('code'),
                female_rating: [],
                resources_names: [], // Fill in blank resource title name(s) in trend activity report Facts & Figures : Issue #84
                resources_opened: [],
                male_opened: [],
                female_opened: [],
                male_deleted_count: 0,
                female_deleted_count: 0
            }
            if (member.get('Gender') == 'Male') {

                var visits = parseInt(docJson.male_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.male_visits = visits
            } else {

                var visits = parseInt(docJson.female_visits)
                //    if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                docJson.female_visits = visits
            }
            docJson.community = App.configuration.get('code'),
                logdb.put(docJson, logdate, function(err, response) {
                    if (!err) {
                        console.log("MemberLoginForm:: created activity log in pouchdb for today..");
                    } else {
                        console.log("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                        console.log(err);
                        //                    alert("MemberLoginForm:: createJsonlog:: error creating/pushing activity log doc in pouchdb..");
                    }
                });
        },
        UpdatejSONlog: function(member, logModel, logdb, logdate) {
            var superMgrIndex = member.get('roles').indexOf('SuperManager');
            if (member.get('Gender') == 'Male') {
                var visits = parseInt(logModel.male_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.male_visits = visits
            } else {
                var visits = parseInt(logModel.female_visits)
                //  if (!member.get('roles')[superMgrIndex ] == "SuperManager") {
                if (superMgrIndex == -1) {
                    visits++
                }
                logModel.female_visits = visits
            }
            logModel.community = App.configuration.get("code");

            logdb.put(logModel, logdate, logModel._rev, function(err, response) { // _id: logdate, _rev: logModel._rev
                if (!err) {
                    console.log("MemberLoginForm:: updated daily log from pouchdb for today..");
                } else {
                    console.log("MemberLoginForm:: UpdatejSONlog:: err making update to record");
                    console.log(err);
                    //                    alert("err making update to record");
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