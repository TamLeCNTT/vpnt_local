import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import Home from "./compnent/Home";
import Nhienlieu from "./compnent/Nhienlieu";
import Login from "./compnent/public/Login";
import Register from "./compnent/public/Register";
import Tonghop from "./compnent/megawa/Tonghop/Tonghop";
import TenTram from "./compnent/Tramdien/TenTram";
import ChuyenAcQuy from "./compnent/Tramdien/ChuyenAcQuy";
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* <Route path="/cabin/test" element={<Test />} />{" "} */}
            
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />

            <Route path="/register" element={<Register />} />
            {/* Megawan */}
            <Route path="/tonghop" element={<Tonghop />} />
            {/* Tram Ac quy */}
            {/* <Route path="/tentram" element={<TenTram />} /> */}
            <Route path="/chuyenacquy" element={<ChuyenAcQuy />} />
          </Routes>{" "}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </header>{" "}
      </div>{" "}
    </Router>
  );
}

export default App;
