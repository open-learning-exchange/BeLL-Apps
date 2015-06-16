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

    defaults: {
      kind: 'Resource'
    },

    schema: {
         title: 'Text',
       author:{title:'Author/Editor',type:'Text'},  // Author Field is required when adding the resource with tag news else no need for that.
     Publisher: 'Text',
        language: {
            type: 'Select',
            options: [{
                val: 'English',
                label: 'English'
            }, {
                val: 'Spanish',
                label: 'Spanish'
            },{
                val: 'Portuguese',
                label: 'Portuguese'
            }, {
                val: 'French',
                label: 'French'
            },
                {
                    val: 'Russian',
                    label: 'Russian'
                }, {
                    val: 'Chinese',
                    label: 'Chinese'
                },{
                    val: 'Arabic',
                    label: 'Arabic'
                }, {
                    val: 'Hindi',
                    label: 'Hindi'
                },
                {
                    val: 'Urdu',
                    label: 'Urdu'
                }, {
                    val: 'Punjabi',
                    label: 'Punjabi'
                },{
                    val: 'Nepali',
                    label: 'Nepali'
                }, {
                    val: 'Swahili',
                    label: 'Swahili'
                },
                {
                    val: 'Somali',
                    label: 'Somali'
                }, {
                    val: 'Kyrgyzstani',
                    label: 'Kyrgyzstani'
                },{
                    val: 'Asante',
                    label: 'Asante'
                }, {
                    val: 'Ewe',
                    label: 'Ewe'
                }]
        },
     
      Year: 'Text',
      
      subject:{
        title:'Subjects',
        type:'Select',
        options:['Agriculture','Business and Finance','Environment','Fine Arts','Food and Nutrition','Geography','Health & Medicine','History','Human Development','Languages','Law','Learning','Literature','Math','Music','Politics & Government','Reference','Religion','Science','Social Sciences','Sports','Technology']
      },
      Level:{
        title:'Levels',
        type:'Select',
        options: ['All','Early Education','Lower Primary','Upper Primary','Lower Secondary','Upper Secondary','Undergraduate','Graduate','Professional'],
      },
      Tag:{
            title:'Collection',
            type:'Select',
 			options:['Add New']
      },
      Medium:{
        type: 'Select',
        options: [ 'Text', 'Graphic/Pictures', 'Audio/Music/Book ', 'Video']
      },
      openWith:{
        type: 'Select',
        options: [ 'Just download','HTML','PDF.js','Flow Video Player','BeLL Video Book Player','Native Video' ]
      },
     uploadDate:'Date',
      averageRating :'Text',
      articleDate: {title:'Date Added to Library',type:'Date'},
      addedBy:'Text',
    }
  })

})
