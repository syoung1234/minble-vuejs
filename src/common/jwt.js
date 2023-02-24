import VueCookies from "vue-cookies"

const ID_TOKEN_KEY = "accessToken"

export const getToken = () => {
    // return window.localStorage.getItem(ID_TOKEN_KEY)
    return VueCookies.get(ID_TOKEN_KEY)
}

export const saveToken = token => {
    // window.localStorage.setItem(ID_TOKEN_KEY, token)
    VueCookies.set(ID_TOKEN_KEY, token)
}

export const destroyToken = () => {
    // window.localStorage.removeItem(ID_TOKEN_KEY)
    VueCookies.remove(ID_TOKEN_KEY)
}

export default {
    getToken,
    saveToken,
    destroyToken
}