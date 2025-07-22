import { useEffect, useState } from "react";
import { connect } from "react-redux";
import TramOLtService from "../../service/TramOLtService";
import Header from "../../Layout/Header";
import "../../Assets/scss/loading.scss";
import Loading from "../../support/Loading";
import { toast } from "react-toastify";
import DoKiemService from "../../service/DoKiemService";
const DoKiem = (props) => {
  const [Ip, setIp] = useState("");

  const [List, setList] = useState([]);
  const [loading, setloading] = useState(false);
  const [isDis, setIsDiss] = useState(false);
  useEffect(() => {}, []);

  const ChangeIp = (e) => {
    setIp(e.target.value);
    setList([]);
  };

  const THUCHIEN = () => {
    setList([]);
    setloading(true);
    if (Ip) {
      setIsDiss(true);
      DoKiemService.getStatus(Ip)
        .then((res) => {
          setIsDiss(false);
          console.log(res.data);
          setloading(false);
          toast.success("Thực hiện lệnh thành công");
          let file_path = "F:\\Vi La\\suyhao\\api\\dokiemcheck.txt";
          TramOLtService.Get_MAC_Onu_Gpon_Alu(file_path).then((res) => {
            console.log(res.data);

            setList(res.data);
          });
        })
        .catch((err) => {
          toast.error("Đã xảy ra lỗi: ", err);
          setloading(false);
        });
    } else {
      toast.info("Vui lòng nhập IP");
    }
  };
  return (
    <>
      {loading && <Loading />}

      <Header />
      <main id="cabin_list" className="main mt-5 ">
        <div className="container">
          <section id="about" className="about">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className=" mb-4 col col-md-12 tonghop-label">
                  <p class="text-center text-uppercase fs-2">
                    SPEED TEST BOX ĐO KIỂM
                  </p>
                </div>
              </div>
              <div className="row mb-9">
                {/* Chọn loại */}
                <div className="col col-12 col-md-3  mb-4"></div>
                <div className="col col-12 col-md-3  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      IP
                    </label>
                    <input
                      className={"form-control"}
                      type="text"
                      value={Ip}
                      onChange={(e) => ChangeIp(e)}
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-3 mb-4 d-flex align-items-end">
                  <div className=" ">
                    <button
                      onClick={() => THUCHIEN()}
                      className="btn btn-lg btn-info b-1"
                    >
                      Thực hiện
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div
            className="container p-3 border rounded"
            style={{
              backgroundColor: "#222",
              color: "yellow",
              maxWidth: "100vh",
            }}
          >
            <div
              className="mb-3"
              style={{
                height: "80vh",
                overflowY: "auto",
                whiteSpace: "pre",
                fontFamily: "monospace",
              }}
            >
              {List.length > 0
                ? List.map((line, index) => <div key={index}>{line}</div>)
                : ""}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DoKiem;
