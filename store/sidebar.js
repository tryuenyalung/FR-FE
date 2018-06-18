const CHANGE_ACTIVE_CONTENT = 'CHANGE_ACTIVE_CONTENT'

export const state = () => ({
    activeContent : "efile"
})

export const mutations = {

    [CHANGE_ACTIVE_CONTENT] : (state, content)  => {
        state.activeContent = content
    }
}

export const actions = {

    [CHANGE_ACTIVE_CONTENT] : (context, content) =>  {
        //fire the method on mutation CHANGE_ACTIVE_CONTENT, with the argument of content
        context.commit(CHANGE_ACTIVE_CONTENT, content)
    }
}
