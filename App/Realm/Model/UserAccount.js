import RealmBase from './RealmBase'
class UserAccount extends RealmBase {}
UserAccount.schema = {
  name: 'UserAccount',
  primaryKey: 'id',
  properties: {
    version: {type: 'int', optional: true},
    startRow: {type: 'int', optional: true},
    rows: {type: 'int', optional: true},
    sortField: {type: 'string', optional: true},
    sortAsc: {type: 'bool', optional: true},
    id: {type: 'string'},
    deleted: {type: 'bool', optional: true},
    displayName: {type: 'string', optional: true},
    firstName: {type: 'string', optional: true},
    lastName: {type: 'string', optional: true},
    image: {type: 'string', optional: true},
    birthDay: {type: 'string', optional: true},
    gender: {type: 'string', optional: true},
    userName: {type: 'string', optional: true},
    password: {type: 'string', optional: true},
    employeeId: {type: 'string', optional: true},
    positionId: {type: 'string', optional: true},
    ssn: {type: 'string', optional: true},

    // info: {type: 'string', optional: true},
    // address: {type: 'string', optional: true},
    // city: {type: 'string', optional: true},
    // province: {type: 'string', optional: true},
    // country: {type: 'string', optional: true},
    // postalCode: {type: 'string', optional: true},
    // phone: {type: 'string', optional: true},
    // emergencyContact: {type: 'string', optional: true},
    // otherSocial: {type: 'string', optional: true},
    // lumosInsightId: {type: 'string', optional: true},
    // startDate: {type: 'string', optional: true},
    // endDate: {type: 'string', optional: true},
    // status: {type: 'string', optional: true},
    // resetPaswordToken: {type: 'string', optional: true},
    // userRoleId: {type: 'string', optional: true},
    // clearPassword: {type: 'string', optional: true}
  }
}

export {
  UserAccount
}
