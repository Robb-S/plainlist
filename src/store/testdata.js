const allUsers = [
  {
  id: '1',
  name: 'robb',
  nickname: 'robb',
  email: 'robb@bento.com',
  passwordHash: 'xxxx',
  active: true,
  admin: 3,
  language: 'EN',
  defaultOrder: 'reverse_date',
  flat: false,
  hideDone: false,
  lastList: 102,
  },
  {
  id: '2',
  name: 'robby',
  nickname: 'robby',
  email: 'robbs@bento.com',
  passwordHash: 'xxxx',
  active: true,
  admin: 1,
  language: 'EN',
  defaultOrder: 'alpha',
  flat: false,
  hideDone: true,
  lastList: 103,
  }
];

const allCategories = [
  {
  id: '1',
  userid: '1',
  categoryName: 'to do',
  categoryPos: 1,
  creationDate: 0,
  lastUse: 0,
  active: true,
},
{
  id: '2',
  userid: '1',
  categoryName: 'shopping',
  categoryPos: 0,
  created: 0,
  lastUsed: 0,
  active: true,
},
{  
  id: '3',
  userid: '2',
  categoryName: 'stuff to do',
  categoryPos: 1,
  creationDate: 0,
  lastUse: 0,
  active: true,
},
{
  id: '4',
  userid: '2',
  categoryName: 'major shopping',
  categoryPos: 0,
  created: 0,
  lastUsed: 0,
  active: true,
},

]



export {allUsers, allCategories};  
