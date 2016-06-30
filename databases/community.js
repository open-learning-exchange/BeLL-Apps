var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    isDuplicateName: {
        map: function(doc) {
            if (doc && (doc.Name || doc.name)) {
                emit(doc._id, true);
            }
        }
    },
    /*isDuplicateUrl: {
        map: function(doc) {
            if (doc.Url) {
                emit(doc.Url, true);
            }
        }
    },*/
    getAllCommunityNames: {
        map: function (doc) {
            if (doc && (doc.Name || doc.name)) {
                emit(doc._id, doc);
            }
        }
    },
    getCommunityByCode: {
        map: function(doc) {
            if (doc && (doc.Code || doc.code))
                emit(doc._id, doc);
        }
    }
}

module.exports = ddoc;