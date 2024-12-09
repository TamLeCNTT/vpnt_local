import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { da } from "date-fns/locale";
import TramOLtService from "../../service/TramOLtService";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import TuyenKTService from "../../service/TuyenKTService";
import { NavLink } from "react-router-dom";
import ImportBSCs from "../../support/ImportBSCs";
import Loading from "../../support/Loading";
import mainEService from "../../service/mainEService";

const SuyHaoBSC = () => {
  let flag = true;
  const [lists, setLists] = useState([]);
  const [listexport, setListexport] = useState([]);
  const [loading, setloading] = useState(false);
  const [listTuyenKT, setListTuyenKT] = useState([]);
  const [listTuyenKT_TT, setListTuyenKT_TT] = useState([]);
  const [ngay, setngay] = useState("");
  const [date, setdate] = useState("");
  const [dateUpdate, setDateUpdate] = useState("");
  const [month, setmonth] = useState("");
  const [sodmb, setsodmb] = useState(1);
  const header = [
    ["id", "tenhethong", "ip", "pon", "tuyenkt", "trungtamvienthong"],
  ];
  const listnv = [
    "Nguyễn Minh Anh",
    "Nguyễn Hoàng Khôi",
    "Hồ Văn Hải",
    "Bùi Đức Khoa",
  ];
  const headerkem = [
    "TTVT",
    "Tuyến",
    "Thiết bị",
    "Cổng",
    "Mã module quang OLT",
    "Mã module quang ONU",
    "Account Fiber",
    "Account MyTV",
    "Mã nhân viên",
    "Thông tin nhân viên",
    "Độ dài",
    "Ngưỡng OLT Rx max",
    "Ngưỡng OLT Rx min",
    "Ngưỡng OLT Tx max",
    "Ngưỡng OLT Tx min",
    "Ngưỡng ONU Rx max",
    "Ngưỡng ONU Rx min",
    "Ngưỡng ONU Tx max",
    "Ngưỡng ONU Rx min",
    "Chỉ số OLT TX",
    "Chỉ số OLT RX",
    "Chỉ số ONU TX",
    "Chỉ số ONU RX",
    "Chỉ số Suy hao down",
    "Chỉ số Suy hao up",
    "Đánh giá",
    "Chỉ số kém",
    "Mô tả",
    "Trạng thái",
    "Tên thuê bao",
    "Địa chỉ lắp đặt",
    "Điện thoại",
    "Datetime online gần nhất",
    "Ngày",
  ];
  let litst_ttvt = [
    {
      matt: "ttvt1",
    },
    {
      matt: "ttvt2",
    },
    {
      matt: "ttvt3",
    },
    {
      matt: "ttvt4",
    },
  ];
  const [message, setMessage] = useState("Chờ một chút...");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };
  const tuyenktbuyid = (ids) => {
    let list = listTuyenKT;
    let ips = ids.split(":")[0];
    // console.log(
    //   list,
    //   ids.split(":")[0],
    //   list.filter((e) => e.id == ips)
    // );
    return list.filter((e) => e.id == ids)[0]
      ? list.filter((e) => e.id == ids)[0]
      : list.filter((e) => e.id == ids.split(":")[0])[0];
  };
  const changesodmb = (e) => {
    let backupdata = e;
    if (Number(e.target.value) < 1) setsodmb(1);
    else setsodmb(e.target.value);
  };
  const getdata = (e) => {
    let backupdata = e;
    setloading(true);
    let listdata = [];
    let listDataKem = [];
    let listDataKem1dpm = [];
    let data = {};
    flag = true;
    console.log(e, Number(sodmb));

    Object.values(e).map((item, values) => {
      let danhgiakem = "sai if= other";

      if (item.tt03 == "C+") {
        if (
          item.tt19 &&
          (Number(item.tt19) <= -31 + Number(sodmb) - 1 ||
            Number(item.tt19) >= -13 - (Number(sodmb) - 1))
        )
          danhgiakem = "OLT RX";
        else if (
          item.tt21 &&
          (Number(item.tt21) <= -27 + Number(sodmb) - 1 ||
            Number(item.tt21) >= -8 - (Number(sodmb) - 1))
        )
          danhgiakem = "ONU RX";
      } else {
        if (item.tt03 == "B+") {
          if (
            item.tt19 &&
            (Number(item.tt19) <= -27 + Number(sodmb) - 1 ||
              Number(item.tt19) >= -9 - (Number(sodmb) - 1))
          )
            danhgiakem = "OLT RX";
          else if (
            item.tt21 &&
            (Number(item.tt21) <= -27 + Number(sodmb) - 1 ||
              Number(item.tt21) >= -8 - (Number(sodmb) - 1))
          )
            danhgiakem = "ONU RX";
        } else {
          if (item.tt03 == "OTHER") {
            if (
              item.tt21 &&
              (Number(item.tt21) <= -27 + Number(sodmb) - 1 ||
                Number(item.tt21) >= -8 - (Number(sodmb) - 1))
            )
              danhgiakem = "ONU RX";
          }
        }
      }
      try {
        if (danhgiakem != "sai if= other") {
          item.tt25 = danhgiakem;
          // console.log(item)
          item.tt000 = tuyenktbuyid(item.tt02).trungtamvienthong;
          item.tt00 = tuyenktbuyid(item.tt02).tuyenkt;

          listDataKem1dpm.push(item);
        }
        if (item.tt24 == "Kém") {
          item.tt000 = tuyenktbuyid(item.tt02).trungtamvienthong;
          item.tt00 = tuyenktbuyid(item.tt02).tuyenkt;

          listDataKem.push(item);
        }
      } catch {
        toast.error(
          item.tt02 + " của nhân viên " + item.tt08 + " không tồn tại !!"
        );
        toast.info(
          "Quá trình thêm " +
            item.tt02 +
            " của nhân viên " +
            item.tt08 +
            " đang diễn ra. Vui lòng đợi trong ít phút !!!"
        );

        console.log(listTuyenKT_TT.filter((e) => e.tennv == item.tt08)[0]);
        let listAutosaveTuyenKT = [];
        let itemAutoSave = {};
        itemAutoSave = {
          id: item.tt02,
          tenhethong: item.tt01,
          pon: item.tt02,
          ip: item.tt02,
          tuyenkt: listTuyenKT_TT.filter((e) => e.tennv == item.tt08)[0]
            .tuyenkt,
          trungtamvienthong: listTuyenKT_TT.filter(
            (e) => e.tennv == item.tt08
          )[0].ttvt,
        };
        listAutosaveTuyenKT.push(itemAutoSave);
        TuyenKTService.addData(listAutosaveTuyenKT)
          .then(async (res) => {
            await delay(3000);
            toast.success("Thêm tuyến kĩ thuật thành công");
            await delay(3000);
            toast.info(
              "Quá trình thông kê suy hao Gpon đang được khởi động lại!!!"
            );
            await delay(5000); // 30 giây
            let listTKT = listTuyenKT;
            setloading(false);
            listTKT.push(itemAutoSave);
            setListTuyenKT([...listTKT]);
            getdata(backupdata);
            console.log(res.data);
          })
          .catch((e) => {
            toast.error("Thêm dữ liệu thất bại !!!");
          });
        flag = false;
        console.log(item);
      }
    });
    // console.log(listDataKem, listDataKem1dpm);
    if (flag) {
      let listkem = [];
      let listbinhquan = [];
      let listbinhquan8362 = [];
      let list_binhquan_suyhao = [];
      // console.log(listTuyenKT_TT);
      let onuxtong = 0;
      let oltxtong = 0;
      let kemtong = 0;
      let kemdptong = 0;
      let tongsl = 0;
      let tongslhgi = 0;
      let tonghientai = 0;
      let kemdptonghgi = 0;
      let onuxtonghgi = 0;
      let oltxtonghgi = 0;
      let kemtonghgi = 0;
      let onurx;
      let oltrx;
      let kem;
      let slcongkemdp;
      let congkemsochitieu;
      let tylecongkem;
      let i = 0;
      // let ths = {
      //   donvi: "(1)",
      //   tuyenkt: "(2)",
      //   sl: "(3)",
      //   onurx: "(4)",
      //   oltrx: "(5)",
      //   kem8362: "(6)",
      //   kemdp: "(7)",
      //   chitieu:"(8)=(6)+(7)",
      //   kemtn: "(9)=(8)/(3)",
      //   tichluy:"(10)",
      //   nhanvien: "(11)",
      // };
      // listkem.push(ths);
      listTuyenKT_TT
        .sort((a, b) => {
          if (a.matt === b.matt) {
            return a.tuyenkt.localeCompare(b.tuyenkt); // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
          }
          return a.matt.localeCompare(b.matt); // Sắp xếp theo 'matt'
        })
        .map((item, index) => {
          onurx = listDataKem1dpm.filter(
            (e) => e.tt00 == item.tuyenkt && e.tt25 == "ONU RX"
          ).length;
          onuxtong = onuxtong + onurx;
          onuxtonghgi = onuxtonghgi + onurx;
          oltrx = listDataKem1dpm.filter(
            (e) => e.tt00 == item.tuyenkt && e.tt25 == "OLT RX"
          ).length;
          oltxtong = oltxtong + oltrx;
          oltxtonghgi = oltxtonghgi + oltrx;
          kem = listDataKem.filter((e) => e.tt00 == item.tuyenkt).length;
          kemtong = kemtong + kem;
          kemtonghgi = kemtonghgi + kem;
          slcongkemdp = oltrx + onurx - kem;
          kemdptong = kemdptong + slcongkemdp;
          kemdptonghgi = kemdptonghgi + slcongkemdp;
          congkemsochitieu =
            oltrx + onurx + "/" + (Number(item.sl) * (0.04 / 100)).toFixed(0);
          tylecongkem = (((oltrx + onurx) / Number(item.sl)) * 100).toFixed(3);

          tongsl += Number(item.sl);
          tongslhgi += Number(item.sl);
          tonghientai = Number(item.sl);
          if ((index % 5 == 0 && index > 0) || index == 20) {
            let th = {
              donvi: listTuyenKT_TT[index - 1].ttvt,
              tuyenkt: "Tổng TT",
              sl: (tongsl - tonghientai).toLocaleString("en-US"),
              onurx: onuxtong - onurx,
              oltrx: oltxtong - oltrx,
              kem8362: kemtong - kem,
              kemdp: kemdptong - slcongkemdp,
              chitieu:
                onuxtong -
                onurx +
                (oltxtong - oltrx) +
                "/" +
                (Number(tongsl - tonghientai) * (0.04 / 100)).toFixed(0),
              kemtn: (
                ((onuxtong - onurx + (oltxtong - oltrx)) /
                  Number(tongsl - tonghientai)) *
                100
              ).toFixed(3),
              tichluy: "0.00%",
              nhanvien: listnv[i],
            };
            i += 1;
            onuxtong = onurx;
            oltxtong = oltrx;
            kemtong = kem;
            kemdptong = slcongkemdp;
            tongsl = tonghientai;
            listkem.push(th);
          }
          let th = {
            donvi: item.ttvt,
            tuyenkt: item.tuyenkt,
            sl: Number(item.sl).toLocaleString("en-US"),
            onurx: onurx,
            oltrx: oltrx,
            kem8362: kem,
            kemdp: slcongkemdp,
            chitieu: congkemsochitieu,
            kemtn: tylecongkem,
            tichluy: "0.00%",
            nhanvien: item.tennv,
          };
          let suyhao = {
            tuyenkt: item.tuyenkt,
            ttvt: item.matt,
            binhquan: oltrx + onurx,
            kem8362: kem,
          };
          list_binhquan_suyhao.push(suyhao);
          listkem.push(th);
        });
      console.log(onuxtong, onurx, oltxtong, oltrx);
      let th = {
        donvi: "Trung tâm Viễn thông 4",
        tuyenkt: "Tổng TT",
        sl: tongsl.toLocaleString("en-US"),
        onurx: onuxtong,
        oltrx: oltxtong,
        kem8362: kemtong,
        kemdp: kemdptong - slcongkemdp,
        chitieu:
          onuxtong +
          oltxtong +
          "/" +
          (Number(tongsl) * (0.04 / 100)).toFixed(0),
        kemtn: (((onuxtong + oltxtong) / Number(tongsl)) * 100).toFixed(3),
        tichluy: "0.00%",
        nhanvien: listnv[i],
      };
      console.log(th);

      listkem.push(th);
      th = {
        donvi: "",
        tuyenkt: "HGI",
        sl: tongslhgi.toLocaleString("en-US"),
        onurx: onuxtonghgi,
        oltrx: oltxtonghgi,
        kem8362: kemtonghgi,
        kemdp: kemdptonghgi,
        chitieu:
          onuxtonghgi +
          oltxtonghgi +
          "/" +
          (Number(tongslhgi) * (0.04 / 100)).toFixed(0),
        kemtn:
          (((onuxtonghgi + oltxtonghgi) / Number(tongslhgi)) * 100).toFixed(3) +
          "%",
        tichluy: "0.00%",
        nhanvien: "",
      };

      listkem.push(th);
      // console.log(listkem, list_binhquan_suyhao);

      let newitem_bqsh = {};
      let newitem_bq8362 = {};
      list_binhquan_suyhao.map((item, index) => {
        newitem_bqsh[item.tuyenkt] = item.binhquan;
        newitem_bq8362[item.tuyenkt] = item.kem8362;
      });
      newitem_bqsh["HGI"] = list_binhquan_suyhao.reduce(
        (acc, item) => acc + item.binhquan,
        0
      );
      newitem_bq8362["HGI"] = list_binhquan_suyhao.reduce(
        (acc, item) => acc + item.kem8362,
        0
      );

      newitem_bqsh["TongTT1"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt1")
        .reduce((acc, item) => acc + item.binhquan, 0);
      newitem_bqsh["TongTT3"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt3")
        .reduce((acc, item) => acc + item.binhquan, 0);
      newitem_bqsh["TongTT2"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt2")
        .reduce((acc, item) => acc + item.binhquan, 0);
      newitem_bqsh["TongTT4"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt4")
        .reduce((acc, item) => acc + item.binhquan, 0);

      newitem_bq8362["TongTT1"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt1")
        .reduce((acc, item) => acc + item.kem8362, 0);
      newitem_bq8362["TongTT3"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt3")
        .reduce((acc, item) => acc + item.kem8362, 0);
      newitem_bq8362["TongTT2"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt2")
        .reduce((acc, item) => acc + item.kem8362, 0);
      newitem_bq8362["TongTT4"] = list_binhquan_suyhao
        .filter((e) => e.ttvt == "ttvt4")
        .reduce((acc, item) => acc + item.kem8362, 0);

      const formattedDate = Object.values(e)[0].tt32;

      const currentDate = formattedDate; // Ghép lại theo DD/MM/YYYY
      setngay(currentDate);
      newitem_bqsh["ngay"] = formattedDate;
      newitem_bq8362["ngay"] = formattedDate;
      const [day, month, year] = formattedDate.split("/"); // Tách tháng, ngày, năm
      const nextMonth = new Date(year, month, 0); // Tháng trong JS bắt đầu từ 0
      setmonth(month + "/" + year);
      setdate(day + "-" + month + "-" + year);
      // sheet  Binh quan
      // Lấy số ngày trong tháng
      const daysInMonth = nextMonth.getDate();
      // console.log(daysInMonth);
      let listsave = [];
      let listsave8362 = [];
      listsave8362.push(newitem_bq8362);
      listsave.push(newitem_bqsh);
      TuyenKTService.getdata_binhquan_suyhao().then((resbq) => {
        if (!resbq.data.filter((e) => e.ngay == currentDate).length) {
          TuyenKTService.addData_binhquan_suyhao(listsave).then((res) => {
            // console.log(res.data);
            TuyenKTService.getdata_binhquan_suyhao_byMonth(month, year).then(
              (resbq) => {
                let tt = 1;
                let sltong = 0;
                let sltonghgi = 0;
                let slhientai = 0;
                listTuyenKT_TT
                  .sort((a, b) => {
                    if (a.matt === b.matt) {
                      return a.tuyenkt.localeCompare(b.tuyenkt); // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
                    }
                    return a.matt.localeCompare(b.matt); // Sắp xếp theo 'matt'
                  })
                  .map((item, index) => {
                    let th = {
                      donvi: item.ttvt,
                      tuyenkt: item.tuyenkt,
                      sl: Number(item.sl).toLocaleString("en-US"),
                    };
                    let sl = 0,
                      socong = 0;
                    for (let i = 1; i <= 31; i++) {
                      th[`tt${i}`] = resbq.data.filter(
                        (e) => e.ngay.split("/")[0] == i
                      ).length
                        ? resbq.data.filter(
                            (e) => e.ngay.split("/")[0] == i
                          )[0][item.tuyenkt]
                        : "";
                      if (
                        resbq.data.filter((e) => e.ngay.split("/")[0] == i)
                          .length
                      ) {
                        socong += Number(
                          resbq.data.filter(
                            (e) => e.ngay.split("/")[0] == i
                          )[0][item.tuyenkt]
                        );
                        sl += 1;
                      }
                    }
                    // console.log(sl, socong);
                    th.socong = (socong / sl).toFixed(1);
                    th.tyle = ((socong / sl / Number(item.sl)) * 100).toFixed(
                      3
                    );

                    slhientai = Number(item.sl);
                    sltong += Number(item.sl);
                    sltonghgi += Number(item.sl);

                    // 5 ttt
                    if (index % 5 == 0 && index > 0) {
                      let th = {
                        donvi: listTuyenKT_TT[index - 1].ttvt,
                        tuyenkt: "Tổng TT",
                        sl: (sltong - slhientai).toLocaleString("en-US"),
                      };

                      let sl = 0,
                        socong = 0;
                      for (let i = 1; i <= 31; i++) {
                        th[`tt${i}`] = resbq.data.filter(
                          (e) => e.ngay.split("/")[0] == i
                        ).length
                          ? resbq.data.filter(
                              (e) => e.ngay.split("/")[0] == i
                            )[0]["TongTT" + tt]
                          : "";
                        if (
                          resbq.data.filter((e) => e.ngay.split("/")[0] == i)
                            .length
                        ) {
                          socong += Number(
                            resbq.data.filter(
                              (e) => e.ngay.split("/")[0] == i
                            )[0]["TongTT" + tt]
                          );
                          sl += 1;
                        }
                      }
                      tt += 1;

                      th.socong = (socong / sl).toFixed(1);
                      th.tyle = (
                        (socong / sl / Number(sltong - slhientai)) *
                        100
                      ).toFixed(3);
                      listbinhquan.push(th);
                      sltong = slhientai;
                    }

                    // console.log(th, item.tuyenkt);
                    listbinhquan.push(th);
                  });

                let th = {
                  donvi: "Trung tâm Viễn thông 4",
                  tuyenkt: "Tổng TT",
                  sl: sltong.toLocaleString("en-US"),
                };
                let sl = 0,
                  socong = 0;
                for (let i = 1; i <= 31; i++) {
                  th[`tt${i}`] = resbq.data.filter(
                    (e) => e.ngay.split("/")[0] == i
                  ).length
                    ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "TongTT" + tt
                      ]
                    : "";
                  if (
                    resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                  ) {
                    socong += Number(
                      resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "TongTT" + tt
                      ]
                    );
                    sl += 1;
                  }
                }
                tt += 1;

                th.socong = (socong / sl).toFixed(1);
                th.tyle = ((socong / sl / Number(sltong)) * 100).toFixed(3);
                listbinhquan.push(th);

                // hgi
                th = {
                  donvi: "",
                  tuyenkt: "HGI",
                  sl: sltonghgi.toLocaleString("en-US"),
                };
                sl = 0;
                socong = 0;
                for (let i = 1; i <= 31; i++) {
                  th[`tt${i}`] = resbq.data.filter(
                    (e) => e.ngay.split("/")[0] == i
                  ).length
                    ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "HGI"
                      ]
                    : "";
                  if (
                    resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                  ) {
                    socong += Number(
                      resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "HGI"
                      ]
                    );
                    sl += 1;
                  }
                }
                tt += 1;

                th.socong = (socong / sl).toFixed(1);
                th.tyle = ((socong / sl / Number(sltonghgi)) * 100).toFixed(3);
                listbinhquan.push(th);
                // console.log(listbinhquan);
                listbinhquan.map((item, index) => {
                  // console.log(listkem[index], item);
                  listkem[index].tichluy = item.tyle;
                });
              }
            );
          });
        } else {
          TuyenKTService.getdata_binhquan_suyhao_byMonth(month, year).then(
            (resbq) => {
              let tt = 1;
              let sltong = 0;
              let sltonghgi = 0;
              let slhientai = 0;
              listTuyenKT_TT
                .sort((a, b) => {
                  if (a.matt === b.matt) {
                    return a.tuyenkt.localeCompare(b.tuyenkt); // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
                  }
                  return a.matt.localeCompare(b.matt); // Sắp xếp theo 'matt'
                })
                .map((item, index) => {
                  let th = {
                    donvi: item.ttvt,
                    tuyenkt: item.tuyenkt,
                    sl: Number(item.sl).toLocaleString("en-US"),
                  };
                  let sl = 0,
                    socong = 0;
                  for (let i = 1; i <= 31; i++) {
                    th[`tt${i}`] = resbq.data.filter(
                      (e) => e.ngay.split("/")[0] == i
                    ).length
                      ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                          item.tuyenkt
                        ]
                      : "";
                    if (
                      resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                    ) {
                      socong += Number(
                        resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                          item.tuyenkt
                        ]
                      );
                      sl += 1;
                    }
                  }
                  // console.log(sl, socong);
                  th.socong = (socong / sl).toFixed(1);
                  th.tyle = ((socong / sl / Number(item.sl)) * 100).toFixed(3);

                  slhientai = Number(item.sl);
                  sltong += Number(item.sl);
                  sltonghgi += Number(item.sl);

                  // 5 ttt
                  if (index % 5 == 0 && index > 0) {
                    let th = {
                      donvi: listTuyenKT_TT[index - 1].ttvt,
                      tuyenkt: "Tổng TT",
                      sl: (sltong - slhientai).toLocaleString("en-US"),
                    };

                    let sl = 0,
                      socong = 0;
                    for (let i = 1; i <= 31; i++) {
                      th[`tt${i}`] = resbq.data.filter(
                        (e) => e.ngay.split("/")[0] == i
                      ).length
                        ? resbq.data.filter(
                            (e) => e.ngay.split("/")[0] == i
                          )[0]["TongTT" + tt]
                        : "";
                      if (
                        resbq.data.filter((e) => e.ngay.split("/")[0] == i)
                          .length
                      ) {
                        socong += Number(
                          resbq.data.filter(
                            (e) => e.ngay.split("/")[0] == i
                          )[0]["TongTT" + tt]
                        );
                        sl += 1;
                      }
                    }
                    tt += 1;

                    th.socong = (socong / sl).toFixed(1);
                    th.tyle = (
                      (socong / sl / Number(sltong - slhientai)) *
                      100
                    ).toFixed(2);
                    listbinhquan.push(th);
                    sltong = slhientai;
                  }

                  // console.log(th, item.tuyenkt);
                  listbinhquan.push(th);
                });

              let th = {
                donvi: "Trung tâm Viễn thông 4",
                tuyenkt: "Tổng TT",
                sl: sltong.toLocaleString("en-US"),
              };
              let sl = 0,
                socong = 0;
              for (let i = 1; i <= 31; i++) {
                th[`tt${i}`] = resbq.data.filter(
                  (e) => e.ngay.split("/")[0] == i
                ).length
                  ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                      "TongTT" + tt
                    ]
                  : "";
                if (
                  resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                ) {
                  socong += Number(
                    resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                      "TongTT" + tt
                    ]
                  );
                  sl += 1;
                }
              }
              tt += 1;

              th.socong = (socong / sl).toFixed(1);
              th.tyle = ((socong / sl / Number(sltong)) * 100).toFixed(3);
              listbinhquan.push(th);

              // hgi
              th = {
                donvi: "",
                tuyenkt: "HGI",
                sl: sltonghgi.toLocaleString("en-US"),
              };
              sl = 0;
              socong = 0;
              for (let i = 1; i <= 31; i++) {
                th[`tt${i}`] = resbq.data.filter(
                  (e) => e.ngay.split("/")[0] == i
                ).length
                  ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                      "HGI"
                    ]
                  : "";
                if (
                  resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                ) {
                  socong += Number(
                    resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                      "HGI"
                    ]
                  );
                  sl += 1;
                }
              }
              tt += 1;

              th.socong = (socong / sl).toFixed(1);
              th.tyle = ((socong / sl / Number(sltonghgi)) * 100).toFixed(3);
              listbinhquan.push(th);
              // console.log(listbinhquan);
              listbinhquan.map((item, index) => {
                // console.log(listkem[index], item);
                listkem[index].tichluy = item.tyle;
              });
            }
          );
        }
      });
      console.log(listDataKem);
      let listThongKeSLSH = [];
      listDataKem.map((item, index) => {
        let DTSH = {};
        DTSH.tkt = item.tt00;
        DTSH.ttvt = item.tt000;
        DTSH.nguoidung = item.tt05 ? item.tt05 : item.tt06;
        DTSH.nhanvien = item.tt08;
        DTSH.ngay = item.tt32;
        listThongKeSLSH.push(DTSH);
      });
      console.log(listThongKeSLSH);

      TuyenKTService.getdata_binhquan_suyhao_vb8362().then((resbq) => {
        if (!resbq.data.filter((e) => e.ngay == currentDate).length) {
          TuyenKTService.addData_binhquan_suyhao_vb8362(listsave8362).then(
            (res) => {
              // console.log(res.data);
              // sheet binh quan 8362
              TuyenKTService.getdata_binhquan_suyhao_vb8362_byMonth(
                month,
                year
              ).then((resbq) => {
                let tt = 1;
                let sltong = 0;
                let sltonghgi = 0;
                let slhientai = 0;
                listTuyenKT_TT
                  .sort((a, b) => {
                    if (a.matt === b.matt) {
                      return a.tuyenkt.localeCompare(b.tuyenkt); // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
                    }
                    return a.matt.localeCompare(b.matt); // Sắp xếp theo 'matt'
                  })
                  .map((item, index) => {
                    let th = {
                      donvi: item.ttvt,
                      tuyenkt: item.tuyenkt,
                      sl: Number(item.sl).toLocaleString("en-US"),
                    };
                    let sl = 0,
                      socong = 0;
                    for (let i = 1; i <= 31; i++) {
                      th[`tt${i}`] = resbq.data.filter(
                        (e) => e.ngay.split("/")[0] == i
                      ).length
                        ? resbq.data.filter(
                            (e) => e.ngay.split("/")[0] == i
                          )[0][item.tuyenkt]
                        : "";
                      if (
                        resbq.data.filter((e) => e.ngay.split("/")[0] == i)
                          .length
                      ) {
                        socong += Number(
                          resbq.data.filter(
                            (e) => e.ngay.split("/")[0] == i
                          )[0][item.tuyenkt]
                        );
                        sl += 1;
                      }
                    }
                    // console.log(sl, socong);
                    th.socong = (socong / sl).toFixed(1);
                    th.tyle = ((socong / sl / Number(item.sl)) * 100).toFixed(
                      3
                    );

                    slhientai = Number(item.sl);
                    sltong += Number(item.sl);
                    sltonghgi += Number(item.sl);

                    // 5 ttt
                    if (index % 5 == 0 && index > 0) {
                      let th = {
                        donvi: listTuyenKT_TT[index - 1].ttvt,
                        tuyenkt: "Tổng TT",
                        sl: (sltong - slhientai).toLocaleString("en-US"),
                      };

                      let sl = 0,
                        socong = 0;
                      for (let i = 1; i <= 31; i++) {
                        th[`tt${i}`] = resbq.data.filter(
                          (e) => e.ngay.split("/")[0] == i
                        ).length
                          ? resbq.data.filter(
                              (e) => e.ngay.split("/")[0] == i
                            )[0]["TongTT" + tt]
                          : "";
                        if (
                          resbq.data.filter((e) => e.ngay.split("/")[0] == i)
                            .length
                        ) {
                          socong += Number(
                            resbq.data.filter(
                              (e) => e.ngay.split("/")[0] == i
                            )[0]["TongTT" + tt]
                          );
                          sl += 1;
                        }
                      }
                      tt += 1;

                      th.socong = (socong / sl).toFixed(1);
                      th.tyle = (
                        (socong / sl / Number(sltong - slhientai)) *
                        100
                      ).toFixed(3);
                      listbinhquan8362.push(th);
                      sltong = slhientai;
                    }

                    // console.log(th, item.tuyenkt);
                    listbinhquan8362.push(th);
                  });

                let th = {
                  donvi: "Trung tâm Viễn thông 4",
                  tuyenkt: "Tổng TT",
                  sl: sltong.toLocaleString("en-US"),
                };
                let sl = 0,
                  socong = 0;
                for (let i = 1; i <= 31; i++) {
                  th[`tt${i}`] = resbq.data.filter(
                    (e) => e.ngay.split("/")[0] == i
                  ).length
                    ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "TongTT" + tt
                      ]
                    : "";
                  if (
                    resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                  ) {
                    socong += Number(
                      resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "TongTT" + tt
                      ]
                    );
                    sl += 1;
                  }
                }
                tt += 1;

                th.socong = (socong / sl).toFixed(1);
                th.tyle = ((socong / sl / Number(sltong)) * 100).toFixed(3);
                listbinhquan8362.push(th);

                // hgi
                th = {
                  donvi: "",
                  tuyenkt: "HGI",
                  sl: sltonghgi.toLocaleString("en-US"),
                };
                sl = 0;
                socong = 0;
                for (let i = 1; i <= 31; i++) {
                  th[`tt${i}`] = resbq.data.filter(
                    (e) => e.ngay.split("/")[0] == i
                  ).length
                    ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "HGI"
                      ]
                    : "";
                  if (
                    resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                  ) {
                    socong += Number(
                      resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        "HGI"
                      ]
                    );
                    sl += 1;
                  }
                }
                tt += 1;

                th.socong = (socong / sl).toFixed(1);
                th.tyle = ((socong / sl / Number(sltonghgi)) * 100).toFixed(3);
                listbinhquan8362.push(th);
              });

              toast.success("Thêm dữ liệu ngày " + currentDate + " thành công");
              console.log(listDataKem);
              let listThongKeSLSH = [];
              listDataKem.map((item, index) => {
                let DTSH = {};
                DTSH.tkt = item.tt00;
                DTSH.ttvt = item.tt000;
                DTSH.nguoidung = item.tt05 ? item.tt05 : item.tt06;
                DTSH.nhanvien = item.tt08;
                DTSH.ngay = item.tt32;
                listThongKeSLSH.push(DTSH);
              });
              console.log(listThongKeSLSH);
              TuyenKTService.addData_thongkesolansuyhao(listThongKeSLSH).then(
                (res) => {
                  console.log(res.data);
                  setloading(false);
                }
              );
            }
          );
        } else {
          toast.info("Dữ liệu ngày " + currentDate + " đã tồn tại");
          setloading(false);
          // sheet binh quan 8362
          TuyenKTService.getdata_binhquan_suyhao_vb8362_byMonth(
            month,
            year
          ).then((resbq) => {
            let tt = 1;
            let sltong = 0;
            let sltonghgi = 0;
            let slhientai = 0;
            listTuyenKT_TT
              .sort((a, b) => {
                if (a.matt === b.matt) {
                  return a.tuyenkt.localeCompare(b.tuyenkt); // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
                }
                return a.matt.localeCompare(b.matt); // Sắp xếp theo 'matt'
              })
              .map((item, index) => {
                let th = {
                  donvi: item.ttvt,
                  tuyenkt: item.tuyenkt,
                  sl: Number(item.sl).toLocaleString("en-US"),
                };
                let sl = 0,
                  socong = 0;
                for (let i = 1; i <= 31; i++) {
                  th[`tt${i}`] = resbq.data.filter(
                    (e) => e.ngay.split("/")[0] == i
                  ).length
                    ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        item.tuyenkt
                      ]
                    : "";
                  if (
                    resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                  ) {
                    socong += Number(
                      resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                        item.tuyenkt
                      ]
                    );
                    sl += 1;
                  }
                }
                // console.log(sl, socong);
                th.socong = (socong / sl).toFixed(1);
                th.tyle = ((socong / sl / Number(item.sl)) * 100).toFixed(3);

                slhientai = Number(item.sl);
                sltong += Number(item.sl);
                sltonghgi += Number(item.sl);

                // 5 ttt
                if (index % 5 == 0 && index > 0) {
                  let th = {
                    donvi: listTuyenKT_TT[index - 1].ttvt,
                    tuyenkt: "Tổng TT",
                    sl: (sltong - slhientai).toLocaleString("en-US"),
                  };

                  let sl = 0,
                    socong = 0;
                  for (let i = 1; i <= 31; i++) {
                    th[`tt${i}`] = resbq.data.filter(
                      (e) => e.ngay.split("/")[0] == i
                    ).length
                      ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                          "TongTT" + tt
                        ]
                      : "";
                    if (
                      resbq.data.filter((e) => e.ngay.split("/")[0] == i).length
                    ) {
                      socong += Number(
                        resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                          "TongTT" + tt
                        ]
                      );
                      sl += 1;
                    }
                  }
                  tt += 1;

                  th.socong = (socong / sl).toFixed(1);
                  th.tyle = (
                    (socong / sl / Number(sltong - slhientai)) *
                    100
                  ).toFixed(2);
                  listbinhquan8362.push(th);
                  sltong = slhientai;
                }

                // console.log(th, item.tuyenkt);
                listbinhquan8362.push(th);
              });

            let th = {
              donvi: "Trung tâm Viễn thông 4",
              tuyenkt: "Tổng TT",
              sl: sltong.toLocaleString("en-US"),
            };
            console.log(resbq.data);
            let sl = 0,
              socong = 0;
            for (let i = 1; i <= 31; i++) {
              th[`tt${i}`] = resbq.data.filter((e) => e.ngay.split("/")[0] == i)
                .length
                ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                    "TongTT" + tt
                  ]
                : "";
              if (resbq.data.filter((e) => e.ngay.split("/")[0] == i).length) {
                socong += Number(
                  resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0][
                    "TongTT" + tt
                  ]
                );
                sl += 1;
              }
            }
            tt += 1;

            th.socong = (socong / sl).toFixed(1);
            th.tyle = ((socong / sl / Number(sltong)) * 100).toFixed(3);
            console.log(th);
            listbinhquan8362.push(th);

            // hgi
            th = {
              donvi: "",
              tuyenkt: "HGI",
              sl: sltonghgi.toLocaleString("en-US"),
            };
            sl = 0;
            socong = 0;
            for (let i = 1; i <= 31; i++) {
              th[`tt${i}`] = resbq.data.filter((e) => e.ngay.split("/")[0] == i)
                .length
                ? resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0]["HGI"]
                : "";
              if (resbq.data.filter((e) => e.ngay.split("/")[0] == i).length) {
                socong += Number(
                  resbq.data.filter((e) => e.ngay.split("/")[0] == i)[0]["HGI"]
                );
                sl += 1;
              }
            }
            tt += 1;

            th.socong = (socong / sl).toFixed(1);
            th.tyle = ((socong / sl / Number(sltonghgi)) * 100).toFixed(3);
            listbinhquan8362.push(th);
          });
        }
      });

      let itemexport = {
        header: headerkem,
        data: listDataKem.sort((a, b) => a.tt000.localeCompare(b.tt000)),
        name: "DS Kém theo 8362",
      };
      let itemexport1dbm = {
        header: headerkem,
        data: listDataKem1dpm.sort((a, b) => a.tt000.localeCompare(b.tt000)),
        name: "DS Cổng Sh dự phòng " + sodmb + "dBm",
      };
      let itemth = {
        header: headerkem,
        data: listkem,
        name: "Tổng hợp số liệu",
      };
      console.log(listkem);
      let itembinhquan = {
        header: headerkem,
        data: listbinhquan,
        name: "Bình quân",
      };
      let itembinhquan8362 = {
        header: headerkem,
        data: listbinhquan8362,
        name: "Bình quân VB8362",
      };
      let listexp = [];
      setLists(listkem);
      if (sodmb == 1) {
        listexp.push(itemexport);
        listexp.push(itemexport1dbm);
        listexp.push(itemth);
        listexp.push(itembinhquan);
        listexp.push(itembinhquan8362);
      } else {
        listexp.push(itemexport1dbm);
      }

      setListexport(listexp);
    }
  };

  useEffect(() => {
    setloading(true);
    
    TuyenKTService.getdata()
      .then((res) => {
        // console.log(res.data);
        setListTuyenKT(res.data);
      })
      .catch((e) => {
        setListTuyenKT([]);
        toast.error(
          "Mất kết nối Server ! Vui lòng khởi động lại máy và chờ 5 phút !!!"
        );
      });
    TuyenKTService.getdata_TT()
      .then((res) => {
        // console.log(res.data);
        setListTuyenKT_TT(res.data);
        setloading(false);
      })
      .catch((e) => {
        setListTuyenKT_TT([]);
      });



      mainEService.getDatainFile("timeUpdateSL_cong.txt").then(res => {
        console.log(res.data.data)
        setDateUpdate(res.data.data)
      }).catch(err=>{})
  }, []);
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
              / Báo cáo / Báo cáo suy hao Gpon hằng ngày
            </div>
          </div>
          <div className="row mt-4 d-flex justify-content-between ">
            <div className="col col-md-7">
              <input
                type="number"
                className="form-control  ms-2 "
                id="teacher"
                onChange={(e) => changesodmb(e)}
                value={sodmb}
                // placeholder="Nhập nội dung tìm kiếm"
              />
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-5">
              <div className="row">
                <div className="col col-md-10">
                  <ImportBSCs
                    getdata={getdata}
                    header={header}
                    listData={listexport}
                    data={[]}
                    row={0}
                    dateUpdate={dateUpdate}
                    ngay={ngay}
                    month={month}
                    name={
                      "CỔNG KÉM THEO GIAO BSC " +
                      (sodmb != 1 ? "(Dự phòng " + sodmb + "dBm )" : " Ngày ") +
                      date
                    }
                  />
                  {/* <SuyHaoBSC setData={getdata} /> */}
                </div>
              </div>
            </div>
          </div>
          <table className="table mt-3 table-bordered   table-hover ">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Đơn vị</th>
                <th scope="col">Tuyến KT</th>
                <th scope="col">SL cổng đến 03.10</th>

                <th scope="col">SL Cổng kém ONU RX,TX</th>

                <th scope="col">SL Cổng kém OLT RX,TX</th>
                <th scope="col">SL Cổng Kém 8362</th>

                <th scope="col">SL Cổng kém (Dự phòng 1dBm)</th>
                <th scope="col">
                  Tổng SL cổng kém so với chỉ tiêu SL cho phép
                </th>

                <th scope="col">Tỷ lệ cổng kém trong ngày</th>

                <th scope="col">Tỉ lệ bình quân tính BSC(Lũy kế)</th>
                <th scope="col">NVKT</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists.map((item, index) => {
                  return (
                    <tr className="alert " role="alert" key={index}>
                      {index % 6 == 0 && (
                        <td rowSpan="6">
                          <div className="d-flex justify-content-between align-self-center donvi">
                            {item.donvi}
                          </div>
                        </td>
                      )}
                      <td className={item.tuyenkt == "Tổng TT" ? "tong" : " "}>
                        {item.tuyenkt}
                      </td>
                      <td className={item.tuyenkt == "Tổng TT" ? "tong" : " "}>
                        {item.sl}
                      </td>

                      <td className={item.tuyenkt == "Tổng TT" ? "tong" : " "}>
                        {item.onurx}
                      </td>

                      <td className={item.tuyenkt == "Tổng TT" ? "tong" : " "}>
                        {item.oltrx}
                      </td>
                      <td className={item.tuyenkt == "Tổng TT" ? "tong" : " "}>
                        {item.kem8362}
                      </td>

                      <td className={item.tuyenkt == "Tổng TT" ? " tong" : " "}>
                        {item.kemdp}
                      </td>
                      <td className={item.tuyenkt == "Tổng TT" ? " tong" : " "}>
                        {item.chitieu}
                      </td>

                      <td className={item.tuyenkt == "Tổng TT" ? " tong" : " "}>
                        {item.kemtn}
                      </td>

                      <td className={item.tuyenkt == "Tổng TT" ? " tong" : " "}>
                        {item.tichluy}
                      </td>
                      <td className={item.tuyenkt == "Tổng TT" ? " tong" : " "}>
                        {item.nhanvien}
                      </td>

                      {/* <td className="manage"> */}
                      {/* <a href="#" className="close" data-dismiss="alert" aria-label="Close" onClick={() => xoa(item.cabinId)}>
                                                            <span aria-hidden="true"><i className="fa fa-close"></i></span>
                                                        </a> */}
                      {/* <Student_Edit id={item.studentId} listst={listst} listgv={listgv} save={save} /> */}
                      {/* </td> */}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};
export default SuyHaoBSC;
