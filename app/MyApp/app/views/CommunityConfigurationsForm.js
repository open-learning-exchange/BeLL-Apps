$(function() {

    App.Views.CommunityConfigurationsForm = Backbone.View.extend({

        className: "addNation-form",

        vars: {},

        events: {
            "click #commConfigFormButton":"validateForm"
        },

        template: $('#template-addCommunity').html(),

        render: function() {
            var that = this;
            var vars = {};
            if(this.model.get('name') == undefined) { //means this is a newly installed community with limited attributes
                $('#nav').css('pointer-events', 'none');
            }
            vars["nations"] = [];
            vars["languages"] = [];
            vars.languages = getAvailableLanguages();
            if(navigator.onLine){ //Check there is a stable internet connection
                $.ajax({
                    url: 'http://nbs.ole.org:5997/nations/_design/bell/_view/getAllNations?_include_docs=true',
                    type: 'GET',
                    dataType: 'jsonp',
                    async: false,
                    success: function (json) {
                        for(var i = 0 ; i < json.rows.length ; i++) {
                         vars.nations.push(json.rows[i].value);
                        }
                        that.$el.append(_.template(that.template, vars));
                        if(that.model.get('_id') != undefined) {
                            that.setFormValues()
                        }
                    },
                    error: function (status) {
                        console.log(status);
                    }
                });
            } else {
                alert('Your status is offline, so we are unable to fetch list of nations for you');
                that.$el.append(_.template(that.template, vars));
                if(that.model.get('_id') != undefined) {
                    that.setFormValues()
                }
            }
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
                        if(element.placeholder != 'Middle Name') {
                            isAllAttributesValid.push(false);
                            alertMessage = "Please fill out all the fields first";
                        }
                    }
                } else {
                    if (element.value != 'Select Language' && element.value != 'Select Nation') {
                        isAllAttributesValid.push(true);
                    } else {
                        isAllAttributesValid.push(false);
                        if(alertMessage == '') {
                            alertMessage = "Please select " + element.name.split('-').pop();
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
            var oldCode = this.model.get('code');
            var newCode = $.trim($('#community-code').val());
            if(oldCode != newCode) {
                this.changeMembersCommunity(oldCode, newCode);
                this.changeCodeInActivityLogs(newCode);
            }
            var prevNation = this.model.get('nationName') + ',' + this.model.get('nationUrl');
            var isChanged = false;
            var that = this;
            var selectedNation = $('#nation-selector').val();
            if(prevNation != selectedNation) {
                isChanged = true;
            }
            selectedNation = selectedNation.split(',');
            var nationName = selectedNation[0];
            var nationUrl = selectedNation[1];
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
                subType:'dummy'
            });
            if(isChanged) {
                this.model.set('registrationRequest', 'pending');
            }
            this.model.save(null, {
                success: function (model, response) {
                    if(isChanged) {
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
                                "target": 'http://nbs:oleoleole@nbs.ole.org:5997/communityregistrationrequests',
                                'doc_ids': docIds
                            }),
                            async: false,
                            success: function (response) {
                                App.stopActivityIndicator();
                                alert("Configurations has been saved");
                                window.location.href = '#dashboard';
                            },
                            error: function(status) {
                                console.log(status);
                                alert(App.languageDict.attributes.UnableToReplicate);
                                App.stopActivityIndicator();
                            }
                        });
                    } else {
                        App.stopActivityIndicator();
                        alert("Configurations has been saved");
                        window.location.href = '#dashboard';
                    }
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