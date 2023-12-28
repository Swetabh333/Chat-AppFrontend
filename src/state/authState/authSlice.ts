import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface authState {
  isAuthorized: boolean;
  redirected: string;
  user: string;
}

const initialState: authState = {
  isAuthorized: false,
  redirected: "",
  user: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setRedirected: (state, action: PayloadAction<string>) => {
      state.redirected = action.payload;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthorized, setRedirected, setUser } = authSlice.actions;

export default authSlice.reducer;
