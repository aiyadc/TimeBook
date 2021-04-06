const dom = {
  // 防抖
  debounce: (func, wait = 0) => {
    let timeout = null
    let args

    function debounced(...arg) {
      args = arg
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      // 以Promise的形式返回函数执行结果
      return new Promise((res, rej) => {
        timeout = setTimeout(async () => {
          try {
            const result = await func.apply(this, args)
            res(result)
          } catch (e) {
            rej(e)
          }
        }, wait)
      })
    }
    // 允许取消
    function cancel() {
      clearTimeout(timeout)
      timeout = null
    }
    // 允许立即执行
    function flush() {
      cancel()
      return func.apply(this, args)
    }
    debounced.cancel = cancel
    debounced.flush = flush
    return debounced
  },

  // 防抖
  throttle: (func, wait = 0, execFirstCall) => {

    let timeout = null

    let args

    let firstCallTimestamp

    function throttled(...arg) {
      if (!firstCallTimestamp) firstCallTimestamp = new Date().getTime()
      if (!execFirstCall || !args) {
        console.log('set args:', arg)
        args = arg
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      // 以Promise的形式返回函数执行结果
      return new Promise(async (res, rej) => {
        if (new Date().getTime() - firstCallTimestamp >= wait) {
          try {
            const result = await func.apply(this, args)
            res(result)
          } catch (e) {
            rej(e)
          } finally {
            cancel()
          }
        } else {
          timeout = setTimeout(async () => {
            try {
              const result = await func.apply(this, args)
              res(result)
            } catch (e) {
              rej(e)
            } finally {
              cancel()
            }
          }, firstCallTimestamp + wait - new Date().getTime())
        }
      })

    }

    // 允许取消

    function cancel() {

      clearTimeout(timeout)

      args = null

      timeout = null

      firstCallTimestamp = null

    }

    // 允许立即执行

    function flush() {

      cancel()

      return func.apply(this, args)

    }

    throttled.cancel = cancel

    throttled.flush = flush

    return throttled

  }


}

export default dom
