var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
    _id: '_design/bell'
}

ddoc.views = {
    getCommunityByCode: {
        map: function(doc) {
            if (doc && doc.kind == 'Community')
                emit(doc.code, doc);
        }
    },
    getCommunityByName: {
        map: function(doc) {
            if (doc && doc.kind == 'Community')
                emit(doc.name, doc);
        }
    },
    getCommunityByNationUrl:{
        map: function(doc){
            if (doc.nationUrl && doc.kind=='Community') {
                emit(doc.nationUrl.split(':')[1], doc);
            }
        }
    },
    getAllCommunities:{
        map: function(doc){
            if (doc && doc.kind=='Community') {
                emit(doc.name, doc);
            }
        }
    },
    getDocById:{
        map: function(doc){
            if (doc._id && doc.kind=='Community') {
                emit(doc._id, doc);
            }
        }
    },
    getDoc:{
        map: function(doc){
            if (doc.nationUrl && doc.kind == 'Community')
                emit(doc.nationUrl, doc);
               // emit([doc.Name, doc.nationUrl], true);
        }
    },
    getCommunityByUniqueRegion: {
        map: function(doc) {
            if (doc.region && doc.kind == 'Community')
                emit(doc.region, doc);
        },
        reduce: function(keys, values, rereduce) {
            return values[0].region;
        }
    },
    getCommunityByRegion: {
        map: function(doc) {
            if (doc && doc.region)
                emit(doc.region, doc);
        }
    },


}

module.exports = ddoc;