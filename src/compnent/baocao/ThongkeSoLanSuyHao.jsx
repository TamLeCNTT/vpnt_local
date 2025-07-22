import Header from "../../Layout/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { da } from "date-fns/locale";
import TramOLtService from "../../service/TramOLtService";
import ImportNhienlieu from "../../support/ImportNhienlieu";
import TuyenKTService from "../../service/TuyenKTService";
import ImportSoLanSuyHao from "../../support/ImportSoLanSuyHao";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../support/Loading";
const ThongkeSoLanSuyHao = () => {
  const [lists, setLists] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [listexport, setListexport] = useState([]);
  const [listSuyHao, setListSuyHao] = useState([]);
  const [daychoices, setdaychoices] = useState("");
  const [textsearch, settextsearch] = useState("");
  const [name, setname] = useState("");
  const [loading, setloading] = useState(false);
  const [daychoice, setdaychoice] = useState(
    new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .substring(0, 10)
  );
  const [daychoiceEnd, setdaychoiceEnd] = useState(
    new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .substring(0, 10)
  );
  const convertDate = (dateString) => {
    // Tách chuỗi ngày thành mảng [year, month, day]
    const [year, month, day] = dateString.split("-");
    // Trả về chuỗi với định dạng "DD/MM/YYYY"
    return `${day}/${month}/${year}`;
  };
  const convertDates = (dateString) => {
    // Tách chuỗi ngày thành mảng [year, month, day]
    const [day, month, year] = dateString.split("/");
    // Trả về chuỗi với định dạng "DD/MM/YYYY"
    return `${day}-${month}-${year}`;
  };
  const convertDatemonth = (dateString) => {
    // Tách chuỗi ngày thành mảng [year, month, day]
    const [day, month, year] = dateString.split("-");
    // Trả về chuỗi với định dạng "DD/MM/YYYY"
    return `${year}-${month}-${day}`;
  };
  const header = [
    ["id", "tenhethong", "ip", "pon", "tuyenkt", "trungtamvienthong"],
  ];
  const getdata = (e) => {
    let listdata = [];
    let data = {};
    // console.log(e);

    TuyenKTService.addData(e).then((res) => {
      // toast.success("Thanh toán thành công");
      // console.log(res.data);
    });

    setLists(e);
    setListSearch(e);
  };
  const handleDateChange = async (e) => {
    setloading(true)
    //  console.log(e.target.value,daychoiceEnd)
    if (e.target.value == daychoiceEnd) {
      setname("DANH SÁCH THUÊ BAO SUY HAO KÉM LẶP LẠI ngày " + daychoiceEnd)
    }
    else {
      setname("DANH SÁCH THUÊ BAO SUY HAO KÉM LẶP LẠI từ ngày " + convertDate(e.target.value) + " đến " + convertDate(daychoiceEnd))
    }
    setListexport([])



    let currentDate = new Date(e.target.value);

    while (currentDate <= new Date(daychoiceEnd)) {


      //console.log(currentDate)
      addDataExport(format(currentDate, 'dd/MM/yyyy'), e.target.value, daychoiceEnd)
      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate > new Date(daychoiceEnd))
        setloading(false)
    }
    setdaychoice(e.target.value);
   


  };
  const addDataExport =async (day, daystart, dayend) => {
    setloading(true)
   await TuyenKTService.getdata_thongkesolansuyhao_byDay(day).then(
      (res) => {
    
        //  console.log(res.data,dayend)
        let listEP = [];

        res.data.map((item, index) => {
          //    console.log(item,listSuyHao,listSuyHao.filter(e=>new Date(convertDatemonth(convertDates(e.ngay)))<=new Date(convertDatemonth(convertDates("20/10/2024")))))

          TuyenKTService.getdata_thongkesolansuyhao().then((ressuyhao) => {

            //  console.log(ressuyhao.data.filter(e=>e.nguoidung=="ftthxuemtp19"))
            let flag = ressuyhao.data
              .filter((e) => e.nguoidung == item.nguoidung && new Date(convertDatemonth(convertDates(e.ngay))) <= new Date(convertDatemonth(convertDates(item.ngay))))
              .sort((a, b) => {
                const [dayA, monthA, yearA] = a.ngay.split("/");
                const [dayB, monthB, yearB] = b.ngay.split("/");

                // So sánh dựa trên năm, tháng và ngày
                return (
                  new Date(yearA, monthA - 1, dayA) -
                  new Date(yearB, monthB - 1, dayB)
                );
              });
            //  console.log(day,item,listSuyHao.filter(e=>e.nguoidung=="ftthxuemtp19"))
            //   console.log(flag);

            item.ngay = flag[0].ngay;
            item.soluong = flag.length;
            let itemexport = {};

            itemexport.ttvt = item.ttvt;
            itemexport.tkt = item.tkt;
            itemexport.nguoidung = item.nguoidung;
            itemexport.soluong = flag.length;
            itemexport.nhanvien = item.nhanvien;
            itemexport.ngay = item.ngay;
            listEP.push(itemexport);
            // setListexport(
            //   listEP.sort((a, b) => {
            //     if (a.ttvt === b.ttvt) {
            //       return b.soluong-a.soluong; // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
            //     }
            //     return a.ttvt.localeCompare(b.ttvt); // Sắp xếp theo 'matt'
            //   })
            // );
            // settextsearch("");
         
          let listdataex = listexport

          let items = {
            name: convertDates(day), data: listEP.sort((a, b) => {
              if (a.ttvt === b.ttvt) {
                return b.soluong - a.soluong; // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
              }
              return a.ttvt.localeCompare(b.ttvt); // Sắp xếp theo 'matt'
            })
          }
          console.log(items)
          //    console.log(listdataex)
          if (listdataex.filter(e => e.name == items.name).length == 0)
            listdataex.push(items)
          //console.log(listdataex.sort((a, b) => a.name.localeCompare(b.name)) )
          //  console.log(listdataex.sort((a, b) => a.name.localeCompare(b.name)).filter(e=> new Date(convertDatemonth(e.name))>=new Date(daystart)&& new Date(convertDatemonth(e.name))<=new Date(dayend)) )
          let listdata = listdataex.sort((a, b) => b.name.localeCompare(a.name)).filter(e => new Date(convertDatemonth(e.name)) >= new Date(daystart) && new Date(convertDatemonth(e.name)) <= new Date(dayend))

          setListexport([...listdata])
        });
      });
     
      setLists(res.data);
    setListSearch(res.data);
    }

    
    );
   
    setloading(false)
  }
  const handleDateEndChange = (e) => {
    setloading(true)
    setListexport([])
    let currentDate = new Date(daychoice);
    let date;
    if (e.target.value == daychoice) {
      setname("THỐNG KÊ CỔNG KÉM THEO GIAO BSC ngày " + daychoice)
    }
    else {
      setname("THỐNG KÊ CỔNG KÉM THEO GIAO BSC từ ngày " + convertDate(daychoice) + " đến " + convertDate(e.target.value))
    }
    if (new Date(new Date().setDate(new Date().getDate())) < new Date(e.target.value)) {
      date = new Date(new Date().setDate(new Date().getDate())).toISOString().substring(0, 10)
      toast.info("Ngày kết thúc không được vượt quá ngày " + convertDate(new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substring(0, 10)))
    }

    else
      date = e.target.value
    while (currentDate <= new Date(date)) {



      addDataExport(format(currentDate, 'dd/MM/yyyy'), daychoice, date)
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setdaychoiceEnd(date)
  };
  useEffect(() => {
    let day = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .substring(0, 10);
    setname("THỐNG KÊ CỔNG KÉM THEO GIAO BSC ngày " + daychoiceEnd)
    setdaychoices(convertDate(day));
    TuyenKTService.getdata_thongkesolansuyhao().then((res) => {

      //  console.log(res.data.filter(e=>e.nguoidung=="ftthxuemtp19"))
      let listSave = []
      listSave = res.data.filter((e) => e.ngay == convertDate(daychoiceEnd));
      //    console.log(res.data,listSave,daychoiceEnd,convertDate(daychoiceEnd))
      let listEP = [];
      listSave.map((item, index) => {
        let flag = res.data
          .filter((e) => e.nguoidung == item.nguoidung)
          .sort((a, b) => {
            const [dayA, monthA, yearA] = a.ngay.split("/");
            const [dayB, monthB, yearB] = b.ngay.split("/");

            // So sánh dựa trên năm, tháng và ngày
            return (
              new Date(yearA, monthA - 1, dayA) -
              new Date(yearB, monthB - 1, dayB)
            );
          });
        // console.log(flag);
        item.ngay = flag[0].ngay;
        item.soluong = flag.length;
        let itemexport = {};

        itemexport.ttvt = item.ttvt;
        itemexport.tkt = item.tkt;
        itemexport.nguoidung = item.nguoidung;
        itemexport.soluong = flag.length;
        itemexport.nhanvien = item.nhanvien;
        itemexport.ngay = item.ngay;
        listEP.push(itemexport);
        let listdataex = []
        // console.log(listEP);
        let items = {
          name: convertDates(convertDate(day)), data: listEP.sort((a, b) => {
            if (a.ttvt === b.ttvt) {
              return b.soluong - a.soluong; // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
            }
            return a.ttvt.localeCompare(b.ttvt); // Sắp xếp theo 'matt'
          })
        }
        console.log(items)
        listdataex.push(items)
        // console.log(listdataex)
        const data = ([...listexport, ...listdataex])
        const uniqueItems = Array.from(new Set(data));
        setListexport(uniqueItems)
        // setListexport(
        //   listEP.sort((a, b) => {
        //     if (a.ttvt === b.ttvt) {
        //       return b.soluong-a.soluong;  // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
        //     }
        //     return a.ttvt.localeCompare(b.ttvt); // Sắp xếp theo 'matt'
        //   })
        // );
      });


      setLists(listSave);
      setListSearch(listSave);
      setListSuyHao(res.data);
    });
    // TuyenKTService.getdata_thongkesolansuyhao_byDay(daychoice)
    //   .then((res) => {
    //     setLists(res.data);
    //   })
    //   .catch((e) => {
    //     setLists([]);
    //   });
  }, []);
  const normalizeString = (str) => {
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D");

    return str
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()“”‘’"…\[\]<>?¿¡|]/g, "")
      .toLowerCase();
  };
  const search = (e) => {
    settextsearch(e);
    let text = e;
    setLists(
      listSearch.filter(
        (item) =>
          normalizeString(item.ttvt).includes(normalizeString(text)) ||
          normalizeString(item.nguoidung).includes(normalizeString(text)) ||
          normalizeString(item.nhanvien).includes(normalizeString(text)) ||
          normalizeString(item.tkt).includes(normalizeString(text)) ||
          normalizeString(item.ngay).includes(normalizeString(text))
      )
    );
  };
  const DeleteOldData= async()=>{
    let newmonth=new Date().getMonth()
    let year=new Date().getFullYear()
    console.log(newmonth)
    if (newmonth==0){
      console.log(newmonth)
      newmonth=11
      year=year-1
    }
    else{
      if (newmonth==1){
        console.log(newmonth)
        newmonth=12
        year=year-1
      } 
      else{
        newmonth=newmonth-1
      }
    }
    const result =await  Swal.fire({
      title: "Bạn có muốn xóa dữ liệu tháng "+newmonth,
      text: "Dữ liệu sẽ xóa vĩnh viễn và không thể khôi phục !!!"  ,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Chấp nhận",
      cancelButtonText: "Hủy",
      customClass: {
        popup: 'swal-wide' // Thêm lớp tùy chỉnh
      },
    });

    if (result.isConfirmed){
     
    
    
      console.log(newmonth)
      TuyenKTService.getdata_thongkesolansuyhao_byMonth(newmonth,year).then(
        res=>{
          if(res.data.length>0){
          console.log(res.data)
          TuyenKTService.delete_thongkesolansuyhao_byMonth(Number(res.data[res.data.length-1].id)).then(ress=>{
            toast.success("Xóa dữ liệu thành công")
          })
          }
          else{
            toast.info("Dữ liệu đã được xóa trước đó!")
          }
        }
      )
    }
  }
  return (
    <>
    {
      loading&&(
        <Loading/>
      )
    }
   
      <Header />
      <main id="cabin_list" className="main">
        <div className="container">
          <div className="row mt-4">
            <div className="col col-md-6 col-lg-12 col-sm-12 b-2">
              <NavLink
                to="/"

              >
                <i class="fa-solid fa-home" /> Trang chủ &nbsp;
              </NavLink>
              / Báo cáo /  Thống ké số lần suy hao Gpon của khách hàng
            </div>
          </div>
          <div className="row mt-4 d-flex justify-content-between ">
            <div className="col col-md-3">
              <div className="row d-flex justify-content-between">
                <div className="col col-md-6 d-flex justify-content-between align-self-center">
                  <label className="form-label tonghop-label" htmlFor="name">
                    Ngày bắt đầu:
                  </label>
                </div>
                <div className="col col-md-6">
                  <input
                    type="date"
                    className="form-control  ms-2 "
                    value={daychoice}
                    onChange={(e) => handleDateChange(e)}
                  />
                </div>
              </div>
            </div>
            {/* <CoHuu_Filter filter={filter} listst={listst} listgv={listgv} /> */}
            <div className="col col-md-3">
              <div className="row d-flex justify-content-between">
                <div className="col col-md-6 d-flex justify-content-between align-self-center">
                  <label className="form-label tonghop-label" htmlFor="name">
                    Ngày kết thúc:
                  </label>
                </div>
                <div className="col col-md-6">
                  <input
                    type="date"
                    className="form-control  ms-2 "
                    value={daychoiceEnd}
                    onChange={(e) => handleDateEndChange(e)}
                  />
                </div>
              </div>
            </div>
           
            <div className="col col-md-5">
              <div className="row">
              <div className="col col-md-4">
              <button className="btn btn-danger btn-lg" onClick={()=>DeleteOldData()}>Xóa dữ liệu cũ</button>
                </div>
                <div className="col col-md-6">
                  <ImportSoLanSuyHao
                    listData={[]}
                    data={listexport}
                    row={0}
                    ngay={daychoices}
                    name={name}
                  />
                </div>
              </div>
            </div>
           
          </div>
          <table className="table mt-3 table-bordered   table-hover ">
            <thead className="thead-dark">
              <tr>
                <th>STT</th>
                <th scope="col">Người dùng</th>
                <th scope="col">Tuyến KT</th>

                <th scope="col">TTVT </th>

                <th scope="col">Nhân viên kỹ thuật</th>
                <th scope="col">Số lần suy hao</th>
                <th scope="col">Ngày bắt đầu suy hao</th>
              </tr>
            </thead>
            <tbody>
              {lists &&
                lists
                  .sort((a, b) => {
                    if (a.ttvt === b.ttvt) {
                      return a.tkt.localeCompare(b.tkt); // Sắp xếp theo 'tuyenkt' khi 'matt' bằng nhau
                    }
                    return a.ttvt.localeCompare(b.ttvt); // Sắp xếp theo 'matt'
                  })
                  .map((item, index) => {
                    return (
                      <tr className="alert " role="alert" key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.nguoidung}</td>
                        <td>{item.tkt}</td>
                        <td>{item.ttvt}</td>

                        <td>{item.nhanvien}</td>
                        <td>{item.soluong ? item.soluong : 0}</td>
                        <td>{item.ngay}</td>

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
export default ThongkeSoLanSuyHao;
