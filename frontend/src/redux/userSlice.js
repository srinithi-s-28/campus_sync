import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name :"user",
    initialState:{
        userData:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
        },
        updateCreadits:(state,action)=>{
            if(state.userData){
                state.userData.credits = action.payload
            }
        }
    }
})

export const {setUserData,updateCreadits}= userSlice.actions
export default userSlice.reducer