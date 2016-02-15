$(function() {

    App.Views.ResourcesDetail = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "btable btable-striped resourceDetail",
        sid: null,
        rid: null,
        id: 'requestsTable',
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyShelfItem": function(e) {

                var vars = this.model.toJSON()
                var rId = vars._id
                var mId = $.cookie('Member._id')

                var memberShelfResource = new App.Collections.shelfResource()
                memberShelfResource.resourceId = rId
                memberShelfResource.memberId = mId
                memberShelfResource.fetch({
                    async: false
                })
                memberShelfResource.each(
                    function(e) {
                        e.destroy()
                    })
                alert(App.languageDict.attributes.Resource_RemovedFrom_Shelf_Success)
                Backbone.history.navigate('dashboard', {
                    trigger: true
                })

            },
            "click .shelfResFeedBack": function(event) {
                var resourcefreq = new App.Collections.ResourcesFrequency()
                resourcefreq.memberID = $.cookie('Member._id')
                resourcefreq.fetch({
                    async: false
                })

                if (resourcefreq.length == 0) {
                    var freqmodel = new App.Models.ResourceFrequency()
                    freqmodel.set("memberID", $.cookie('Member._id'))
                    freqmodel.set("resourceID", [this.model.get("_id")])
                    freqmodel.set("reviewed", [0])
                    freqmodel.set("frequency", [1])
                    freqmodel.save()
                } else {
                    var freqmodel = resourcefreq.first()
                    var index = freqmodel.get("resourceID").indexOf(this.model.get("_id").toString())
                    if (index != -1) {
                        var freq = freqmodel.get('frequency')
                        freq[index] = freq[index] + 1
                        freqmodel.save()
                    } else {
                        freqmodel.get("resourceID").push(this.model.get("_id"))
                        freqmodel.get("frequency").push(1)
                        if (!freqmodel.get("reviewed")) {
                            freqmodel.set("reviewed", [0])
                        } else {
                            freqmodel.get("reviewed").push(0)
                        }
                        freqmodel.save()
                    }
                }

                $('ul.nav').html($('#template-nav-logged-in').html()).hide()
                //                 var member = new App.Models.Member({
                //                 	_id: $.cookie('Member._id')
                //                 })
                //                 member.fetch({
                //                     async: false
                //                 })
                //                 var pending=[]
                //                pending= member.get("pendingReviews")
                //                pending.push(this.model.get("_id"))
                //     		   	member.set("pendingReviews",pending)
                //     		   	member.save()
                Backbone.history.navigate('resource/feedback/add/' + this.model.get("_id") + '/' + this.model.get("title"), {
                    trigger: true
                })
            }

        },
        initialize: function() {
            this.$el.append('<th colspan="2"><h6>'+loadLanguageDocs().attributes.Resource_Detail+'</h6></th>')
        },
        SetShelfId: function(s, r) {
            this.sid = s
            this.rid = r
        },
        render: function() {
            var vars = this.model.toJSON();
            var languageDictValue=loadLanguageDocs();
            this.$el.append("<tr><td>"+languageDictValue.attributes.Title+"</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>"+languageDictValue.attributes.Subject_single+"</td><td>" + vars.subject + "</td></tr>")
            this.$el.append("<tr><td>"+languageDictValue.attributes.Tag+"</td><td>" + vars.Tag + "</td></tr>")
            this.$el.append("<tr><td>"+languageDictValue.attributes.level_Single+"</td><td>" + vars.Level + "</td></tr>")
            if (vars.author) {
                this.$el.append("<tr><td>"+languageDictValue.attributes.author+"</td><td>" + vars.author + "</td></tr>")
            } else {
                this.$el.append("<tr><td>"+languageDictValue.attributes.author+"</td><td>"+languageDictValue.attributes.Undefined_Author+"</td></tr>")
            }
            /**********************************************************************/
            //Issue No: 54 (Update buttons on the My Library page on Dashboard)
            //Date: 18th Sept, 2015
            /**********************************************************************/
            //if the model has the Attachments
           // if (vars._attachments) {

          /*      this.$el.append("<tr><td>Attachment</td><td><a class='btn open'  target='_blank' style='background-color:#1ABC9C;position: absolute;display: inline-block; line-height: 25px;margin-top: 35px;margin-left:-620px;width: 65px;height:26px;font-size: large' href='/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id + "'>View</a></td></tr>")

            } else {
                this.$el.append("<tr><td>Attachment</td><td>No Attachment</td></tr>")
            }
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyShelfItem">Remove</button></td></tr>') */
            if (vars._attachments) {
                this.$el.append("<tr><td>"+languageDictValue.attributes.Attachment+"</td><td></td></tr>")
                this.$el.append("<br><a class='btn open shelfResFeedBack' target='_blank' style='background-color:#1ABC9C;  width: 65px;height:26px;font-size: large' href='/apps/_design/bell/bell-resource-router/index.html#open/" + vars._id + "/"+ vars.title +"'>"+languageDictValue.attributes.View+"</a><button class='btn btn-danger marginsOnMeetUp' id='DestroyShelfItem'>"+languageDictValue.attributes.Remove+"</button></td></tr>")

            } else {
                this.$el.append("<tr><td>"+languageDictValue.attributes.Attachment+"</td><td>"+languageDictValue.attributes.No_Attachment+"</td></tr>")
                this.$el.append('<br><a class="btn open shelfResFeedBack" style="visibility: hidden">'+languageDictValue.attributes.View+'</a><button class="btn btn-danger marginsOnMeetUp" id="DestroyShelfItem">'+languageDictValue.attributes.Remove+'</button></td></tr>')
            }



        }

    })

})