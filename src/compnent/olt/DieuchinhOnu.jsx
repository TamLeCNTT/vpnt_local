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
import { NavLink } from "react-router-dom";
import { set } from "date-fns";
import DownloadLog from "../../support/DownloadLog";

const DieuchinhOnu = (props) => {
  let navtive = useNavigate();
  const [tramolt, settramolt] = useState({});
  const [matram, setmatram] = useState("");
  const [loaichuyenerror, setloaichuyenerror] = useState(false);

  const [slot_old, setslot_old] = useState({});
  const [portpon_old, setportpon_old] = useState("");
  const [onu_old, setonu_old] = useState("");
  const [onu_del_old, setonu_del_old] = useState("");
  const [slid_old, setslid_old] = useState("");
  const [ListOnuCu,SetListOnucu]=useState([])
  
  const [ListOnuMoi,SetListOnumoi]=useState([])
  const [slot_new, setslot_new] = useState({});
  const [portpon_new, setportpon_new] = useState("");
  const [onu_new, setonu_new] = useState("");
  const [onu_del_new, setonu_del_new] = useState("");
  const [slid_new, setslid_new] = useState("");
  const [tramolt_new, settramolt_new] = useState({});

  const [checkboxValue, setcheckboxValue] = useState(false);
  const [checkNet, setCheckNet] = useState(false);
  const [checkMytv, setCheckMytv] = useState(false);
  const [checkVoip, setCheckVoip] = useState(false);
  const [listtramolt, setListtramolt] = useState([]);
  const [loading, setloading] = useState(false);
  const [listSLIDOld, setListSLIDOld] = useState([]);
  const [type, settype] = useState(false);
  const optionslot_old = [
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
      const initialCheckboxes = Array.from({ length: 64 }, (_, i) => ({
      id: i + 1,
      status: false,
    }));
    SetListOnucu(initialCheckboxes);
    SetListOnumoi(initialCheckboxes);

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
  function replaceEncodedCharacters(inputString) {
    // Thay thế %40 bằng #
    let result = inputString.replace(/%40/g, "@");

    // Thay thế %21 bằng @
    result = result.replace(/%23/g, "#");

    return result;
  }
  const Active_olt = (slid_save) => {
    let listSLID = [];
    if (checkboxValue == true) {
      listSLID = [...slid_save];
    } else {
      for (let i = onu_old; i <= onu_new; i++) {
        let onu = i < 10 ? "0" + "" + i : i;
        listSLID.push(
          tramolt_new.matram +
            "" +
            slot_new.value +
            "" +
            (portpon_new < 10 ? "0" + portpon_new : portpon_new) +
            "" +
            onu
        );
      }
    }
    console.log(listSLID);
    let tramolt_1 = tramolt_new;
    tramolt_1.password = replaceEncodedCharacters(tramolt_1.password);
    if (tramolt_new.loai == "gpon-alu") {
      console.log(listSLID);

      TramOLtService.Active_Onu_Gpon_Alu_many({
        tramolt: tramolt_1,
        list_slid: listSLID,
        slot: slot_new.value,
        portpon: portpon_new < 10 ? "0" + portpon_new : portpon_new,
        onu_old: onu_old,
        onu_new: onu_new,
        checkNet: checkNet,
        checkMytv: checkMytv,
        checkVoip: checkVoip,
      }).then((res) => {
        console.log(res.data);
        toast.success("Kích onu thành công");
        setloading(false);
      });
    } else {
      if (tramolt_new.loai == "gpon-zte") {
        TramOLtService.Active_Onu_Gpon_zte_many({
          tramolt: tramolt_1,
          list_slid: listSLID,
          slot: slot_new.value,
          portpon: portpon_new < 10 ? "0" + portpon_new : portpon_new,
          onu_old: onu_old,
          onu_new: onu_new,
          checkNet: checkNet,
          checkMytv: checkMytv,
          checkVoip: checkVoip,
        }).then((res) => {
          console.log(res.data);
          toast.success("Kich onu thành công");
          setloading(false);
        });
      } else {
        if (tramolt_new.loai == "zte-mini") {
          console.log("kfkfjfjfjf");
          TramOLtService.Active_Onu_Gpon_zte_mini_many({
            tramolt: tramolt_1,
            list_slid: listSLID,
            slot: slot_new.value,
            portpon: portpon_new < 10 ? "0" + portpon_new : portpon_new,
            onu_old: onu_old,
            onu_new: onu_new,
            checkNet: checkNet,
            checkMytv: checkMytv,
            checkVoip: checkVoip,
          }).then((res) => {
            console.log(res.data);
            toast.success("Kich onu thành công");
            setloading(false);
          });
        } else {
          if (tramolt_new.loai == "huawei") {
            TramOLtService.Active_Onu_Gpon_huawei_many({
              tramolt: tramolt_1,
              list_slid: listSLID,
              slot: slot_new.value,
              portpon: portpon_new < 10 ? "0" + portpon_new : portpon_new,
              onu_old: onu_old,
              onu_new: onu_new,
              checkNet: checkNet,
              checkMytv: checkMytv,
              checkVoip: checkVoip,
            }).then((res) => {
              console.log(res.data);
              toast.success("Kich onu thành công");
              setloading(false);
            });
          } else {
            if (tramolt_new.loai == "hw-mini") {
              if (checkboxValue == true) {
                slid_save =
                  tramolt.matram +
                  "" +
                  1 +
                  "" +
                  (portpon_old < 10 ? "0" + portpon_old : portpon_old);
              } else
                slid_save =
                  tramolt_new.matram +
                  "" +
                  1 +
                  "" +
                  (portpon_new < 10 ? "0" + portpon_new : portpon_new);

              TramOLtService.Active_Onu_Gpon_huawei_mini_many({
                tramolt: tramolt_1,
                list_slid: listSLID,
                slot: slot_new.value,
                portpon: portpon_new < 10 ? "0" + portpon_new : portpon_new,
                onu_old: onu_old,
                onu_new: onu_new,
                checkNet: checkNet,
                checkMytv: checkMytv,
                checkVoip: checkVoip,
              }).then((res) => {
                console.log(res.data);
                toast.success("Kich onu thành công");
                setloading(false);
              });
            } else {
              if (checkboxValue == true) {
                slid_save =
                  tramolt.matram +
                  "" +
                  1 +
                  "" +
                  (portpon_old < 10 ? "0" + portpon_old : portpon_old);
              } else
                slid_save =
                  tramolt_new.matram +
                  "" +
                  1 +
                  "" +
                  (portpon_new < 10 ? "0" + portpon_new : portpon_new);

              TramOLtService.Active_Onu_Gpon_dasan_many({
                tramolt: tramolt_1,
                list_slid: listSLID,
                slot: slot_new.value,
                portpon: portpon_new < 10 ? "0" + portpon_new : portpon_new,
                onu_old: onu_old,
                onu_new: onu_new,
                checkNet: checkNet,
                checkMytv: checkMytv,
                checkVoip: checkVoip,
              }).then((res) => {
                console.log(res.data);
                toast.success("Kích onu thành công");
                setloading(false);
              });
            }
          }
        }
      }
    }
  };

  const changeTramOlt = (e) => {
    console.log(e);

    settramolt(e ? e : null);
    if (onu_old && e && slot_old && portpon_old) {
      setslid_old(
        e.matram +
          "" +
          slot_old.value +
          "" +
          (Number(portpon_old) < 10 ? "0" + portpon_old : portpon_old) +
          "" +
          (Number(onu_old) < 10 ? "0" + onu_old : onu_old)
      );
      console.log(
        e.matram + "" + slot_old.value + "" + portpon_old + "" + onu_old
      );
    } else {
      setslid_old("");
    }
  };

  const changeslot_oldOlt = (e) => {
    console.log(e);
    setslot_old(e);
    if (onu_old && tramolt && e && portpon_old) {
      setslid_old(
        tramolt.matram +
          "" +
          e.value +
          "" +
          (Number(portpon_old) < 10 ? "0" + portpon_old : portpon_old) +
          "" +
          (Number(onu_old) < 10 ? "0" + onu_old : onu_old)
      );
      console.log(
        tramolt.matram + "" + e.value + "" + portpon_old + "" + onu_old
      );
    } else {
      setslid_old("");
    }
  };

  const changeportpon_old = (e) => {
    let portpon_oldnew = "";
    if (!e.target.value) setportpon_old("");
    else {
      if (Number(e.target.value) < 0) {
        setportpon_old(0);
        portpon_oldnew = 0;
      } else {
        setportpon_old(e.target.value);
        portpon_oldnew = e.target.value;
      }
    }
  };

  const changeonu_old = (e) => {
   setonu_old(e.target.value)
  };

  const changeonu_new = (e) => {
    setonu_new(e.target.value)
  };
  const changecheckboxValue = (e) => {
    setcheckboxValue(e);
  };
  const changeCheckNet = (e) => {
    setCheckNet(e);
  };
  const changeCheckMytvt = (e) => {
    setCheckMytv(e);
  };
  const changeCheckVoip = (e) => {
    setCheckVoip(e);
  };
  const isValidInput = (rawInput) => {
  // Kiểm tra định dạng tổng thể
   const input = rawInput.replace(/\s/g, '');
  const regex = /^(\d{1,2})(,\d{1,2})*$/;
  if (!regex.test(input)) return { valid: false, message: 'Định dạng không hợp lệ. Ví dụ: 1,2,3' };

  const numbers = input.split(',').map(Number);
  console.log(numbers)
  // Kiểm tra từng số < 65
  for (let num of numbers) {
    if (num >= 65) {
      return { valid: false, message: `Số ${num} không hợp lệ (phải < 65)` };
    }
  }
  // Kiểm tra trùng lặp
  const seen = new Set();
  for (const [index, num] of numbers.entries()) {
    if (seen.has(num)) {
      return { valid: false, message: `Số ${num} bị trùng tại vị trí ${index + 1}` };
    }
    seen.add(num);
  }

  return { valid: true, message: 'Hợp lệ',length:numbers.length,numbers:numbers };
};

  const Actiononu_old = async (status) => {
    if (isValidInput(onu_old).valid && isValidInput(onu_new).valid && isValidInput(onu_old).length ==isValidInput(onu_new).length ){
        let ListOld=isValidInput(onu_old).numbers
        let Listnew=isValidInput(onu_new).numbers
        let listsave=[]
        ListOld.forEach((num, index) => {
      
                let slid=tramolt.matram+slot_old.value+(portpon_old<10?"0"+String(portpon_old):String(portpon_old))+(num<10?"0"+String(num):String(num))

          console.log(tramolt,slot_old,portpon_old)
        let newitem={onuold:num,onunew:Listnew[index],slid:slid}
        listsave.push(newitem)
        });
      console.log(listsave)
      if (tramolt.loai == "gpon-alu") {
        TramOLtService.Active_Onu_Gpon_Alu_820(
          {

            tramolt: tramolt,
            list_slid: listsave,
            slot: slot_old.value,
            portpon: portpon_old < 10 ? "0" + portpon_old : portpon_old,
            onu_old: onu_old,
            onu_new: onu_new,
            checkNet: true,
            checkMytv: true,
            checkVoip: true,
      
          }
        ).then(
          res => {
            console.log(res.data)
          }
        )
      }
      else {
        if (tramolt.loai == "gpon-zte") {
          console.log("pk")
          let tramolt_1=tramolt
          tramolt_1.password = replaceEncodedCharacters(tramolt_1.password);
          TramOLtService.Active_Onu_Gpon_Zte_820(
          {

            tramolt: tramolt_1,
            list_slid: listsave,
            slot: slot_old.value,
            portpon: portpon_old < 10 ? "0" + portpon_old : portpon_old,
            onu_old: onu_old,
            onu_new: onu_new,
            checkNet: true,
            checkMytv: true,
            checkVoip: true,
      
          }
        ).then(
          res => {
            console.log(res.data)
          }
        )
        
        }
      }



    }
    else
    {
        if (isValidInput(onu_old).length !=isValidInput(onu_new).length){
            toast.error("Số lượng Onu cũ và mới không giống nhau")
            return
        }

        if(isValidInput(onu_old).valid){
            toast.error("ONU New "+isValidInput(onu_new).message)
        }
        else
           toast.error("ONU Old "+isValidInput(onu_old).message)
    }
   
    
    // if (!tramolt || !tramolt.value) {
    //   toast.error("Vui lòng chọn trạm olt cũ");
    // } else {
    //   if (!slot_old || !slot_old.value) {
    //     toast.error("Vui lòng chọn slot cũ");
    //   } else {
    //     if (!portpon_old) {
    //       toast.error("Vui lòng nhập port cũ");
    //     } else {
    //       if (!tramolt_new || !tramolt_new.value) {
    //         toast.error("Vui lòng chọn trạm olt mới");
    //       } else {
    //         if (!slot_new || !slot_new.value) {
    //           toast.error("Vui lòng chọn slot mới");
    //         } else {
    //           if (!portpon_new && portpon_new != 0) {
    //             toast.error("Vui lòng nhập port mới");
    //           } else {
    //             if (!onu_old) {
    //               toast.error("Vui lòng nhập onu bắt đầu");
    //             } else {
    //               if (!onu_new) {
    //                 toast.error("Vui lòng nhập onu kết thúc");
    //               } else {
    //                 if (Number(onu_new) < Number(onu_old)) {
    //                   toast.error(
    //                     "Onu kết thúc mới  phải lớn hơn Onu bắt đầu mới"
    //                   );
    //                 } else {
    //                   if (Number(onu_del_new) < Number(onu_del_old)) {
    //                     toast.error(
    //                       "Onu kết thúc cũ phải lớn hơn Onu bắt đầu cũ"
    //                     );
    //                   } else {
    //                     if (
    //                       Number(onu_new) - Number(onu_old) !=
    //                       Number(onu_del_new) - Number(onu_del_old)
    //                     ) {
    //                       toast.error(
    //                         "Số lượng Onu cũ phải bằng số lượng Onu mới"
    //                       );
    //                     } else {
    //                       const result = await Swal.fire({
    //                         title: "Bạn có chắc chắn muốn chuyển pon",
    //                         text:
    //                           "Từ OLT " +
    //                           tramolt.label +
    //                           " S" +
    //                           slot_old.value +
    //                           "P" +
    //                           portpon_old +
    //                           " ONU (" +
    //                           onu_del_old +
    //                           "->" +
    //                           onu_del_new +
    //                           ") " +
    //                           "\nsang OLT " +
    //                           tramolt_new.label +
    //                           " S" +
    //                           slot_new.value +
    //                           "P" +
    //                           portpon_new +
    //                           " ONU (" +
    //                           onu_old +
    //                           "->" +
    //                           onu_new +
    //                           ") ",
    //                         icon: "warning",
    //                         showCancelButton: true,
    //                         confirmButtonColor: "#3085d6",
    //                         cancelButtonColor: "#d33",
    //                         confirmButtonText: "Chấp nhận",
    //                         cancelButtonText: "Hủy",
    //                         customClass: {
    //                           popup: "swal-wide", // Thêm lớp tùy chỉnh
    //                         },
    //                       });

    //                       if (result.isConfirmed) {
    //                         setloading(true);
    //                         if (tramolt.loai == "gpon-alu") {
    //                           if (
    //                             tramolt_new.loai == "gpon-alu" &&
    //                             tramolt_new.matram == tramolt.matram
    //                           ) {
    //                             console.log("gghhhh");
    //                             TramOLtService.Active_Many_Onu_2_Gpon_Alu({
    //                               tramolt: tramolt,
    //                               slot_old: slot_old.value,
    //                               portpon_old:
    //                                 portpon_old < 10
    //                                   ? "0" + portpon_old
    //                                   : portpon_old,
    //                               onuOldStart: onu_del_old,
    //                               onuOldEnd: onu_del_new,
    //                               slid: checkboxValue,

    //                               slot_new: slot_new.value,
    //                               portpon_new:
    //                                 portpon_new < 10
    //                                   ? "0" + portpon_new
    //                                   : portpon_new,
    //                               onuNewStart: onu_old,
    //                               onuNewEnd: onu_new,
    //                               checkNet: checkNet,
    //                               checkMytv: checkMytv,
    //                               status: status,
    //                               checkVoip: checkVoip,
    //                             }).then((res) => {
    //                               console.log(res.data);
                                 
    //                               toast.success("Kích ONUthành công");
    //                               setloading(false)
    //                             });
    //                           } else {
    //                             TramOLtService.Delete_Onu_Gpon_Alu(
    //                               tramolt.ip,
    //                               tramolt.username,
    //                               tramolt.password,
    //                               tramolt.matram,
    //                               slot_old.value,
    //                               portpon_old < 10
    //                                 ? "0" + portpon_old
    //                                 : portpon_old,
    //                               onu_del_old,
    //                               onu_del_new
    //                             ).then((res) => {
    //                               setListSLIDOld(res.data.subslocid_list);
    //                               console.log(res.data);

    //                               toast.success("Lấy SILD cũ thành công");

    //                               Active_olt(res.data.subslocid_list);
    //                             });
    //                           }
    //                         } else {
    //                           if (tramolt.loai == "gpon-zte") {
    //                             console.log(onu_new);
    //                             TramOLtService.Delete_Onu_Gpon_zte(
    //                               tramolt.ip,
    //                               tramolt.username,
    //                               tramolt.password,
    //                               tramolt.matram,
    //                               slot_old.value,
    //                               portpon_old < 10
    //                                 ? "0" + portpon_old
    //                                 : portpon_old,
    //                               onu_del_old,
    //                               onu_del_new
    //                             ).then((res) => {
    //                               console.log(res.data);

    //                               toast.success("Lấy SILD cũ thành công");
    //                               Active_olt(res.data.subslocid_list);
    //                             });
    //                           } else {
    //                             if (tramolt.loai == "zte-mini") {
    //                               TramOLtService.Delete_Onu_Gpon_zte_mini(
    //                                 tramolt.ip,
    //                                 tramolt.username,
    //                                 tramolt.password,
    //                                 tramolt.matram,
    //                                 slot_old.value,
    //                                 portpon_old < 10
    //                                   ? "0" + portpon_old
    //                                   : portpon_old,
    //                                 onu_del_old,
    //                                 onu_del_new
    //                               ).then((res) => {
    //                                 console.log(res.data);
                                   
    //                                 toast.success("Lấy SILD cũ thành công");
    //                                 Active_olt(res.data.subslocid_list);
    //                               });
    //                             } else {
    //                               if (
    //                                 tramolt.loai == "huawei" ||
    //                                 tramolt.loai == "hw-mini"
    //                               ) {
    //                                 TramOLtService.Delete_Onu_Gpon_huawei(
    //                                   tramolt.ip,
    //                                   tramolt.username,
    //                                   tramolt.password,
    //                                   tramolt.matram,
    //                                   slot_old.value,
    //                                   portpon_old < 10
    //                                     ? "0" + portpon_old
    //                                     : portpon_old,
    //                                   onu_del_old,
    //                                   onu_del_new
    //                                 ).then((res) => {
    //                                   console.log(res.data);
                                   
    //                                   toast.success("Lấy SILD cũ thành công");
    //                                   Active_olt(res.data.subslocid_list);
    //                                 });
    //                               } else {
    //                                 TramOLtService.Delete_Onu_Gpon_dasan(
    //                                   tramolt.ip,
    //                                   tramolt.username,
    //                                   tramolt.password,
    //                                   tramolt.matram,
    //                                   slot_old.value,
    //                                   portpon_old < 10
    //                                     ? "0" + portpon_old
    //                                     : portpon_old,
    //                                   onu_del_old,
    //                                   onu_del_new
    //                                 ).then((res) => {
    //                                   console.log(res.data);
    //                                   // setloading(false)
    //                                   Active_olt(res.data.subslocid_list);
    //                                   toast.success("Lấy SILD cũ thành công");
    //                                 });
    //                               }
    //                             }
    //                           }
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  };
  const handleChangeOnuCu=(id)=>{
    let list=ListOnuCu
    list[id-1].status=!list[id-1].status
    SetListOnucu(list)
    console.log(list)
  }
    const handleChangeOnuMoi=(id)=>{
    let list=ListOnuMoi
    list[id-1].status=!list[id-1].status
    SetListOnumoi(list)
    console.log(list)
  }
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
          <div className="row mt-4 mb-5">
            <div className="col col-md-6 col-lg-12 col-sm-12 b-2">
              <NavLink to="/">
                <i class="fa-solid fa-home" /> Trang chủ &nbsp;
              </NavLink>
              / Chuyển PON / Chuyển nhiều ONU
            </div>
          </div>

          <section id="about" className="about">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className=" mb-4 col col-md-12 tonghop-label">
                  <p class="text-center text-uppercase fs-2">thiết bị onu cũ</p>
                </div>
              </div>

              <div className="row mb-9">
                {/* Chọn loại */}
                <div className="col col-12 col-md-4 mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Chọn trạm olt cũ <a className="obligatory">*</a>
                    </label>
                    <Select
                      onChange={(e) => changeTramOlt(e)}
                      options={listtramolt}
                      value={
                        listtramolt.find(
                          (option) => option.value === tramolt?.value
                        ) || null
                      }
                      className={loaichuyenerror ? "error" : ""}
                    />
                  </div>
                </div>

                {/* Ma tram */}
                <div className="col col-12 col-md-2  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Mã trạm olt 
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
                      Loại Olt
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
                {/* Chọn slot_old */}
                <div className="col col-12 col-md-3 mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                      Chọn slot  <a className="obligatory">*</a>
                    </label>
                    <Select
                      onChange={(e) => changeslot_oldOlt(e)}
                      options={optionslot_old}
                      value={slot_old}
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
                      value={portpon_old}
                      onChange={(e) => changeportpon_old(e)}
                    />
                  </div>
                </div>

               
              
               <div className="col col-12 col-md-12  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                   Danh sách Onu cũ (cách nhau dấu ",")
                    </label>
                    <input
                      className={"form-control"}
                      onChange={(e)=>changeonu_old(e)}
                      value={onu_old}
                    />
                  </div>
                </div>


                

    
             
              </div>
              
             <div className="col col-12 col-md-12  mb-4">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="name">
                   Danh sách Onu mới (cách nhau dấu ",")
                    </label>
                    <input
                      className={"form-control"}
                      onChange={(e)=>changeonu_new(e)}
                      value={onu_new}
                    />
                  </div>
                </div>
              {/* --------------------------dong 3 */}
              <div className="row mb-9">
                <div className="col col-4 col-md-3 mb-4 "></div>
                {/* Chọn slot_old */}

                {tramolt_new.loai == "gpon-alu" &&
                  tramolt_new.loai == tramolt.loai &&
                  tramolt_new.matram == tramolt.matram && (
                    <div className="col col-4 col-md-2 mb-4 ">
                      <div className="d-flex md-4 justify-content-center align-items-center">
                        {/* <button cla
                    ssName="btn btn-lg btn-danger p-3 text-uppercase btn-block fs-1 mr-3 ">
                      xóa onu
                    </button> */}
                        <button
                          onClick={() => Actiononu_old(true)}
                          className="btn btn-lg btn-danger p-3 text-uppercase btn-block fs-1 ms-5 "
                        >
                          Xóa PON
                        </button>
                        <div></div>
                      </div>
                    </div>
                  )}

                <div className="col col-8 col-md-5 mb-4 ">
                  <div className="d-flex md-4 justify-content-center align-items-center">
                    {/* <button cla
                      ssName="btn btn-lg btn-danger p-3 text-uppercase btn-block fs-1 mr-3 ">
                        xóa onu
                      </button> */}
                    <button
                      onClick={() => Actiononu_old(false)}
                      className="btn btn-lg btn-primary p-3 text-uppercase btn-block fs-1 ms-5 "
                    >
                      chuyển pon hàng loạt
                    </button>
                    <div>
                      <DownloadLog
                        name={
                          "Chuyen_PON_" +
                          tramolt.label +
                          "_S" +
                          slot_old.value +
                          "_P" +
                          portpon_old +
                          "___" +
                          tramolt_new.label +
                          "_S" +
                          slot_new.value +
                          "_P" +
                          portpon_new
                        }
                      />
                    </div>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DieuchinhOnu);
