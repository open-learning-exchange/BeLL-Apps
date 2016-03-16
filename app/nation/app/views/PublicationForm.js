$(function() {

    App.Views.PublicationForm = Backbone.View.extend({

        className: "form",
        events: {
            "click .save": "saveForm",
            "click #AddResPublication": "searchres",
            "click #AddCoursePublication": "listCourses",
            "click #cancel": function() {
                window.location.href = '#publication'
            }
        },

        template: _.template($('#template-form-file').html()),

        render: function() {

            var vars = {}

            if (_.has(this.model, 'id')) {
                vars.header = 'Publication Issue : "' + this.model.get('IssueNo') + '"'
            } else {
                vars.header = 'New Publication Issue'
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            vars.form = ""
            vars.rlength = this.rlength
            this.form.render()
            this.$el.html(this.template(vars))

            $('.fields').html(this.form.el)
            $('.form .field-resources').hide();
            $('#progressImage').hide();

            return this
        },

        saveForm: function() {
            var loginOfMem = $.cookie('Member.login');
            var lang;
            $.ajax({
                url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                type: 'GET',
                dataType: 'jsonp',
                async:false,
                success: function (surResult) {
                    console.log(surResult);
                    var id = surResult.rows[0].id;
                    $.ajax({
                        url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                        type: 'GET',
                        dataType: 'jsonp',
                        async:false,
                        success: function (resultByDoc) {
                            console.log(resultByDoc);
                            lang=resultByDoc.rows[0].value.bellLanguage;
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                },
                error:function(err){
                    console.log(err);
                }
            });
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            var isEdit = this.model.get("_id")
            var addtoDb = true
            this.form.commit()
            if (this.model.get("IssueNo") == undefined) {
                alert(languageDictValue.attributes.Pubs_Issue_Missing)
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allres = new App.Collections.Publication()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function(m) {
                        if (that.model.get("IssueNo") == m.get("IssueNo")) {
                            alert(languageDictValue.attributes.Issue_Duplicate)
                            addtoDb = false
                        }
                    })
                }

                if (addtoDb) {
                    this.form.commit()
                    this.model.save(null, {
                        success: function(e) {
                            alert(languageDictValue.attributes.Pubs_Issue_Saved)
                            window.location.href = '#publicationdetail/' + e.toJSON().id;
                        }
                    })
                }
            }


        },
        searchres: function() {
            var showsearch = true;
            var loginOfMem = $.cookie('Member.login');
            var lang;
            $.ajax({
                url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                type: 'GET',
                dataType: 'jsonp',
                async:false,
                success: function (surResult) {
                    console.log(surResult);
                    var id = surResult.rows[0].id;
                    $.ajax({
                        url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                        type: 'GET',
                        dataType: 'jsonp',
                        async:false,
                        success: function (resultByDoc) {
                            console.log(resultByDoc);
                            lang=resultByDoc.rows[0].value.bellLanguage;
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                },
                error:function(err){
                    console.log(err);
                }
            });
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            var isEdit = this.model.get("_id")
            this.form.commit()
            if (this.model.get("IssueNo") == undefined) {
                alert(languageDictValue.attributes.Pubs_Issue_Missing)
                showsearch = false
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allpub = new App.Collections.Publication()
                    allpub.issue = this.model.get("IssueNo")
                    allpub.fetch({
                        async: false
                    })
                    allpub = allpub.first()
                    if (allpub != undefined)
                        if (allpub.toJSON().IssueNo != undefined) {
                            alert(languageDictValue.attributes.Issue_Duplicate)
                            showsearch = false
                        }

                }
            }
            if (showsearch) {
                this.model.save(null, {
                    success: function(e) {
                        window.location.href = '../MyApp/index.html#search-bell/' + e.toJSON().id;
                    }
                })


            }
        },
        listCourses: function() {
            var showcourse = true;
            var loginOfMem = $.cookie('Member.login');
            var lang;
            $.ajax({
                url: '/members/_design/bell/_view/MembersByLogin?_include_docs=true&key="' + loginOfMem + '"',
                type: 'GET',
                dataType: 'jsonp',
                async:false,
                success: function (surResult) {
                    console.log(surResult);
                    var id = surResult.rows[0].id;
                    $.ajax({
                        url: '/members/_design/bell/_view/MembersById?_include_docs=true&key="' + id + '"',
                        type: 'GET',
                        dataType: 'jsonp',
                        async:false,
                        success: function (resultByDoc) {
                            console.log(resultByDoc);
                            lang=resultByDoc.rows[0].value.bellLanguage;
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                },
                error:function(err){
                    console.log(err);
                }
            });
            var languageDictValue=App.Router.loadLanguageDocs(lang);
            var myCourses = new Array()
            var isEdit = this.model.get("_id")
            this.form.commit()
            // this.model.unset("resources", { silent: true });
            this.model.set({
                "courses": myCourses
            })
            if (this.model.get("IssueNo") == undefined) {
                alert(languageDictValue.attributes.Pubs_Issue_Missing)
                showcourse = false
            } else {
                if (isEdit == undefined) {
                    var that = this
                    var allpub = new App.Collections.Publication()
                    allpub.issue = this.model.get('IssueNo')
                    allpub.fetch({
                        async: false
                    })
                    allpub = allpub.first()
                    if (allpub != undefined)
                        if (allpub.toJSON().IssueNo != undefined) {
                            alert(languageDictValue.attributes.Issue_Duplicate)
                            showcourse = false
                        }

                }
            }
            if (showcourse) {
                this.model.save(null, {
                    success: function(e) {
                        window.location.href = '#courses/' + e.toJSON().id;
                    }
                })


            }
        },
        statusLoading: function() {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})