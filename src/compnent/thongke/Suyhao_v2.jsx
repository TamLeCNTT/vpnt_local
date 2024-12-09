import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import "./thongke.scss";
import Select from "react-select";
import suyhaoService from "../../service/suyhaoService";
import CryptoJS from "crypto-js";
import ImportSuyhao from "../../support/ImportSuyhao";
import suyhao_olt_Service from "../../service/suyhao_olt_Service";
import { NavLink } from "react-router-dom";
import portService from "../../service/portService";
import TramOLtService from "../../service/TramOLtService";
import Loading from "../../support/Loading";
import Paginations from "../../support/Paginations";
const Suyhao_v2 = () => {
  const [lists, setLists] = useState([]);
  const [listRing, setListRing] = useState([]);
  const [dinhmuc, setdinhmuc] = useState(2);
  const [dinhmucnhietdo, setdinhmucnhietdo] = useState(60);
  const [loaiDo, setLoaiDo] = useState("suyhao");
  const [loaiThietBi, setLoaiThietBi] = useState("all");
  const [Ring, setRing] = useState("all");
  let flash = 0;

  const [listPg, setListPg] = useState([]);
  const [list_export, setlist_export] = useState([]);
  const [flag, setflag] = useState(false);
  const [loading, setloading] = useState(false);
  const [load, setload] = useState(false);
  const getlist = (e) => {
    setListPg(e);
  };
  const header = [
    [
      "Tên thiết bị",
      "Địa chỉ IP",
      "Tên thương mại",

      "Port",
      "Thông số suy hao",
      "W_low",
    ],
  ];
  const headerDegree = [
    ["Tên thiết bị", "Địa chỉ IP", "Tên thương mại", "Port", "Nhiệt độ"],
  ];
  const min = (a, b, c) => {
    //console.log(a, b, Number(b) - Number(a), Number(b), Number(a));
    let i1 = Number(b) - Number(a);
    let i2 = 999999;
    return i1 < i2 ? i1 : i2;
  };
  const changedinhmuc = (e) => {
    let dinhmuc = "";
    if (!e.target.value) setdinhmuc("");
    else if (Number(e.target.value) < 1) {
      setdinhmuc(1);
      dinhmuc = 1;
    } else {
      setdinhmuc(e.target.value);
      let list = lists;
      dinhmuc = e.target.value;
      setLists(list);
    }
    // console.log(lists);
    let listshow_export_suyhao = [];
    lists.map((item, index) => {
      if (
        Number(item.RXpower) < 99 &&
        Number(item.RXpower) - Number(item.w_low) < dinhmuc
      ) {
        let item_export = {};
        item_export.tenthietbi = decryptData(item.tenthietbi);
        item_export.diachi = decryptData(item.diachi);
        item_export.tenthuongmai = decryptData(item.tenthuongmai);
        item_export.port = item.port;
        item_export.RXpower = item.RXpower;
        item_export.w_low = item.w_low;
        listshow_export_suyhao.push(item_export);
        setlist_export(listshow_export_suyhao);
      }
    });
  };

  const changedinhmucnhietdo = (e) => {
    let dinhmuc = "";
    if (!e.target.value) setdinhmucnhietdo("");
    else if (Number(e.target.value) < 1) {
      setdinhmucnhietdo(1);
      dinhmuc = 1;
    } else {
      setdinhmucnhietdo(e.target.value);
      let list = lists;
      dinhmuc = e.target.value;
      setLists(list);
    }
    console.log(lists);
    let listshow_export_suyhao = [];
    lists.map((item, index) => {
      if (Number(item.temperature) >= dinhmuc) {
        let item_export = {};
        item_export.tenthietbi = decryptData(item.tenthietbi);
        item_export.diachi = decryptData(item.diachi);
        item_export.tenthuongmai = decryptData(item.tenthuongmai);
        item_export.port = item.port;
        item_export.temperature = item.temperature;
        listshow_export_suyhao.push(item_export);
        setlist_export(listshow_export_suyhao);
      }
    });
  };

  const Loadpage = () => {
    setload(!load);
  };
  useEffect(() => {
    //   suyhaoService.getdata().then((res) => {
    //   console.log(res.data);
    //   let list=res.data
    //   list.map((item,index)=>{
    //     item.diachi=decryptData(item.diachi)
    //     item.password=decryptData(item.password)
    //     item.tenthietbi=decryptData(item.tenthietbi)
    //     item.tenthuongmai=decryptData(item.tenthuongmai)
    //     item.username=decryptData(item.username)
    //   })
    //   console.log(list)
    //   setlist_export(list)
    // });

    portService.getdataRing().then((res) => {
      console.log(res.data);
      let list = [{ label: "Tất cả", value: "all" }];
      res.data.map((item, index) => {
        let ring = { label: item.ten, value: item.ten };
        list.push(ring);
      });
      console.log(list);
      setListRing(list);
    });

    //     const fetchData = () => {

    //       let listshow_export_suyhao = [];
    //       setLists([]);
    //       suyhaoService.getdata().then((res) => {
    //         console.log(res.data);
    //       });
    //       suyhaoService.getdata().then((res) => {
    //         console.log(Object.values(res.data));
    //         let list_log=[]
    //         Object.values(res.data).map(async (item, index) => {
    //           try{
    //           if (item.loai == "V2224G") {
    //           //  console.log("sw2224");
    //             await suyhaoService
    //               .get_rx_power_by_SW2224(
    //                 decryptData(item.diachi),
    //                 decryptData(item.username),
    //                 decryptData(item.password),
    //                 item.port
    //               )
    //               .then((res) => {
    //                 // console.log(decryptData(item.diachi), item.port, res.data);
    //                 const correctedJsonString = res.data.RXpower.replace(/'/g, '"');
    //                 JSON.parse(correctedJsonString).map((e, i) => {
    //                   let newitem = {};
    //                   newitem.diachi = item.diachi;
    //                   newitem.tenthietbi = item.tenthietbi;
    //                   newitem.tenthuongmai= item.tenthuongmai;
    //                   newitem.username = item.username;
    //                   newitem.password = item.password;
    //                   newitem.loai = item.loai;
    //                   newitem.port = e.port;
    //                   newitem.RXpower = e.rx_power;
    //                   newitem.w_low = e.w_low;
    //                   newitem.w_high = e.w_high;
    //                   if (
    //                     Number(e.rx_power) < 99 &&
    //                     (Number(e.rx_power) - Number(e.w_low) < dinhmuc )
    //                   ) {
    //                     let item_export ={}
    //                     item_export.tenthietbi = decryptData(item.tenthietbi);
    //                     item_export.diachi = decryptData(item.diachi);
    //                     item_export.tenthuongmai =decryptData( item.tenthuongmai);
    //                     newitem.loai = item.loai;
    //                     item_export.port = e.port;
    //                     item_export.RXpower = e.rx_power;
    //                     item_export.w_low = e.w_low;

    //                     listshow_export_suyhao.push(item_export);
    //                     setlist_export(listshow_export_suyhao);
    //                   }

    //                   setLists((prevList) =>
    //                     [...prevList, newitem].sort(
    //                       (a, b) =>
    //                         min(a.w_low, a.RXpower, a.w_high) -
    //                         min(b.w_low, b.RXpower, b.w_high)
    //                     )
    //                   );
    //                 });
    //               })
    //               // .catch((er) => {
    //               //   console.log(er);
    //               // });
    //           }
    //           if (item.loai == "ECS4120-28FV2-AF") {
    //             await suyhaoService
    //               .get_rx_power_by_ECS(
    //                 decryptData(item.diachi),
    //                 decryptData(item.username),
    //                 decryptData(item.password),

    //                 item.port
    //               )
    //               .then((res) => {
    //                 const correctedJsonString = res.data.RXpower.replace(/'/g, '"');
    //             //    console.log(JSON.parse(correctedJsonString));

    //                 JSON.parse(correctedJsonString).map((e, i) => {
    //                   // console.log(e, item);
    //                   let newitem = {};
    //                   newitem.diachi = item.diachi;
    //                   newitem.tenthietbi = item.tenthietbi;
    //                   newitem.tenthuongmai= item.tenthuongmai;
    //                   newitem.username = item.username;
    //                   newitem.password = item.password;
    //                   newitem.loai = item.loai;
    //                   newitem.port = e.port;
    //                   newitem.RXpower = e.rx_power;
    //                   newitem.w_low = e.w_low;
    //                   newitem.w_high = e.w_high;
    //                   if (
    //                     Number(e.rx_power) < 99 &&
    //                     (Number(e.rx_power) - Number(e.w_low) < dinhmuc )
    //                   ) {
    //                     let item_export ={}
    //                     item_export.tenthietbi = decryptData(item.tenthietbi);
    //                     item_export.diachi = decryptData(item.diachi);
    //                     item_export.tenthuongmai =decryptData( item.tenthuongmai);
    //                     newitem.loai = item.loai;
    //                     item_export.port = e.port;
    //                     item_export.RXpower = e.rx_power;
    //                     item_export.w_low = e.w_low;

    //                     listshow_export_suyhao.push(item_export);
    //                     setlist_export(listshow_export_suyhao);
    //                   }

    //                   setLists((prevList) =>
    //                     [...prevList, newitem].sort(
    //                       (a, b) =>
    //                         min(a.w_low, a.RXpower, a.w_high) -
    //                         min(b.w_low, b.RXpower, b.w_high)
    //                     )
    //                   );
    //                 });
    //               })
    //               // .catch((er) => {
    //               //   console.log(er);
    //               // });
    //           }
    //           if (String(item.loai).includes("OS6")) {
    //           //  console.log("A6400");
    //             await suyhaoService
    //               .get_rx_power_by_A6400(
    //                 decryptData(item.diachi),
    //                 decryptData(item.username),
    //                 decryptData(item.password),
    //                 item.port
    //               )
    //               .then((res) => {
    //                 const correctedJsonString = res.data.RXpower.replace(/'/g, '"');
    //               //  console.log(JSON.parse(correctedJsonString));
    //                 JSON.parse(correctedJsonString).map((e, i) => {
    //                   let newitem = {};
    //                   newitem.diachi = item.diachi;
    //                   newitem.tenthietbi = item.tenthietbi;
    //   newitem.tenthuongmai= item.tenthuongmai;
    //                   newitem.username = item.username;
    //                   newitem.password = item.password;
    //                   newitem.loai = item.loai;
    //                   newitem.port = e.port;
    //                   newitem.RXpower = e.rx_power;
    //                   newitem.w_low = e.w_low;
    //                   newitem.w_high = e.w_high;
    //                   if (
    //                     Number(e.rx_power) < 99 &&
    //                     (Number(e.rx_power) - Number(e.w_low) < dinhmuc )
    //                   ) {
    //                     let item_export ={}
    //                     item_export.tenthietbi = decryptData(item.tenthietbi);
    //                     item_export.diachi = decryptData(item.diachi);
    //                     item_export.tenthuongmai =decryptData( item.tenthuongmai);
    //                     newitem.loai = item.loai;
    //                     item_export.port = e.port;
    //                     item_export.RXpower = e.rx_power;
    //                     item_export.w_low = e.w_low;

    //                     listshow_export_suyhao.push(item_export);
    //                     setlist_export(listshow_export_suyhao);
    //                   }
    //                   setLists((prevList) =>
    //                     [...prevList, newitem].sort(
    //                       (a, b) =>
    //                         min(a.w_low, a.RXpower, a.w_high) -
    //                         min(b.w_low, b.RXpower, b.w_high)
    //                     )
    //                   );
    //                 });
    //               })
    //               // .catch((er) => {
    //               //   console.log(er);
    //               // });
    //           }
    //           if (item.loai == "V2724G") {
    //           //  console.log("sw2724");
    //             await suyhaoService
    //               .get_rx_power_by_SW2724(
    //                 decryptData(item.diachi),
    //                 decryptData(item.username),
    //                 decryptData(item.password),
    //                 item.port
    //               )
    //               .then((res) => {
    //                 const correctedJsonString = res.data.RXpower.replace(/'/g, '"');
    //                 JSON.parse(correctedJsonString).map((e, i) => {
    //                   let newitem = {};
    //                   newitem.diachi = item.diachi;
    //                   newitem.tenthietbi = item.tenthietbi;
    //   newitem.tenthuongmai= item.tenthuongmai;
    //                   newitem.username = item.username;
    //                   newitem.password = item.password;
    //                   newitem.loai = item.loai;
    //                   newitem.port = e.port;
    //                   newitem.RXpower = e.rx_power;
    //                   newitem.w_low = e.w_low;
    //                   newitem.w_high = e.w_high;
    //                   if (
    //                     Number(e.rx_power) < 99 &&
    //                     (Number(e.rx_power) - Number(e.w_low) < dinhmuc )
    //                   ) {
    //                     let item_export ={}
    //                     item_export.tenthietbi = decryptData(item.tenthietbi);
    //                     item_export.diachi = decryptData(item.diachi);
    //                     item_export.tenthuongmai =decryptData( item.tenthuongmai);
    //                     newitem.loai = item.loai;
    //                     item_export.port = e.port;
    //                     item_export.RXpower = e.rx_power;
    //                     item_export.w_low = e.w_low;

    //                     listshow_export_suyhao.push(item_export);
    //                     setlist_export(listshow_export_suyhao);
    //                   }
    //                   setLists((prevList) =>
    //                     [...prevList, newitem].sort(
    //                       (a, b) =>
    //                         min(a.w_low, a.RXpower, a.w_high) -
    //                         min(b.w_low, b.RXpower, b.w_high)
    //                     )
    //                   );
    //                 });
    //               })
    //               // .catch((er) => {
    //               //   console.log(er);
    //               // });
    //           }
    //           list_log.push({diachi:decryptData(item.diachi),status:"Kết nối thành công",thoigian: new Date()})
    //        setflag(true)
    //         }
    //         catch(e){
    //           list_log.push({diachi:decryptData(item.diachi),status:"Kết nối thất bại"+e,thoigian: new Date()})
    //         }
    //         console.log(list_log)
    //         });
    //       });

    //   TramOLtService.getdata().then(res=>{
    //     console.log(res.data)
    //     res.data.map((item,index)=>{
    //       if (item.loai=="gpon-alu" && item.port){
    //         suyhao_olt_Service.get_rx_power_by_alu(item.ip,item.username,item.password,item.port).then(res=>{
    //          res.data && res.data.data.map((items,i)=>{
    //           let newitem = {};
    //         newitem.diachi = encryptData(item.ip);
    //         newitem.tenthietbi =encryptData(item.matram);
    //         newitem.tenthuongmai= encryptData(item.tentram);
    //         newitem.username = item.username;
    //         newitem.password = item.password;
    //         newitem.loai = item.loai;
    //         newitem.port = items.port;
    //         newitem.RXpower = items.rx_power;
    //         newitem.w_low = items.rx_min;
    //         newitem.w_high = "";
    //         console.log(lists,items)
    //         setLists((prevList) =>
    //                   [...prevList, newitem].sort(
    //                   (a, b) =>
    //                   min(a.w_low, a.RXpower, a.w_high) -
    //                   min(b.w_low, b.RXpower, b.w_high)
    //                             )
    //                           );
    //          })
    //         }).catch(e=>{
    //           suyhao_olt_Service.get_rx_power_by_alu(item.ip,item.username,item.password,item.port).then(res=>{
    //             res.data && res.data.data.map((items,i)=>{
    //              let newitem = {};
    //            newitem.diachi = encryptData(item.ip);
    //            newitem.tenthietbi =encryptData(item.matram);
    //            newitem.tenthuongmai= encryptData(item.tentram);
    //            newitem.username = item.username;
    //            newitem.password = item.password;
    //            newitem.loai = item.loai;
    //            newitem.port = items.port;
    //            newitem.RXpower = items.rx_power;
    //            newitem.w_low = items.rx_min;
    //            newitem.w_high = "";
    //            console.log(lists,items)
    //            setLists((prevList) =>
    //                      [...prevList, newitem].sort(
    //                      (a, b) =>
    //                      min(a.w_low, a.RXpower, a.w_high) -
    //                      min(b.w_low, b.RXpower, b.w_high)
    //                                )
    //                              );
    //             })
    //            }).catch(err=>{
    //             console.log(err)
    //            })
    //         })
    //       }
    //       else{
    //         if (item.loai=="gpon-zte" && item.port){
    //           suyhao_olt_Service.get_rx_power_by_zte(item.ip,item.username,item.password,item.port).then(res=>{
    //             console.log(res.data,item )
    //             res.data && res.data.data.map((items,i)=>{
    //             let newitem = {};
    //           newitem.diachi = encryptData(item.ip);
    //           newitem.tenthietbi =encryptData(item.matram);
    //           newitem.tenthuongmai= encryptData(item.tentram);
    //           newitem.username = item.username;
    //           newitem.password = item.password;
    //           newitem.loai = item.loai;
    //           newitem.port = items.port;
    //           newitem.RXpower = items.rx_power;
    //           newitem.w_low = items.rx_min;
    //           newitem.w_high = "";
    //           console.log(lists,items)
    //           setLists((prevList) =>
    //                     [...prevList, newitem].sort(
    //                     (a, b) =>
    //                     min(a.w_low, a.RXpower, a.w_high) -
    //                     min(b.w_low, b.RXpower, b.w_high)
    //                               )
    //                             );
    //            })
    //           }).catch(e=>{
    //             suyhao_olt_Service.get_rx_power_by_zte(item.ip,item.username,item.password,item.port).then(res=>{
    //               console.log(res.data,item )
    //               res.data && res.data.data.map((items,i)=>{
    //               let newitem = {};
    //             newitem.diachi = encryptData(item.ip);
    //             newitem.tenthietbi =encryptData(item.matram);
    //             newitem.tenthuongmai= encryptData(item.tentram);
    //             newitem.username = item.username;
    //             newitem.password = item.password;
    //             newitem.loai = item.loai;
    //             newitem.port = items.port;
    //             newitem.RXpower = items.rx_power;
    //             newitem.w_low = items.rx_min;
    //             newitem.w_high = "";
    //             console.log(lists,items)
    //             setLists((prevList) =>
    //                       [...prevList, newitem].sort(
    //                       (a, b) =>
    //                       min(a.w_low, a.RXpower, a.w_high) -
    //                       min(b.w_low, b.RXpower, b.w_high)
    //                                 )
    //                               );
    //              })
    //             }).catch(error=>{
    //               console.log(error)
    //             })
    //           })
    //         }
    //         else{
    //           if (item.loai=="zte-mini" && item.port){
    //   suyhao_olt_Service.get_rx_power_by_zte_mini(item.ip,item.username,item.password,item.port).then(res=>{
    //             console.log(res.data,item )
    //             res.data && res.data.data.map((items,i)=>{
    //             let newitem = {};
    //           newitem.diachi = encryptData(item.ip);
    //           newitem.tenthietbi =encryptData(item.matram);
    //           newitem.tenthuongmai= encryptData(item.tentram);
    //           newitem.username = item.username;
    //           newitem.password = item.password;
    //           newitem.loai = item.loai;
    //           newitem.port = items.port;
    //           newitem.RXpower = items.rx_power;
    //           newitem.w_low = items.rx_min;
    //           newitem.w_high = "";
    //           console.log(lists,items)
    //           setLists((prevList) =>
    //                     [...prevList, newitem].sort(
    //                     (a, b) =>
    //                     min(a.w_low, a.RXpower, a.w_high) -
    //                     min(b.w_low, b.RXpower, b.w_high)
    //                               )
    //                             );
    //            })
    //           }).catch(e=>{
    //             suyhao_olt_Service.get_rx_power_by_zte_mini(item.ip,item.username,item.password,item.port).then(res=>{
    //               console.log(res.data,item )
    //               res.data && res.data.data.map((items,i)=>{
    //               let newitem = {};
    //             newitem.diachi = encryptData(item.ip);
    //             newitem.tenthietbi =encryptData(item.matram);
    //             newitem.tenthuongmai= encryptData(item.tentram);
    //             newitem.username = item.username;
    //             newitem.password = item.password;
    //             newitem.loai = item.loai;
    //             newitem.port = items.port;
    //             newitem.RXpower = items.rx_power;
    //             newitem.w_low = items.rx_min;
    //             newitem.w_high = "";
    //             console.log(lists,items)
    //             setLists((prevList) =>
    //                       [...prevList, newitem].sort(
    //                       (a, b) =>
    //                       min(a.w_low, a.RXpower, a.w_high) -
    //                       min(b.w_low, b.RXpower, b.w_high)
    //                                 )
    //                               );
    //              })
    //             }).catch(error=>{
    //               console.log(error)
    //             })
    //           })
    //           }
    //           else{
    //           if (item.loai=="huawei"){
    //             suyhao_olt_Service.get_rx_power_by_huawei(item.ip,item.username,item.password,item.port).then(res=>{
    //               console.log(res.data,item )
    //               res.data && res.data.data.map((items,i)=>{
    //               let newitem = {};
    //             newitem.diachi = encryptData(item.ip);
    //             newitem.tenthietbi =encryptData(item.matram);
    //             newitem.tenthuongmai= encryptData(item.tentram);
    //             newitem.username = item.username;
    //             newitem.password = item.password;
    //             newitem.loai = item.loai;
    //             newitem.port = items.port;
    //             newitem.RXpower = items.rx_power;
    //             newitem.w_low = items.rx_min;
    //             newitem.w_high = "";
    //             console.log(lists,items)
    //             setLists((prevList) =>
    //                       [...prevList, newitem].sort(
    //                       (a, b) =>
    //                       min(a.w_low, a.RXpower, a.w_high) -
    //                       min(b.w_low, b.RXpower, b.w_high)
    //                                 )
    //                               );
    //              })
    //             }).catch(e=>{
    //               suyhao_olt_Service.get_rx_power_by_huawei(item.ip,item.username,item.password,item.port).then(res=>{
    //                 console.log(res.data,item )
    //                 res.data && res.data.data.map((items,i)=>{
    //                 let newitem = {};
    //               newitem.diachi = encryptData(item.ip);
    //               newitem.tenthietbi =encryptData(item.matram);
    //               newitem.tenthuongmai= encryptData(item.tentram);
    //               newitem.username = item.username;
    //               newitem.password = item.password;
    //               newitem.loai = item.loai;
    //               newitem.port = items.port;
    //               newitem.RXpower = items.rx_power;
    //               newitem.w_low = items.rx_min;
    //               newitem.w_high = "";
    //               console.log(lists,items)
    //               setLists((prevList) =>
    //                         [...prevList, newitem].sort(
    //                         (a, b) =>
    //                         min(a.w_low, a.RXpower, a.w_high) -
    //                         min(b.w_low, b.RXpower, b.w_high)
    //                                   )
    //                                 );
    //                })
    //               }).catch(error=>{
    //                 console.log(error)
    //               })
    //             })
    //           }
    //           else{
    //             if (item.loai=="hw-mini"){
    //               suyhao_olt_Service.get_rx_power_by_huawei_mini(item.ip,item.username,item.password,item.port).then(res=>{
    //                 console.log(res.data,item )
    //               let  items=res.data
    //                 let newitem = {};
    //               newitem.diachi = encryptData(item.ip);
    //               newitem.tenthietbi =encryptData(item.matram);
    //               newitem.tenthuongmai= encryptData(item.tentram);
    //               newitem.username = item.username;
    //               newitem.password = item.password;
    //               newitem.loai = item.loai;
    //               newitem.port = items.port;
    //               newitem.RXpower = items.rx_power;
    //               newitem.w_low = items.rx_min;
    //               newitem.w_high = "";
    //               console.log(lists,items)
    //               setLists((prevList) =>
    //                         [...prevList, newitem].sort(
    //                         (a, b) =>
    //                         min(a.w_low, a.RXpower, a.w_high) -
    //                         min(b.w_low, b.RXpower, b.w_high)
    //                                   )
    //                                 );

    //               }).catch(e=>{
    //                 suyhao_olt_Service.get_rx_power_by_huawei_mini(item.ip,item.username,item.password,item.port).then(res=>{
    //                   console.log(res.data,item )
    //                   let  items=res.data
    //                   let newitem = {};
    //                 newitem.diachi = encryptData(item.ip);
    //                 newitem.tenthietbi =encryptData(item.matram);
    //                 newitem.tenthuongmai= encryptData(item.tentram);
    //                 newitem.username = item.username;
    //                 newitem.password = item.password;
    //                 newitem.loai = item.loai;
    //                 newitem.port = items.port;
    //                 newitem.RXpower = items.rx_power;
    //                 newitem.w_low = items.rx_min;
    //                 newitem.w_high = "";
    //                 console.log(lists,items)
    //                 setLists((prevList) =>
    //                           [...prevList, newitem].sort(
    //                           (a, b) =>
    //                           min(a.w_low, a.RXpower, a.w_high) -
    //                           min(b.w_low, b.RXpower, b.w_high)
    //                                     )
    //                                   );

    //                 }).catch(error=>{
    //                   console.log(error)
    //                 })
    //               })
    //             }
    //             else{
    //               if (item.loai=="dasan"){
    //                 suyhao_olt_Service.get_rx_power_by_dasan(item.ip,item.username,item.password,item.port).then(res=>{
    //                   console.log(res.data,item )
    //                 let  items=res.data
    //                   let newitem = {};
    //                 newitem.diachi = encryptData(item.ip);
    //                 newitem.tenthietbi =encryptData(item.matram);
    //                 newitem.tenthuongmai= encryptData(item.tentram);
    //                 newitem.username = item.username;
    //                 newitem.password = item.password;
    //                 newitem.loai = item.loai;
    //                 newitem.port = items.port;
    //                 newitem.RXpower = items.rx_power;
    //                 newitem.w_low = items.rx_min;
    //                 newitem.w_high = "";
    //                 console.log(lists,items)
    //                 setLists((prevList) =>
    //                           [...prevList, newitem].sort(
    //                           (a, b) =>
    //                           min(a.w_low, a.RXpower, a.w_high) -
    //                           min(b.w_low, b.RXpower, b.w_high)
    //                                     )
    //                                   );

    //                 }).catch(e=>{
    //                   suyhao_olt_Service.get_rx_power_by_dasan(item.ip,item.username,item.password,item.port).then(res=>{
    //                     console.log(res.data,item )
    //                     let  items=res.data
    //                     let newitem = {};
    //                   newitem.diachi = encryptData(item.ip);
    //                   newitem.tenthietbi =encryptData(item.matram);
    //                   newitem.tenthuongmai= encryptData(item.tentram);
    //                   newitem.username = item.username;
    //                   newitem.password = item.password;
    //                   newitem.loai = item.loai;
    //                   newitem.port = items.port;
    //                   newitem.RXpower = items.rx_power;
    //                   newitem.w_low = items.rx_min;
    //                   newitem.w_high = "";
    //                   console.log(lists,items)
    //                   setLists((prevList) =>
    //                             [...prevList, newitem].sort(
    //                             (a, b) =>
    //                             min(a.w_low, a.RXpower, a.w_high) -
    //                             min(b.w_low, b.RXpower, b.w_high)
    //                                       )
    //                                     );

    //                   }).catch(error=>{
    //                     console.log(error)
    //                   })
    //                 })
    //               }
    //             }
    //           }
    //           }
    //         }
    //       }
    //     })
    //   })

    // };
    //     setflag(false)
    //     fetchData();
    //     // const interval = setInterval(fetchData, 30000); // 600000 milliseconds = 10 phút
    //     // // Dọn dẹp để tránh rò rỉ bộ nhớ
    //     // return () => clearInterval(interval);
  }, [load]);

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
  const encryptData = (data) => {
    let secretKey = "vnpt";
    try {
      const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
      return encryptedData;
    } catch (error) {
      console.error("Error encrypting data: ", error);
      return null;
    }
  };
  const getdata = (e) => {
    console.log(e);
    e.map((item, index) => {
      // console.log(item);
      item.username = encryptData(item.username);
      item.password = encryptData(item.password);
      item.diachi = encryptData(item.diachi);
      item.tenthietbi = encryptData(item.tenthietbi);
      item.tenthuongmai = encryptData(item.tenthuongmai);
    });
    suyhaoService.addData(e).then((res) => {
      //  console.log(res.data);
    });
    setLists(e);
  };

  const changeRing = (e) => {
    console.log(e);
    setRing(e.value);
  };
  const changeLoaiDo = (e) => {
    setLoaiDo(e.target.value);
    setLists([]);
    setlist_export([]);
  };
  const changeLoaiThietBi = (e) => {
    setLoaiThietBi(e.target.value);
  };
  const BatdauDo = () => {
    setloading(true);
    setLists([]);
    console.log(loaiDo, loaiThietBi, Ring);
    let listSuyHao = [];
    if (loaiDo == "suyhao") {
      if (loaiThietBi != "olt")
        suyhaoService.getdata().then((res) => {
          if (loaiThietBi == "sw") {
            if (Ring != "all")
              listSuyHao = res.data.filter((e) => e.ring == Ring);
            else listSuyHao = res.data;
          }
          if (loaiThietBi == "all") listSuyHao = res.data;
          let list_log = [];
          let listshow_export_suyhao = [];
          listSuyHao.map(async (item, index) => {
            try {
              if (item.loai == "V2224G") {
                //  console.log("sw2224");
                await suyhaoService
                  .get_rx_power_by_SW2224(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password),
                    item.port
                  )
                  .then((res) => {
                    // console.log(Object.values(res.data))
                    // console.log(decryptData(item.diachi), item.port, res.data);
                    const correctedJsonString = res.data.RXpower.replace(
                      /'/g,
                      '"'
                    );
                    JSON.parse(correctedJsonString).map((e, i) => {
                      let newitem = {};
                      newitem.diachi = item.diachi;
                      newitem.tenthietbi = item.tenthietbi;
                      newitem.tenthuongmai = item.tenthuongmai;
                      newitem.username = item.username;
                      newitem.password = item.password;
                      newitem.loai = item.loai;
                      newitem.port = e.port;
                      newitem.RXpower = e.rx_power;
                      newitem.w_low = e.w_low == 0 ? -999 : e.w_low;
                      newitem.w_high = e.w_high;
                      newitem.temperature = e.temperature;
                      newitem.T_low = e.T_low;
                      newitem.T_high = e.T_high;
                      if (
                        Number(e.rx_power) < 99 &&
                        Number(e.rx_power) - Number(e.w_low) < dinhmuc
                      ) {
                        let item_export = {};
                        item_export.tenthietbi = decryptData(item.tenthietbi);
                        item_export.diachi = decryptData(item.diachi);
                        item_export.tenthuongmai = decryptData(
                          item.tenthuongmai
                        );
                        newitem.loai = item.loai;
                        item_export.port = e.port;
                        item_export.RXpower = e.rx_power;
                        item_export.w_low = e.w_low;

                        listshow_export_suyhao.push(item_export);
                        setlist_export(listshow_export_suyhao);
                      }

                      setLists((prevList) => {
                        // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                        const exists = prevList.some(
                          (item) =>
                            item.diachi === newitem.diachi &&
                            item.port === newitem.port
                        );

                        // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                        if (!exists) {
                          return [...prevList, newitem].sort(
                            (a, b) =>
                              min(a.w_low, a.RXpower, a.w_high) -
                              min(b.w_low, b.RXpower, b.w_high)
                          );
                        } else {
                          return prevList; // Giữ nguyên nếu đã tồn tại
                        }
                      });
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              if (item.loai == "ECS4120-28FV2-AF") {
                await suyhaoService
                  .get_rx_power_by_ECS(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password),

                    item.port
                  )
                  .then((res) => {
                    // console.log(Object.values(res.data))
                    const correctedJsonString = res.data.RXpower.replace(
                      /'/g,
                      '"'
                    );
                    //    console.log(JSON.parse(correctedJsonString));

                    JSON.parse(correctedJsonString).map((e, i) => {
                      // console.log(e, item);
                      let newitem = {};
                      newitem.diachi = item.diachi;
                      newitem.tenthietbi = item.tenthietbi;
                      newitem.tenthuongmai = item.tenthuongmai;
                      newitem.username = item.username;
                      newitem.password = item.password;
                      newitem.loai = item.loai;
                      newitem.port = e.port;
                      newitem.RXpower = e.rx_power;
                      newitem.w_low = e.w_low == 0 ? -999 : e.w_low;
                      newitem.w_high = e.w_high;
                      newitem.temperature = e.temperature;
                      newitem.T_low = e.T_low;
                      newitem.T_high = e.T_high;
                      if (
                        Number(e.rx_power) < 99 &&
                        Number(e.rx_power) - Number(e.w_low) < dinhmuc
                      ) {
                        let item_export = {};
                        item_export.tenthietbi = decryptData(item.tenthietbi);
                        item_export.diachi = decryptData(item.diachi);
                        item_export.tenthuongmai = decryptData(
                          item.tenthuongmai
                        );
                        newitem.loai = item.loai;
                        item_export.port = e.port;
                        item_export.RXpower = e.rx_power;
                        item_export.w_low = e.w_low;

                        listshow_export_suyhao.push(item_export);
                        setlist_export(listshow_export_suyhao);
                      }

                      setLists((prevList) => {
                        // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                        const exists = prevList.some(
                          (item) =>
                            item.diachi === newitem.diachi &&
                            item.port === newitem.port
                        );

                        // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                        if (!exists) {
                          return [...prevList, newitem].sort(
                            (a, b) =>
                              min(a.w_low, a.RXpower, a.w_high) -
                              min(b.w_low, b.RXpower, b.w_high)
                          );
                        } else {
                          return prevList; // Giữ nguyên nếu đã tồn tại
                        }
                      });
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              if (String(item.loai).includes("OS6")) {
                //  console.log("A6400");
                await suyhaoService
                  .get_rx_power_by_A6400(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password),
                    item.port
                  )
                  .then((res) => {
                    console.log(Object.values(res.data));
                    const correctedJsonString = res.data.RXpower.replace(
                      /'/g,
                      '"'
                    );
                    //  console.log(JSON.parse(correctedJsonString));
                    JSON.parse(correctedJsonString).map((e, i) => {
                      let newitem = {};
                      newitem.diachi = item.diachi;
                      newitem.tenthietbi = item.tenthietbi;
                      newitem.tenthuongmai = item.tenthuongmai;
                      newitem.username = item.username;
                      newitem.password = item.password;
                      newitem.loai = item.loai;
                      newitem.port = e.port;
                      newitem.RXpower = e.rx_power;
                      newitem.w_low = e.w_low == 0 ? -999 : e.w_low;
                      newitem.w_high = e.w_high;
                      newitem.temperature = e.temperature;
                      newitem.T_low = e.T_low;
                      newitem.T_high = e.T_high;
                      if (
                        Number(e.rx_power) < 99 &&
                        Number(e.rx_power) - Number(e.w_low) < dinhmuc
                      ) {
                        let item_export = {};
                        item_export.tenthietbi = decryptData(item.tenthietbi);
                        item_export.diachi = decryptData(item.diachi);
                        item_export.tenthuongmai = decryptData(
                          item.tenthuongmai
                        );
                        newitem.loai = item.loai;
                        item_export.port = e.port;
                        item_export.RXpower = e.rx_power;
                        item_export.w_low = e.w_low;

                        listshow_export_suyhao.push(item_export);
                        setlist_export(listshow_export_suyhao);
                      }
                      setLists((prevList) => {
                        // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                        const exists = prevList.some(
                          (item) =>
                            item.diachi === newitem.diachi &&
                            item.port === newitem.port
                        );

                        // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                        if (!exists) {
                          return [...prevList, newitem].sort(
                            (a, b) =>
                              min(a.w_low, a.RXpower, a.w_high) -
                              min(b.w_low, b.RXpower, b.w_high)
                          );
                        } else {
                          return prevList; // Giữ nguyên nếu đã tồn tại
                        }
                      });
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              if (item.loai == "V2724G") {
                //  console.log("sw2724");
                await suyhaoService
                  .get_rx_power_by_SW2724(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password),
                    item.port
                  )
                  .then((res) => {
                    // console.log(Object.values(res.data))
                    const correctedJsonString = res.data.RXpower.replace(
                      /'/g,
                      '"'
                    );
                    JSON.parse(correctedJsonString).map((e, i) => {
                      let newitem = {};
                      newitem.diachi = item.diachi;
                      newitem.tenthietbi = item.tenthietbi;
                      newitem.tenthuongmai = item.tenthuongmai;
                      newitem.username = item.username;
                      newitem.password = item.password;
                      newitem.loai = item.loai;
                      newitem.port = e.port;
                      newitem.RXpower = e.rx_power;
                      newitem.w_low = e.w_low == 0 ? -999 : e.w_low;
                      newitem.w_high = e.w_high;
                      newitem.temperature = e.temperature;
                      newitem.T_low = e.T_low;
                      newitem.T_high = e.T_high;
                      if (
                        Number(e.rx_power) < 99 &&
                        Number(e.rx_power) - Number(e.w_low) < dinhmuc
                      ) {
                        let item_export = {};
                        item_export.tenthietbi = decryptData(item.tenthietbi);
                        item_export.diachi = decryptData(item.diachi);
                        item_export.tenthuongmai = decryptData(
                          item.tenthuongmai
                        );
                        newitem.loai = item.loai;
                        item_export.port = e.port;
                        item_export.RXpower = e.rx_power;
                        item_export.w_low = e.w_low;

                        listshow_export_suyhao.push(item_export);
                        setlist_export(listshow_export_suyhao);
                      }
                      setLists((prevList) => {
                        // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                        const exists = prevList.some(
                          (item) =>
                            item.diachi === newitem.diachi &&
                            item.port === newitem.port
                        );

                        // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                        if (!exists) {
                          return [...prevList, newitem].sort(
                            (a, b) =>
                              min(a.w_low, a.RXpower, a.w_high) -
                              min(b.w_low, b.RXpower, b.w_high)
                          );
                        } else {
                          return prevList; // Giữ nguyên nếu đã tồn tại
                        }
                      });
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              list_log.push({
                diachi: decryptData(item.diachi),
                status: "Kết nối thành công",
                thoigian: new Date(),
              });
              setflag(true);
            } catch (e) {
              list_log.push({
                diachi: decryptData(item.diachi),
                status: "Kết nối thất bại" + e,
                thoigian: new Date(),
              });
            }
            console.log(list_log);
          });
        });
      if (loaiThietBi != "sw") {
        TramOLtService.getdata().then((res) => {
          console.log(res.data);
          res.data.map((item, index) => {
            if (item.loai == "gpon-alu" && item.port) {
              suyhao_olt_Service
                .get_rx_power_by_alu(
                  item.ip,
                  item.username,
                  item.password,
                  item.port
                )
                .then((res) => {
                  res.data &&
                    res.data.data.map((items, i) => {
                      let newitem = {};
                      newitem.diachi = encryptData(item.ip);
                      newitem.tenthietbi = item.tenhethong;
                      newitem.tenthuongmai = encryptData(item.tentram);
                      newitem.username = item.username;
                      newitem.password = item.password;
                      newitem.loai = item.loai;
                      newitem.port = items.port;
                      newitem.RXpower = items.rx_power;
                      if (String(items.rx_min).includes("high"))
                        newitem.w_low = 100;
                      else {
                        if (String(items.rx_min).includes("low"))
                          newitem.w_low = 90;
                        else {
                          newitem.w_low = -40;
                        }
                      }

                      newitem.w_high = "";
                      console.log(lists, items);
                      setLists((prevList) => {
                        // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                        const exists = prevList.some(
                          (item) =>
                            item.diachi === newitem.diachi &&
                            item.port === newitem.port
                        );

                        // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                        if (!exists) {
                          return [...prevList, newitem].sort(
                            (a, b) =>
                              min(a.w_low, a.RXpower, a.w_high) -
                              min(b.w_low, b.RXpower, b.w_high)
                          );
                        } else {
                          return prevList; // Giữ nguyên nếu đã tồn tại
                        }
                      });
                    });
                })
                .catch((e) => {
                  suyhao_olt_Service
                    .get_rx_power_by_alu(
                      item.ip,
                      item.username,
                      item.password,
                      item.port
                    )
                    .then((res) => {
                      res.data &&
                        res.data.data.map((items, i) => {
                          let newitem = {};
                          newitem.diachi = encryptData(item.ip);
                          newitem.tenthietbi = item.tenhethong;
                          newitem.tenthuongmai = encryptData(item.tentram);
                          newitem.username = item.username;
                          newitem.password = item.password;
                          newitem.loai = item.loai;
                          newitem.port = items.port;
                          newitem.RXpower = items.rx_power;
                          newitem.w_low =
                            items.rx_min == 0 ? -999 : items.rx_min;
                          newitem.w_high = "";
                          console.log(lists, items);
                          setLists((prevList) => {
                            // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                            const exists = prevList.some(
                              (item) =>
                                item.diachi === newitem.diachi &&
                                item.port === newitem.port
                            );

                            // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                            if (!exists) {
                              return [...prevList, newitem].sort(
                                (a, b) =>
                                  min(a.w_low, a.RXpower, a.w_high) -
                                  min(b.w_low, b.RXpower, b.w_high)
                              );
                            } else {
                              return prevList; // Giữ nguyên nếu đã tồn tại
                            }
                          });
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
            } else {
              if (item.loai == "gpon-zte" && item.port) {
                suyhao_olt_Service
                  .get_rx_power_by_zte(
                    item.ip,
                    item.username,
                    item.password,
                    item.port
                  )
                  .then((res) => {
                    console.log(res.data, item);
                    res.data &&
                      res.data.data.map((items, i) => {
                        let newitem = {};
                        newitem.diachi = encryptData(item.ip);
                        newitem.tenthietbi = item.tenhethong;
                        newitem.tenthuongmai = encryptData(item.tentram);
                        newitem.username = item.username;
                        newitem.password = item.password;
                        newitem.loai = item.loai;
                        newitem.port = items.port;
                        newitem.RXpower = items.rx_power;
                        newitem.w_low = items.rx_min == 0 ? -999 : items.rx_min;
                        newitem.w_high = "";
                        console.log(lists, items);
                        setLists((prevList) => {
                          // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                          const exists = prevList.some(
                            (item) =>
                              item.diachi === newitem.diachi &&
                              item.port === newitem.port
                          );

                          // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                          if (!exists) {
                            return [...prevList, newitem].sort(
                              (a, b) =>
                                min(a.w_low, a.RXpower, a.w_high) -
                                min(b.w_low, b.RXpower, b.w_high)
                            );
                          } else {
                            return prevList; // Giữ nguyên nếu đã tồn tại
                          }
                        });
                      });
                  })
                  .catch((e) => {
                    suyhao_olt_Service
                      .get_rx_power_by_zte(
                        item.ip,
                        item.username,
                        item.password,
                        item.port
                      )
                      .then((res) => {
                        console.log(res.data, item);
                        res.data &&
                          res.data.data.map((items, i) => {
                            let newitem = {};
                            newitem.diachi = encryptData(item.ip);
                            newitem.tenthietbi = item.tenhethong;
                            newitem.tenthuongmai = encryptData(item.tentram);
                            newitem.username = item.username;
                            newitem.password = item.password;
                            newitem.loai = item.loai;
                            newitem.port = items.port;
                            newitem.RXpower = items.rx_power;
                            newitem.w_low =
                              items.rx_min == 0 ? -999 : items.rx_min;
                            newitem.w_high = "";
                            console.log(lists, items);
                            setLists((prevList) => {
                              // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                              const exists = prevList.some(
                                (item) =>
                                  item.diachi === newitem.diachi &&
                                  item.port === newitem.port
                              );

                              // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                              if (!exists) {
                                return [...prevList, newitem].sort(
                                  (a, b) =>
                                    min(a.w_low, a.RXpower, a.w_high) -
                                    min(b.w_low, b.RXpower, b.w_high)
                                );
                              } else {
                                return prevList; // Giữ nguyên nếu đã tồn tại
                              }
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  });
              } else {
                if (item.loai == "zte-mini" && item.port) {
                  suyhao_olt_Service
                    .get_rx_power_by_zte_mini(
                      item.ip,
                      item.username,
                      item.password,
                      item.port
                    )
                    .then((res) => {
                      console.log(res.data, item);
                      res.data &&
                        res.data.data.map((items, i) => {
                          let newitem = {};
                          newitem.diachi = encryptData(item.ip);
                          newitem.tenthietbi = item.tenhethong;
                          newitem.tenthuongmai = encryptData(item.tentram);
                          newitem.username = item.username;
                          newitem.password = item.password;
                          newitem.loai = item.loai;
                          newitem.port = items.port;
                          newitem.RXpower = items.rx_power;
                          newitem.w_low =
                            items.rx_min == 0 ? -999 : items.rx_min;
                          newitem.w_high = "";
                          console.log(lists, items);
                          setLists((prevList) => {
                            // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                            const exists = prevList.some(
                              (item) =>
                                item.diachi === newitem.diachi &&
                                item.port === newitem.port
                            );

                            // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                            if (!exists) {
                              return [...prevList, newitem].sort(
                                (a, b) =>
                                  min(a.w_low, a.RXpower, a.w_high) -
                                  min(b.w_low, b.RXpower, b.w_high)
                              );
                            } else {
                              return prevList; // Giữ nguyên nếu đã tồn tại
                            }
                          });
                        });
                    })
                    .catch((e) => {
                      suyhao_olt_Service
                        .get_rx_power_by_zte_mini(
                          item.ip,
                          item.username,
                          item.password,
                          item.port
                        )
                        .then((res) => {
                          console.log(res.data, item);
                          res.data &&
                            res.data.data.map((items, i) => {
                              let newitem = {};
                              newitem.diachi = encryptData(item.ip);
                              newitem.tenthietbi = item.tenhethong;
                              newitem.tenthuongmai = encryptData(item.tentram);
                              newitem.username = item.username;
                              newitem.password = item.password;
                              newitem.loai = item.loai;
                              newitem.port = items.port;
                              newitem.RXpower = items.rx_power;

                              newitem.w_low =
                                items.rx_min == 0 ? -999 : items.rx_min;
                              newitem.w_high = "";
                              console.log(lists, items);
                              setLists((prevList) => {
                                // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                                const exists = prevList.some(
                                  (item) =>
                                    item.diachi === newitem.diachi &&
                                    item.port === newitem.port
                                );

                                // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                                if (!exists) {
                                  return [...prevList, newitem].sort(
                                    (a, b) =>
                                      min(a.w_low, a.RXpower, a.w_high) -
                                      min(b.w_low, b.RXpower, b.w_high)
                                  );
                                } else {
                                  return prevList; // Giữ nguyên nếu đã tồn tại
                                }
                              });
                            });
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    });
                } else {
                  if (item.loai == "huawei") {
                    suyhao_olt_Service
                      .get_rx_power_by_huawei(
                        item.ip,
                        item.username,
                        item.password,
                        item.port
                      )
                      .then((res) => {
                        console.log(res.data, item);
                        res.data &&
                          res.data.data.map((items, i) => {
                            let newitem = {};
                            newitem.diachi = encryptData(item.ip);
                            newitem.tenthietbi = item.tenhethong;
                            newitem.tenthuongmai = encryptData(item.tentram);
                            newitem.username = item.username;
                            newitem.password = item.password;
                            newitem.loai = item.loai;
                            newitem.port = items.port;
                            newitem.RXpower = items.rx_power;
                            newitem.w_low =
                              items.rx_min == 0 ? -999 : items.rx_min;
                            newitem.w_high = "";
                            console.log(lists, items);
                            setLists((prevList) => {
                              // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                              const exists = prevList.some(
                                (item) =>
                                  item.diachi === newitem.diachi &&
                                  item.port === newitem.port
                              );

                              // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                              if (!exists) {
                                return [...prevList, newitem].sort(
                                  (a, b) =>
                                    min(a.w_low, a.RXpower, a.w_high) -
                                    min(b.w_low, b.RXpower, b.w_high)
                                );
                              } else {
                                return prevList; // Giữ nguyên nếu đã tồn tại
                              }
                            });
                          });
                      })
                      .catch((e) => {
                        suyhao_olt_Service
                          .get_rx_power_by_huawei(
                            item.ip,
                            item.username,
                            item.password,
                            item.port
                          )
                          .then((res) => {
                            console.log(res.data, item);
                            res.data &&
                              res.data.data.map((items, i) => {
                                let newitem = {};
                                newitem.diachi = encryptData(item.ip);
                                newitem.tenthietbi = encryptData(item.matram);
                                newitem.tenthuongmai = encryptData(
                                  item.tentram
                                );
                                newitem.username = item.username;
                                newitem.password = item.password;
                                newitem.loai = item.loai;
                                newitem.port = items.port;
                                newitem.RXpower = items.rx_power;
                                newitem.w_low =
                                  items.rx_min == 0 ? -999 : items.rx_min;
                                newitem.w_high = "";
                                console.log(lists, items);
                                setLists((prevList) => {
                                  // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                                  const exists = prevList.some(
                                    (item) =>
                                      item.diachi === newitem.diachi &&
                                      item.port === newitem.port
                                  );

                                  // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                                  if (!exists) {
                                    return [...prevList, newitem].sort(
                                      (a, b) =>
                                        min(a.w_low, a.RXpower, a.w_high) -
                                        min(b.w_low, b.RXpower, b.w_high)
                                    );
                                  } else {
                                    return prevList; // Giữ nguyên nếu đã tồn tại
                                  }
                                });
                              });
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      });
                  } else {
                    if (item.loai == "hw-mini") {
                      suyhao_olt_Service
                        .get_rx_power_by_huawei_mini(
                          item.ip,
                          item.username,
                          item.password,
                          item.port
                        )
                        .then((res) => {
                          console.log(res.data, item);
                          let items = res.data;
                          let newitem = {};
                          newitem.diachi = encryptData(item.ip);
                          newitem.tenthietbi = item.tenhethong;
                          newitem.tenthuongmai = encryptData(item.tentram);
                          newitem.username = item.username;
                          newitem.password = item.password;
                          newitem.loai = item.loai;
                          newitem.port = items.port;
                          newitem.RXpower = items.rx_power;
                          newitem.w_low =
                            items.rx_min == 0 ? -999 : items.rx_min;
                          newitem.w_high = "";
                          console.log(lists, items);
                          setLists((prevList) => {
                            // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                            const exists = prevList.some(
                              (item) =>
                                item.diachi === newitem.diachi &&
                                item.port === newitem.port
                            );

                            // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                            if (!exists) {
                              return [...prevList, newitem].sort(
                                (a, b) =>
                                  min(a.w_low, a.RXpower, a.w_high) -
                                  min(b.w_low, b.RXpower, b.w_high)
                              );
                            } else {
                              return prevList; // Giữ nguyên nếu đã tồn tại
                            }
                          });
                        })
                        .catch((e) => {
                          suyhao_olt_Service
                            .get_rx_power_by_huawei_mini(
                              item.ip,
                              item.username,
                              item.password,
                              item.port
                            )
                            .then((res) => {
                              console.log(res.data, item);
                              let items = res.data;
                              let newitem = {};
                              newitem.diachi = encryptData(item.ip);
                              newitem.tenthietbi = item.tenhethong;
                              newitem.tenthuongmai = encryptData(item.tentram);
                              newitem.username = item.username;
                              newitem.password = item.password;
                              newitem.loai = item.loai;
                              newitem.port = items.port;
                              newitem.RXpower = items.rx_power;
                              newitem.w_low =
                                items.rx_min == 0 ? -999 : items.rx_min;
                              newitem.w_high = "";
                              console.log(lists, items);
                              setLists((prevList) => {
                                // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                                const exists = prevList.some(
                                  (item) =>
                                    item.diachi === newitem.diachi &&
                                    item.port === newitem.port
                                );

                                // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                                if (!exists) {
                                  return [...prevList, newitem].sort(
                                    (a, b) =>
                                      min(a.w_low, a.RXpower, a.w_high) -
                                      min(b.w_low, b.RXpower, b.w_high)
                                  );
                                } else {
                                  return prevList; // Giữ nguyên nếu đã tồn tại
                                }
                              });
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        });
                    } else {
                      if (item.loai == "dasan") {
                        suyhao_olt_Service
                          .get_rx_power_by_dasan(
                            item.ip,
                            item.username,
                            item.password,
                            item.port
                          )
                          .then((res) => {
                            console.log(res.data, item);
                            let items = res.data;
                            let newitem = {};
                            newitem.diachi = encryptData(item.ip);
                            newitem.tenthietbi = item.tenhethong;
                            newitem.tenthuongmai = encryptData(item.tentram);
                            newitem.username = item.username;
                            newitem.password = item.password;
                            newitem.loai = item.loai;
                            newitem.port = items.port;
                            newitem.RXpower = items.rx_power;
                            newitem.w_low =
                              items.rx_min == 0 ? -999 : items.rx_min;
                            newitem.w_high = "";
                            console.log(lists, items);
                            setLists((prevList) => {
                              // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                              const exists = prevList.some(
                                (item) =>
                                  item.diachi === newitem.diachi &&
                                  item.port === newitem.port
                              );

                              // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                              if (!exists) {
                                return [...prevList, newitem].sort(
                                  (a, b) =>
                                    min(a.w_low, a.RXpower, a.w_high) -
                                    min(b.w_low, b.RXpower, b.w_high)
                                );
                              } else {
                                return prevList; // Giữ nguyên nếu đã tồn tại
                              }
                            });
                          })
                          .catch((e) => {
                            suyhao_olt_Service
                              .get_rx_power_by_dasan(
                                item.ip,
                                item.username,
                                item.password,
                                item.port
                              )
                              .then((res) => {
                                console.log(res.data, item);
                                let items = res.data;
                                let newitem = {};
                                newitem.diachi = encryptData(item.ip);
                                newitem.tenthietbi = encryptData(item.matram);
                                newitem.tenthuongmai = encryptData(
                                  item.tentram
                                );
                                newitem.username = item.username;
                                newitem.password = item.password;
                                newitem.loai = item.loai;
                                newitem.port = items.port;
                                newitem.RXpower = items.rx_power;
                                newitem.w_low =
                                  items.rx_min == 0 ? -999 : items.rx_min;
                                newitem.w_high = "";
                                console.log(lists, items);
                                setLists((prevList) => {
                                  // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                                  const exists = prevList.some(
                                    (item) =>
                                      item.diachi === newitem.diachi &&
                                      item.port === newitem.port
                                  );

                                  // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                                  if (!exists) {
                                    return [...prevList, newitem].sort(
                                      (a, b) =>
                                        min(a.w_low, a.RXpower, a.w_high) -
                                        min(b.w_low, b.RXpower, b.w_high)
                                    );
                                  } else {
                                    return prevList; // Giữ nguyên nếu đã tồn tại
                                  }
                                });
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          });
                      }
                    }
                  }
                }
              }
            }
          });
        });
      }
    } else {
      if (loaiThietBi != "olt")
        suyhaoService.getdata().then((res) => {
          if (loaiThietBi == "sw") {
            if (Ring != "all")
              listSuyHao = res.data.filter((e) => e.ring == Ring);
            else listSuyHao = res.data;
          }
          if (loaiThietBi == "all") listSuyHao = res.data;
          let list_log = [];
          let listshow_export_suyhao = [];
          listSuyHao.map(async (item, index) => {
            try {
              if (item.loai == "V2224G") {
                console.log("sw2224");
                await suyhaoService
                  .get_degree_by_SW2224(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password)
                  )
                  .then((res) => {
                    // console.log((res.data))
                    let newitem = {};
                    newitem.diachi = item.diachi;
                    newitem.tenthietbi = item.tenthietbi;
                    newitem.tenthuongmai = item.tenthuongmai;
                    newitem.username = item.username;
                    newitem.password = item.password;
                    newitem.loai = item.loai;
                    newitem.port = item.port;
                    newitem.temperature = res.data.degree;

                    if (Number(res.data.degree) >= dinhmucnhietdo) {
                      let item_export = {};
                      item_export.tenthietbi = decryptData(item.tenthietbi);
                      item_export.diachi = decryptData(item.diachi);
                      item_export.tenthuongmai = decryptData(item.tenthuongmai);
                      newitem.loai = item.loai;
                      item_export.port = item.port;
                      item_export.temperature = res.data.degree;
                      listshow_export_suyhao.push(item_export);
                      setlist_export(listshow_export_suyhao);
                    }

                    setLists((prevList) => {
                      // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                      const exists = prevList.some(
                        (item) =>
                          item.diachi === newitem.diachi &&
                          item.port === newitem.port
                      );

                      // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                      if (!exists) {
                        return [...prevList, newitem].sort(
                          (a, b) => b.temperature - a.temperature
                        );
                      } else {
                        return prevList; // Giữ nguyên nếu đã tồn tại
                      }
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              if (item.loai == "ECS4120-28FV2-AF") {
                await suyhaoService
                  .get_degree_by_ECS(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password),

                    item.port
                  )
                  .then((res) => {
                    console.log(res.data);
                    let newitem = {};
                    newitem.diachi = item.diachi;
                    newitem.tenthietbi = item.tenthietbi;
                    newitem.tenthuongmai = item.tenthuongmai;
                    newitem.username = item.username;
                    newitem.password = item.password;
                    newitem.loai = item.loai;
                    newitem.port = item.port;
                    newitem.temperature = res.data.degree;

                    if (Number(res.data.degree) >= dinhmucnhietdo) {
                      let item_export = {};
                      item_export.tenthietbi = decryptData(item.tenthietbi);
                      item_export.diachi = decryptData(item.diachi);
                      item_export.tenthuongmai = decryptData(item.tenthuongmai);
                      newitem.loai = item.loai;
                      item_export.port = item.port;
                      item_export.temperature = res.data.degree;
                      listshow_export_suyhao.push(item_export);
                      setlist_export(listshow_export_suyhao);
                    }

                    setLists((prevList) => {
                      // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                      const exists = prevList.some(
                        (item) =>
                          item.diachi === newitem.diachi &&
                          item.port === newitem.port
                      );

                      // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                      if (!exists) {
                        return [...prevList, newitem].sort(
                          (a, b) => b.temperature - a.temperature
                        );
                      } else {
                        return prevList; // Giữ nguyên nếu đã tồn tại
                      }
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              if (String(item.loai).includes("OS6")) {
                //  console.log("A6400");
                await suyhaoService
                  .get_degree_by_A6400(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password),
                    item.port
                  )
                  .then((res) => {
                    // console.log((res.data))
                    let newitem = {};
                    newitem.diachi = item.diachi;
                    newitem.tenthietbi = item.tenthietbi;
                    newitem.tenthuongmai = item.tenthuongmai;
                    newitem.username = item.username;
                    newitem.password = item.password;
                    newitem.loai = item.loai;
                    newitem.port = item.port;
                    newitem.temperature = res.data.degree;

                    if (Number(res.data.degree) >= dinhmucnhietdo) {
                      let item_export = {};
                      item_export.tenthietbi = decryptData(item.tenthietbi);
                      item_export.diachi = decryptData(item.diachi);
                      item_export.tenthuongmai = decryptData(item.tenthuongmai);
                      newitem.loai = item.loai;
                      item_export.port = item.port;
                      item_export.temperature = res.data.degree;
                      listshow_export_suyhao.push(item_export);
                      setlist_export(listshow_export_suyhao);
                    }

                    setLists((prevList) => {
                      // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                      const exists = prevList.some(
                        (item) =>
                          item.diachi === newitem.diachi &&
                          item.port === newitem.port
                      );

                      // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                      if (!exists) {
                        return [...prevList, newitem].sort(
                          (a, b) => b.temperature - a.temperature
                        );
                      } else {
                        return prevList; // Giữ nguyên nếu đã tồn tại
                      }
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              if (item.loai == "V2724G") {
                //  console.log("sw2724");
                await suyhaoService
                  .get_degree_by_SW2724(
                    decryptData(item.diachi),
                    decryptData(item.username),
                    decryptData(item.password),
                    item.port
                  )
                  .then((res) => {
                    // console.log((res.data))
                    let newitem = {};
                    newitem.diachi = item.diachi;
                    newitem.tenthietbi = item.tenthietbi;
                    newitem.tenthuongmai = item.tenthuongmai;
                    newitem.username = item.username;
                    newitem.password = item.password;
                    newitem.loai = item.loai;
                    newitem.port = item.port;
                    newitem.temperature = res.data.degree;

                    if (Number(res.data.degree) >= dinhmucnhietdo) {
                      let item_export = {};
                      item_export.tenthietbi = decryptData(item.tenthietbi);
                      item_export.diachi = decryptData(item.diachi);
                      item_export.tenthuongmai = decryptData(item.tenthuongmai);
                      newitem.loai = item.loai;
                      item_export.port = item.port;
                      item_export.temperature = res.data.degree;
                      listshow_export_suyhao.push(item_export);
                      setlist_export(listshow_export_suyhao);
                    }

                    setLists((prevList) => {
                      // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                      const exists = prevList.some(
                        (item) =>
                          item.diachi === newitem.diachi &&
                          item.port === newitem.port
                      );

                      // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                      if (!exists) {
                        return [...prevList, newitem].sort(
                          (a, b) => b.temperature - a.temperature
                        );
                      } else {
                        return prevList; // Giữ nguyên nếu đã tồn tại
                      }
                    });
                  });
                // .catch((er) => {
                //   console.log(er);
                // });
              }
              list_log.push({
                diachi: decryptData(item.diachi),
                status: "Kết nối thành công",
                thoigian: new Date(),
              });
              setflag(true);
            } catch (e) {
              list_log.push({
                diachi: decryptData(item.diachi),
                status: "Kết nối thất bại" + e,
                thoigian: new Date(),
              });
            }
            console.log(list_log);
          });
        });

      if (loaiThietBi != "sw")
        TramOLtService.getdata().then((res) => {
          let listshow_export_suyhao = [];
          //console.log(res.data);
          console.log(res.data);
          res.data.map((item, index) => {
            if (item.loai == "gpon-alu" && item.port) {
              // console.log(item);
              suyhao_olt_Service
                .get_degree_by_alu(item.ip, item.username, item.password)
                .then((res) => {
                  res.data &&
                    res.data.map((items, i) => {
                      let newitem = {};
                      newitem.diachi = item.ip;
                      newitem.tenthietbi = item.tenhethong
                        ? item.tenhethong
                        : "";
                      newitem.tenthuongmai = item.tentram;
                      newitem.username = item.username;
                      newitem.password = item.password;
                      newitem.loai = item.loai;
                      newitem.port = items.port;
                      newitem.temperature = items.degree;

                      if (Number(items.degree) >= dinhmucnhietdo) {
                        let item_export = {};
                        item_export.tenthietbi = item.tenhethong
                          ? item.tenhethong
                          : "";
                        item_export.diachi = decryptData(item.diachi);
                        item_export.tenthuongmai = item.tenthuongmai;
                        newitem.loai = item.loai;
                        item_export.port = item.port;
                        item_export.temperature = res.data.degree;
                        listshow_export_suyhao.push(item_export);
                        setlist_export(listshow_export_suyhao);
                      }
                    });
                })
                .catch((e) => {
                  suyhao_olt_Service
                    .get_rx_power_by_alu(
                      item.ip,
                      item.username,
                      item.password,
                      item.port
                    )
                    .then((res) => {
                      res.data &&
                        res.data.data.map((items, i) => {
                          let newitem = {};
                          newitem.diachi = encryptData(item.ip);
                          newitem.tenthietbi = item.tenhethong
                            ? item.tenhethong
                            : "";
                          newitem.tenthuongmai = encryptData(item.tentram);
                          newitem.username = item.username;
                          newitem.password = item.password;
                          newitem.loai = item.loai;
                          newitem.port = items.port;
                          newitem.RXpower = items.rx_power;
                          newitem.w_low = items.rx_min;
                          newitem.w_high = "";
                          console.log(lists, items);
                          setLists((prevList) => {
                            // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                            const exists = prevList.some(
                              (item) =>
                                item.diachi === newitem.diachi &&
                                item.port === newitem.port
                            );

                            // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                            if (!exists) {
                              return [...prevList, newitem].sort(
                                (a, b) =>
                                  min(a.w_low, a.RXpower, a.w_high) -
                                  min(b.w_low, b.RXpower, b.w_high)
                              );
                            } else {
                              return prevList; // Giữ nguyên nếu đã tồn tại
                            }
                          });
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
            } else {
              if (item.loai == "gpon-zte" && item.port) {
                suyhao_olt_Service
                  .get_rx_power_by_zte(
                    item.ip,
                    item.username,
                    item.password,
                    item.port
                  )
                  .then((res) => {
                    //   console.log(res.data, item);
                    res.data &&
                      res.data.data.map((items, i) => {
                        let newitem = {};
                        newitem.diachi = encryptData(item.ip);
                        newitem.tenthietbi = item.tenhethong
                          ? item.tenhethong
                          : "";
                        newitem.tenthuongmai = encryptData(item.tentram);
                        newitem.username = item.username;
                        newitem.password = item.password;
                        newitem.loai = item.loai;
                        newitem.port = items.port;
                        newitem.RXpower = items.rx_power;
                        newitem.w_low = items.rx_min;
                        newitem.w_high = "";
                        //   console.log(lists, items);
                        setLists((prevList) => {
                          // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                          const exists = prevList.some(
                            (item) =>
                              item.diachi === newitem.diachi &&
                              item.port === newitem.port
                          );

                          // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                          if (!exists) {
                            return [...prevList, newitem].sort(
                              (a, b) =>
                                min(a.w_low, a.RXpower, a.w_high) -
                                min(b.w_low, b.RXpower, b.w_high)
                            );
                          } else {
                            return prevList; // Giữ nguyên nếu đã tồn tại
                          }
                        });
                      });
                  })
                  .catch((e) => {
                    suyhao_olt_Service
                      .get_rx_power_by_zte(
                        item.ip,
                        item.username,
                        item.password,
                        item.port
                      )
                      .then((res) => {
                        console.log(res.data, item);
                        res.data &&
                          res.data.data.map((items, i) => {
                            let newitem = {};
                            newitem.diachi = encryptData(item.ip);
                            newitem.tenthietbi = item.tenhethong
                              ? item.tenhethong
                              : "";
                            newitem.tenthuongmai = encryptData(item.tentram);
                            newitem.username = item.username;
                            newitem.password = item.password;
                            newitem.loai = item.loai;
                            newitem.port = items.port;
                            newitem.RXpower = items.rx_power;
                            newitem.w_low = items.rx_min;
                            newitem.w_high = "";
                            console.log(lists, items);
                            setLists((prevList) => {
                              // Kiểm tra xem đã có mục nào có cùng diachi và port trong danh sách chưa
                              const exists = prevList.some(
                                (item) =>
                                  item.diachi === newitem.diachi &&
                                  item.port === newitem.port
                              );

                              // Nếu chưa có, thêm newItem vào danh sách, nếu không thì giữ nguyên danh sách cũ
                              if (!exists) {
                                return [...prevList, newitem].sort(
                                  (a, b) =>
                                    min(a.w_low, a.RXpower, a.w_high) -
                                    min(b.w_low, b.RXpower, b.w_high)
                                );
                              } else {
                                return prevList; // Giữ nguyên nếu đã tồn tại
                              }
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  });
              }
            }
          });
        });
    }
    setloading(false);
  };
  return (
    <>
      {loading && <Loading />}
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-4">
            <div className="col col-md-6 col-lg-12 col-sm-12 b-2">
              <NavLink to="/">
                <i class="fa-solid fa-home" /> Trang chủ &nbsp;
              </NavLink>
              / Giám sát suy hao / Thống kê suy hao Switch & OLT
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-6 col-md-2">
              <div className="md-4">
                <label htmlFor="code" className="form-label tonghop-label">
                  Chọn loại đo
                </label>
                <select
                  className="form-select"
                  onChange={(e) => changeLoaiDo(e)}
                >
                  <option value="suyhao">Suy hao cổng</option>
                  <option value="nhietdo">Nhiệt độ</option>
                </select>
              </div>
            </div>
            <div className="col col-6 col-md-2">
              <div className="md-4">
                <label htmlFor="code" className="form-label tonghop-label">
                  Chọn loại thiết bị
                </label>
                <select
                  className="form-select"
                  onChange={(e) => changeLoaiThietBi(e)}
                >
                  <option value="all">Tất cả</option>
                  <option value="olt">OLT</option>

                  <option value="sw">SWITCH</option>
                </select>
              </div>
            </div>
            {loaiThietBi == "sw" && (
              <div className="col col-6 col-md-2">
                <div className="md-4">
                  <label className="form-label tonghop-label" htmlFor="name">
                    Chọn Ring
                  </label>
                  <Select onChange={(e) => changeRing(e)} options={listRing} />
                </div>
              </div>
            )}

            <div className="col col-6 col-md-2">
              <div className="md-4 mt-4 p-3">
                <button
                  onClick={() => BatdauDo()}
                  className="btn btn-primary btn-lg"
                >
                  Bắt đầu Đo
                </button>
              </div>
            </div>
          </div>
          {/* <div className="row mt-4">
                <div className="col col-md-6">
                  <div className="md-4">
                    <label className="form-label tonghop-label" htmlFor="rank">
                      Loại thiết bị
                    </label>
                    <select
                      className="form-select"
                   
                    >
                      <option value="" hidden>
                        Chọn loại thiết bị
                      </option>
                      <option value="V2724G">V2724G</option>
                      <option value="V2224G">V2224G</option>
                      <option value="ECS4120-28FV2-AF">
                        {" "}
                        ECS4120-28FV2-AF
                      </option>
                      <option value="OS6400">OS6400</option>
                      <option value="OS6450">OS6450</option>
                    </select>
                  </div>
                </div>
                <div className="col col-12 col-md-6">
                  <div className="md-4">
                    <label
                      htmlFor="course"
                      className="form-label tonghop-label"
                    >
                      Cổng thiết bị
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="course"
                     
                      placeholder="Cổng thiết bị"
                    />
                  </div>
                </div>
              </div> */}

          <div className="row mt-4 d-flex justify-content-between ">
            <div className="col col-md-5">
              <input
                type="text"
                className="form-control  ms-2 "
                id="teacher"
                // onChange={(e) => changetext(e)}
                // value={text}
                placeholder="Nhập nội dung tìm kiếm"
              />
            </div>
            <div className="col col-md-1 d-flex align-items-center justify-content-center">
              <label className="form-label tonghop-label"> Định mức</label>
            </div>
            {loaiDo == "suyhao" ? (
              <>
                <div className="col col-md-1">
                  <input
                    type="number"
                    className="form-control  ms-2 "
                    onChange={(e) => changedinhmuc(e)}
                    value={dinhmuc}
                    placeholder="Định mức suy hao"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col col-md-1">
                  <input
                    type="number"
                    className="form-control  ms-2 "
                    onChange={(e) => changedinhmucnhietdo(e)}
                    value={dinhmucnhietdo}
                    placeholder="Định mức nhiệt độ"
                  />
                </div>
              </>
            )}

            <div className="col col-md-5">
              <div className="row">
                <div className="col col-md-4">
                  <button
                    onClick={() => Loadpage()}
                    className={
                      flag
                        ? "btn btn-lg  btn-success"
                        : "btn btn-lg disabled btn-success"
                    }
                  >
                    Làm mới trạng thái
                  </button>
                </div>
                <div className="col col-md-7">
                  <ImportSuyhao
                    getdata={getdata}
                    header={loaiDo == "suyhao" ? header : headerDegree}
                    data={list_export}
                    row={0}
                    name={
                      "DanhSach_" +
                      (loaiDo == "suyhao"
                        ? "Suyhao"
                        : "Thiet bị nhiet do cao") +
                      "_ " +
                      new Date().getFullYear() +
                      "_" +
                      new Date().getMonth() +
                      "_" +
                      new Date().getDate()
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <table className="table mt-3 table-bordered   table-hover">
            <thead className="thead-dark">
              <tr>
                <th>STT</th>
                <th scope="col">SITE NAME</th>
                <th scope="col">Địa chỉ</th>
                <th scope="col">Tên hệ thống</th>

                <th scope="col">Loại</th>
                <th scope="col">Port</th>
                {loaiDo == "suyhao" && (
                  <>
                    <th scope="col">Thông số suy hao</th>
                    <th scope="col">W_Low</th>
                  </>
                )}
                {loaiDo == "nhietdo" && <th scope="col">Nhiệt độ</th>}
                {/* <th scope="col">W_High</th> */}
              </tr>
            </thead>
            <tbody>
              {listPg &&
                listPg.map((item, index) => {
                  return (
                    <tr
                      className={
                        // ||Number(item.RXpower) - Number(item.w_high) > -2
                        Number(item.RXpower) < 99 &&
                        Number(item.RXpower) - Number(item.w_low) < dinhmuc
                          ? "alert tr-backgroud"
                          : Number(item.temperature) >= dinhmucnhietdo &&
                            loaiDo != "suyhao"
                          ? "alert tr-backgroud"
                          : "alert"
                      }
                      role="alert"
                      key={index}
                    >
                      <td scope="row">{index + 1}</td>
                      <td>
                        {item.tenthuongmai.length < 20
                          ? item.tenthuongmai
                          : decryptData(item.tenthuongmai)}
                      </td>
                      <td>{decryptData(item.diachi)}</td>
                      <td>
                        {item.tenthietbi.length < 50
                          ? item.tenthietbi
                          : decryptData(item.tenthietbi)}
                      </td>

                      <td> {item.loai} </td>
                      <td> {item.port} </td>
                      {loaiDo == "suyhao" && (
                        <>
                          <td>
                            {" "}
                            {item.RXpower != 9999
                              ? item.RXpower + " dBm"
                              : " DDM not supported"}{" "}
                          </td>

                          {item.loai == "gpon-alu" ? (
                            <>
                              <td>
                                {" "}
                                {item.w_low == 100
                                  ? "high-th"
                                  : item.w_low == 90
                                  ? "low-th"
                                  : "normal-th"}{" "}
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                {" "}
                                {item.RXpower != 9999 &&  item.w_low!=-999
                                  ? item.w_low + " dBm"
                                  : "w_low not found"}{" "}
                              </td>
                            </>
                          )}
                        </>
                      )}
                      {loaiDo == "nhietdo" && <td> {item.temperature} </td>}
                      {/* <td>
                        {" "}
                        {item.RXpower != 9999
                          ? item.w_high + " dBm"
                          : "w_high not found"}{" "}
                      </td> */}
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <Paginations
            itemsPerPage={20}
            list={lists}
            getlist={getlist}
          />

        </div>
      </main>
    </>
  );
};
export default Suyhao_v2;
