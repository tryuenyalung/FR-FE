const GET_REJECTED_EFILE_NOTIFICATION = 'GET_REJECTED_EFILE_NOTIFICATION'
const GET_PENDING_EFILE_NOTIFICATION = 'GET_PENDING_EFILE_NOTIFICATION'

export const state = () => ({
    rejectedEfileNotif : 0,
    pendingEfileNotif : 0,
})


export const mutations = {

    [GET_REJECTED_EFILE_NOTIFICATION] : (state, payload)  => {
        state.rejectedEfileNotif = payload
    },
    [GET_PENDING_EFILE_NOTIFICATION] : (state, payload)  => {
        state.pendingEfileNotif = payload
    },

}

export const actions = {

    [GET_REJECTED_EFILE_NOTIFICATION] : (context, payload) =>  {
        //fire the method on mutation STORE_USER_DETAILS , with the argument of content
        context.commit(GET_REJECTED_EFILE_NOTIFICATION, payload)
    },

    [GET_PENDING_EFILE_NOTIFICATION] : (context, payload) =>  {
        //fire the method on mutation STORE_USER_DETAILS , with the argument of content
        context.commit(GET_PENDING_EFILE_NOTIFICATION, payload)
    },
    
}
