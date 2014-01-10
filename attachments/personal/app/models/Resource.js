$(function() {

  App.Models.Resource = Backbone.Model.extend({

    idAttribute: "_id",
    
       url: function() {
      if (_.has(this, 'id')) {
        var url = (_.has(this.toJSON(), '_rev'))
          ? App.Server + '/resources/' + this.id + '?rev=' + this.get('_rev') // For UPDATE and DELETE
          : App.Server + '/resources/' + this.id // For READ
      }
      else {
        var url = App.Server + '/resources' // for CREATE
      }
      return url
    },
    SetRid : function(rid){
    	this.id = rid
    },
    defaults: {
      kind: 'Resource'
    },
     schema: {
      addedBy:'Text',
      title: 'Text',
      description: 'Text',
      articleDate: 'Date',
      openWith:{
        type: 'Select',
        options: [ 'Just download', 'HTML', 'PDF.js', 'Flow Video Player', 'BeLL Video Book Player', 'Native Video' ]
      },
      subject:{
        type:'Select',
        options:['AGR (Agriculture)','BUS (Business and Finance)','FAS (Fine Arts)','FNU (Food and Nutrition)','GEO (Geography)','HMD (Health & Medicine)','HIS (History)','HDV (Human Development)','LAN (Languages)','LAW (Law)','LEA (Learning)','LIT (Literature)','MAT (Math)','MUS (Music)','POL (Politics & Government)','REF (Reference)','REL (Religion)','SCI (Science)','SOC (Social Sciences)','SPO (Sports)','TEC (Technology)','EN (Environment)']
      },
      Level:{
        type:'Select',
        options: ['Range','All']
      },
      fromLevel:{
          type :'Select',
          options:['1','2','3','4','5','6','7','8','9','10','11','12']
      },
      toLevel:{
          type :'Select',
          options:['1','2','3','4','5','6','7','8','9','10','11','12']
      },
      Tag:{
            type:'Select',
            options:['News','Fiction','Non Fiction']
      },
      author:'Text',  // Author Field is required when adding the resource with tag news else no need for that.
      // For Resources with more than one and where one open file must be specified
     openWhichFile: 'Text',
     uploadDate:'Date',
     // override everything, just open a specific URL
      openUrl: 'Text',
      averageRating :'Text',
    },
    
})
  
})
