import { useState } from "react";
import "../assets/styles/register.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../api/axios";
import avatar from "../assets/images/avatar.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import validator from "validator";
import axios from "axios";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCPassword] = useState<string>("");

  const formValidation = (): boolean => {
    if (password !== cpassword) {
      toast.error("Passwords don't match!");
      return false;
    }
    if (!password || !username || !email) {
      toast.error("Field(s) left empty.");
      return false;
    }
    if (!validator.isEmail(email)) {
      toast.error("Enter a valid email");
      return false;
    }
    if (password.length < 5) {
      toast.error("Password too small");
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validation: boolean = formValidation();

    if (validation) {
      try {
        const post = await axiosInstance.post("/auth/register", {
          username,
          password,
          email,
        });

        if (post.status === 201) {
          toast(
            <div className="flex ">
              <img alt="SVG" src={avatar} height={"20px"} width={"24px"} />
              <span className="ml-4 mr-2">User Created</span>
              <FontAwesomeIcon
                icon={faCheck}
                className="tick font-bold text-green"
              />
            </div>,
            {
              progressStyle: {
                background: "rgb(117,104,242)",
              },
            },
          );
        } else {
          toast.error(`${post.data.msg}`);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(`${err.response?.data.msg}`);
        }
      }
    }
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="bg-black flex items-center justify-center h-screen">
        <form className="register bg-darkBlack p-2 rounded-lg text-center cusor-default form">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="bg-darkBlack text-white outline-none font-bold rounded-sm p-2 w-4/5 mt registeri"
            placeholder="Enter Username"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-darkBlack text-white outline-none font-bold rounded-sm p-2 w-4/5 mt registeri"
            placeholder="Enter e-mail"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-darkBlack text-white outline-none font-bold rounded-sm p-2 w-4/5 mt registeri"
            placeholder="Enter Password"
          />
          <input
            type="password"
            value={cpassword}
            onChange={(e) => {
              setCPassword(e.target.value);
            }}
            className="bg-darkBlack text-white outline-none font-bold rounded-sm p-2 w-4/5 mt registeri"
            placeholder="Confirm Password"
          />
          <button
            className="text-white bg-hoverPurple btn rounded-md mt-10 hover:opacity-80"
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <p className="mt-10 text-white">
            Go Back to{" "}
            <Link to="/" className="text-Purple">
              Login.
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
