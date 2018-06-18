const STORE_USER_DETAILS = 'STORE_USER_DETAILS'

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
        localStorage.setItem( "user", JSON.stringify(payload.user) )
    }
}

export const actions = {

    [STORE_USER_DETAILS] : (context, payload) =>  {
        //fire the method on mutation STORE_USER_DETAILS , with the argument of content
        context.commit(STORE_USER_DETAILS, payload)
    }
}
