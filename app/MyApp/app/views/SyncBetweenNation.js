$(function() {
    //This form/view is binded with Configuration model
    App.Views.SyncBetweenNation = Backbone.View.extend({

        className: "SyncNation-form",

        vars: {},
        events: {
            "change select#from-nation": 'showOptions',
            "click #syncResources": 'syncResources',
            "click #selectAllButton": function() {
                var isChecked = $('#selectAllButton').prop('checked');
                if(isChecked){
                     $("input[name='result']").each(function() {
                        $(this).prop('checked', true);
                    })
                }else{
                    $("input[name='result']").each(function() {
                        $(this).prop('checked', false);
                    })
                }
            }
            
        },

        template: $('#template-syncBetweenNation').html(),

        syncResources: function() {
            App.startActivityIndicator();
            var resourcesIds =[]
            var that = this
            var sender_nation =  $("#from-nation").val();
            var recevier_nation =  $("#to-nation").val();
            var str = sender_nation.split(",");
            var s_admin_name = str[0];
            var s_nationUrl = str[1];
            var str1 = recevier_nation.split(",");
            var r_admin_name = str1[0];
            var r_nationUrl = str1[1];

            if ($("#from-nation").val() != $("#to-nation").val()) {
                $("input[name='result']").each(function() {
                    if ($(this).is(":checked")) {
                        resourcesIds.push($(this).val())
                    }
                });
                console.log(resourcesIds)
                 $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    type: 'POST',
                    url: '/_replicate',
                    dataType: 'json',
                    data: JSON.stringify({
                        "source": 'http://'+ s_admin_name +':'+App.password+'@'+ s_nationUrl + '/resources',
                        "target": 'http://'+ r_admin_name +':'+App.password+'@'+ r_nationUrl + '/resources',
                        'doc_ids': resourcesIds
                    }),
                    async: false,
                    success: function (response) {
                        console.log(response)
                        App.stopActivityIndicator();
                        alert(App.languageDict.attributes.Resources_Synced_Success);
                    },
                    error: function(status){
                        console.log(status);
                        App.stopActivityIndicator();
                        alert(App.languageDict.attributes.Resources_Synced_Error);
                    }
                });
            } else {
                alert("sender and recevier are same")
            }
        },
        showOptions: function(e){
            if(e.currentTarget.value != ""){
                $('#list_courses_resources').show();
                $('a#aResources').css({"text-decoration": "underline","font-size": "30px"});
                this.showResources(e.currentTarget.value);
            }
        },
        showResources: function(r_options){
            App.startActivityIndicator();
            var that = this;
            $('tbody#tbodyList').children('tr').remove();
            if(r_options != ""){
                var str = r_options.split(",");
                admin_name = str[0];
                nationUrl = str[1];
                $.ajax({
                url: 'http://'+ admin_name + ':oleoleole@' + nationUrl + '/resources/_all_docs?include_docs=true',
                type: 'GET',
                dataType: 'jsonp',
                    success: function (response) {
                        if(response.rows.length > 1){
                            var tbodyList = "";
                            for(var i = 0; i < response.rows.length; i++){
                                var title = response.rows[i].doc.title;
                                var publisher = response.rows[i].doc.Publisher;
                                var author = response.rows[i].doc.author;
                                var id = response.rows[i].id;
                                if(publisher != undefined){
                                    console.log( response.rows[i].doc)
                                    var checkbox = "<input id="+ id +" type='checkbox' name='result' value="+ id +" >";
                                    tbodyList += "<tr><td>" + checkbox + "</td><td>" + title + "</td><td>" + author + "</td><td>" + publisher + "</td></tr>";
                                }
                            }
                            $("tbody#tbodyList").append(tbodyList);
                            App.stopActivityIndicator();
                        }else{
                            console.log("There is no data available !!!");
                            App.stopActivityIndicator();
                        }
                    },
                    error: function(status) {
                        console.log(status);
                        App.stopActivityIndicator();
                    }
                });
                App.stopActivityIndicator();
            }else{
                App.stopActivityIndicator();
            }
            
        },

        render: function() {
            var configDoc = getCommunityConfigs();
            var centralNationUrl = getCentralNationUrl();
            var that = this;
            var vars = {};
            vars["nations"] = [];
            vars["languages"] = [];
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
                    },
                    error: function (status) {
                        console.log(status);
                    }
                });
            } /*else {
                alert(App.languageDict.get('offline_Status_warning'));
                that.$el.append(_.template(that.template, vars));
                if(that.model.get('_id') != undefined) {
                    that.setFormValues()
                }
            }*/
        }

    })

})