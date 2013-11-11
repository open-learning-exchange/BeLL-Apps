module.exports = {
  hostname: "messenger.local",
  couchUrl: "http://pi:raspberry@messenger.local:5984",
  databases: [
    'apps',
  	'assignments', 
  	'feedback', 
  	'groups', 
  	'members', 
  	'actions',
  	'resources', 
  	'facilities',
    'devices'
  ],
  replicator: {
    location: 'http://pi:raspberry@messenger.local:5984/_replicator',
    directions: [
      {
        label: 'zone-mirror',
        server: 'http://ole:oleole@ole-kenya.iriscouch.com',
        push: [
          //'apps',
          'assignments', 
          'feedback', 
          'groups', 
          'members', 
          'actions',
          'resources', 
          'facilities',
          // 'devices'
        ],
        pull: [
          'apps',
          // 'assignments', 
          'feedback', 
          // 'groups', 
          // 'members', 
          // 'actions',
          'resources', 
          'facilities',
          // 'devices'
        ]
      },
      { 
        label: 'zone', 
        server: 'http://pi:raspberry@zone.local:5984', 
        push: [
          // 'apps',
          'assignments', 
          'feedback', 
          'groups', 
          'members', 
          'actions',
          'resources', 
          'facilities',
          // 'devices'
        ],
        pull: [
          'apps',
          // 'assignments', 
          'feedback', 
          // 'groups', 
          // 'members', 
          // 'actions',
          'resources', 
          'facilities',
          // 'devices'
        ]
      },
      {  
        label: 'bell',
        server: 'http://pi:raspberry@bell.local:5984',
        push: [
          'apps',
          // 'assignments', 
          'feedback', 
          // 'groups', 
          // 'members', 
          // 'actions',
          'resources', 
          // 'facilities',
          // 'devices'
        ],
        pull: [
          'apps',
          'assignments', 
          'feedback', 
          'groups', 
          'members', 
          'actions',
          'resources', 
          'facilities',
          // 'devices'
        ]
      }
    ]
  }
}




