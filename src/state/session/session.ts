import { createSlice, type PayloadAction} from '@reduxjs/toolkit';


// Note: Im removing session token here? cause it could be exposed?
// Thinking of replacing it with table id, if it doesnt work,
// go back to sessions

// 4 whole redux state
interface SessionStateType {
  isLoggedIn: boolean;
  userName: string | null;
  userId: string | null;
}

// 4 what is being passed
export interface SessionPayload {
    userName: string | null;
    userId: string | null;
}

const initialState: SessionStateType = {
  isLoggedIn: false,
  userName: null,
  userId: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    _rdxLogin(state, action : PayloadAction<SessionPayload>) {
      state.isLoggedIn = true;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
    },
    _rdxLogout(state) {
      state.isLoggedIn = false;
      state.userName = null;
      state.userId = null;
    }},
});


export const { _rdxLogin, _rdxLogout } = sessionSlice.actions;

export default sessionSlice.reducer;
