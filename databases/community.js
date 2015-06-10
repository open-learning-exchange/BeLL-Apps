var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    isDuplicateName: {
        map: function(doc) {
            if (doc.Name) {
                emit(doc.Name, true);
            }
        }
    },
    isDuplicateUrl: {
        map: function(doc) {
            if (doc.Url) {
                emit(doc.Url, true);
            }
        }
    },
    getAllCommunityNames: {
        map: function(doc) {
            if (doc && doc.Name) {
                emit(doc.Name, doc.Code);
            }
        }
    },
    getCommunityByCode: {
        map: function(doc) {
            if (doc && doc.Code)
                emit(doc.Code, doc);
        }
    }
}

module.exports = ddoc;