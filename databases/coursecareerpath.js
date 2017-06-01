var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    GetCourseCareerById: {
        map: function(doc) {
            if (doc._id ) {
                emit(doc._id, doc);
            }
        }
    },
    GetCourseCareerByMember: {
        map: function(doc) {
            if (this.MemberID != "") {
                emit([doc.MemberID], doc);
            }
        }
    },
}
module.exports = ddoc;