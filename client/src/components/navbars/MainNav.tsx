import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faCrown,
  // faCrown,
  // faGear,
  // faInfo,
  faKeyboard,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../utils/logout";
import { toast } from "sonner";
import { useEffect } from "react";
import { socket } from "../../socket/socket";
import {
  // setRes,
  setSocketId,
  setSocketInstance,
} from "../../redux/reducers/multiplayerSlice";
import { setRecentTestResults } from "../../redux/reducers/statSlice";

export default function MainNav() {
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );
  const isMultiplayer = useSelector(
    (state: any) => state.multiplayer.multiplayer
  );
  const socketI = useSelector((state: any) => state.multiplayer.socketInstance);

  const roomId = useSelector((state: any) => state.multiplayer.roomId);
  // const res = useSelector((state: any) => state.multiplayer.res);
  const mode = useSelector((state: any) => state.setting.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const disconnectFromRoom = () => {
    dispatch(
      setRecentTestResults({
        wpm: 0,
        raw: 0,
        accuracy: 0,
        consistency: 0,
        chars: `${0}/${0}/${0}/${0}`,
        mode: mode,
        multiplayer: isMultiplayer,
      })
    );

    socketI.emit("complete-test", roomId, {
      wpm: 0,
      raw: 0,
      accuracy: 0,
      consistency: 0,
      chars: `${0}/${0}/${0}/${0}`,
      mode: mode,
    });
    socketI.emit("leave-room", roomId);
    navigate("/pvp-result", { replace: true });
  };

  useEffect(() => {
    if (!socketI && isMultiplayer) {
      socket.connect();
      dispatch(setSocketId(socket.id));
      dispatch(setSocketInstance(socket));
    } else if (!isMultiplayer && !socketI) {
      socket.disconnect();
    }
  }, [socketI]);

  return (
    <>
      <nav className="flex fixed top-0 w-full z-20 bg-zinc-800">
        <ul className="flex text-zinc-400 justify-between w-screen p-4 items-center">
          <li>
            <div>
              <ul className="flex flex-row gap-4 items-center">
                <li>
                  <Link to="/" className="flex justify-center items-center">
                    <img src="/icon.png" className="w-10 h-12 mx-2" />
                    <h1 className="text-2xl">donkeytype</h1>
                  </Link>
                </li>
                {!isMultiplayer && (
                  <>
                    <li title="Start Test">
                      <Link to="/">
                        <FontAwesomeIcon
                          icon={faKeyboard}
                          className="h-5 px-4"
                        />
                      </Link>
                    </li>
                    <li title="Leaderboard">
                      <Link to="/leaderboard">
                        <FontAwesomeIcon icon={faCrown} className="h-5 px-4" />
                      </Link>
                    </li>
                    {/* <li title="Info">
                      <Link to="/info">
                        <FontAwesomeIcon icon={faInfo} className="h-5 px-4" />
                      </Link>
                    </li> */}
                    <li title="Multiplayer">
                      <Link to="/multiplayer">
                        <FontAwesomeIcon
                          icon={faUserGroup}
                          className="h-5 px-4"
                        />
                      </Link>
                    </li>
                    {/* <li title="Settings">
                      <Link to="/settings">
                        <FontAwesomeIcon icon={faGear} className="h-5 px-4" />
                      </Link>
                    </li> */}
                  </>
                )}
              </ul>
            </div>
          </li>
          {!isMultiplayer ? (
            <li className="relative group flex">
              {isAuthenticated ? (
                <Link to="/account">
                  <div title="Profile Card">
                    <FontAwesomeIcon icon={faUser} className="h-5 px-4" />
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <div title="Login">
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      className="h-5 px-4"
                    />
                  </div>
                </Link>
              )}
              <div className="cursor-pointer">
                {isAuthenticated && (
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="h-5 px-4"
                    title="Logout"
                    onClick={async () => {
                      if (await logout()) {
                        toast.success("Logged Out!");
                        navigate("/login");
                      }
                    }}
                  />
                )}
              </div>
            </li>
          ) : (
            <>
              <div className="cursor-pointer">
                {isAuthenticated && (
                  <FontAwesomeIcon
                    icon={faArrowAltCircleLeft}
                    className="h-8 px-4"
                    title="Quit Game"
                    onClick={disconnectFromRoom}
                  />
                )}
              </div>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
