import Cookies from 'js-cookie'

const TokenKey = 'coloredeer-token'

export function getToken() {
  return Cookies.get(TokenKey)
  // return window.sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  // Cookies.set(TokenKey, token)
  // console.log('aaaaaa',Cookies.get(TokenKey))
  return Cookies.set(TokenKey, token)
  // console.log('token:',token)
  // return window.sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
  // return window.sessionStorage.removeItem(TokenKey)
}
