const STORE_USER_DETAILS = 'STORE_USER_DETAILS'
const UPDATE_USER_NAME = 'UPDATE_USER_NAME'
const UPDATE_USER_AVATAR = 'UPDATE_USER_AVATAR'

export const state = () => ({
    user : {},
    token: null
})


export const mutations = {

    [STORE_USER_DETAILS] : (state, payload)  => {
        state.user = payload.user
        state.token = payload.token
        console.log(state.user.avatar);
        localStorage.setItem( "token", payload.token )
        // localStorage.setItem( "user", JSON.stringify(payload.user) )
    },

    [UPDATE_USER_NAME] : (state, payload) => {
        state.user.name.first_name = payload.name.first_name
        state.user.name.middle_name = payload.name.middle_name
        state.user.name.last_name = payload.name.last_name
    },

    [UPDATE_USER_AVATAR] : (state, payload) => {
        state.user.avatar = payload.avatar 
    },


}

export const actions = {

    [STORE_USER_DETAILS] : (context, payload) =>  {
        //fire the method on mutation STORE_USER_DETAILS , with the argument of content
        context.commit(STORE_USER_DETAILS, payload)
    },

    [UPDATE_USER_NAME] : (context, payload) =>  {
        //fire the method on mutation STORE_USER_DETAILS , with the argument of content
        context.commit(UPDATE_USER_NAME, payload)
    },

    [UPDATE_USER_AVATAR] : (context, payload) =>  {
        //fire the method on mutation STORE_USER_DETAILS , with the argument of content
        context.commit(UPDATE_USER_AVATAR, payload)
    },
    
}
