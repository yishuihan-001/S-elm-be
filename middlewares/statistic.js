import timestamp from 'time-stamp'
import BaseComponent from '../prototype/baseComponent'
import StaticModel from '../models/static/static'

class Statistic extends BaseComponent {
  constructor () {
    super()
    this.apiRecord = this.apiRecord.bind(this)
  }

  async apiRecord (req, res, next) {
    try {
      let static_id = await this.getId('static_id')
      let apiInfo = {
        id: static_id,
        url: req.url,
        host: req.headers.host,
        date: timestamp('YYYY-MM-DD HH:mm:ss')
      }
      StaticModel.create(apiInfo)
    } catch (err) {
      console.log('API记录出错')
    }
    next()
  }
}

export default new Statistic()
