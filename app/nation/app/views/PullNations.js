$(function() {

    var admin_name = "";
    var nationUrl = "";

    App.Views.PullNations = Backbone.View.extend({

        template: $('#template-GetResource').html(),

        vars:{},

        events: {
            "change select#nationList": 'showOptions',
            "click .btn-primary": 'checkBtn',
            "click a.alink": 'checkLink'
        },
        
        initialize: function() {
        },

        render: function() {
            var that = this;
             var centralNationUrl = App.Router.getCentralNationUrl();
             $.ajax({
                url: 'http://' + centralNationUrl + '/nations/_design/bell/_view/getAllNations?_include_docs=true',
                type: 'GET',
                dataType: 'jsonp',
                async: false,
                success: function (json) {
                   that.vars.options = "";
                   var options1 = "<option value =''>" + App.languageDictValue.attributes.select_nation + "</option>";
                    for(var i = 0 ; i < json.rows.length ; i++) {
                        options1 += "<option value ='"+ json.rows[i].value.admin_name+","+json.rows[i].value.nationurl +"'>"+ json.rows[i].value.name +"</option>";
                    }   
                    that.vars.options = options1;
                    that.vars.response = "";
                    that.$el.html(_.template(that.template,that.vars))
                },
                error: function (status) {
                    console.log(status);
                }
               
            });
        },
        
        showOptions: function(e){
            if(e.currentTarget.value != ""){
                $('p#optionsList').show();
                $('a#aResources').css({"text-decoration": "underline","font-size": "30px"});
                this.showResources(e.currentTarget.value);
            }
        },

        checkLink: function(e){
            if(e.currentTarget.id == "aResources"){
                $('a#aResources').css({"text-decoration": "underline","font-size": "25px","cursor": "pointer"});
                $('a#aCourses').attr('style', '');
                $('a#aCourses').css({"cursor": "pointer"});
                var val = $( "select#nationList option:selected" ).val();
                this.showResources(val);
            }else if(e.currentTarget.id == "aCourses"){
                $('a#aCourses').css({"text-decoration": "underline","font-size": "25px","cursor": "pointer"});
                $('a#aResources').attr('style', '');
                $('a#aResources').css({"cursor": "pointer"});
                var val = $( "select#nationList option:selected" ).val();
                this.showCourses(val);
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
                        console.log(response);
                        if(response.rows.length > 1){
                            var tbodyList = "";
                            for(var i = 0; i < response.rows.length; i++){
                                var publisher = response.rows[i].doc.Publisher;
                                var id = response.rows[i].id;
                                if(publisher != undefined){
                                    var btnOpen = "<button type='button' class='btn btn-primary' value="+ id +" name='r_view' data-toggle='modal' data-target='#modalResources'>" + App.languageDictValue.attributes.View_Details + "</button>";
                                    var btnAdd = "<button type='button' class='btn btn-primary' value="+ id +" name='r_add'>" + App.languageDictValue.attributes.Add + "</button>";
                                    var totalBtn = btnOpen + '  ' + btnAdd;
                                    tbodyList += "<tr><td>" + publisher + "</td><td>" + totalBtn + "</td></tr>";
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
                $('div.#list_courses_resources').show();
                App.stopActivityIndicator();
            }else{
                $('div.#list_courses_resources').hide();
                App.stopActivityIndicator();
            }
            
        },

        showCourses: function(c_options){
            App.startActivityIndicator();
            var that = this;
            $('tbody#tbodyList').children('tr').remove();
            if(c_options != ""){
                var str = c_options.split(",");
                admin_name = str[0];
                nationUrl = str[1];
                $.ajax({
                url: 'http://'+ admin_name + ':oleoleole@' + nationUrl + '/courses/_all_docs?include_docs=true',
                type: 'GET',
                dataType: 'jsonp',
                    success: function (response) {
                        console.log(response);
                        if(response.rows.length > 1){
                            var tbodyList = "";
                            console.log(response.rows);
                            for(var i = 0; i < response.rows.length; i++){
                                var name = response.rows[i].doc.name;
                                var id = response.rows[i].id;
                                if(name != undefined){
                                    var btnOpen = "<button type='button' class='btn btn-primary' value="+ id +" name='c_view' data-toggle='modal'  data-target='#modalCourses'>" + App.languageDictValue.attributes.View_Details + "</button>";
                                    var btnAdd = "<button type='button' class='btn btn-primary' value="+ id +" name='c_add'>" + App.languageDictValue.attributes.Add + "</button>";
                                    var totalBtn = btnOpen + '  ' + btnAdd;
                                    tbodyList += "<tr><td>" + name + "</td><td>" + totalBtn + "</td></tr>";
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
                $('div.#list_courses_resources').show();
                App.stopActivityIndicator();
            }else{
                $('div.#list_courses_resources').hide();
                App.stopActivityIndicator();
            }
        },

        addToNation: function(doc_name,doc_id){
            if(doc_name && doc_id){
                App.startActivityIndicator();
                if(doc_name == "resources"){
                    $.ajax({
                    url: 'http://'+ admin_name + ':oleoleole@' + nationUrl + '/resources/_design/bell/_view/GetResourcesByID?include_docs=true&key="'+ doc_id +'"',
                    type: 'GET',
                    dataType: 'jsonp',
                        success: function (response) {
                            if(response.rows.length > 0){
                                var jsonData = [];
                                jsonData.push(doc_id);
                                var doc = response.rows[0].doc;
                                $.ajax({
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json; charset=utf-8'
                                    },
                                    type: 'POST',
                                    url: '/_replicate',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        "source": 'http://' + nationUrl + '/resources',
                                        "target": 'resources',
                                        'doc_ids': jsonData
                                    }),
                                    async: false,
                                    success: function (response) {
                                        alert(App.languageDictValue.attributes.Added_Success);
                                        App.stopActivityIndicator();
                                    },
                                    error: function(status) {
                                        console.log(status);
                                        App.stopActivityIndicator();
                                    }
                                });
                            }else{
                                console.log("There is no data available !!!");
                                App.stopActivityIndicator();
                            }
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                    App.stopActivityIndicator();
                }else if(doc_name == "courses"){
                    $.ajax({
                    url: 'http://'+ admin_name + ':oleoleole@' + nationUrl + '/courses/_design/bell/_view/GetCourseByID?include_docs=true&key="'+ doc_id +'"',
                    type: 'GET',
                    dataType: 'jsonp',
                        success: function (response) {
                            if(response.rows.length > 0){
                                var jsonData = [];
                                jsonData.push(doc_id);
                                var doc = response.rows[0].doc;
                                $.ajax({
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json; charset=utf-8'
                                    },
                                    type: 'POST',
                                    url: '/_replicate',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        "source": 'http://' + nationUrl + '/courses',
                                        "target": 'courses',
                                        'doc_ids': jsonData
                                    }),
                                    async: false,
                                    success: function (response) {
                                        alert(App.languageDictValue.attributes.Added_Success);
                                        App.stopActivityIndicator();
                                    },
                                    error: function(status) {
                                        console.log(status);
                                        App.stopActivityIndicator();
                                    }
                                });
                            }else{
                                console.log("There is no data available !!!");
                                App.stopActivityIndicator();
                            }
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                    App.stopActivityIndicator();
                }
            }
        },

        viewDetails: function(doc_name,doc_id){
            if(doc_name && doc_id){
                $('dd').html('');
                if(doc_name == "resources"){
                    $.ajax({
                    url: 'http://'+ admin_name + ':oleoleole@' + nationUrl + '/resources/_design/bell/_view/GetResourcesByID?include_docs=true&key="'+ doc_id +'"',
                    type: 'GET',
                    dataType: 'jsonp',
                        success: function (response) {
                            if(response.rows.length > 0){
                                var doc = response.rows[0].doc;
                                var subjects = "";
                                for(var i = 0; i < doc.subject.length; i++){
                                    subjects += doc.subject[i]+" ";
                                }
                                var levels = "";
                                for(var i = 0; i < doc.Level.length; i++){
                                    levels += doc.Level[i]+" ";
                                }
                                $('dd#author').html(doc.author);
                                $('dd#year').html(doc.Year);
                                $('dd#media').html(doc.Medium);
                                $('dd#language').html(doc.language);
                                $('dd#subject').html(subjects);
                                $('dd#level').html(levels);
                                $('dd#publisher').html(doc.Publisher);
                                $('dd#linkToLicense').html(doc.linkToLicense);
                                $('dd#resourceFor').html(doc.resourceFor);
                                $('dd#resourceType').html(doc.resourceType);
                            }else{
                                console.log("There is no data available !!!");
                            }
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                }else if(doc_name == "courses"){
                    $.ajax({
                    url: 'http://'+ admin_name + ':oleoleole@' + nationUrl + '/courses/_design/bell/_view/GetCourseByID?include_docs=true&key="'+ doc_id +'"',
                    type: 'GET',
                    dataType: 'jsonp',
                        success: function (response) {
                            console.log(response);
                            if(response.rows.length > 0){
                                var doc = response.rows[0].doc;
                                var schedule = doc.startDate + ' | ' +doc.startTime;
                                $('dd#name').html(doc.CourseTitle);
                                $('dd#subjectLevel').html(doc.subjectLevel);
                                $('dd#gradeLevel').html(doc.gradeLevel);
                                $('dd#description').html(doc.description);
                                $('dd#schedule').html(schedule);
                                $('dd#location').html(location);
                            }else{
                                console.log("There is no data available !!!");
                            }
                        },
                        error: function(status) {
                            console.log(status);
                        }
                    });
                }
            }
        },

        checkBtn: function(e){
            if(e){
                var id = e.currentTarget.value;
                if(e.currentTarget.name == "r_view"){
                    this.viewDetails("resources",id);
                }else if(e.currentTarget.name == "r_add")
                    this.addToNation("resources",id);
                else if(e.currentTarget.name == "c_view")
                    this.viewDetails("courses",id);
                else if(e.currentTarget.name == "c_add")
                    this.addToNation("courses",id);
            }
        }
    })
})
