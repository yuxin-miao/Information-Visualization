import { createSlice } from "@reduxjs/toolkit";

export const infoSlice = createSlice({
    name: 'info',
    initialState: {
        url: 'https://cdn.anime-planet.com/anime/primary/fairy-tail-1.jpg',
        title: 'No anime selected.',
        description: '',
        rank:'',
        studio:'',
        releaseYear:'',
        releaseSeason:'',
        type:''
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
        setRank:(state,action)=>{
            state.rank=action.payload
        },
        setRating:(state,action)=>{
            state.rating=action.payload
        },
        setReleaseYear:(state,action)=>{
            state.releaseYear=action.payload
        },
        setReleaseSeason:(state,action)=>{
            state.releaseSeason=action.payload
        },
        setStudio:(state,action)=>{
            state.studio=action.payload
        },
        setType:(state,action)=>{
            state.type=action.payload
        }
    }
})

export const { setUrl, setTitle, setDescription, setRank, setRating,setReleaseSeason,setReleaseYear,setStudio,setType } = infoSlice.actions

export default infoSlice.reducer