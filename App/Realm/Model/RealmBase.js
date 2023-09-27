import _ from 'lodash'

class RealmBase {}
RealmBase.prototype.refAsArray = function(ref) {
  return _.keys(this[ref]).map(key => this[ref][key])
}
export default RealmBase
