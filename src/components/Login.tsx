import { useEffect, useState } from "react";
import "../assets/styles/login.css";
import axiosInstance from "../api/axios";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setAuthorized } from "../state/authState/authSlice";
import { RootState, AppDispatch } from "../state/store";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { redirected } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    axiosInstance.get("/auth/verifytoken").then((res) => {
      if (res.status === 200) {
        dispatch(setAuthorized(true));
        dispatch(setUser(res.data.user));
        if (redirected) {
          navigate(redirected, { replace: true });
        } else {
          navigate("/chat-page");
        }
      }
    });
  }, []);

  const formValidation = (): boolean => {
    if (username === "" || password === "") {
      toast.error("Please enter both username and password");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validation: boolean = formValidation();
    if (validation) {
      try {
        const post = await axiosInstance.post("/auth/login", {
          username,
          password,
        });
        if (post.status === 200) {
          dispatch(setUser(username));
          dispatch(setAuthorized(true));
          navigate("/chat-page");
          toast("Logged in", {
            progressStyle: {
              background: "rgb(117,104,242)",
            },
          });
        } else {
          toast.error("Could not login");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log(err);
          toast.error(`${err.response?.data.msg}`);
        }
      }
    }
  };

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="Body bg-black flex items-center justify-center h-screen">
        <form className="bg-darkBlack p-2 rounded-lg  text-center cursor-default form">
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="username"
            className="mt login bg-darkBlack text-white outline-none  font-bold rounded-sm p-2 
        w-4/5"
          />
          <input
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            type="password"
            placeholder="password"
            className="login bg-darkBlack outline-none text-white font-bold rounded-sm p-2 
        w-4/5 mt-10 "
          />
          <button
            className="text-white bg-hoverPurple btn rounded-md mt-10 hover:opacity-80"
            onClick={handleLogin}
          >
            Login
          </button>
          <p className="mt-10 text-white">
            New User?{" "}
            <Link to="/register" className="text-Purple">
              Signup.
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
