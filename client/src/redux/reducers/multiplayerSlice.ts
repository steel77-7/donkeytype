import { createSlice } from "@reduxjs/toolkit";
import { IMultiplayer } from "../../types/user";
import { socket } from "../../socket/socket";

const initialState: IMultiplayer = {
  roomId: null,
  members: [],
  settings: {
    time: null,
    currentMode: null,
    type: null,
    typeOfText: null,
    wordNumber: null,
  },
  socketId: null,
  socketInstance: null,
  multiplayer: false,
  userLeft:false,
  res:null,
  oppRes:null
};

const multiplayerSlice = createSlice({
  name: "multiplayer",
  initialState,
  reducers: {
    setRoomIdState: (state, action) => {
      state.roomId = action.payload;
    },
    setSocketInstance: (state, action) => {
      state.socketInstance = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setMultiplayer: (state, action) => {
      state.multiplayer = action.payload;
    },
    setMode: (state, action) => {
      state.settings = action.payload;
    },
    setUserLeft:(state,action)=>{
      state.userLeft = action.payload
    },
    setRes:(state,action)=>{
      state.res = action.payload;
    },
    setOppRes:(state,action)=>{
      state.oppRes = action.payload;
    },
    invalidateState: (state) => {
      state.members = [];
      state.settings = {
        time: null,
        currentMode: null,
        type: null,
        typeOfText: null,
        wordNumber: null,
      };
      state.roomId = null;
      state.socketId = null;
      state.socketInstance = null;
      state.multiplayer = false;
      state.userLeft = false;
    },
  },
});

export const {
  setRoomIdState,
  invalidateState,
  setSocketId,
  setSocketInstance,
  setMultiplayer,
  setMode,
  setUserLeft,
  setRes,
  setOppRes
} = multiplayerSlice.actions;

export const initializeSocket = () => (dispatch: any) => {
  
  socket.on("connect", () => {
    console.log("socket connected", socket.id);
    dispatch(setSocketId(socket.id));
    dispatch(setSocketInstance(socket));
  });
  return socket;
};

export default multiplayerSlice.reducer;
