import { IUserState } from "@/type/user";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IUserState = {
    id: 0,
    name: "",
    email: "",
    role: "",
    avatar: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginAction: (state, action: PayloadAction<IUserState>) => {
            const { id, name, email, role, avatar } = action.payload

            state.id = id
            state.name = name
            state.email = email
            state.role = role
            state.avatar = avatar
        },
        logoutAction: (state) => {
            state.id = 0
            state.name = ""
            state.email = ""
            state.role = ""
            state.avatar = ""
        }
    }
})

export const { loginAction, logoutAction } = userSlice.actions
export default userSlice.reducer