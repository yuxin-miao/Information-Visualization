import { createSlice } from "@reduxjs/toolkit";

export const infoSlice = createSlice({
    name: 'info',
    initialState: {
        url: 'https://cdn.anime-planet.com/anime/primary/fairy-tail-1.jpg',
        title: 'No anime selected.',
        description: ''
    },
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload
        },
        setTitle: (state, action) => {
            state.title = action.payload
        },
        setDescription: (state, action) => {
            state.description = action.payload
        }
    }
})

export const { setUrl, setTitle, setDescription } = infoSlice.actions

export default infoSlice.reducer