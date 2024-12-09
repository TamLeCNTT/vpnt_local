import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000/tuyen_kt/";
const EMPLOYEE_API_BASE_URLs = "http://10.102.20.135:5000/tuyen_kt_tt/";
const EMPLOYEE_API_BASE_URLbq = "http://10.102.20.135:5000/binhquan_suyhao/";
const EMPLOYEE_API_BASE_URLvb8362 = "http://10.102.20.135:5000/binhquan_suyhao_vb8362/";
const EMPLOYEE_API_BASE_URL_thongkesolansuyhao = "http://10.102.20.135:5000/thongkesolansuyhao/";
const ONU_API_BASE_URL = "http://10.102.20.135:5000/onu/";
const SCHEMA = "suyhao";
class TuyenKTService {
 
  getdata() {
    return axios.get(EMPLOYEE_API_BASE_URL+"get_data")
  }
  getdata_TT() {
    return axios.get(EMPLOYEE_API_BASE_URLs+"get_data")
  }
  getdata_binhquan_suyhao() {
    return axios.get(EMPLOYEE_API_BASE_URLbq+"get_data")
  }
  getdata_binhquan_suyhao_vb8362() {
    return axios.get(EMPLOYEE_API_BASE_URLvb8362+"get_data")
  }
  getdata_thongkesolansuyhao() {
    return axios.get(EMPLOYEE_API_BASE_URL_thongkesolansuyhao+"get_data")
  }
  getdata_binhquan_suyhao_byMonth(month,year) {
    return axios.get(EMPLOYEE_API_BASE_URLbq+"get_data_by_date?month="+month+"&year="+year)
  }
  getdata_binhquan_suyhao_vb8362_byMonth(month,year) {
    return axios.get(EMPLOYEE_API_BASE_URLvb8362+"get_data_by_date?month="+month+"&year="+year)
  }
  getdata_thongkesolansuyhao_byMonth(month,year) {
    return axios.get(EMPLOYEE_API_BASE_URL_thongkesolansuyhao+"get_data_by_date?month="+month+"&year="+year)
  }
  getdata_thongkesolansuyhao_byDay(day) {
    return axios.get(EMPLOYEE_API_BASE_URL_thongkesolansuyhao+"get_data_by_date?date="+day)
  }
  delete_thongkesolansuyhao_byMonth(month) {
    return axios.get(EMPLOYEE_API_BASE_URL_thongkesolansuyhao+"deletebymonth?month="+month)
  }


  addData(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URL+"insert_data",liurlst)
  }
  addData_TT(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URLs+"insert_data",liurlst)
  }
  addData_binhquan_suyhao(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URLbq+"insert_data",liurlst)
  }
  addData_binhquan_suyhao_vb8362(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URLvb8362+"insert_data",liurlst)
  }
  addData_thongkesolansuyhao(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URL_thongkesolansuyhao+"insert_data",liurlst)
  }
  UpdateData(data) {
    return axios.post(EMPLOYEE_API_BASE_URL+"update_data",data)
  }
DeleteDataTuyenKt(id) {
    return axios.get(EMPLOYEE_API_BASE_URL+"delete?id="+id)
  }



  UpdateData_TT(data) {
    return axios.post(EMPLOYEE_API_BASE_URLs+"update_data",data)
  }
DeleteDataTuyenKt_TT(id) {
    return axios.get(EMPLOYEE_API_BASE_URLs+"delete?id="+id)
  }
}

export default new TuyenKTService();