import { NavLink } from "react-router-dom";
import bcrypt from "bcryptjs";
import "./User.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// import logo from '../../Asset/img/logo4.png'
import { connect } from "react-redux";
import Header from "../../Layout/Header";
import userService from "../../service/userService";
const Register = (props) => {
  const [username, setUsername] = useState("");
  const [errorusername, setErrorUsername] = useState(false);
  const [errorpassword, setErrorPassword] = useState(false);
  const [errorrepassword, setErrorRePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [listuser, setListUser] = useState([]);
  const [lastActivityTime, setLastActivityTime] = useState(new Date());

  let navitive = useNavigate();

  useEffect(() => {
    userService.getAll().then((res) => {
      setListUser(Object.values(res.data));
      console.log(Object.values(res.data));
    });
    // userService.update({ username: "khang", password: "khang", roleId: 2 });
  }, []);
  const ChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const ChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const ChangeRePassword = (e) => {
    setRePassword(e.target.value);
  };
  // useEffect(() => {
  //   const logoutTimer = setTimeout(() => {
  //     const currentTime = new Date();
  //     const elapsedMinutes = (currentTime - lastActivityTime) / (1000 * 60);
  //     console.log("Đăng xuất người dùng");
  //     // Đăng xuất nếu thời gian đã trôi qua hơn 10 phút
  //     if (elapsedMinutes >= 10) {
  //       // Thực hiện hành động đăng xuất ở đây
  //       console.log("Đăng xuất người dùng");
  //       setUser(null);
  //       sessionStorage.clear();
  //     }
  //   }, 60); // 10 phút = 600000 milliseconds

  //   return () => clearTimeout(logoutTimer);
  // }, [lastActivityTime, user]);
  const register = async (e) => {
    let user = { username: username, password: password };
    if (!username) {
      toast.error("Vui lòng nhập tên đăng nhập");
      setErrorUsername(true);
    } else {
      setErrorUsername(false);
      if (!password) {
        toast.error("Vui lòng nhập mật khẩu ");
        setErrorPassword(true);
      } else {
        setErrorPassword(false);
        if (!repassword) {
          toast.error("Vui lòng nhập lại mật khẩu");
          setErrorRePassword(true);
        } else {
          setErrorRePassword(false);
          if (password != repassword) {
            toast.error("Mật khẩu và nhập lại mật khẩu không khớp");
            setErrorRePassword(true);
            setErrorPassword(true);
          } else {
            setErrorRePassword(false);
            setErrorPassword(false);
            if (listuser.filter((e) => e.username == username).length > 0) {
              setErrorUsername(true);
              toast.error("Tên tài khoản đã tồn tại");
            } else {
              setErrorUsername(false);
              const salt = await bcrypt.genSalt(10); // Đợi salt được tạo
              const hashed = await bcrypt.hash(password, salt); // Mã hóa mật khẩu với salt

              console.log(
                "Hashed Password:",
                await bcrypt.compare(password, hashed)
              );
              userService
                .update({
                  id: username,
                  data: { username: username, password: hashed, roleId: 2 },
                })
                .then((res) => {
                  toast.success("Đăng ký tài khoản thành công !");
                  setPassword("");
                  setUsername("");
                  setRePassword("");
                });
            }
          }
        }
      }
    }
  };

  return (
    <>
      <Header />
      <main className="mains mt-5" id="login">
        <section id="about" class="about">
          <div class="container">
            <div class="row py-5 mt-4 align-items-center">
              <div class="col-md-5 pr-lg-5 mb-5 mb-md-0">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg"
                  alt=""
                  class="img-fluid mb-3 d-none d-md-block"
                />
                <h1 className="title">Chào mừng bạn trở lại</h1>
                {/* <p class="font-italic text-muted mb-0">Create a minimal registeration page using Bootstrap 4 HTML form elements.</p>
                                <p class="font-italic text-muted">Snippet By <a href="https://bootstrapious.com" class="text-muted">
                                    <u>Bootstrapious</u></a>
                                </p> */}
              </div>

              <div class="col-md-7 col-lg-6 ml-auto">
                <div class="row">
                  <h3 className="title ">Đăng ký tài khoản mới</h3>

                  <div class="input-group col-6 mb-2">
                    <input
                      id="firstName"
                      type="text"
                      name="firstname"
                      placeholder="Tên đăng nhập"
                      value={username}
                      onChange={(e) => ChangeUsername(e)}
                      class={
                        errorusername
                          ? "error form-control bg-white border-left-0 border-md input-login"
                          : "form-control bg-white border-left-0 border-md input-login"
                      }
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          register(event);
                        }
                      }}
                    />
                  </div>

                  <div class="input-group col-6 mb-2">
                    <input
                      required
                      id="lastName"
                      type="password"
                      name="lastname"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => ChangePassword(e)}
                      class={
                        errorpassword
                          ? "error form-control bg-white border-left-0 border-md input-login"
                          : "form-control bg-white border-left-0 border-md input-login"
                      }
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          register(event);
                        }
                      }}
                    />
                  </div>
                  <div class="input-group col-6 mb-4">
                    <input
                      required
                      id="lastName"
                      type="password"
                      name="lastname"
                      placeholder="Nhập lại mật khẩu"
                      value={repassword}
                      onChange={(e) => ChangeRePassword(e)}
                      class={
                        errorrepassword
                          ? "error form-control bg-white border-left-0 border-md input-login"
                          : "form-control bg-white border-left-0 border-md input-login"
                      }
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          register(event);
                        }
                      }}
                    />
                  </div>
                  <div class="form-group col-lg-12 mx-auto mb-0">
                    <div class="row">
                      <h5 className="content mb-3">
                        Bạn đã có tài khoản? <NavLink to="/">Đăng nhập</NavLink>
                      </h5>
                    </div>
                  </div>
                  <div class="form-group col-lg-12 mx-auto mb-0">
                    <button
                      class="btn btn-primary btn-block py-2"
                      onClick={(e) => register(e)}
                    >
                      <span class="font-weight-bold  btn-lg">Đăng ký</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
const mapStateToProps = (state) => {
  console.log(state);
  return {
    dataRedux: state.trangthai,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (e) => dispatch({ type: "LOGIN", payload: e }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
