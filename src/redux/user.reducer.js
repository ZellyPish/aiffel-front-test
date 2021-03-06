import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userInfo',
  initialState: {},
  reducers: {
    setUserInfo: {
      reducer: (state, action) => {
        return action.payload;
      },
    },
  },
});

const { actions, reducer } = userSlice;
export const { setUserInfo } = actions;
export default reducer;
