import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import itemSlice from "./itemSlice"
import claimSlice from "./claimSlice"
import marketplaceSlice from "./marketplaceSlice"
import messageSlice from "./messageSlice"


export default configureStore({
    reducer:{
        user:userSlice,
        item:itemSlice,
        claim:claimSlice,
        marketplace:marketplaceSlice,
        message:messageSlice,
    },
})