import { useEffect, useRef, useState } from "react";
import MainNav from "../components/navbars/MainNav";
import TypeLayout from "./TypeLayout";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setOppRes, setUserLeft } from "../redux/reducers/multiplayerSlice";

export default function Home() {
  const res = useRef<any>(null);
  const dispatch = useDispatch();
  const socket = useSelector((state: any) => state.multiplayer.socketInstance);
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const isMultiplayer = useSelector(
    (state: any) => state.multiplayer.multiplayer
  );
  const mySocketId = useSelector((state: any) => state.multiplayer.socketId);

  useEffect(() => {
    if (roomId && socket.connected) {
      // console.log(socket);
      socket.on("connect", () => {
        console.log("connect");
        socket.emit("verify-room", roomId);
      });
      socket.on("Verified", () => {
        toast.success("Room verified!");
      });
      socket.on("Not Verified", () => {
        toast.error("Room may be full or not existed");
        navigate("/");
      });
      socket.on("User Left", (socketId: string) => {
        if (socketId !== mySocketId) {
          toast.warning("User Left");
        }
        dispatch(setUserLeft(true));
      });
      socket.on("Results", (users: any) => {
        const arr = users.filter((u: any) => u.userId !== user._id);
        const opp = arr[0];
        if (opp.results) {
          res.current = opp.results;
        }
        dispatch(
          setOppRes({
            username: opp.username,
            results: res.current,
            userId: opp.userId,
          })
        );
      });
    }
    //disconnection removed
    else if (!isMultiplayer && !roomId && socket) {
      console.log("disconnect");
      //socket.disconnect();
    } else {
      navigate("/");
    }

    return () => {
      // socket.disconnect()
    };
  }, [socket]);

  return (
    <>
      <MainNav />
      <div className="flex flex-col justify-around h-screen overflow-hidden">
        <TypeLayout />
        <footer className="fixed bottom-0 flex justify-center w-full mb-4">
          Content here
        </footer>
      </div>
    </>
  );
}
