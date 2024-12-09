import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000/port/";
const SCHEMA = "suyhao";
class portService {
 
  get_status_port_by_ECS(ip, username, passoword, port) {
    console.log(EMPLOYEE_API_BASE_URL + "get_status_port_by_ECS?eth_ports=" + port + "&switch_ip=" + ip + "&username=" + username + "&password=" + passoword);
    return axios.get(EMPLOYEE_API_BASE_URL + "status/ecs?eth_ports=" + port + "&switch_ip=" + ip + "&username=" + username + "&password=" + passoword);
  }
  get_status_port_by_SW2224(ip, username, passoword, port) {
    return axios.get(EMPLOYEE_API_BASE_URL + "status/vft?eth_ports=" + port + "&switch_ip=" + ip + "&username=" + username + "&password=" + passoword);
  }
  get_status_port_by_A6400(ip, username, passoword, port) {
    return axios.get(EMPLOYEE_API_BASE_URL + "status/A6400?eth_ports=" + port + "&switch_ip=" + ip + "&username=" + username + "&password=" + passoword);
  }
  get_status_port_by_SW2724(ip, username, passoword, port) {
    return axios.get(EMPLOYEE_API_BASE_URL + "status/v2724?eth_ports=" + port + "&switch_ip=" + ip + "&username=" + username + "&password=" + passoword);
  }
  getdata() {
    return axios.get(EMPLOYEE_API_BASE_URL+"get_data")
  }
  deletedata(id) {
    return axios.get(EMPLOYEE_API_BASE_URL+"delete?id="+id)
  }
 
  addData(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URL+"insert_data",liurlst)
  }
  UpdateData(data) {
    return axios.post(EMPLOYEE_API_BASE_URL+"update_data",data)
  }
  
  addDataRing(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URL+"ring/insert_data",liurlst)
  }
 
  getdataRing() {
    return axios.get(EMPLOYEE_API_BASE_URL+"ring/get_data")
  }
}

export default new portService();