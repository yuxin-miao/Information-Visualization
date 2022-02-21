import { createSlice } from "@reduxjs/toolkit";

export const infoSlice = createSlice({
    name: 'info',
    initialState: {
        url: 'https://cdn.anime-planet.com/anime/primary/fairy-tail-1.jpg',
        title: 'No anime selected.'
    },
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload
        },
        setTitle: (state, action) => {
            state.title = action.payload
        }
    }
})

export const { setUrl, setTitle } = infoSlice.actions

export default infoSlice.reducer