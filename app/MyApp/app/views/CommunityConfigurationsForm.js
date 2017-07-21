$(function() {
    //This form/view is binded with Configuration model
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
            vars["passwordResetDuration"] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
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
            $('#pwd_reset_duration').val(that.model.get('passwordResetDuration'));
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

            //Check for Duplicate name of Community on Cetral Nation i.e., nbs.ole.org:5997
            var that = this;
            var selectedNation = $('#nation-selector').val();
            var nationName = selectedNation.split(',')[0];
            var nationUrl = selectedNation.split(',')[1];
            var communityName = $.trim($('#community-name').val());
            communityName = communityName.toLowerCase();

            var communityCode=  $.trim($('#community-code').val());
            communityCode = communityCode.toLowerCase();
            var configDoc = getCommunityConfigs();
            var comId = this.model.get('_id');

                var centralNationUrl = getCentralNationUrl();
                var nationName  = centralNationUrl.split('.')[0];
                var alertDuplicatename = "Already used, Please change red marked field";
                $.ajax({
                    url: 'http://' + centralNationUrl + '/communityregistrationrequests/_design/bell/_view/getDoc?_include_docs=true&key="'+nationUrl+'"',
                    //   url: 'http://' + nationName + ':' + nationPassword + '@' + centralNationUrl + '/communityregistrationrequests/_design/bell/_view/getDoc?_include_docs=true&key="'+communityName+'"',
                    type: 'GET',
                    dataType: 'jsonp',
                    async: false,
                    success: function(json) {

                        var jsonModels = json.rows;
                        //check for matched results if it is on the same nation and have same community name and code. If matched prompt user to enter another name
                        if (jsonModels.length > 0 && jsonModels!=[]){

                            var duplicateName = 0;
                            var duplicateCode = 0;

                            for (var i = 0; i < jsonModels.length; i++) {
                                var community = jsonModels[i].value;
                                var cName = community.Name.toLowerCase()
                                var cCode = community.Code.toLowerCase()

                                if (cName == communityName && cCode == communityCode && community._id != comId) {
                                    duplicateName = 1;
                                    duplicateCode = 1;
                                }
                                else if(cName == communityName && cCode != communityCode && community._id != comId ){
                                    duplicateName = 1;
                                }
                                else if(cName != communityName && cCode == communityCode && community._id != comId){
                                    duplicateCode = 1;
                                }
                            }
                            if(duplicateName == 1 && duplicateCode == 1) {
                                $("#community-name").css("border", "1px solid red");
                                $("#community-code").css("border", "1px solid red");
                                alert(alertDuplicatename);
                            }
                            else if(duplicateName == 1) {
                                $("#community-name").css("border", "1px solid red");
                                $("#community-code").css("border", "");
                                alert(alertDuplicatename);
                            }
                            else if(duplicateCode == 1) {
                                $("#community-code").css("border", "1px solid red");
                                $("#community-name").css("border", "");
                                alert(alertDuplicatename);
                            }
                            else {
                                if (isAllAttributesValid.indexOf(false) == -1) {
                                    $("#community-name").css("border", "");
                                    $("#community-code").css("border", "");

                                    that.setForm();
                                } else {
                                    $("#community-name").css("border", "");
                                    $("#community-code").css("border", "");
                                    alert(alertMessage);
                                    return;
                                }
                            }
                        }
                        //If Community name does not already exist on the Nation nbs then check if all the fields are filled or not
                        else{
                            if (isAllAttributesValid.indexOf(false) == -1) {
                                that.setForm();
                            } else {
                                alert(alertMessage);
                                return;
                            }
                        }
                    },
                    error: function(error) {
                        console.log(error);
                        alert("Unable to contact Central database");
                        App.stopActivityIndicator();
                    }
                });
        },
        isChanged: function(model , config ){
           if(model.get('name')==config.name &&
                model.get('code')== config.code &&
            model.get('nationName')== config.nationName &&
            model.get('nationUrl')==config.nationUrl &&
            model.get('currentLanguage')== config.currentLanguage&&
            model.get('region')==config.region &&
            model.get('sponsorName')==config.sponsorName &&
            model.get('sponsorAddress')==config.sponsorAddress&&
            model.get('sponsorUrl')== config.sponsorUrl &&
            model.get('contactFirstName')== config.contactFirstName &&
            model.get('contactMiddleName')== config.contactMiddleName&&
            model.get('contactLastName')== config.contactLastName &&
            model.get('contactPhone')==config.contactPhone &&
            model.get('contactEmail')== config.contactEmail &&
            model.get('superManagerFirstName')== config.superManagerFirstName &&
            model.get('superManagerMiddleName')==config.superManagerMiddleName &&
            model.get('superManagerLastName')==config.superManagerLastName &&
            model.get('superManagerPhone')==config.superManagerPhone &&
            model.get('superManagerEmail')== config.superManagerEmail
           ) {

               return false;

           }
            else{

               return true;
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
                Code: $.trim($('#community-code').val()),
                passwordResetDuration: $.trim($('#pwd_reset_duration').val())
            });
            if(configDoc.registrationRequest == 'rejected' || prevNation != selectedNation) {
                this.model.set('registrationRequest', 'pending');
            }

            if(this.model.get('registrationRequest') == 'pending' || this.isChanged(this.model ,configDoc )){

            App.stopActivityIndicator();
            $.ajax({
                type: 'GET',
                url: 'http://' + nationUrl + '/configurations/_all_docs?include_docs=true',
                dataType: 'jsonp',
                async: false,
                success: function (response) {
                    if(response.rows.length > 0){
                        var accept = response.rows[0].doc.accept;
                        if(accept == undefined || accept == false){
                            that.model.set('registrationRequest', 'pending');
                            that.model.save(null, {
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
                                            if(response.docs_written == 0 || response.docs_written == undefined){
                                                alert(App.languageDict.attributes.UnableToReplicate);
                                            }else{
                                                var members = new App.Models.Member({
                                                    "_id": $.cookie('Member._id')
                                                });
                                                members.fetch({
                                                    async: false,
                                                    success: function(data){
                                                        if(data){
                                                            members.set('community',newCode);
                                                            if(members.save()){
                                                                App.stopActivityIndicator();
                                                                alert(App.languageDict.get('Successfully_Registered'));
                                                                window.location.href = '#dashboard';
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        },
                                        error: function(status) {
                                            console.log(status);
                                            alert(App.languageDict.attributes.UnableToReplicate);
                                            App.stopActivityIndicator();
                                        }
                                    });
                                }
                            });
                        }else{
                            that.model.set('registrationRequest', 'accepted');
                            that.model.save(null, {
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
                                            if(response.docs_written == 0 || response.docs_written == undefined){
                                                alert(App.languageDict.attributes.UnableToReplicate);
                                            }else{
                                                App.stopActivityIndicator();
                                                alert(App.languageDict.get('request_accepted'));
                                                window.location.href = '#dashboard';
                                            }
                                        },
                                        error: function(status) {
                                            console.log(status);
                                            alert(App.languageDict.attributes.UnableToReplicate);
                                            App.stopActivityIndicator();
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
            } else{
                alert("you have not made any changes");
                App.stopActivityIndicator();
            }

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