$(function () {

    App.Views.FeedbackForm = Backbone.View.extend({

        tagName: "form",
        user_rating: 'null',
        events: {
            "click #formButton": "setForm",
            //"click #addtoshelf": "setForm",
            "submit form": "setFormFromEnterKey"
        },

        render: function () {
            this.user_rating = 0
            console.log(this.model)
            this.form = new Backbone.Form({
                model: this.model
            })
            this.$el.append(this.form.render().el)
            this.form.fields['rating'].$el.hide()
            this.form.fields['memberId'].$el.hide()
            this.form.fields['resourceId'].$el.hide()


            var $button = $('<a class="btn btn-success" style="margin-left:10px" id="formButton">Save</a>')
            $btnAddToshelf = $('<button class="btn btn-success" id="addtoshelf" onclick=addToshelf("' + this.model.get('resourceId') + '","' + this.rtitle + '") style="margin-left:10px">Add To My Library</button>')


            this.$el.append($button)
            this.$el.append($btnAddToshelf)
        },

        setFormFromEnterKey: function (event) {
            event.preventDefault()
            this.setForm()
        },

        setUserRating: function (ur) {
            this.user_rating = ur
        },
        setForm: function () {
            // Put the form's input into the model in memory
            if (this.user_rating == 0) {
                alert("Please rate the resource first")
            } else {
                // Put the form's input into the model in memory
                if (this.form.getValue('comment').length == 0) {
                    this.form.setValue('comment', 'No Comment')
                }
                this.form.setValue('rating', this.user_rating)
                this.form.commit()
                //Send the updated model to the server
                var that = this
                var flength = new App.Collections.ResourceFeedback()
                flength.resourceId = that.model.get("resourceId")
                flength.fetch({
                    async: false
                })
                var lengthoffeedbacks = flength.length
                console.log("lengthoffeedbacks" + lengthoffeedbacks)
                console.log(this.user_rating)

                this.model.on('sync', function () {
                    var rmodel = new App.Models.Resource({
                        "_id": that.model.get("resourceId")
                    })
                    rmodel.fetch({
                        success: function () {
                            var avgr = rmodel.get("sum")
                            console.log(avgr)
                            avgr = parseInt(avgr) + parseInt(that.user_rating)
                            rmodel.set("sum", parseInt(avgr))
                            rmodel.set("timesRated", lengthoffeedbacks + 1)
                            rmodel.save()
                        }
                    })
                })
                this.model.save()
                var resourcefreq = new App.Collections.ResourcesFrequency()
                resourcefreq.memberID = $.cookie('Member._id')
                resourcefreq.fetch({
                    async: false
                })
                var freqmodel = resourcefreq.first()
                var index = freqmodel.get("resourceID").indexOf(that.model.get("resourceId").toString())
                if (index != -1) {
                    var freq = freqmodel.get('reviewed')
                    freq[index] = freq[index] + 1
                    freqmodel.save()
                    
                }
                //				var member = new App.Models.Member({
                //                     _id: $.cookie('Member._id')
                //                 })
                //                 member.fetch({
                //                     async: false
                //                })            
                //                var pending=[]
                //                pending=member.get("pendingReviews")
                //                var index=pending.indexOf(that.model.get("resourceId"))
                //                if(index>-1){
                //                	pending.splice(index,1)
                //                	member.set("pendingReviews",pending)
                //                	member.save()
            
                    $('#externalDiv').hide()
            }

        },


    })

})