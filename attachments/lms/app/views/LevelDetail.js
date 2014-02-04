$(function () {

    App.Views.LevelDetail = Backbone.View.extend({

        tagName: "table",
        className: "table table-striped",

        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click .remover": function (e) {
                var rid = e.currentTarget.value
                var rtitle = this.model.get("resourceTitles")
                var rids = this.model.get("resourceId")
                var index = rids.indexOf(rid)
                rids.splice(index, 1)
                rtitle.splice(index, 1)
                this.model.set("resourceId", rids)
                this.model.set("resourceTitles", rtitle)
                this.model.save()
                var that = this
                this.model.on('sync', function () {
                    console.log(that.model.get('rev'))
                    document.location.href = '#course/manage/' + that.model.get("courseId")

                })
            },
            "click .levelResView": function (e) {
                var rid = e.currentTarget.attributes[0].value
                var levelId = this.model.get("_id")
                var revid = this.model.get("_rev")
                Backbone.history.navigate('resource/atlevel/feedback/' + rid + '/' + levelId + '/' + revid, {
                    trigger: true
                })

            },
        },
        render: function () {
            var i = 0
            var rtitle = this.model.get("resourceTitles")
            var rid = this.model.get("resourceId")
            this.$el.append("</BR>")
            if (this.model.get("resourceTitles")) {
                for (i = 0; i < this.model.get("resourceTitles").length; i++) {
                    var r = new App.Models.Resource({
                        "_id": rid[i]
                    })
                    r.fetch({
                        async: false
                    })
                    if(! (r.get("hidden") ))
                    	{
                    	if (r.get("_attachments")) {
                        	this.$el.append("<tr><td>" + rtitle[i] + "</td><td><a class='levelResView btn btn-info' href='/apps/_design/bell/bell-resource-router/index.html#open/" + rid[i] + "'  target='_blank' value='" + rid[i] + "'><i class='icon-eye-open'></i>View</a></td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>Remove </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                    		} 	else {
                        		this.$el.append("<tr><td>" + rtitle[i] + "</td><td>No Attachment</td><td><button class='remover btn btn-danger' value='" + rid[i] + "'>Remove </button><input type='hidden' id='" + rid[i] + "' value='" + rtitle[i] + "'/>")
                    	}
                    }
                }
            }
        }

    })

})