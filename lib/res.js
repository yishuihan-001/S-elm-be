const res = {
  code: {
    fail: 0,
    success: 1
  },
  Fail (msg = 'FAIL') {
    return {
      status: res.code.fail,
      message: msg
    }
  },
  Success (data = 'SUCCESS') {
    return {
      status: res.code.success,
      data: data
    }
  }
}

export default res
