$(function () {

    App.Views.RequestView = Backbone.View.extend({

        tagName: "div",
        id: "site-request",
        type: null,
        events: {
            "click #formButton": "setForm",
            "click #CancelButton": "cancelform",
            "click #ViewAllButton": "gotoRoute"
        },
        gotoRoute: function () {
            document.getElementById('nav').style.visibility = "visible"
            Backbone.history.navigate('AllRequests', {
                trigger: true
            })
        },
        cancelform: function () {
            $('#site-request').animate({
                height: 'toggle'
            })
            this.form.setValue({
                request: ""
            })
            var that = this
            setTimeout(function () {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },
        setForm: function () {
             var configurations=Backbone.Collection.extend({

    				url: App.Server + '/configurations/_all_docs?include_docs=true'
    		})	
    	    var config=new configurations()
    	      config.fetch({async:false})
    	    var currentConfig=config.first()
            var cofigINJSON=currentConfig.toJSON()
             var date1 = new Date()
				var datestring = ("0" + (date1.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + date1.getDate().toString()).substr(-2)  + "/" + (date1.getFullYear().toString()).substr(2)
            if (this.form.getValue("request").length != 0) {
                this.form.setValue({
                    status: '0'
                })
                this.form.setValue({
                    senderId: ($.cookie('Member._id'))
                }) 
                this.form.setValue({
                     date:datestring 
                })
                this.form.setValue({
                    sendFrom:cofigINJSON.rows[0].doc.type 
                })
                this.form.setValue({
                    sendFromName:cofigINJSON.rows[0].doc.name 
                })
                this.form.setValue({
                    response: ""
                })
                this.form.setValue({
                    type: this.type
                })
                this.form.commit()
                this.model.save()
                alert("Request Successfully Sent")
                this.form.setValue({
                    request: ""
                })
            }
            $('#site-request').animate({
                height: 'toggle'
            })
            var that = this
            setTimeout(function () {
                that.remove()
            }, 1000)
            document.getElementById('nav').style.visibility = "visible"
        },

        render: function () {
            document.getElementById('nav').style.visibility = "hidden"
            var modl = new App.Models.request()
            this.model = modl
            this.form = new Backbone.Form({
                model: modl
            })
            if (this.type == "Course") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to enroll in a course on the following subject</span>')
            } else if (this.type == "Resource") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to have the following resource in BELL</span>')
            } else if (this.type == "Meetup") {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">I would like to join a Meetup on the following topic</span>')
            } else {
                this.$el.html('<span style=" font-weight: bold;visibility: visible;">Error!!!!</span>')
            }
            this.$el.append(this.form.render().el)
            this.form.fields['senderId'].$el.hide()
            this.form.fields['status'].$el.hide()
            this.form.fields['response'].$el.hide()
            this.form.fields['type'].$el.hide()
            this.form.fields['sendFrom'].$el.hide()
            this.form.fields['sendFromName'].$el.hide()
            this.form.fields['date'].$el.hide()
            var $button = $('<br/><div id="f-formButton"><button class="btn btn-hg btn-danger" id="CancelButton">Cancel</button><button class="btn btn-hg btn-info" id="ViewAllButton">View All</button><button class="btn btn-hg btn-primary" id="formButton">Submit</button></div>')
            this.$el.append($button)
        }


    })
})