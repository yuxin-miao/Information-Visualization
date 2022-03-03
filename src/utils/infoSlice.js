import { createSlice } from "@reduxjs/toolkit";

export const infoSlice = createSlice({
    name: 'info',
    initialState: {
        url: 'https://cdn.anime-planet.com/anime/primary/fairy-tail-1.jpg',
        title: 'No anime selected.',
        description: '',
        studio: '',
        season: '',
        releaseYear: '',
        type: '',
        rank: '',
        rating: '',
        voiceActors: '',
        staff: ''
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
        },
        setStudio: (state, action) => {
            state.studio = action.payload
        },
        setSeason: (state, action) => {
            state.season = action.payload
        },
        setReleaseYear: (state, action) => {
            state.releaseYear = action.payload
        },
        setType: (state, action) => {
            state.type = action.payload
        },
        setRank: (state, action) => {
            state.rank = action.payload
        },
        setRating: (state, action) => {
            state.rating = action.payload
        },
        setVoiceActors: (state, action) => {
            state.voiceActors = action.payload
        },
        setStaff: (state, action) => {
            state.staff = action.payload
        },
    }
})

export const { setUrl, setTitle, setDescription, setStudio, setSeason, setReleaseYear, setType, setRank, setRating, setVoiceActors, setStaff } = infoSlice.actions

export default infoSlice.reducer