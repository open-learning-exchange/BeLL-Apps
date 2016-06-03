$(function() {

    App.Views.CommunityConfigurationsForm = Backbone.View.extend({

        className: "addNation-form",

        vars: {},

        events: {
            "click #commConfigFormButton":"validateForm"
        },

        template: $('#template-addCommunity').html(),

        render: function() {
            var configDoc = getCommunityConfigs();
            var centralNationUrl = getCentralNationUrl();
            var that = this;
            var vars = {};
            //Check if it is a new community or an older one with registrationRequest attribute
            if(!configDoc.hasOwnProperty('registrationRequest')) {
                $('#nav').css('pointer-events', 'none');
            }
            vars["nations"] = [];
            vars["languages"] = [];
            vars.languages = getAvailableLanguages();
            vars.languageDict=App.languageDict;
            if(navigator.onLine){ //Check if there is a stable internet connection
                $.ajax({
                    url: 'http://' + centralNationUrl + '/nations/_design/bell/_view/getAllNations?_include_docs=true',
                    type: 'GET',
                    dataType: 'jsonp',
                    async: false,
                    success: function (json) {
                        for(var i = 0 ; i < json.rows.length ; i++) {
                         vars.nations.push(json.rows[i].value);
                        }
                        that.$el.append(_.template(that.template, vars));
                        that.makeFormMultiLingual();
                        if(that.model.get('_id') != undefined) {
                            that.setFormValues()
                        }
                    },
                    error: function (status) {
                        console.log(status);
                    }
                });
            } else {
                alert(App.languageDict.get('offline_Status_warning'));
                that.$el.append(_.template(that.template, vars));
                if(that.model.get('_id') != undefined) {
                    that.setFormValues()
                }
            }
        },
        makeFormMultiLingual: function () {
            $('#community-name').attr('title',App.languageDict.get('title_msg_required'));
            $('#community-name').attr('placeholder',App.languageDict.get('Name'));
            $('#community-code').attr('title',App.languageDict.get('title_msg_required'));
            $('#community-code').attr('placeholder',App.languageDict.get('Code'));
            $('#community-region').attr('placeholder',App.languageDict.get('Region'));
            $('#org-name').attr('placeholder',App.languageDict.get('Name'));
            $('#org-address').attr('placeholder',App.languageDict.get('Address'));
            $('#org-url').attr('placeholder',App.languageDict.get('Url'));
            $('#org-firstname').attr('placeholder',App.languageDict.get('First_Name'));
            $('#org-middlename').attr('placeholder',App.languageDict.get('Middle_Names'));
            $('#org-lastname').attr('placeholder',App.languageDict.get('Last_Name'));
            $('#org-phone').attr('placeholder',App.languageDict.get('Phone'));
            $('#org-email').attr('placeholder',App.languageDict.get('Email'));
            $('#leader-firstname').attr('placeholder',App.languageDict.get('First_Name'));
            $('#leader-middlename').attr('placeholder',App.languageDict.get('Middle_Names'));
            $('#leader-lastname').attr('placeholder',App.languageDict.get('Last_Name'));
            $('#leader-phone').attr('placeholder',App.languageDict.get('Phone'));
            $('#leader-email').attr('placeholder',App.languageDict.get('Email'));
        },
        setFormValues: function () {
            var that = this;
            $('#community-name').val(that.model.get('name'));
            if(that.model.get('name') != undefined) {
                $('#community-code').val(that.model.get('code'));
            }
            $('#nation-selector').val(that.model.get('nationName') + ',' + that.model.get('nationUrl'));
            $('#language-selector').val(that.model.get('currentLanguage'));
            $('#community-region').val(that.model.get('region'));
            $('#org-name').val(that.model.get('sponsorName'));
            $('#org-address').val(that.model.get('sponsorAddress'));
            $('#org-url').val(that.model.get('sponsorUrl'));
            $('#org-firstname').val(that.model.get('contactFirstName'));
            $('#org-middlename').val(that.model.get('contactMiddleName'));
            $('#org-lastname').val(that.model.get('contactLastName'));
            $('#org-phone').val(that.model.get('contactPhone'));
            $('#org-email').val(that.model.get('contactEmail'));
            $('#leader-firstname').val(that.model.get('superManagerFirstName'));
            $('#leader-middlename').val(that.model.get('superManagerMiddleName'));
            $('#leader-lastname').val(that.model.get('superManagerLastName'));
            $('#leader-phone').val(that.model.get('superManagerPhone'));
            $('#leader-email').val(that.model.get('superManagerEmail'));
        },

        validateForm: function () {
            var isAllAttributesValid = [];
            var alertMessage = '';
            var formElements = document.getElementById("communityFrom").elements;
            for (var i = 0, element; element = formElements[i++];) {
                if(element.type == "text" || element.type == "email") {
                    if (element.value.trim() != '') {
                        isAllAttributesValid.push(true);
                    } else {
                        if(element.placeholder != App.languageDict.get('Middle_Names')) {
                            isAllAttributesValid.push(false);
                            alertMessage = App.languageDict.get('fill_all_fields');
                        }
                    }
                } else {
                    if (element.value != App.languageDict.get('Select_Language') && element.value != App.languageDict.get('select_nation')) {
                        isAllAttributesValid.push(true);
                    } else {
                        isAllAttributesValid.push(false);
                        if(alertMessage == '') {
                            alertMessage = App.languageDict.get('pls_select_' + element.name.split('-').pop());
                        }
                    }
                }
            }
            if (isAllAttributesValid.indexOf(false) == -1) {
                this.setForm();
            } else {
                alert(alertMessage);
                return;
            }
        },

        setForm: function() {
            App.startActivityIndicator();
            var centralNationUrl = getCentralNationUrl();
            var configDoc = getCommunityConfigs();
            var oldCode = this.model.get('code');
            var newCode = $.trim($('#community-code').val());
            if(oldCode != newCode) {
                this.changeMembersCommunity(oldCode, newCode);
                this.changeCodeInActivityLogs(newCode);
            }
            var prevNation = this.model.get('nationName') + ',' + this.model.get('nationUrl');
            var that = this;
            var selectedNation = $('#nation-selector').val();
            var nationName = selectedNation.split(',')[0];
            var nationUrl = selectedNation.split(',')[1];
            this.model.set({
                name: $.trim($('#community-name').val()),
                code: $.trim($('#community-code').val()),
                nationName: nationName,
                nationUrl: nationUrl,
                currentLanguage: $('#language-selector').val(),
                region: $.trim($('#community-region').val()),
                sponsorName: $('#org-name').val(),
                sponsorAddress: $('#org-address').val(),
                sponsorUrl: $('#org-url').val(),
                contactFirstName: $('#org-firstname').val(),
                contactMiddleName: $('#org-middlename').val(),
                contactLastName: $('#org-lastname').val(),
                contactPhone: $('#org-phone').val(),
                contactEmail: $('#org-email').val(),
                superManagerFirstName: $('#leader-firstname').val(),
                superManagerMiddleName: $('#leader-middlename').val(),
                superManagerLastName: $('#leader-lastname').val(),
                superManagerPhone: $('#leader-phone').val(),
                superManagerEmail: $('#leader-email').val(),
                countDoubleUpdate: 0,
                subType:'dummyy',
                type: 'community',
                kind: 'Community',
                //Temporarily adding these attributes
                Name: $.trim($('#community-name').val()),
                Code: $.trim($('#community-code').val())
            });
            if(configDoc.registrationRequest == 'rejected' || prevNation != selectedNation) {
                this.model.set('registrationRequest', 'pending');
            }
            this.model.save(null, {
                success: function (model, response) {
                    var docIds = [];
                    var id = that.model.get('id');
                    docIds.push(id);
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        type: 'POST',
                        url: '/_replicate',
                        dataType: 'json',
                        data: JSON.stringify({
                            "source": "configurations",
                            "target": 'http://' + centralNationUrl + '/communityregistrationrequests',
                            'doc_ids': docIds
                        }),
                        async: false,
                        success: function (response) {
                            App.stopActivityIndicator();
                            alert(App.languageDict.get('Successfully_Registered'));
                            window.location.href = '#dashboard';
                        },
                        error: function(status) {
                            console.log(status);
                            alert(App.languageDict.attributes.UnableToReplicate);
                            App.stopActivityIndicator();
                        }
                    });
                }
            });
        },
        changeCodeInActivityLogs: function(newCode){
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
                    logModel.community = newCode;

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
        },

        changeMembersCommunity: function (oldCode, newCode) {
            var members = new App.Collections.Members();
            var member;
            var membersDoc=[];
            members.fetch({
                async:false,
                success:function () {
                    if(members.length > 0) {
                        for(var i = 0 ; i < members.length ; i++) {
                            member = members.models[i];
                            if(oldCode == member.get('community')) {
                                member.set('community',newCode);
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
    })

})