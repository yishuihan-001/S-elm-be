'use strict'

import ExplainModel from '../../models/v3/explain'
import Res from '../../lib/res'

class Explain {
  async getExpalin (req, res, next) {
    try {
      const explain = await ExplainModel.findOne()
      res.send(Res.Success(explain.data))
    } catch (err) {
      console.log('获取服务中心数据失败', err)
      res.send(Res.Fail(err.message || '获取服务中心数据失败'))
    }
  }
}

export default new Explain()
