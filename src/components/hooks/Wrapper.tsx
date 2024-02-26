import React, { useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRedirected } from "../../state/authState/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../state/store";

interface myProps {
  children: ReactNode;
}

const Wrapper: React.FC<myProps> = ({ children }) => {
 
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthorized } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    
    if (!isAuthorized) {
      dispatch(setRedirected(location.pathname));
      navigate("/");
    }
  }, [isAuthorized,location.pathname]);

  return <>{isAuthorized && children}</>;
};

export default Wrapper;
