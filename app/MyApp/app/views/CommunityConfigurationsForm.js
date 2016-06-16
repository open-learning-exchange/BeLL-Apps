$(function() {

    App.Views.CommunityConfigurationsForm = Backbone.View.extend({

        className: "addNation-form",

        vars: {},

        events: {
            "click #commConfigFormButton":"validateForm"
        },

        template: $('#template-addCommunity').html(),

        render: function() {
            $('#nav').css('pointer-events', 'none');
            var that = this;
            var vars = {"nations":[],"languages":[]};
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
                    },
                    error: function (status) {
                        console.log(status);
                    }
                });
            } else {
                alert('Your status is offline, so we are unable to fetch list of nations for you');
                that.$el.append(_.template(that.template, vars));
            }
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
            var that = this;
            var nation = $('#nation-selector').val();
            nation = nation.split(',');
            var nationName = nation[0];
            var nationUrl = nation[1];
                this.model.set({
                    name: $.trim($('#community-name').val()),
                    code: $.trim($('#community-code').val()),
                    nationName: nationName,
                    nationUrl: nationUrl,
                    currentLanguage: $('#language-selector').val(),
                    region: $.trim($('#community-region').val()),
                    sponsorName: $('#org-name').val(),
                    sponsorAddress: $('#org-address').val(),
                    contactFirstName: $('#org-firstname').val(),
                    contactMiddleName: $('#org-middlename').val(),
                    contactLastName: $('#org-lastname').val(),
                    contactPhone: $('#org-phone').val(),
                    contactEmail: $('#org-email').val(),
                    sponsorUrl: $('#org-url').val(),
                    superManagerFirstName: $('#leader-firstname').val(),
                    superManagerMiddleName: $('#leader-middlename').val(),
                    superManagerLastName: $('#leader-lastname').val(),
                    superManagerPhone: $('#leader-phone').val(),
                    superManagerEmail: $('#leader-email').val(),
                });
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
                            "source": "communityconfigurations",
                            "target": 'http://nbs:oleoleole@nbs.ole.org:5997/registeredcommunities',
                            'doc_ids': docIds
                        }),
                        async: false,
                        success: function (response) {
                            App.stopActivityIndicator();
                            alert("Community Configurations saved");
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
        }
    })

})