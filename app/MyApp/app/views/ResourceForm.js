$(function() {

    App.Views.ResourceForm = Backbone.View.extend({

        className: "form",
        id: 'resourceform',
        hide: false,
        events: {
            /**********************************************************************/
            //Issue#43: Add A Resource: Change Order of tabindex
            /**********************************************************************/
            'keydown input[name="title"]':"getFocusForTitle",
            'keydown input[name="author"]':"getFocusForAuthor",
            'keydown input[name="Year"]':"getFocusForYear",
            'keydown select[name="language"]':"getFocusForLanguage",
            'keydown input[name="Publisher"]':"getFocusForPublisher",
            "keydown #_attachments":"getFocusForBrowse",
            "keydown  .save":"getFocusForSave",

            "click .save": "saveForm",
            "click #cancel": function() {
                window.history.back()
            },
            "click #add_newCoellection": function() {
                App.Router.AddNewSelect('Add New')
            },
            "click #saveUpdatedWelcomeVideoForm": "saveUpdatedWelcomeVideoForm"
        },
        getFocusForTitle : function(e){

            if(e.keyCode==9) //tab is pressed
            {
                e.preventDefault();

                $.trim($('[name="title"]').val());

                $('[name="author"]').focus();
            }
        },

        getFocusForAuthor : function(e){


            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $.trim($('[name="author"]').val());

                $('[name="Year"]').focus();
            }
        },
        /*******************************************************************/
        /*Issue No: 43 remove "Add New" button on Add New Resource page from the tabindex and instead have
         the "Save" button highlighted after the "Browse" button is highlighted. (route:resource/add)
         Date: 21 Sept, 2015*/
        /**********************************************************************/
        getFocusForBrowse : function(e){
            if(e.keyCode==9) //tab is pressed
            {
                // alert("Tab is pressed on uplaoad attachment button");
                e.preventDefault();
                var $focused = $(':focus');
                //	$('[name="save"]').focus();
                $(".save").attr("tabindex",0);
                //	$(".save").prop('autofocus', 'true');
                $('.save').addClass("myTabIndexClass");
                $('.myTabIndexClass').focus();
                $focused = $(':focus');
                //$focused.click()

            }
        },
        getFocusForSave : function(e){
            if(e.keyCode==9) //tab is pressed
            {
                //alert("Tab is pressed on Save button");
                e.preventDefault();
                var $focused = $(':focus');
                $("#cancel").attr("tabindex",0);
                $('#cancel').focus();
                $focused = $(':focus');
                //$focused.click()
                e.preventDefault();
            }
        },
        /**********************************************************************/
        getFocusForYear : function(e){


            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $.trim($('[name="Year"]').val());

                $('[name="language"]').focus();
            }
        },
        getFocusForLanguage : function(e){

            if(e.keyCode==9) //tab is pressed
            {
                //
                e.preventDefault();

                $('[name="Publisher"]').focus();
            }
        },
        getFocusForPublisher : function(e){

            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $('[name="linkToLicense"]').focus();
            }
        },
        getFocusForLinkToLicense : function (e)
        {

            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $.trim($('[name="Publisher"]').val());

                $('[name="resourceType"]').focus();
            }
        },
        getFocusForResourceType : function (e)
        {

            if(e.keyCode==9) //tab is pressed
            {

                e.preventDefault();

                $('[name="subject"]').focus();
            }
        },
        template: _.template($('#template-form-file').html()),

        render: function() {
            var vars = {}
            var clanguage = '';
            if (_.has(this.model, 'id')) {

                vars.header = App.languageDict.attributes.Details+' ' + '"'+' '+ this.model.get('title') +' '+ '"';
                var tempAttachments = this.model.get('_attachments');
                var fields = _.map(
                    _.pairs(tempAttachments),
                    function(pair) {
                        return {
                            key: pair[0],
                            value: pair[1]
                        };
                    }
                );
                vars.resourceAttachments = fields;
                vars.resourceTitle = this.model.get('title');
                vars.resourceUrl = this.model.get('url');
                vars.languageDict=App.languageDict;
                vars.cLang='addResource'
                clanguage = this.model.get('language');

            } else {

                vars.header = App.languageDict.attributes.New+' '+App.languageDict.attributes.Resources;
                vars.resourceAttachments = App.languageDict.attributes.No_File_Selected;
                vars.resourceUrl = "";
                vars.languageDict=App.languageDict;
                vars.cLang='addResource'
                var configurations = Backbone.Collection.extend({
                    url: App.Server + '/configurations/_all_docs?include_docs=true'
                })
                var config = new configurations()
                config.fetch({
                    async: false
                })
                var con = config.first();
                var currentConfig = config.first().toJSON().rows[0].doc;
                clanguage= App.languageDict.get('nameInNativeLang');
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.form.render()
            this.form.fields['uploadDate'].$el.hide()
            if (this.edit == false) {
                this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
            }
            this.form.fields['addedBy'].$el.attr("disabled", true)
            this.form.fields['averageRating'].$el.hide()
            var that = this
            if (_.has(this.model, 'id')) {
                if (this.model.get("Level") == "All") {
                    that.hide = true
                }
            }
            // @todo Why won't this work?
            vars.form = "" //$(this.form.el).html()
            this.$el.html(this.template(vars))
            // @todo this is hackey, should be the following line or assigned to vars.form
            $('.fields').html(this.form.el)
            var availableLanguages=getAvailableLanguages();
            for(var key in availableLanguages){
                this.$el.find('.field-language .bbf-editor select').append($('<option>', {
                    value: key,
                    text:availableLanguages[key]
                }));
            }
            $('.field-language').find('.bbf-editor').find('select').val(clanguage);

            this.$el.append('<button class="btn btn-success" id="add_newCoellection" >'+App.languageDict.attributes.Add_New+'</button>')
            $('#progressImage').hide();
            //$this.$el.children('.fields').html(this.form.el) // also not working
            $('[name="title"]').focus();

            applyCorrectStylingSheet(App.languageDict.get('directionOfLang'));
          //  applyStylingSheet();
            return this
        },
        saveUpdatedWelcomeVideoForm: function() {
            // mark this resource with welcome-video flag
            if (this.model.get("isWelcomeVideo") === undefined) {
                this.model.set("isWelcomeVideo", true);
            }
            this.form.commit();
            this.model.set("Level", null);
            this.model.set("subject", null);
            this.model.set("addedBy", $.cookie('Member.login'));
            var formContext = this;
            // id a new video file has been linked/uploaded, change the "addedBy" field to have the name of the current user
            // if no new file has been linked/uploaded, don't take any action
            var uploadedFileName = $('input[type="file"]').val();
            this.model.save(null, {
                success: function(res) {
                    if (uploadedFileName) {
                        formContext.model.unset('_attachments');
                        App.startActivityIndicator();
                        // set the handler for successful response on processing the video update form
                        formContext.model.on('savedAttachment', function() {
                            App.stopActivityIndicator();
                            this.trigger('processed');
                        }, formContext.model);
                        formContext.model.saveAttachment("#fileAttachment", "#_attachments", "#fileAttachment .rev");
                        alert($.cookie('Member.login'));
                        formContext.form.fields['addedBy'].setValue($.cookie('Member.login'));
                    } else {
                        return;
                    }
                }
            });
        },
        renderAddOrUploadWelcomeVideoForm: function() {
            var formHeader = $('<h3> '+App.languageDict.get('edit_welcomeVideo')+' </h3><br><br><br><br>');
            this.$el.append(formHeader);
            this.form = new Backbone.Form({
                model: this.model
            });
            this.$el.append(this.form.render().el);
            // hide the 'decision' and 'submitted by' subschemas from rendering when form has not been submitted
            for (var field in this.form.fields) {
                this.form.fields[field].$el.hide();
            }
            this.form.fields['addedBy'].$el.show();
            this.form.fields['resourceType'].$el.show();
            this.form.fields['addedBy'].editor.el.disabled = true;
            this.form.fields['uploadDate'].$el.show();
            this.form.fields['openWith'].$el.show();
            this.form.fields['resourceFor'].$el.show();
            // get attachments of welcome video doc
            var tempAttachments = this.model.get('_attachments');
            var fields = _.map(
                _.pairs(tempAttachments),
                function(pair) {
                    return {
                        key: pair[0],
                        value: pair[1]
                    };
                }
            );
            for (var field in fields) { // field is index and fields is the array being traversed
                var label = $("<label>").text(fields[field].key); // fields[field].value has info like {content_type: "video/mp4", length: 16501239, etc}
                this.$el.append(label);
            }
            this.$el.append('<br><br>');
            // add a label followed by input box/button for allowing uploading of new welcome video, followed by label anming the
            // name of the video currently being used as welcome video
            this.$el.append('<form method="post" id="fileAttachment"></form>');
            this.$el.find("#fileAttachment").append('<label for="_attachments">'+App.languageDict.get('upload_welcomeVideo')+'</label>');
            this.$el.find("#fileAttachment").append('<input type="file" name="_attachments" id="_attachments" style="line-height: 28px;" multiple="multiple" label=" :" />');
            this.$el.find("#fileAttachment").append('<input class="rev" type="hidden" name="_rev">');
            this.$el.append('<button class="addNation-btn btn btn-success" id="saveUpdatedWelcomeVideoForm">'+App.languageDict.get('Submit')+'</button>');
            this.$el.append('<a class="btn btn-danger" id="cancel">'+App.languageDict.get('Cancel')+'</a>');
        },
        saveForm: function() {


            // @todo validate
            //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
            // Put the form's input into the model in memory
            var previousTitle = this.model.get("title")
            previousTitle = $.trim(previousTitle)
            var isEdit = this.model.get("_id")
            var formContext = this
            this.form.commit()

            if (this.model.get('openWith') == 'PDF.js') {
                this.model.set('need_optimization', true)
            }
            // Send the updated model to the server

            var title = this.model.get("title");
            this.model.set("title", $.trim(title));
            var newTitle = this.model.get("title")
            if (this.model.get("title").length == 0) {
                alert(App.languageDict.attributes.Missing_Resource_Title)
            } else if (this.model.get("subject") == null) {
                alert(App.languageDict.attributes.Resource_Subject_Missing)
            } else if (this.model.get("Level") == null) {
                alert(App.languageDict.attributes.Resource_Level_Missing)
            } else {
                if (isEdit) {
                    var addtoDb = true
                    if (previousTitle != newTitle) {
                        if (this.DuplicateTitle()) {
                            addtoDb = false
                        }
                    }
                    if (addtoDb) {
                        this.model.save(null, {
                            success: function(res) {

                                if ($('input[type="file"]').val()) {
                                    formContext.model.unset('_attachments')
                                    App.startActivityIndicator()
                                    formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

                                } else {
                                    window.history.back()
                                }
                            }
                        })
                    }
                } else {
                    if (!this.DuplicateTitle()) {
                        this.model.set("sum", 0)
                        this.model.set("timesRated", 0)
                        this.model.save(null, {
                            success: function(res) {
                                if ($('input[type="file"]').val()) {
                                    App.startActivityIndicator()
                                    formContext.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")

                                } else {
                                    window.history.back()
                                }
                            }
                        })
                    }
                }
            }
            this.model.on('savedAttachment', function() {
                this.trigger('processed')
            }, formContext.model)



        },
        DuplicateTitle: function() {
            var checkTitle = new App.Collections.Resources()
            checkTitle.title = this.model.get("title")
            checkTitle.fetch({
                async: false
            })
            checkTitle = checkTitle.first()
            if (checkTitle != undefined)
                if (checkTitle.toJSON().title != undefined) {
                    alert(App.languageDict.attributes.Duplicate_Title)
                    return true
                }
            return false
        },
        statusLoading: function() {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})