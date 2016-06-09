$(function () {

    App.Views.EventInfo = Backbone.View.extend({


        authorName: null,
        tagName: "table",
        className: "btable btable-striped resourceDetail",
        sid: null,
        rid: null,
        id:"eventDetail-table",
        events: {
            // Handling the Destroy button if the user wants to remove this Element from its shelf
            "click #DestroyEvent": function (e) {
            
             var vars = this.model.toJSON()
             var mId=$.cookie('Member._id')
             
             this.model.destroy()
             
             alert(App.languageDict.attributes.Event_Deleted_Success)
                    Backbone.history.navigate('calendar', {
                        trigger: true
                    })
      
        }
        },
        initialize: function () {
            this.$el.append('<th colspan="2"><h6>'+App.languageDict.get("Event_Detail")+'</h6></th>')
        },
        render: function () {
            var vars = this.model.toJSON()
            var date=new Date(vars.schedule)
                vars.schedule=date.toUTCString()
            this.$el.append("<tr><td>"+App.languageDict.get('Title')+"</td><td>" + vars.title + "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('Description')+"</td><td>" + vars.description + "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('Start_date')+"</td><td>" + vars.startDate + "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('End_date')+"</td><td>" + vars.endDate+ "</td></tr>")
            this.$el.append("<tr><td>"+App.languageDict.get('Timing')+"</td><td>" + vars.startTime + "-"+vars.endTime+"</td></tr>")
            this.$el.append('<tr><td colspan="2"><button class="btn btn-danger" id="DestroyEvent">'+App.languageDict.get('Destroy')+'</button><a href="#calendar" style="margin-left:10px" class="btn btn-info">'+App.languageDict.get('Calender')+'</a></td></tr>')

        }

    })

})