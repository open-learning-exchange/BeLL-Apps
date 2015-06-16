var couchapp = require('couchapp'),
	path = require('path');

ddoc = {
	_id: '_design/bell'
}

ddoc.views = {
	getUsermeetups: {
		map: function(doc) {
			if (doc.memberId) {
				emit(doc.memberId, true)
			}
		}
	},
	getMeetupUsers: {
		map: function(doc) {
			if (doc.meetupId) {
				emit(doc.meetupId, true)
			}
		}
	},
	getUserMeetup: {
		map: function(doc) {
			if (doc.meetupId && doc.memberId) {
				emit([doc.memberId, doc.meetupId], true)
			}
		}
	}

}

module.exports = ddoc;