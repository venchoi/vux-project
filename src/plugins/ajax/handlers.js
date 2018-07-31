import router from '../../router'
/**
 * responed 统一处理的函数
 * @param {String} code - data字段的数据
 */
const businessCodeHandler = (code) => {
  switch (code) {
    case '301':
    // 清掉token
      router.push('/login/userLogin')
      break
    case '302':
      router.push('/login/userLogin')
      break
    case '303':
      router.push('/login/userLogin')
      break
    default:
      break
  }
}

/**
 * 异常处理
 * @param {String} error - 异常信息
 */
const catchHandler = (error) => {
  console.log(error)
}

const specialHandler = {
}
export {
  businessCodeHandler,
  catchHandler,
  specialHandler
}
