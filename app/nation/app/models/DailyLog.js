$(function() {

    App.Models.DailyLog = Backbone.Model.extend({

        idAttribute: "_id",
        url: function() {
            if (_.has(this, 'id')) {
                var url = (_.has(this.toJSON(), '_rev')) ? App.Server + '/activitylog/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
                    : App.Server + '/activitylog/' + this.id // For READ
            } else {
                var url = App.Server + '/activitylog' // for CREATE
            }

            return url
        },
        schema: {
            "male_deleted_count": 'number',//Count of male member deletions in a day
            "female_deleted_count": 'number',//Count of female member deletions in a day
            "logDate": "Text",//Date of the day for which activity log doc is created.
            "female_visits": 'number',//Count of female member visits in a day
            "male_visits": 'number',//Count of male member visits in a day
            "female_new_signups": 'number',//Count of new female sign-ups in a day
            "male_new_signups": 'number',//Count of new male sign-ups in a day
            "resourcesIds": [],//Saves ids of those resources which are opened and given feedback in a day
            "female_rating": [],//Rating count against each resource opened and rated by females in a day
            "female_timesRated": [],//Count of how many times a resource has been rated by females in a day
            "male_rating": [],//Rating count against each resource opened and rated by males in a day
            "male_timesRated": [],//Count of how many times a resource has been rated by males in a day
            "resources_opened": [],//Ids of opened resources in a day.These ids are actually coming from resources db.
            "resources_names": [], //Names of opened resources in a day
            "female_opened": [],//Ids of opened resources by females in a day.These ids are actually coming from resources db.
            "male_opened": []//Ids of opened resources by males in a day.These ids are actually coming from resources db.
        }
    })

})