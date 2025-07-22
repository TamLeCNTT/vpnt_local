import { db } from "../config/firebase";
import {set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000/tramdidong/";
const SCHEMA = "suyhao";
class TramdidongService {


    getdata() {
        return axios.get(EMPLOYEE_API_BASE_URL + "get_data")
    }
    deletedata(id) {
        return axios.get(EMPLOYEE_API_BASE_URL + "delete?id=" + id)
    }

    addData(liurlst) {
        return axios.post(EMPLOYEE_API_BASE_URL + "insert_data", liurlst)
    }
    UpdateData(data) {
        return axios.post(EMPLOYEE_API_BASE_URL + "update_data", data)
    }

   
}

export default new TramdidongService();