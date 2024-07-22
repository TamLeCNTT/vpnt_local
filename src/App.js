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
import ThemChuyenAcQuy from "./compnent/Tramdien/ThemChuyenAcQuy";
import ImageUploadAndDisplay from "./compnent/ImageUpload";
import TSLCD from "./compnent/megawa/TSLCD/TSLCD";
import Suyhao from "./compnent/thongke/Suyhao";
import Suyhao_v2 from "./compnent/thongke/Suyhao_v2";
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
            {/* thongke */}
            <Route path="/suyhao" element={<Suyhao />} />
            <Route path="/suyhao_v2" element={<Suyhao_v2 />} />
            {/* Megawan */}
            <Route path="/tonghop" element={<Tonghop />} />
            <Route path="/tslcd" element={<TSLCD />} />
              {/* Tram Ac quy */}
              {/* <Route path="/tentram" element={<TenTram />} /> */}
              <Route path="/chuyenacquy" element={<ChuyenAcQuy />} />
              <Route path="/themchuyenacquy" element={<ThemChuyenAcQuy />} />
            <Route path="/uploadImage" element={<ImageUploadAndDisplay />} />
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
