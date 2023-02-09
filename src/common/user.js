const ID_TOKEN_KEY = "user"

export const getUser = () => {
    return window.localStorage.getItem(ID_TOKEN_KEY)
}

export const saveUser = user => {
    window.localStorage.setItem(ID_TOKEN_KEY, user)
}

export const destroyUser = () => {
    window.localStorage.removeItem(ID_TOKEN_KEY)
}

export default {
    getUser,
    saveUser,
    destroyUser
}