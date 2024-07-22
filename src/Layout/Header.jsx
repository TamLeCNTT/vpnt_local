import { NavLink } from "react-router-dom";
import "./Layout.scss";
import "../Assets/scss/Layout.scss";
import logo from "../Assets/img/logo.png";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
const Header = (props) => {
  let navtive = useNavigate();
  const users = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const dangxuat = () => {
    navtive("/");
    sessionStorage.removeItem("user");
    toast.success("Đăng xuất thành công");
    props.logout();
  };

  const decryptData = (encryptedData) => {
    let secretKey = "vnpt";
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    } catch (error) {
      console.error("Error decrypting data: ", error);
      return null;
    }
  };
  return (
    <>
      <header className="header">
        {/* <div className="container-fluid"> */}
        <nav className="navbar header-nav navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand header-logo" href="#">
              <img src={logo} alt="vnpt" />
              <span className="header-subtitle-logo ">
                {/* <span className="d-flex fs-5 justify-content-center align-items-center">
                  Hậu Giang
                </span> */}
              </span>
            </a>
            <button
              className="navbar-toggler btn-menu-mobile"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">
                <i class="fa-solid fa-bars"></i>
              </span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    Trang chủ
                  </NavLink>
                </li>
                {/* <li className="nav-item">
                                    <a className="nav-link" href="#">Dịch vụ</a>

                                </li> */}
                {users && users.roleId > 99 && (
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      MEGAWAN
                    </a>
                    <ul className="sub-nav modal-90w">
                      <li className="sub-item">
                        <NavLink to="/tonghop" className="sub-content">
                          Tổng hợp
                        </NavLink>{" "}
                      </li>
                      <li className="sub-item">
                        <a href="" className="sub-content">
                          S4T
                        </a>
                      </li>
                      <li className="sub-item">
                        <NavLink to="/tslcd" className="sub-content">
                          TSLCD
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                )}

                <li className="nav-item">
                  <a className="nav-link" href="#">
                    FORM
                  </a>
                  <ul className="sub-nav modal-90w">
                    <li className="sub-item">
                      <NavLink to="/chuyenacquy" className="sub-content">
                        CHUYỂN TRẠM
                      </NavLink>{" "}
                    </li>
                    <li className="sub-item">
                      <a href="" className="sub-content">
                        S4T
                      </a>
                    </li>
                    <li className="sub-item">
                      <a href="" className="sub-content">
                        TSLCD
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">
                    Báo cáo
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">
                    Báo cáo
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">
                    Báo cáo
                  </NavLink>
                </li>

                {!users && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                      Đăng nhập
                    </NavLink>
                  </li>
                )}

                {users && (
                  <>
                    <li className="nav-item mr-3">
                      <a className="nav-link" href="#">
                        Quản lý
                      </a>
                      <ul className="sub-nav">
                        <li className="sub-item">
                          <a onClick={() => dangxuat()} className="sub-content">
                            Đăng xuất
                          </a>
                        </li>
                        <li className="sub-item">
                          {" "}
                          <NavLink to="/cabin/list" className="sub-content">
                            Lịch cabin
                          </NavLink>
                        </li>
                        <li className="sub-item">
                          {" "}
                          <NavLink to="/cabin/add" className="sub-content">
                            Đăng ký cabin
                          </NavLink>
                        </li>
                        <li className="sub-item">
                          {" "}
                          <NavLink to="/giaovien/list" className="sub-content">
                            Giáo viên{" "}
                          </NavLink>
                        </li>
                        <li className="sub-item">
                          {" "}
                          <NavLink to="/student/list" className="sub-content">
                            Học viên{" "}
                          </NavLink>
                        </li>
                        <li className="sub-item">
                          {" "}
                          <NavLink to="/session/list" className="sub-content">
                            Kiểm tra DAT
                          </NavLink>
                        </li>
                        <li className="sub-item">
                          {" "}
                          <NavLink to="/cohuu/list" className="sub-content">
                            DAT cơ hữu
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <ul className="navbar-nav nav-right me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                          {/* <button
                    className="btn btn-contact active"
                    aria-current="page"
                    href="#"
                  >
                    Liên hệ
                  </button> */}
                          <img
                            src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                            class="rounded-circle"
                            alt="Avatar"
                          />
                        </li>

                        <li className="nav-item  nav-phone">
                          <label className="form-label label label-primary">
                            {decryptData(users.username)}
                          </label>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {/* </div> */}
      </header>
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand text-white" href="/#"><h1>Hưng Thịnh</h1></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                            <li className="nav-item">
                                <a className="nav-link" href="/#">Lịch học</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link " href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Lịch Học
                                </a>
                                <ul className="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
                                    <li><NavLink activeclassname="nav-link scrollto" className="dropdown-item" href="#">Action</NavLink></li>
                                    <li>
                                        <NavLink activeclassname="nav-link scrollto" to="/cabin/show" className="dropdown-item" >
                                            Lịch cabin
                                        </NavLink>
                                    </li>

                                    <li><NavLink className="dropdown-item" activeclassname="nav-link scrollto" href="#">Something else here</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#">Xin chào!</a>
                            </li>
                        </ul>
                    </div>
                </div >
            </nav > */}
    </>
  );
};
const mapStateToProps = (state) => {
  return { dataRedux: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: "LOGOUT" }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
