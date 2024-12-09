import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


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
import List_Thietbị from "./compnent/thongke/List_Thietbị";
import KichONU from "./compnent/olt/KichONU";
import ListTramOLT from "./compnent/olt/List_tram_olt";
import KichONU_HangLoat from "./compnent/olt/KichONU_HangLoat";
import List_mainE from "./compnent/thongke/List_mainE";
import Suyhao_mainE_v2 from "./compnent/thongke/Suyhao_mainE_v2";
import TrangChu from "./compnent/TrangChu";
import SuyHaoBSC from "./compnent/baocao/SuyHaoBSC";
import ListTuyenKT from "./compnent/baocao/ListTuyenKT";
import ListTuyenKT_TT from "./compnent/baocao/ListTuyenKT_TT";
import ThongkeSoLanSuyHao from "./compnent/baocao/ThongkeSoLanSuyHao";
import Trangchu from "./compnent/TrangChu";
import ListPort from "./compnent/port/ListPort";
import ListRing from "./compnent/port/ListRing";
function App() {

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* <Route path="/cabin/test" element={<Test />} />{" "} */}
            {/* status port  */}
            <Route path="/port/status" element={<ListPort />} />
            <Route path="/port/ring" element={<ListRing />} />
            {/*  */}
            <Route path="/kichonu" element={<KichONU />} />
            <Route path="/listtramolt" element={<ListTramOLT />} />
            <Route path="/kichonuhangloat" element={<KichONU_HangLoat />} />
            <Route path="/suyhao/switch" element={<Suyhao_v2 />} />
            <Route path="/suyhao/mainE" element={<Suyhao_mainE_v2 />} />
            <Route path="/listthietbi" element={<List_Thietbị />} />
            <Route path="/listmainE" element={<List_mainE />} />
            <Route path="/home" element={<Home />} />
            <Route path="/nhienlieu/list" element={<Nhienlieu />} />
            <Route path="/" element={<Trangchu />} />
            <Route path="/register" element={<Register />} />
            {/* bao cao */}
            <Route path="/tuyen_kt/danhsach" element={<ListTuyenKT />} />
            <Route path="/tuyen_kt_tt/danhsach" element={<ListTuyenKT_TT />} />
            <Route path="/thongke/solansuyhao" element={<ThongkeSoLanSuyHao />} />
            <Route path="/baocao/suyhaobsc" element={<SuyHaoBSC />} />
            {/* thongke */}
            {/* <Route path="/suyhao" element={<Suyhao />} />
            <Route path="/suyhao_v2" element={<Suyhao_v2 />} /> */}
            {/* Megawan */}
            {/* <Route path="/tonghop" element={<Tonghop />} />
            <Route path="/tslcd" element={<TSLCD />} /> */}
              {/* Tram Ac quy */}
              {/* <Route path="/tentram" element={<TenTram />} /> */}
              {/* <Route path="/chuyenacquy" element={<ChuyenAcQuy />} />
              <Route path="/themchuyenacquy" element={<ThemChuyenAcQuy />} />
            <Route path="/uploadImage" element={<ImageUploadAndDisplay />} /> */}
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
