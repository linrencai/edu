import request from '@/utils/request'

export function login(data) {
  console.log(data);
  return request({
    url: '/admin/adminLogin',
    method: 'post',
    data
  })
}
export function getCode(data) {
  return request({
    url: '/verificationCode/getCode',
    method: 'post',
    params
  })
}
// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
