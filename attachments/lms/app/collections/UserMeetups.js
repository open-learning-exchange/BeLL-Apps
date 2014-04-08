$(function () {

    App.Collections.UserMeetups = Backbone.Collection.extend({


        url: function () { 
             	  if(this.memberId && this.meetupId)
                		 return App.Server + '/usermeetups/_design/bell/_view/getUserMeetup?key=["' + this.memberId + '","'+this.meetupId+'"]&include_docs=true' 
              	else if(this.memberId)
                	 	return App.Server + '/usermeetups/_design/bell/_view/getUsermeetups?key="' + this.memberId + '"&include_docs=true' 
             	else
               		return App.Server + '/usermeetups/_design/bell/_view/getMeetupUsers?key="' + this.meetupId + '"&include_docs=true'
               
               },
        parse: function (response) {
            var docs = _.map(response.rows, function (row) {
                return row.doc
            })
            return docs
        },
      model: App.Models.UserMeetups,


    })

})