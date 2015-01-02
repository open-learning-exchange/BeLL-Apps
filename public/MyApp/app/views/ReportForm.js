$(function () {

    App.Views.ReportForm = Backbone.View.extend({

        className: "form",
        hide: false,
        events: {
            "click .save": "saveForm",
            "click #cancel": function () {
                window.history.back()
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function () {
            var vars = {}

            // prepare the header

            if (_.has(this.model, 'id')) {

                vars.header = 'Title "' + this.model.get('title') + '"'
                vars.hidesave = true
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
            
            } else {
                vars.header = 'New Report'
                vars.hidesave = false
				vars.resourceAttachments="No File Selected.";

            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            this.form.render()
            //this.form.fields['uploadDate'].$el.hide()
            if (this.edit == false) {
                alert("here")
                //this.form.fields['addedBy'].$el.val($.cookie('Member.login'))
            }
            //this.form.fields['addedBy'].$el.attr("disabled",true)
            //this.form.fields['averageRating'].$el.hide()
            var that = this
            if (_.has(this.model, 'id')) {
                //if(this.model.get("Level") == "All"){
                // that.form.fields['toLevel'].$el.hide();
                //that.form.fields['fromLevel'].$el.hide();
                //that.hide = true
            }


            // @todo Why won't this work?
            vars.form = "" //$(this.form.el).html()

            // render the template
            this.$el.html(this.template(vars))
            // @todo this is hackey, should be the following line or assigned to vars.form
            $('.fields').html(this.form.el)
            $('#progressImage').hide();
            //$this.$el.children('.fields').html(this.form.el) // also not working

            return this
        },

        saveForm: function () {
            // @todo validate 
            //if(this.$el.children('input[type="file"]').val() && this.$el.children('input[name="title"]').val()) {
            // Put the form's input into the model in memory
            
            
            var addtoDb = true
            var previousTitle = this.model.get("title")
            var newTitle
            var isEdit = this.model.get("_id")
            this.form.commit()
            // Send the updated model to the server
            newTitle = this.model.get("title")
            var that = this
            var savemodel = false
            if (this.model.get("title").length == 0) {
                alert("Resource Title is missing")
            } else if ((this.model.get("Tag") == "News") && !this.model.get("author")) {
                alert("Please Specify Author For This News Resource")
            } else {
                $('#gressImage').show();
                this.model.set(' uploadDate', new Date().getTime())
                if (this.model.get("Level") == "All") {
                    this.model.set('toLevel', 0)
                    this.model.set('fromLevel', 0)
                } else {
                    if (parseInt(this.model.get("fromLevel")) > parseInt(this.model.get("toLevel"))) {
                        alert("Invalid range specified ")
                        addtoDb = false
                    }
                }
                if (isEdit == undefined) {
                    var that = this
                    var allres = new App.Collections.Reports()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function (m) {
                        if (that.model.get("title") == m.get("title")) {
                            alert("Title already exist")
                            addtoDb = false
                        }
                    })
                }
                if (addtoDb) {
                    if (isEdit == undefined) {
                        this.model.set("sum", 0)
                    } else {
                        this.model.set("title", previousTitle)
                    }
                    this.model.save(null, {
                        success: function () {
                            that.model.unset('_attachments')
                            if ($('input[type="file"]').val()) {
                                if (isEdit != undefined) {
                                    if (previousTitle != newTitle) {
                                        var titleMatch = false
                                        var allres = new App.Collections.Resources()
                                        allres.fetch({
                                            async: false
                                        })
                                        allres.each(function (m) {
                                            if (newTitle == m.get("title")) {
                                                titleMatch = true
                                            }
                                        })
                                        if (!titleMatch) {
                                            var new_res = new App.Models.Resource()
                                            new_res.set("title", newTitle)
                                            new_res.set("description", that.model.get("description"))
                                            new_res.set("articleDate", that.model.get("articleDate"))
                                            new_res.set("addedBy", that.model.get("addedBy"))
                                            new_res.set("openWith", that.model.get("openWith"))
                                            new_res.set("openWhichFile", that.model.get("openWhichFile"))
                                            new_res.set("uploadDate", that.model.get("uploadDate"))
                                            new_res.set("openUrl", that.model.get("openUrl"))
                                            new_res.save()
                                            new_res.on('sync', function () {
                                                new_res.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                                new_res.on('savedAttachment', function () {
                                                    alert("Resource Updated Successfully")
                                                    Backbone.history.navigate("#resources", {
                                                        trigger: true
                                                    })
                                                    that.trigger('processed')
                                                    $('#progressImage').hide();
                                                }, new_res)
                                            })
                                        } else {
                                            alert("Resource title Already exist")
                                        }
                                    } else {
                                        alert("Cannot update model due to identical title")
                                    }
                                } else {
                                    that.model.saveAttachment("form#fileAttachment", "form#fileAttachment #_attachments", "form#fileAttachment .rev")
                                }
                            } else {
                                that.model.trigger('processed')
                            }

                            that.model.on('savedAttachment', function () {
                                this.trigger('processed')
                                $('#progressImage').hide();
                            }, that.model)
                        }
                    })
                }
            }

        },

        statusLoading: function () {
            alert("asdf")
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})