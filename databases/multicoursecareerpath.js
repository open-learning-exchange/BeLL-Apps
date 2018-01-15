var couchapp = require('couchapp'),
path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    GetMultiCourseCareerById: {
        map: function(doc) {
            if (doc._id ) {
                emit(doc._id, doc);
            }
        }
    },
    GetCourseCareerByName: {
        map: function(doc) {
            if (this.CoursePathName!= "") {
                emit([doc.CoursePathName], doc);
            }
        }
    },
}
module.exports = ddoc;