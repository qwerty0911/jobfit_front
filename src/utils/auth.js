const USER_UUID_KEY = 'jobfit_user_uuid'

export const saveUserUuid = (userUuid) => {
    localStorage.setItem(USER_UUID_KEY, userUuid)
}

export const getUserUuid = () => localStorage.getItem(USER_UUID_KEY)

export const clearUserUuid = () => {
    localStorage.removeItem(USER_UUID_KEY)
}
