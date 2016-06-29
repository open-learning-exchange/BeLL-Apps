var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    isDuplicateName: {
        map: function(doc) {
            if (doc.name) {
                emit(doc.name, true);
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
        map: function(doc) {
            if (doc && doc.name) {
                emit(doc.name, doc.code);
            }
        }
    },
    getCommunityByCode: {
        map: function(doc) {
            if (doc && doc.code)
                emit(doc.code, doc);
        }
    }
}

module.exports = ddoc;