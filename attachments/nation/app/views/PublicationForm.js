$(function () {

    App.Views.PublicationForm = Backbone.View.extend({

        className: "form",
        events: {
            "click .save": "saveForm",
            "click #AddResPublication":"searchres",
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
                
            } else {
                vars.header = 'New Publication Issue'
                
            }

            // prepare the form
            this.form = new Backbone.Form({
                model: this.model
            })
            vars.form = ""
            this.form.render()
            this.$el.html(this.template(vars))
            $('.fields').html(this.form.el)
            $('.form .field-resources').hide();
            $('#progressImage').hide();
            return this
        },

        saveForm: function () {
            var addtoDb=true
            var isEdit = this.model.get("_id")
            this.form.commit()
            if (this.model.get("IssueNo").length == 0) {
                alert("Publication Issue is missing")
            } else {
                 if (isEdit == undefined) {
                    var that = this
                    var allres = new App.Collections.Publication()
                    allres.fetch({
                        async: false
                    })
                    allres.each(function (m) {
                        if (that.model.get("IssueNo") == m.get("IssueNo")) {
                            alert("IssueNo already exist")
                            addtoDb = false
                        }
                    })
                }
                if (addtoDb) {
                    this.model.save()
                    alert("Issue Saved (No Resources attached)")
                    window.location.href='#publication'
                }
            }

        },
		searchres:function(){
		  var showsearch=true
		  var isEdit = this.model.get("_id")
		  this.form.commit()
		  
		  if (this.model.get("IssueNo")==undefined) {
                alert("Publication Issue is missing")
                showsearch=false
            }
            else {
                 if (isEdit == undefined) {
                    var that = this
                    var allpub = new App.Collections.Publication()
                    allpub.fetch({
                        async: false
                    })
                    allpub.each(function (m) {
                        if (that.model.get("IssueNo") == m.get("IssueNo")) {
                            alert("IssueNo already exist")
                            showsearch=false
                        }
                    })
                }
            }
            if(showsearch)
            {
            		this.model.save(null,{success:function(e){
		 				 window.location.href = '../lms/index.html#search-bell/'+e.toJSON().id;
		 				 }
		  			})
		  
            		
            }
		},
        statusLoading: function () {
            this.$el.children('.status').html('<div style="display:none" class="progress progress-striped active"> <div class="bar" style="width: 100%;"></div></div>')
        }

    })

})