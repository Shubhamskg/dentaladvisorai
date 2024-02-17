import { createSlice } from "@reduxjs/toolkit";

let messagesSlice = createSlice({
    name: 'radiograph',
    initialState: {
        option:'',
        prompt: '',
        image:null,
        content: '',
        _id: null,
        latest: {
            option:'',
            prompt: '',
            image:null,
            content: ''
        },
        all: []
    },
    reducers: {
        emptyAllRes: () => {
            return {
                option:'',
                prompt: '',
                image:null,
                content: '',
                _id: null,
                latest: {
                    option:'',
                    prompt: '',
                    image:null,
                    content: ''
                },
                all: []
            }
        },
        addList: (state, { payload }) => {
            const { _id, items } = payload
            state._id = _id
            state.all = items
            return state
        },
        insertNew: (state, { payload }) => {
            const { chatsId, content = null,
                resume = false, fullContent = null,
                _id = null, option,prompt ,image } = payload

            if (_id) {
                state._id = _id
            }

            state.latest.id = chatsId

            if (prompt) {
                state.latest.prompt = prompt
            }
            if(image){
                state.latest.image=image
            }
            if(option){
                state.latest.option=option
            }

            const addToList = (latest) => {
                if (state['all'].find(obj => obj.id === latest.id)) {
                    state['all'].forEach(obj => {
                        if (obj.id === latest.id) {
                            obj.content = latest.content
                        }
                    })
                } else {
                    state['all'].push(latest)
                }
            }

            if (content && resume) {
                state.latest.content += content
                addToList(state.latest)

            } else if (content) {
                state.latest.content = content
                addToList(state.latest)
            }

            if (fullContent) {
                state.content = fullContent
            }

            return state
        },
        livePrompt: (state, { payload }) => {
            state.prompt = payload.prompt
            state.image=payload.image
            state.option=payload.option
            return state
        }
    }
})

export const { emptyAllRes, insertNew, livePrompt, addList } = messagesSlice.actions
export default messagesSlice.reducer