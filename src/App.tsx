import "./App.css";
import Chat from "./components/Chat.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Wrapper from "./components/hooks/Wrapper.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/chat-page"
          element={
            <Wrapper>
              <Chat />
            </Wrapper>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
