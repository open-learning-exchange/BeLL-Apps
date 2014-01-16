var source = 'http://oledemo:oleoleole@oledemo.cloudant.com'
var i = 0
alert("Install script loaded. Now replicating data from " + source)
// @todo Need the rest of the databases here
var databases = ['apps', 'facilities', 'members', 'feedback','actions','calendar','communityreports','courseschedule','coursestep','groups','invitations','mail','membercourseprogress','report','resources','shelf','community_code']
// A recursive function to replicate the databases one at a time
var replicate = function() {
  var database = databases[i]
  $.couch.replicate(source + '/' + database, database, {
    success: function() {
      if (databases.length-1 > i) {
        i++
        console.log('database : ' + databases[i])
        replicate()
      }
      else {
        alert("Installation has completed")
        window.location = 'http://' + window.location.host + '/apps/_design/bell/lms/index.html'
      }
    },
    error: function(status) {
      console.log(status);
      alert('Something went wrong:' + status)
    }
  },
  {
    create_target: true
  })
}
// Start the recursion
replicate()
