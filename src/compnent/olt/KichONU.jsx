import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import TramOLtService from "../../service/TramOLtService";
import Header from "../../Layout/Header";
import "../../Assets/scss/loading.scss";
import Loading from "../../support/Loading";
import Swal from "sweetalert2";
const KichONU = (props) => {
  let navtive = useNavigate();
  const [tramolt, settramolt] = useState({});
  const [matram, setmatram] = useState("");
  const [loaichuyenerror, setloaichuyenerror] = useState(false);

  const [ngaychuyen, setngaychuyen] = useState("");
  const [slot, setslot] = useState({});
  const [portpon, setportpon] = useState("");
  const [onu, setonu] = useState("");
  const [slid, setslid] = useState("");
  const [disableSlot, setdisableSlot] = useState(false);
  const [listtramolt, setListtramolt] = useState([]);
  const [loading, setloading] = useState(false);
  const optionslot = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];
  useEffect(() => {
    TramOLtService.getdata().then((res) => {
      res.data.map((item, index) => {
        item.value = item.matram;
        item.label = item.tentram;
      });
      setListtramolt(res.data);
    });
  }, []);

  const RandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const changeTramOlt = (e) => {
    console.log(e);
    settramolt(e);
    if (onu && e && slot && portpon) {
      if (e.loai == "zte-mini")
        setslid(
          e.matram +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      else
        setslid(
          e.matram +
            "" +
            slot.value +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      console.log(e.matram + "" + slot.value + "" + portpon + "" + onu);
    } else {
      setslid("");
    }
    if (e.loai == "zte-mini") {
      setslot({ value: "3", label: "3" });
      setdisableSlot(true);
    } else {
      setslot({});
      setdisableSlot(false);
      setslid("");
    }
  };
  const changeSlotOlt = (e) => {
    console.log(e);
    setslot(e);
    if (onu && tramolt && e && portpon) {
      if (tramolt.loai == "zte-mini")
        setslid(
          tramolt.matram +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      else
        setslid(
          tramolt.matram +
            "" +
            e.value +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      console.log(tramolt.matram + "" + e.value + "" + portpon + "" + onu);
    } else {
      setslid("");
    }
  };
  const changePortpon = (e) => {
    let portponnew = "";
    if (!e.target.value) setportpon("");
    else {
      if (Number(e.target.value) < 1) {
        setportpon(1);
        portponnew = 1;
      } else {
        if (Number(e.target.value) > 16) {
          setportpon(16);
          portponnew = 16;
        } else {
          setportpon(e.target.value);
          portponnew = e.target.value;
        }
      }
    }
    if (onu && tramolt && slot && portponnew) {
      if (tramolt.loai == "zte-mini")
        setslid(
          tramolt.matram +
            "" +
            (Number(portponnew) < 10 ? "0" + portponnew : portponnew) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      else
        setslid(
          tramolt.matram +
            "" +
            slot.value +
            "" +
            (Number(portponnew) < 10 ? "0" + portponnew : portponnew) +
            "" +
            (Number(onu) < 10 ? "0" + onu : onu)
        );
      console.log(
        tramolt.matram + "" + slot.value + "" + portponnew + "" + onu
      );
    } else {
      setslid("");
    }
  };
  const changeOnu = (e) => {
    let onunew = "";
    if (!e.target.value) setonu("");
    else {
      if (Number(e.target.value) < 1) {
        setonu(1);
        onunew = 1;
      } else {
        if (Number(e.target.value) > 64) {
          setonu(64);
          onunew = 64;
        } else {
          setonu(e.target.value);
          onunew = e.target.value;
        }
      }
    }

    if (onunew && tramolt && slot && portpon) {
      if (tramolt.loai == "zte-mini")
        setslid(
          tramolt.matram +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onunew) < 10 ? "0" + onunew : onunew)
        );
      else
        setslid(
          tramolt.matram +
            "" +
            slot.value +
            "" +
            (Number(portpon) < 10 ? "0" + portpon : portpon) +
            "" +
            (Number(onunew) < 10 ? "0" + onunew : onunew)
        );
      console.log(tramolt.matram + "" + slot.value + "" + portpon + "" + onu);
    } else {
      setslid("");
    }
  };
  const changeSlid = (e) => {
    setslid(e.target.value);
  };
  const changengaychuyen = (e) => {
    setngaychuyen(e.target.value);
  };
  const ActionONU = () => {
    if (!tramolt || !tramolt.value) {
      toast.error("Vui lòng chọn trạm olt");
    } else {
      if (!slot || !slot.value) {
        toast.error("Vui lòng chọn slot");
      } else {
        if (!portpon) {
          toast.error("Vui lòng nhập port");
        } else {
          if (!onu) {
            toast.error("Vui lòng nhập onu");
          } else {
            const regex = /^[HZAD][A-Z0-9]{9}$/;
            if (!regex.test(slid)) {
              toast.error("Vui lòng nhập đúng định dạng SLID");
            } else {
              setloading(true);

              if (tramolt.loai == "gpon-alu") {
                const onuid =
                  "1/1/" +
                  slot.value +
                  "/" +
                  (portpon < 10 ? "0" + portpon : portpon) +
                  "/" +
                  (onu < 10 ? "0" + onu : onu);
                console.log(onu, portpon, slid, slot, tramolt, onuid);
                TramOLtService.Active_Onu_Gpon_Alu(
                  tramolt.ip,
                  tramolt.username,
                  tramolt.password,
                  slid,
                  onuid,
                  tramolt.his,
                  tramolt.mytv
                ).then((res) => {
                  console.log(res.data);
                  toast.success("Kích Onu thành công");
                  setloading(false);
                });
                // TramOLtService.Active_Onu_Gpon_Alu_many(
                //   "10.102.54.26",
                //   "isadmin",
                //   "ans%23150",
                //   tramolt.matram,
                //   tramolt.his,
                //   tramolt.mytv,
                //   slot.value,
                //   portpon < 10 ? "0" + portpon : portpon,
                //   onu,
                //   onu
                // ).then((res) => {
                //   console.log(res.data);
                //   if (res.data.error) toast.error("Kích  ONU thất bại");
                //   else toast.success("Kích ONU thành công");
                //   setloading(false);
                // });
              } else {
                if (tramolt.loai == "gpon-zte") {
                  const onuid =
                    "1/" +
                    slot.value +
                    "/" +
                    (portpon < 10 ? "0" + portpon : portpon);

                  console.log(onu, portpon, slid, slot, tramolt, onuid);
                  TramOLtService.Active_Onu_Gpon_Zte(
                    tramolt.ip,
                    tramolt.username,
                    tramolt.password,
                    slid,
                    onuid,
                    tramolt.his,
                    tramolt.mytv,
                    onu < 10 ? "0" + onu : onu
                  ).then((res) => {
                    console.log(res.data);
                    toast.success("Kích Onu thành công");
                    setloading(false);
                  });
                  // TramOLtService.Active_Onu_Gpon_zte_many(
                  //   "10.102.53.14",
                  //   "admin",
                  //   "dhtthost%40",
                  //   tramolt.matram,
                  //   tramolt.his,
                  //   tramolt.mytv,
                  //   slot.value,
                  //   portpon < 10 ? "0" + portpon : portpon,
                  //   onu,
                  //   onu
                  // ).then((res) => {
                  //   console.log(res.data);
                  //   toast.success("Kich ONU thành công");
                  //   setloading(false);
                  // });
                } else {
                  if (tramolt.loai == "zte-mini") {
                    const onuid = "1/" + "3/" + portpon;
                    let slid_zte_mini =
                      tramolt.matram +
                      "" +
                      (Number(portpon) < 10 ? "0" + portpon : portpon) +
                      "" +
                      (Number(onu) < 10 ? "0" + onu : onu);
                    console.log(onu, portpon, slid, slot, tramolt, onuid);
                    TramOLtService.Active_Onu_Gpon_Zte_mini(
                      tramolt.ip,
                      tramolt.username,
                      tramolt.password,
                      slid_zte_mini,
                      onuid,
                      tramolt.his,
                      tramolt.mytv,
                      onu < 10 ? "0" + onu : onu,
                      tramolt.ims
                    ).then((res) => {
                      console.log(res.data);
                      toast.success("Kích Onu thành công");
                      setloading(false);
                    });
                    // TramOLtService.Active_Onu_Gpon_zte_mini_many(
                    //   "10.102.62.12",
                    //   "admin",
                    //   "dhtthost%40",
                    //   tramolt.matram,
                    //   tramolt.his,
                    //   tramolt.mytv,
                    //   tramolt.ims,
                    //   slot.value,
                    //   portpon < 10 ? "0" + portpon : portpon,
                    //   onu,
                    //   onu
                    // ).then((res) => {
                    //   console.log(res.data);
                    //   toast.success("Kich onu_old thành công");
                    //   setloading(false);
                    // });
                  } else {
                    if (tramolt.loai == "huawei") {
                      const onuid =
                        "0/" +
                        slot.value +
                        "/" +
                        (portpon < 10 ? "0" + portpon : portpon);

                      TramOLtService.Active_Onu_Gpon_huawei(
                        tramolt.ip,
                        tramolt.username,
                        tramolt.password,
                        slid,
                        onuid,
                        tramolt.his,
                        tramolt.mytv,
                        onu < 10 ? "0" + onu : onu,
                        tramolt.ims,
                        slot.value,
                        portpon < 10 ? "0" + portpon : portpon
                      ).then((res) => {
                        console.log(res.data);
                        toast.success("Kích Onu thành công");
                        setloading(false);
                      });
                      // TramOLtService.Active_Onu_Gpon_huawei_many(
                      //   "10.102.55.11",
                      //   "root",
                      //   "Dhtthost%40345678",
                      //   tramolt.matram,
                      //   tramolt.his,
                      //   tramolt.mytv,
                      //   tramolt.ims,
                      //   slot.value,
                      //   portpon < 10 ? "0" + portpon : portpon,
                      //   onu,
                      //   onu
                      // ).then((res) => {
                      //   console.log(res.data);
                      //   toast.success("Kich onu_old thành công");
                      //   setloading(false);
                      // });
                    } else {
                      if (tramolt.loai == "hw-mini") {
                        const onuid =
                          "0/" +
                          slot.value +
                          "/" +
                          (portpon < 10 ? "0" + portpon : portpon);

                        TramOLtService.Active_Onu_Gpon_huawei_mini(
                          tramolt.ip,
                          tramolt.username,
                          tramolt.password,
                          slid,
                          onuid,
                          tramolt.his,
                          tramolt.mytv,
                          onu < 10 ? "0" + onu : onu,
                          tramolt.ims,
                          slot.value,
                          portpon < 10 ? "0" + portpon : portpon
                        ).then((res) => {
                          console.log(res.data);
                          toast.success("Kích Onu thành công");
                          setloading(false);
                        });
                        // TramOLtService.Active_Onu_Gpon_huawei_mini_many(
                        //   "10.102.60.11",
                        //   "root",
                        //   "Dhtthost%40345678",
                        //   tramolt.matram,
                        //   tramolt.his,
                        //   tramolt.mytv,
                        //   tramolt.ims,
                        //   slot.value,
                        //   portpon < 10 ? "0" + portpon : portpon,
                        //   onu,
                        //   onu
                        // ).then((res) => {
                        //   console.log(res.data);
                        //   toast.success("Kich onu_old thành công");
                        //   setloading(false);
                        // });
                      } else {
                        let slid_dasan =
                          tramolt.matram +
                          "1" +
                          (Number(portpon) < 10 ? "0" + portpon : portpon) +
                          "" +
                          (Number(onu) < 10 ? "0" + onu : onu);
                        TramOLtService.Active_Onu_Gpon_dasan(
                          tramolt.ip,
                          tramolt.username,
                          tramolt.password,
                          slid_dasan,

                          onu < 10 ? "0" + onu : onu,

                          portpon < 10 ? "0" + portpon : portpon
                        ).then((res) => {
                          console.log(res.data);
                          toast.success("Kích Onu thành công");
                          setloading(false);
                        });
                        // TramOLtService.Active_Onu_Gpon_dasan_many(
                        //   "10.102.56.109",
                        //   "admin",
                        //   "dhtthost%40",
                        //   tramolt.matram,
                        //   tramolt.his,
                        //   tramolt.mytv,
                        //   tramolt.ims,
                        //   slot.value,
                        //   portpon < 10 ? "0" + portpon : portpon,
                        //   onu,
                        //   onu
                        // ).then((res) => {
                        //   console.log(res.data);
                        //   toast.success("Kích onu_old thành công");
                        //   setloading(false);
                        // });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const DeleteONU = () => {
    if (!tramolt || !tramolt.value) {
      toast.error("Vui lòng chọn trạm olt");
    } else {
      if (!slot || !slot.value) {
        toast.error("Vui lòng chọn slot");
      } else {
        if (!portpon) {
          toast.error("Vui lòng nhập port");
        } else {
          if (!onu) {
            toast.error("Vui lòng nhập onu");
          } else {
            const regex = /^[HZAD][A-Z0-9]{9}$/;
            if (!regex.test(slid)) {
              toast.error("Vui lòng nhập đúng định dạng SLID");
            } else {
              setloading(true);

              if (tramolt.loai == "gpon-alu") {
                TramOLtService.Delete_Onu_Gpon_Alu(
                  tramolt.ip,
                  tramolt.username,
                  tramolt.password,
                  slot.value,
                  portpon < 10 ? "0" + portpon : portpon,
                  onu,
                  onu
                ).then((res) => {
                  console.log(res.data);
                  toast.success("Xoá Onu thành công");
                  setloading(false);
                });
               
              } else {
                if (tramolt.loai == "gpon-zte") {
                  const onuid =
                    "1/" +
                    slot.value +
                    "/" +
                    (portpon < 10 ? "0" + portpon : portpon);

                  console.log(onu, portpon, slid, slot, tramolt, onuid);
                  TramOLtService.Delete_Onu_Gpon_zte(
                    tramolt.ip,
                    tramolt.username,
                    tramolt.password,
                    slot.value,
                    portpon < 10 ? "0" + portpon : portpon,
                    onu,
                    onu
                  ).then((res) => {
                    console.log(res.data);
                    toast.success("Xoá Onu thành công");
                    setloading(false);
                  });
                } else {
                  if (tramolt.loai == "zte-mini") {
                    const onuid = "1/" + "3/" + portpon;
                    let slid_zte_mini =
                      tramolt.matram +
                      "" +
                      (Number(portpon) < 10 ? "0" + portpon : portpon) +
                      "" +
                      (Number(onu) < 10 ? "0" + onu : onu);
                    console.log(onu, portpon, slid, slot, tramolt, onuid);
                    TramOLtService.Delete_Onu_Gpon_zte_mini(
                      tramolt.ip,
                      tramolt.username,
                      tramolt.password,
                      slot.value,
                      portpon < 10 ? "0" + portpon : portpon,
                      onu,
                      onu
                    ).then((res) => {
                      console.log(res.data);
                      toast.success("Xoá Onu thành công");
                      setloading(false);
                    });
                  } else {
                    if (tramolt.loai == "huawei") {
                      const onuid =
                        "0/" +
                        slot.value +
                        "/" +
                        (portpon < 10 ? "0" + portpon : portpon);

                        TramOLtService.Delete_Onu_Gpon_huawei(
                          tramolt.ip,
                          tramolt.username,
                          tramolt.password,
                          slot.value,
                          portpon < 10 ? "0" + portpon : portpon,
                          onu,
                          onu
                        ).then((res) => {
                          console.log(res.data);
                          toast.success("Xoá Onu thành công");
                          setloading(false);
                        });
                    } else {
                      if (tramolt.loai == "hw-mini") {
                        TramOLtService.Delete_Onu_Gpon_huawei(
                          tramolt.ip,
                          tramolt.username,
                          tramolt.password,
                          slot.value,
                          portpon < 10 ? "0" + portpon : portpon,
                          onu,
                          onu
                        ).then((res) => {
                          console.log(res.data);
                          toast.success("Xoá Onu thành công");
                          setloading(false);
                        });
                      } else {
                        TramOLtService.Delete_Onu_Gpon_dasan(
                          tramolt.ip,
                          tramolt.username,
                          tramolt.password,
                          slot.value,
                          portpon < 10 ? "0" + portpon : portpon,
                          onu,
                          onu
                        ).then((res) => {
                          console.log(res.data);
                          toast.success("Xoá Onu thành công");
                          setloading(false);
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return (
    <>
      {loading && (
        // <div className="overlay">
        //   <div className="spinner-border text-primary" role="status">
        //     <span className="sr-only">Loading...</span>
        //   </div>
        // </div>
        <Loading />
      )}

      <Header />
      <main id="cabin_list" className="main mt-5 ">
        <div className="container">
          <section id="about" className="about">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className=" mb-4 col col-md-12 tonghop-label">
                  <p class="text-center text-uppercase fs-2">
                    Kích hoạt thiết bị onu
                  </p>
                </div>
              </div>
              <div className="row mb-9">
                {/* Chọn loại */}
                <div className="col col-12 col-md-4 mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Chọn trạm <a className="obligatory">*</a>
                    </label>
                    <Select
                      onChange={(e) => changeTramOlt(e)}
                      options={listtramolt}
                      value={tramolt}
                      className={loaichuyenerror ? "error" : ""}
                      isClearable
                    />
                  </div>
                </div>

                {/* Ma tram */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Mã trạm
                    </label>
                    <input
                      className={"form-control"}
                      disabled
                      value={tramolt?.matram || ""}
                    />
                  </div>
                </div>
                {/* HIS */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      HIS
                    </label>
                    <input
                      className={"form-control"}
                      disabled
                      value={tramolt?.his || ""}
                    />
                  </div>
                </div>
                {/* My TV */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      MyTV
                    </label>
                    <input
                      className={"form-control"}
                      disabled
                      value={tramolt?.mytv || ""}
                    />
                  </div>
                </div>
                {/* Loai */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Loại
                    </label>
                    <input
                      className={"form-control text-uppercase"}
                      disabled
                      value={tramolt?.loai || ""}
                    />
                  </div>
                </div>
              </div>
              {/* ---------------  dong 2--------------------------------------------------- */}
              <div className="row mb-9">
                {/* Chọn slot */}
                <div className="col col-12 col-md-3 mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Chọn slot <a className="obligatory">*</a>
                    </label>
                    <Select
                      isDisabled={disableSlot}
                      onChange={(e) => changeSlotOlt(e)}
                      options={optionslot}
                      value={slot}
                      className={loaichuyenerror ? "error" : ""}
                    />
                  </div>
                </div>

                {/* port pon */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Port PON
                    </label>
                    <input
                      className={"form-control"}
                      type="number"
                      value={portpon}
                      onChange={(e) => changePortpon(e)}
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      ONU
                    </label>
                    <input
                      className={"form-control"}
                      type="number"
                      value={onu}
                      onChange={(e) => changeOnu(e)}
                    />
                  </div>
                </div>
                <div className="col col-12 col-md-3  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      SLID
                    </label>
                    <input
                      className={"form-control"}
                      type="text"
                      value={slid}
                      onChange={(e) => changeSlid(e)}
                    />
                  </div>
                </div>
              </div>
              {/* --------------------------dong 3 */}
              <div className="row mb-9">
                {/* Chọn slot */}
                <div className="col col-12 col-md-12 mb-4 ">
                  <div className="d-flex md-4 justify-content-center align-items-center">
                    <button   onClick={() => DeleteONU()}className="btn btn-lg btn-danger p-3 text-uppercase btn-block fs-1 mr-3 ">
                      xóa ONU
                    </button>
                    <button
                      onClick={() => ActionONU()}
                      className="btn btn-lg btn-primary p-3 text-uppercase btn-block fs-1 ms-5 "
                    >
                      Kích ONU
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
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
export default connect(mapStateToProps, mapDispatchToProps)(KichONU);
