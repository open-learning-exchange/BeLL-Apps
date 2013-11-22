module.exports = [
  {
    label: 'zone-mirror',
    server: 'http://ole:oleole@zone-mirror.iriscouch.com',
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
