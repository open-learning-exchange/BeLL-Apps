var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    getDocumentByDate: {
        map: function(doc) {
            if (doc.logDate) {
                var datePart = doc.logDate.match(/\d+/g),
                    month = datePart[0], // get only two digits
                    day = datePart[1],
                    year = datePart[2];
                var newdate = year + '/' + month + '/' + day;
                emit(newdate, doc);
            }
        }
    },
    getdocBylogdate: {
        map: function(doc) {
            emit(doc.logDate, doc);
        }
    },
    getDocByCommunityCode: {
        map: function(doc) {
            if (doc && doc.logDate) {
                var datePart = doc.logDate.match(/\d+/g),
                    month = datePart[0], // get only two digits
                    day = datePart[1],
                    year = datePart[2];
                var newdate = year + '/' + month + '/' + day;
                emit([doc.community, newdate], null);
            }
        }
    },
    getDocByCommunityCodeWithValue: {
        map: function(doc) {
            if (doc && doc.logDate) {
                var datePart = doc.logDate.match(/\d+/g),
                    month = datePart[0], // get only two digits
                    day = datePart[1],
                    year = datePart[2];
                var newdate = year + '/' + month + '/' + day;
                emit([doc.community, newdate], doc);
            }
        }
    },
    GetMaleCountByCommunity: {
        map: function(doc) {
            if (doc && doc.community) {
                emit(doc.community, doc.male_new_signups)
            }
        },
        reduce: function(keys, values) {
            return sum(values);
        }
    },
    GetFemaleCountByCommunity: {
        map: function(doc) {
            if (doc && doc.community) {
                emit(doc.community, doc.female_new_signups)
            }
        },
        reduce: function(keys, values) {
            return sum(values);
        }
    },
    GetMaleVisitsByCommunity: {
        map: function(doc) {
            if (doc && doc.community) {
                emit(doc.community, doc.male_visits)
            }
        },
        reduce: function(keys, values) {
            return sum(values);
        }

    },
    GetFemaleVisitsByCommunity: {
        map: function(doc) {
            if (doc && doc.community) {
                emit(doc.community, doc.female_visits)
            }
        },
        reduce: function(keys, values) {
            return sum(values);
        }

    },
    date_now: {
        map: function () {
            var now = new Date().toLocaleDateString();
            var output = JSON.parse(JSON.stringify(now));
            emit(output, output);
        }
    }
}

module.exports = ddoc;