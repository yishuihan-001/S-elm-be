'use strict'

import EntryModel from '../../models/v2/entry'
import Res from '../../lib/res'

class Entry {
  constructor () {
    this.getEntry = this.getEntry.bind(this)
  }
  async getEntry (req, res, next) {
    try {
      const entries = await EntryModel.find({}, '-_id')
      res.send(Res.Success(entries))
    } catch (err) {
      res.send(Res.Fail(err.message || '获取数据失败'))
    }
  }
}

export default new Entry()
