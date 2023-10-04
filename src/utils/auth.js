import Cookies from "js-cookie"

const tokenKey = "token"
const refreshTokenKey = "refreshToken"

export function getToken() {
  return Cookies.get(tokenKey) || sessionStorage.getItem(tokenKey)
}

export function setToken(token) {
  return Cookies.set(tokenKey, token, { expires: 365 })
}

export function setTempToken(token) {
  return sessionStorage.setItem(tokenKey, token)
}

export function removeToken() {
  sessionStorage.removeItem(tokenKey)
  return Cookies.remove(tokenKey)
}

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey)
}

export function setRefreshToken(refreshToken, maxAge) {
  return Cookies.set(refreshTokenKey, refreshToken, {
    expires: maxAge / 86400
  })
}

export const removeRefreshToken = () => Cookies.remove(refreshTokenKey)
