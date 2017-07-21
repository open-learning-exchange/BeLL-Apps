$(function() {
    var grpId= "";
    var rid = "";
    var levelId = "";
    var revId = "";
    App.Views.LevelDetail = Backbone.View.extend({
        template: $("#template-Search").html(),
        vars: {},
        courseresult: null,
        resultArray: null,
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            'click #AddRes': 'SearchPopup',
            "click .remover": function(e) {
                var that = this
                var rid = e.currentTarget.value
                var rtitle = this.model.get("resourceTitles")
                var rids = this.model.get("resourceId")
                var index = rids.indexOf(rid)
                rids.splice(index, 1)
                rtitle.splice(index, 1)
                this.model.set("resourceId", rids)
                this.model.set("resourceTitles", rtitle)
                this.model.save(null, {
                    success: function(responseModel, responseRev) {
                        that.model.set("_rev", responseRev.rev)
                        $('#' + rid.replace("\.", "\\.")).remove();
                    }
                })
            },
            "click .removeAttachment": function(e) {
                var that = this
                var attachmentNo = e.currentTarget.value
                $.ajax({
                    url: '/coursestep/' + this.model.get('_id') + '/' + _.keys(this.model.get('_attachments'))[attachmentNo] + '?rev=' + this.model.get("_rev"),
                    type: 'DELETE',
                    success: function(response, status, jqXHR) {
                        alert(App.languageDict.attributes.Successfully_Deleted)
                        App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    }
                })

            },
            "click .levelResView": function(e) {
                var rid = e.currentTarget.attributes[0].value
                var levelId = this.model.get("_id")
                var revid = this.model.get("_rev")
                Backbone.history.navigate('resource/atlevel/feedback/' + rid + '/' + levelId + '/' + revid, {
                    trigger: true
                })

            },
            "click #addInstructions": function(e) {
                var fileinput = document.forms["fileAttachment"]["_attachments"]
                fileinput.click();
            },
            "change #_attachments": function(e) {
                var that = this
                var img = $('input[type="file"]')
                var extension = img.val().split('.')
                if (img.val() != "" && extension[(extension.length - 1)] != 'doc' && extension[(extension.length - 1)] != 'pdf' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'ppt' && extension[(extension.length - 1)] != 'docx' && extension[(extension.length - 1)] != 'pptx' && extension[(extension.length - 1)] != 'jpg' && extension[(extension.length - 1)] != 'jpeg' && extension[(extension.length - 1)] != 'png' && extension[(extension.length - 1)] != 'mp4' && extension[(extension.length - 1)] != 'mov' && extension[(extension.length - 1)] != 'mp3') {
                    alert(App.languageDict.attributes.Invalid_Attachment)
                    return
                }
                //this.model.unset('_attachments')
                if ($('input[type="file"]').val()) {
                    this.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                } else {
                    ////no attachment
                    alert(App.languageDict.attributes.No_Attachment)
                }
                this.model.on('savedAttachment', function() {
                    /////Attatchment successfully saved
                    alert(App.languageDict.attributes.Assignment_Submit_Success)
                    App.Router.ViewLevel(that.model.get('_id'), that.model.get("_rev"))
                    //                 this.$el.html('')
                    //                 this.model.fetch({async:false})
                    //                 this.render()
                }, this.model)

            }
        },
        initialize: function() {
            this.courseresult = new App.Collections.Resources()
            this.resultArray = []
            enablenext = 0;
        },

        SearchPopup: function(){
            $('#invitationdiv').css({'width' : '50%', 'height' : '60%', 'overflow' : 'auto', 'margin-left' : '25%' });
            $('#invitationdiv').fadeIn(1000)
            document.getElementById('cont').style.opacity = 0.1
            document.getElementById('nav').style.opacity = 0.1
            var that = this;
            $('#invitationdiv').show()
            var levelInfo = new App.Models.CourseStep({
                "_id": levelId
            })
            levelInfo.fetch({
                success: function(response){
                    if (typeof levelId === 'undefined') {
                        document.location.href = '#courses'
                    }
                    if (typeof rid === 'undefined') {
                        document.location.href = '#courses'
                    }
                    grpId = levelId
                    levelrevId = rid
                    ratingFilter.length = 0
                    rtitle.length = 0
                    rids.length = 0
                    var inviteForm = new App.Views.Search()
                    //inviteForm.resourceids = levelInfo.get("resourceId")
                    //inviteForm.addResource = true
                    inviteForm.render()
                    $('#invitationdiv').html('&nbsp')
                    $('#invitationdiv').append('<a id="Close" class="btn btn-danger destroy">'+App.languageDict.attributes.Close+'</a>')
                    $("#Close").click(function(e){
                         Backbone.history.loadUrl('level/view/' + levelId + '/' + revId, {
                            return: false
                        })
                        $("#cont").css('opacity', "")
                        $("#nav").css('opacity', "")
                        $("#invitationdiv").hide()
                    })
                    $('#invitationdiv').append(inviteForm.el)
                    $('#searchText').hide()
                    $("#multiselect-collections-search").multiselect().multiselectfilter();
                    $("#multiselect-collections-search").multiselect({
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected,
                        noneSelectedText: App.languageDict.attributes.Select_An_option
                    });
                    $("#multiselect-collections-search").multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $('.ui-multiselect-filter').find('input').attr('placeholder',App.languageDict.attributes.KeyWord_s);
                    $("#multiselect-levels-search").multiselect().multiselectfilter();
                    $("#multiselect-levels-search").multiselect({
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected,
                        noneSelectedText: App.languageDict.attributes.Select_An_option
                    });
                    $("#multiselect-levels-search").multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $("#multiselect-medium-search").multiselect({
                        multiple: false,
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        selectedList: 1
                    });
                    $("#search-language").multiselect({
                        multiple: false,
                        header: App.languageDict.attributes.Select_An_option,
                        noneSelectedText: App.languageDict.attributes.Select_An_option,
                        selectedList: 1
                    });
                    $('button#searchR.btn.btn-info').hide()
                    $("#srch").hide()
                    $('#searchR').hide()
                    $(".search-bottom-nav").hide()
                    $(".search-result-header").hide()
                    $("#selectAllButton").hide()
                    $(".courseSearchResults_Bottom").hide()
                    $('#next_button').hide()
                    showSubjectCheckBoxes()
                    $("#multiselect-subject-search").multiselect().multiselectfilter();
                    $("#multiselect-subject-search").multiselect({
                        checkAllText: App.languageDict.attributes.checkAll,
                        uncheckAllText: App.languageDict.attributes.unCheckAll,
                        selectedText: '# '+App.languageDict.attributes.Selected,
                        noneSelectedText: App.languageDict.attributes.Select_An_option
                    });
                    $("#multiselect-subject-search").multiselect().multiselectfilter("widget")[0].children[0].firstChild.data=App.languageDict.attributes.Filter;
                    $('#invitationdiv').append('<a id="search1" class="btn btn btn-info">'+App.languageDict.attributes.Search+'</a>')
                    $("#search1").click(function(e){
                        that.search()
                        if(that.courseresult.length == 0){
                            that.GoBackToSearch()
                            $("#Add").hide()
                        }
                    })
                    $('#invitationdiv').append('<div class="container- fluid Search-Btns" style="display:block; padding-top: 5%; padding-bottom: 10%;"></div>')
                    $(".Search-Btns").append('<a id="previous-button" class="btn btn-success">'+App.languageDict.attributes.Previous+'</a>&nbsp;&nbsp;')
                    $(".Search-Btns").append('<a id="BacktoSearch" class="btn btn-success" style = "margin-left: 28%; margin-top: -30px;">'+App.languageDict.attributes.Back_to_Search+'</a>&nbsp;&nbsp;')
                    $(".Search-Btns").append('<a id="Add" class="btn btn-success" style = "margin-top: -30px;">'+App.languageDict.attributes.Add_To_Level+'</a>&nbsp;&nbsp;')
                    $(".Search-Btns").append('<a id="next-button" class="btn btn-success">'+App.languageDict.attributes.Next+'</a>')
                    $('#BacktoSearch').click(function(e){
                        that.GoBackToSearch()
                    })
                    $('#previous-button').click(function(e){
                        that.GoBacktoPrevious()
                    })
                    $("#Add").click(function(e){
                        that.AddResources()
                    })
                    $("#next-button").click(function(e){
                        that.NextButtonPressed()
                    })
                    $(".Search-Btns").hide()
                    $('#textSearch').keypress(function(e){
                        if(e.keyCode == 13){
                            that.search()
                            if(that.courseresult.length == 0){
                                $("#invitationdiv").append("<table style='margin-top: -145px;text-align: center;'><tr><td style='width: 630px;'><h6>"+App.languageDict.attributes.No_Resource_Found+"</h6></td></tr></table>")
                                $("#Add").hide()
                            }
                        }
                    })
                }
            })
            $("#Close").show()
        },

        initialize: function() {
            this.courseresult = new App.Collections.Resources()
            this.resultArray = []
            enablenext = 0;
        },

        addResourceToStepView: function() {
            var obj = this
            var ResultCollection = new Backbone.Collection();
            if (obj.resultArray.length > 0) {
                ResultCollection.set(obj.resultArray)
                var SearchSpans = new App.Views.SearchSpans({
                    collection: ResultCollection
                })

                SearchSpans.resourceids = obj.resourceids
                SearchSpans.render()
                $('#srch').append(SearchSpans.el)
            }
        },

        GoBackToSearch:function(){
            this.SearchPopup()
         },
        AddResources: function(){
            if(typeof levelId === 'undefined'){
                document.location.href = '#courses'
            }
            var cstep = new App.Models.CourseStep({
                "_id": levelId
            })
            cstep.fetch({
                async: false,
                success: function(response){
                }
            })
            var oldIds = cstep.get("resourceId")
            var oldTitles = cstep.get("resourceTitles")
            $("input[name='result']").each(function() {
                if ($(this).is(":checked") == true) {
                    var rId = $(this).val();
                    if (oldIds.indexOf(rId) == -1) {
                        rtitle.push($(this).attr('rTitle'))
                        rids.push(rId)
                    }
                }
            });
            if(rids != "" && rtitle != ""){
                cstep.set("resourceId", oldIds.concat(rids))
                cstep.set("resourceTitles", oldTitles.concat(rtitle))
                cstep.save(null, {
                    success: function(responseModel, responseRev) {
                        cstep.set("_rev", responseRev.rev)
                        alert(App.languageDict.attributes.Resource_Updated)
                        Backbone.history.navigate('level/view/' + responseRev.id + '/' + responseRev.rev, {
                            trigger: true
                        })
                        $("#cont").css('opacity', "")
                        $("#nav").css('opacity', "")
                        $("#invitationdiv").hide()
                    }
                })
                rids = []
                rtitle = []
            } else {
                Backbone.history.navigate('level/view/' + cstep.get("id") + '/' + cstep.get("rev"), {
                    trigger: true
                })
                $("#cont").css('opacity', "")
                $("#nav").css('opacity', "")
                $("#invitationdiv").hide()
            }
        },

        NextButtonPressed: function(e) {
            App.startActivityIndicator()
            this.courseresult.skip = this.courseresult.skip + 20;
            this.courseresult.fetch({
                async: false
            })
            console.log(this.courseresult)
            App.stopActivityIndicator()
            var obj = this
            if (this.courseresult.length > 0) {
                var SearchSpans = new App.Views.SearchSpans({
                    collection: this.courseresult,
                })
                SearchSpans.resourceids = obj.resourceids
                SearchSpans.render()
                $('#srch').html(SearchSpans.el)
                $("#previous-button").show()
                if (this.courseresult.length < 20) {
                    $("#next-button").hide();
                }
            } else {
                this.courseresult.skip = this.courseresult.skip - 20;
                $("#next-button").hide();
            }
        },

        GoBacktoPrevious: function(e) {
            App.startActivityIndicator()
            this.courseresult.skip = this.courseresult.skip - 20;
            this.courseresult.fetch({
                async: false
            })
            App.stopActivityIndicator()
            var obj = this
            if (this.courseresult.length > 0) {
                var SearchSpans = new App.Views.SearchSpans({
                    collection: this.courseresult
                })
                SearchSpans.resourceids = obj.resourceids
                SearchSpans.render()
                $('#srch').html(SearchSpans.el)
                $("#next-button").show()
            } else {
                $("#previous-button").hide();
            }
            if (this.courseresult.skip <= 0) {
                $("#previous-button").hide();
            }
        },

        search:function(e){
            searchText = $("#textSearch").val()
            var collectionFilter = new Array()
            var subjectFilter = new Array()
            var levelFilter = new Array()
            ratingFilter.length = 0

            collectionFilter = $("#multiselect-collections-search").val()
            subjectFilter = $("#multiselect-subject-search").val()
            levelFilter = $("#multiselect-levels-search").val()
            mediumFilter = $('#multiselect-medium-search').val()
            languageFilter = $('#search-language').val()
            $("input[name='star']").each(function() {
                if ($(this).is(":checked")) {
                    ratingFilter.push($(this).val());
                }
            })
            if (searchText != "" || (collectionFilter) || (subjectFilter) || (levelFilter) || (mediumFilter) || (languageFilter) || (ratingFilter && ratingFilter.length > 0)) {

                this.collectionFilter = collectionFilter
                this.levelFilter = levelFilter
                this.subjectFilter = subjectFilter
                this.ratingFilter = ratingFilter
                this.mediumFilter = mediumFilter
                this.languageFilter = languageFilter
                this.addResource = true
                App.$el.children('.body').html(search.el)
                this.render()
                $("#searchText2").val(searchText)
                $("#srch").show()
                $(".row").hide()
                $('.courseSearchResults_Bottom').hide()
                $(".search-bottom-nav").hide()
                $(".search-result-header").hide()
                $("#selectAllButton").show()
                $("#previous-button").hide()
                $(".Search-Btns").show()
            }
            $('#next-button').hide()
            $('#previous_button').hide()
            $('#textSearch').focus();
            $("#textSearch").val(searchText)
        },

        render: function() {
            $("a#search1.btn.btn.btn-info").hide()
            $("#textSearch").hide()
            var obj = this
            var collections = App.collectionslist
            this.vars.tags = collections.toJSON();
            this.vars.languageDict=App.languageDict;
            this.vars.levelArray=App.languageDict.get('LevelArray');
            this.vars.mediaArray=App.languageDict.get('mediaList');
            this.vars.languages=getAvailableLanguages();
            this.vars.addResource = this.addResource
            if (typeof this.Publications != 'undefined') {
                this.vars.Publications = this.Publications
            } else {
                this.vars.Publications = false
            }
            if (searchText != "" || (this.collectionFilter) || (this.subjectFilter) || (this.levelFilter) || (this.languageFilter) || (this.mediumFilter) || (this.ratingFilter && this.ratingFilter.length > 0)) {
                App.startActivityIndicator()
                this.getSearchedRecords();
            }
            this.$el.append('<br/><br/><B>'+App.languageDict.attributes.Resources+'</B>&nbsp;&nbsp;<a id="AddRes" class="btn btn-success" lvlid ="'+levelId+'" lid="'+rid+'">'+App.languageDict.attributes.Add+'</a><br/><br/>')
            var i = 0
            var rtitle = this.model.get("resourceTitles")
            rid = this.model.get("resourceId")
            levelId = this.model.get("_id")
            revId = this.model.get("_rev")
            var stepResources = '</BR><table class="table table-striped">'
            if (this.model.get("resourceTitles")) {
                for (i = 0; i < this.model.get("resourceTitles").length; i++) {
                    var r = new App.Models.Resource({
                        "_id": rid[i]
                    })
                    r.fetch({
                        async: false
                    })
                    if (!(r.get("hidden"))) {
                        if (r.get("_attachments")) {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td><a class='levelResView btn btn-info' href='/apps/_design/bell/bell-resource-router/index.html#open/" + rid[i] + "/"+rtitle[i]+"'  target='_blank' value='" + rid[i] + "'><i class='icon-eye-open'></i>"+App.languageDict.attributes.View+"</a></td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        } else {
                            stepResources = stepResources + ("<tr id='" + rid[i] + "'><td>" + rtitle[i] + "</td><td>"+App.languageDict.attributes.No_Attachment+"</td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                        }
                    }
                }
                stepResources = stepResources + '</table>'
                this.$el.append(stepResources)
                var uploadString = '<form method="post" id="fileAttachment">'
                uploadString = uploadString + '<input type="file" name="_attachments" id="_attachments" multiple="multiple" style="display: none" /> '
                uploadString = uploadString + '<input class="rev" type="hidden" name="_rev"></form>'
                this.$el.append(uploadString)
                if (!this.model.get('_attachments')) {
                    return
                }
                var tableString = '<table class="table table-striped">'
                for (i = 0; i < _.keys(this.model.get('_attachments')).length; i++) {

                    var attachmentURL = '/coursestep/' + this.model.get('_id') + '/'
                    var attachmentName = ''
                    if (typeof this.model.get('_attachments') !== 'undefined') {
                        attachmentURL = attachmentURL + _.keys(this.model.get('_attachments'))[i]
                        attachmentName = _.keys(this.model.get('_attachments'))[i]
                    }
                    tableString = tableString + ("<tr><td>" + attachmentName + "</td><td><a class='btn btn-info' href='" + attachmentURL + "'  target='_blank' ><i class='icon-eye-open'></i>"+App.languageDict.attributes.View+"</a></td><td><button class='removeAttachment btn btn-danger' value='" + i + "'>"+App.languageDict.attributes.Remove+" </button><input type='hidden'/>")
                }
                tableString = tableString + '</table>'
                this.$el.append(tableString)
            }
        },

        getSearchedRecords: function() {
            var mapFilter = {};
            var filters = new Array()
            if (this.collectionFilter && searchText.replace(" ", "") == '' && !(this.subjectFilter)) {
                for (var i = 0; i < this.collectionFilter.length; i++) {
                    filters.push(this.collectionFilter[i])
                }
            } else {
                if (this.collectionFilter && (searchText.replace(" ", "") != '' || this.subjectFilter)) {
                    mapFilter["Tag"] = this.collectionFilter;
                }
            }
            if (this.subjectFilter && searchText.replace(" ", "") == '') {
                for (var i = 0; i < this.subjectFilter.length; i++) {
                    filters.push(this.subjectFilter[i].toLowerCase())
                }
            } else {
                if (this.subjectFilter && searchText.replace(" ", "") != '') {
                    mapFilter["subject"] = this.subjectFilter;
                }
            }
            if (this.levelFilter && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.levelFilter.length; i++) {
                    filters.push(this.levelFilter[i].toLowerCase())
                }
            } else {
                if (this.levelFilter && (this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["Level"] = this.levelFilter;
                }
            }
            if (this.mediumFilter && !(this.levelFilter) && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.mediumFilter.length; i++) {
                    filters.push(this.mediumFilter[i].toLowerCase())
                }
            } else {
                if (this.mediumFilter && (this.levelFilter || this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["Medium"] = this.mediumFilter;
                }
            }
            if (this.languageFilter && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                for (var i = 0; i < this.languageFilter.length; i++) {
                    filters.push(this.languageFilter[i])
                }
            } else {
                if (this.languageFilter && (searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                    mapFilter["language"] = this.languageFilter;
                }
            }
            if(this.ratingFilter!=undefined){
                if (this.ratingFilter.length > 0 && !(this.mediumFilter) && !(this.levelFilter) && !(this.languageFilter) && searchText.replace(" ", "") == '' && !(this.subjectFilter) && !(this.collectionFilter)) {
                    for (var i = 0; i < this.ratingFilter.length; i++) {
                        filters.push(parseInt(this.ratingFilter[i]))
                    }
                } else {
                    if (this.ratingFilter.length > 0 && (this.mediumFilter || this.levelFilter || this.languageFilter || searchText.replace(" ", "") != '' || this.subjectFilter || this.collectionFilter)) {
                        mapFilter["timesRated"] = this.ratingFilter;
                    }
                }
            }
            var prefix, prex, searchTxt, searchText_Coll_Id;
            var searchTextArray = [];
            if (searchText != '') {
                prefix = searchText.replace(/[!(.,'";):&]+/gi, "").toLowerCase()
                filters.push(prefix);
                /* Get Collection Id from collection list database by passing the name of collection*/
                $.ajax({
                    url: '/collectionlist/_design/bell/_view/collectionByName?_include_docs=true&key="' + prefix + '"',
                    type: 'GET',
                    dataType: 'json',
                    success: function(collResult) {
                        if (collResult.rows.length > 0) {
                            searchText_Coll_Id = collResult.rows[0].id;
                            filters.push(searchText_Coll_Id);
                        }
                    },
                    error: function() {
                        alert(App.languageDict.attributes.Fetch_Collections_Error);
                    },
                    async: false
                });
                /****************************************************************************************/
                /****************************************************************************************/
                searchTxt = searchText.replace(/[" "-]+/gi, "").toLowerCase()
                if (searchTxt != null) {
                    filters.push(searchTxt)
                }
                //prefix = searchText.replace(/[!(.,;):&]+/gi, "").toLowerCase().split(" ")
                prefix = searchText.replace(/[!(.,;'"):&]+/gi, "").toLowerCase()
                prex = prefix.replace(/[-]+/gi, " ");
                filters.push(prex);
                prefix = prefix.replace(/[-]+/gi, " ").split(" ")
                searchTextArray = prefix;
                for (var idx in prefix) {
                    if (prefix[idx] != ' ' && prefix[idx] != "" && prefix[idx] != "the" && prefix[idx] != "an" && prefix[idx] != "a" && prefix[idx] != "and" && prefix[idx] != "&")
                        filters.push(prefix[idx])
                }
                /*****************************************************************************************************/
            }
            var fil = JSON.stringify(filters);
            this.courseresult.skip = 0
            this.courseresult.collectionName = fil;
            this.courseresult.fetch({
                async: false
            })
            //Checking the AND Conditions here
            var resultModels;
            if (this.courseresult.models.length > 0 && !this.isEmpty(mapFilter)) {
                var tempResultModels = this.courseresult.models;
                resultModels = this.checkANDConditions(mapFilter, tempResultModels);
            }
            if (this.courseresult.models.length > 0 && searchText != '' && this.isEmpty(mapFilter)) {
                if (searchText_Coll_Id != null || searchText_Coll_Id != undefined) {
                    var collection_id = searchText_Coll_Id;
                }
                var tempModels = this.courseresult.models;
                resultModels = this.checkSearchTextCompleteMatch(searchTextArray, collection_id, tempModels);
            }
            if (resultModels != null) {
                this.courseresult.models = resultModels;
                if (resultModels.length == 0) {
                    this.courseresult.length = 0;
                } else {
                    this.courseresult.length = resultModels.length;
                }
            }
            //End of the checking AND Conditions here
            App.stopActivityIndicator()
            var obj = this
            if (obj.addResource == true) {
                if (this.courseresult.length > 0) {
                    var SearchSpans = new App.Views.SearchSpans({
                        collection: this.courseresult,
                        attributes:{
                            LevelID : levelId
                        }
                    })

                    SearchSpans.resourceids = obj.resourceids
                    SearchSpans.render()
                    $('#srch').append(SearchSpans.el)
                }
            } else {
                var loggedIn = App.member
                var roles = loggedIn.get("roles")
                var SearchResult = new App.Views.ResourcesTable({
                    collection: this.courseresult
                })
                SearchResult.removeAlphabet = true
                SearchResult.isManager = roles.indexOf("Manager")
                SearchResult.resourceids = obj.resourceids
                SearchResult.collections = App.collectionslist
                SearchResult.render()
                $('#srch').html('<h4>'+App.languageDict.attributes.Search_Result+'<a class="backToSearchButton" class="btn btn-info" onclick="backtoSearchView()">'+App.languageDict.attributes.Back_to_Search+'</a></h4>')
                $('#srch').append(SearchResult.el)
            }
        },

        isEmpty: function(map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },

        checkANDConditions: function(map_filter, resultModels) {
            var matchedResults;
            var models = [];
            for (var i = 0; i < resultModels.length; i++) {
                matchedResults = [];
                var model = resultModels[i];
                for (var key in map_filter) {
                    var value = map_filter[key];
                    if (Array.isArray(model.attributes[key])) {
                        var arrayValCheck = false;
                        for (var j = 0; j < value.length; j++) {
                            var val = value[j];
                            if (model.attributes[key].indexOf(val) > -1) {
                                arrayValCheck = true;
                            }
                        }
                        matchedResults.push(arrayValCheck);
                    } else {
                        var stringValCheck = false;
                        if (key != "timesRated") {
                            for (var k = 0; k < value.length; k++) {
                                var val = value[k];
                                if (model.attributes[key] == val) {
                                    stringValCheck = true;
                                }
                            }
                        } else {
                            for (var k = 0; k < value.length; k++) {
                                var val = value[k];
                                var modelRating = Math.ceil(model.attributes.sum / model.attributes[key]);
                                if (modelRating == val) {
                                    stringValCheck = true;
                                }
                            }
                        }
                        matchedResults.push(stringValCheck);
                    }
                }
                if (matchedResults.indexOf(false) == -1) {
                    models.push(model);
                }
            }
            return models;
        },

        checkSearchTextCompleteMatch: function(search_text, coll_id, resultModels) {
            var matchedResults, matchingTitle, matchingPublisher, matchingAuthor;
            var models = [];
            for (var i = 0; i < resultModels.length; i++) {
                matchedResults = [];
                matchingTitle = [];
                matchingPublisher = [];
                matchingAuthor = [];
                var model = resultModels[i];
                for (var st = 0; st < search_text.length; st++) {
                    if(model.attributes.title) {
                        if (model.attributes.title.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.title.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.title.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                            matchingTitle.push(true);
                        } else {
                            matchingTitle.push(false);
                        }
                    }
                    if(model.attributes.Publisher) {
                        if (model.attributes.Publisher.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.Publisher.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.Publisher.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                            matchingPublisher.push(true);
                        } else {
                            matchingPublisher.push(false);
                        }
                    }
                    if(model.attributes.author) {
                        if (model.attributes.author.toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.author.replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.author.replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                            matchingAuthor.push(true);
                        } else {
                            matchingAuthor.push(false);
                        }
                    }
                    if(model.attributes.subject) {
                        for (var j = 0; j < model.attributes.subject.length; j++) {
                            if (model.attributes.subject[j].toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.subject[j].replace(/[!(.," "-;):]+/g, "").toLowerCase().indexOf(search_text[st]) > -1 || model.attributes.subject[j].replace(/[!(.,-;):]+/g, " ").toLowerCase().indexOf(search_text[st]) > -1) {
                                matchedResults.push(true);
                            }
                        }
                    }
                    if (model.attributes.Tag) {
                        for (var k = 0; k < model.attributes.Tag.length; k++) {
                            if (model.attributes.Tag[k].indexOf(coll_id) > -1) {
                                matchedResults.push(true);
                            }
                        }
                    }
                }
                if (matchingTitle.indexOf(false) == -1 || matchingPublisher.indexOf(false) == -1 || matchingAuthor.indexOf(false) == -1) {
                    matchedResults.push(true);
                }
                if (matchedResults.indexOf(true) > -1) {
                    models.push(model);
                }
            }
            return models;
        },

    })

})