const Rules = {
  isEmpty (v, msg) {
    if (v === '' || v === undefined || v === null) {
      return msg
    }
  },

  regexpPhone (v, msg) {
    if (!/^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(v)) {
      return msg
    }
  },

  regexpEmail (v, msg) {
    if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(v)) {
      return msg
    }
  },

  minLength (v, len, msg) {
    if (v.length < len) {
      return msg
    }
  },

  maxLength (v, len, msg) {
    if (v.length > len) {
      return msg
    }
  },

  enum (v, arr, msg) {
    arr = arr.split('&')
    if (arr.indexOf(v) < 0) {
      return msg
    }
  },

  equal (v, ov, msg) {
    if (v !== ov) {
      return msg
    }
  }
}

class Validator {
  constructor () {
    this.list = []
  }
  add (value, rules) {
    let that = this
    rules.forEach(rule => {
      (function (item) {
        let dataArr = item.rule.split(':')
        let errorMsg = item.msg
        that.list.push(function () {
          let ruleName = dataArr.shift()
          dataArr.unshift(value)
          dataArr.push(errorMsg)
          return Rules[ruleName] ? Rules[ruleName].apply(null, dataArr) : '输入错误，请重新输入'
        })
      })(rule)
    })
  }

  start () {
    for (let i = 0, len = this.list.length; i < len; i++) {
      let res = this.list[i]()
      if (res) {
        return res
      }
    }
  }
}

export default Validator
