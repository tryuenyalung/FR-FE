const LOGOUT = 'LOGOUT'
// const UPDATE_USER_NAME = 'UPDATE_USER_NAME'
// const UPDATE_USER_AVATAR = 'UPDATE_USER_AVATAR'



export const mutations = {

    [LOGOUT] : (state, payload)  => {
        state.rejectedEfileList = payload
    },

    // [UPDATE_USER_NAME] : (state, payload) => {
    //     state.user.name.first_name = payload.name.first_name
    //     state.user.name.middle_name = payload.name.middle_name
    //     state.user.name.last_name = payload.name.last_name
    // },

    // [UPDATE_USER_AVATAR] : (state, payload) => {
    //     state.user.avatar = payload.avatar 
    // },


}

export const actions = {

    [LOGOUT] : (context, payload) =>  {
        //fire the method on mutation STORE_USER_DETAILS , with the argument of content
        context.commit(LOGOUT, payload)
    },

    // [UPDATE_USER_NAME] : (context, payload) =>  {
    //     //fire the method on mutation STORE_USER_DETAILS , with the argument of content
    //     context.commit(UPDATE_USER_NAME, payload)
    // },

    // [UPDATE_USER_AVATAR] : (context, payload) =>  {
    //     //fire the method on mutation STORE_USER_DETAILS , with the argument of content
    //     context.commit(UPDATE_USER_AVATAR, payload)
    // },
    
}
