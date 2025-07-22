import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000/mainE/";
const SCHEMA = "suyhao";
class mainEService {

  getdata() {
    return axios.get(EMPLOYEE_API_BASE_URL+"get_data")
  }
  deletedata(id) {
    return axios.get(EMPLOYEE_API_BASE_URL+"delete?id="+id)
  }
  autorun(time) {
    return axios.get(EMPLOYEE_API_BASE_URL+"autorun?time="+time)
  }
  getDatainFile(name) {
    return axios.get(EMPLOYEE_API_BASE_URL+"read_file?name="+name)
  }
 
  writeDatainFile(name,content) {
    return axios.get(EMPLOYEE_API_BASE_URL+"write_file?name="+name+"&content="+content)
  }
  addData(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URL+"insert_data",liurlst)
  }
  UpdateData(data) {
    return axios.post(EMPLOYEE_API_BASE_URL+"update_data",data)
  }
  
  get_rx_power_by_upe(ip, username, passoword) {
    console.log(EMPLOYEE_API_BASE_URL + "suyhao_upe?address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "suyhao_upe?address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
   
}

export default new mainEService();