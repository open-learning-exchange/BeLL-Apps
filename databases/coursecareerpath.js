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
    GetCourseCareerByLevelNameMemberIds: {
        map: function(doc) {
            if (this.CoursePathName!= "" && this.MemberID != "" ) {
                emit([doc.CoursePathName,doc.MemberID], doc);
            }
        }
    },
    getCourseCareerByName: {
        map: function(doc) {
            if (this.CoursePathName!= "") {
                emit([doc.CoursePathName], doc);
            }
        }
    }
}
module.exports = ddoc;