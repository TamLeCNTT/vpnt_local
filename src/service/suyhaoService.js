import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const EMPLOYEE_API_BASE_URL = "http://localhost:5000/";
const SCHEMA = "suyhao";
class suyhaoService {
  get_rx_power_by_ECS(ip, username, passoword, port) {
    console.log(EMPLOYEE_API_BASE_URL + "get_rx_power_by_ECS?eth_ports=" + port + "&switch_ip=" + ip + "&user=" + username + "&password=" + passoword);
    return axios.get(EMPLOYEE_API_BASE_URL + "get_rx_power_by_ECS?eth_ports=" + port + "&switch_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_SW2224(ip, username, passoword, port) {
    return axios.get(EMPLOYEE_API_BASE_URL + "get_rx_power_by_SW2224?eth_ports=" + port + "&switch_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_A6400(ip, username, passoword, port) {
    return axios.get(EMPLOYEE_API_BASE_URL + "get_rx_power_by_A6400?eth_ports=" + port + "&switch_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_SW2724(ip, username, passoword, port) {
    return axios.get(EMPLOYEE_API_BASE_URL + "get_rx_power_by_SW2724?eth_ports=" + port + "&switch_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  getdata() {
    return axios.get(EMPLOYEE_API_BASE_URL+"get_data")
  }
  getAll() {
    const url = `${SCHEMA}.json`;
    return axiosClient.get(url);
  }
  addData(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URL+"insert_data",liurlst)
  }
    update(data) {
     
    const url = `/${SCHEMA}/${data.id}.json`;
    return axiosClient.patch(url, data.data);
  }
  getbyId(id) {
    
  const url = `/${SCHEMA}/${id}.json`;
  return axiosClient.get(url);
}
  delete(data) {
   
  const url = `/${SCHEMA}/${data.id}.json`;
  return axiosClient.delete(url, data);
}
}

export default new suyhaoService();