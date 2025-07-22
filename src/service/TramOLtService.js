import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000/tram_olt/";
const ONU_API_BASE_URL = "http://10.102.20.135:5000/onu/";
const MAC_API_BASE_URL = "http://10.102.20.135:5000/mac/";

const SCHEMA = "suyhao";
class TramOLtService {
  // Active_Onu_Gpon_Alu(ip, username, passoword,slid,onuid,vlannet,vlanmytv) {
  //   console.log(EMPLOYEE_API_BASE_URL + "kich_onu_alu?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onuid="+onuid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv);
  //   return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_alu?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onuid="+onuid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv);
  // }
  Active_Onu_Gpon_Alu_820(data) {
    //console.log(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
   //  return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);

    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_alu_820",data);
  }
  Active_Onu_Gpon_Zte_820(data) {
 
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_zte_820",data);
  }






  Active_Onu_Gpon_Alu(data) {
    //console.log(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
   //  return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);

    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_alu",data);
  }
  
  Active_Many_Onu_2_Gpon_Alu(data) {
    //console.log(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
   //  return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);

    return axios.post(EMPLOYEE_API_BASE_URL + "active_two_olt_alu",data);
  }
  Active_Onu_Gpon_Zte(data) {
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_zte",data);
  }
  Active_Onu_Gpon_Zte_mini(data) {
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_zte_mini",data);
  }
  Active_Onu_Gpon_huawei(data) {
    // console.log(EMPLOYEE_API_BASE_URL + "kich_onu_huawei?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onuid="+onuid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&onu="+onu+"&vlanims="+ims+"&slot="+slot+"&port="+port);
    // return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_huawei?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onuid="+onuid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&onu="+onu+"&vlanims="+ims+"&slot="+slot+"&port="+port);
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_huawei",data);
  }
  Active_Onu_Gpon_huawei_mini(data) {
    // console.log(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_mini?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onuid="+onuid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&onu="+onu+"&vlanims="+ims+"&slot="+slot+"&port="+port);
    // return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_mini?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onuid="+onuid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&onu="+onu+"&vlanims="+ims+"&slot="+slot+"&port="+port);
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_mini",data);
  }
  Active_Onu_Gpon_dasan(ip, username, passoword,slid,onu,port) {
    console.log(EMPLOYEE_API_BASE_URL + "kich_onu_dasan?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onu="+onu+"&port="+port);
    return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_dasan?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&onu="+onu+"&port="+port);
  }
  // many 
  Active_Onu_Gpon_Alu_many(data) {
    //console.log(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
   //  return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);

    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_alu_many",data);
  }
  Active_Onu_Gpon_zte_many(data) {
    // console.log(EMPLOYEE_API_BASE_URL + "kich_onu_zte_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
    // return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_zte_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);
  
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_zte_many",data);
  }
  Active_Onu_Gpon_zte_mini_many(data) {
    // console.log(EMPLOYEE_API_BASE_URL + "kich_onu_zte_mini_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
    // return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_zte_mini_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&vlanims="+vlan_ims+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_zte_mini_many",data);
  }
  Active_Onu_Gpon_huawei_many(data) {
    // console.log(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
    // return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&vlanims="+vlan_ims+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_many",data);
  }
  Active_Onu_Gpon_huawei_mini_many(data) {
    // console.log(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_mini_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
    // return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_mini_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&vlanims="+vlan_ims+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_huawei_mini_many",data);
  }
  Active_Onu_Gpon_dasan_many(data) {
    // console.log(EMPLOYEE_API_BASE_URL + "kich_onu_dasan_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&ounend="+onuend);
    // return axios.get(EMPLOYEE_API_BASE_URL + "kich_onu_dasan_many?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slid="+slid+"&vlannet="+vlannet+"&vlanmytv="+vlanmytv+"&vlanims="+vlan_ims+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend+"&checknet="+checkNet+"&checkmytv="+checkMytv+"&checkvoip="+checkVoip);
    return axios.post(EMPLOYEE_API_BASE_URL + "kich_onu_dasan_many",data);
  }

  Show_MAC_Onu_Gpon_Alu(ip, username, passoword,slot,port,onu) {
    return axios.get(MAC_API_BASE_URL + "onu_alu?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }
 
  Show_MAC_Onu_Gpon_Zte(ip, username, passoword,slot,port,onu) {
    return axios.get(MAC_API_BASE_URL + "onu_zte?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }
  Show_MAC_Onu_Gpon_Zte_mini(ip, username, passoword,slot,port,onu) {
    return axios.get(MAC_API_BASE_URL + "onu_zte_mini?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }

  Show_MAC_Onu_Gpon_Huawei(ip, username, passoword,slot,port,onu) {
    return axios.get(MAC_API_BASE_URL + "onu_huawei?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }

  Show_MAC_Onu_Gpon_Dasan(ip, username, passoword,slot,port,onu) {
    return axios.get(MAC_API_BASE_URL + "onu_dasan?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }
  Show_ONU_Onu_Gpon_Alu(ip, username, passoword,slot,port,onu) {
    return axios.get(ONU_API_BASE_URL + "onu_alu?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }
  Show_ONU_Onu_Gpon_Zte(ip, username, passoword,slot,port,onu) {
    return axios.get(ONU_API_BASE_URL + "onu_zte?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }
  Show_ONU_Onu_Gpon_huawei(ip, username, passoword,slot,port,onu) {
    return axios.get(ONU_API_BASE_URL + "onu_huawei?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }
  Show_ONU_Onu_Gpon_dasan(ip, username, passoword,slot,port,onu) {
    return axios.get(ONU_API_BASE_URL + "onu_dasan?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&slot="+slot+"&port="+port+"&onu="+onu);
  }
  Get_MAC_Onu_Gpon_Alu(file_path) {
    return axios.get(MAC_API_BASE_URL + "get-mac-list?name="+file_path);
  }


  // xoa onu
  Delete_Onu_Gpon_Alu(ip, username, passoword,matram,slot,port,onustart,onuend) {
    return axios.get(ONU_API_BASE_URL + "delete_onu_alu?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&matram=" + matram+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend);
  }
 
  Delete_Onu_Gpon_zte(ip, username, passoword,matram,slot,port,onustart,onuend) {
    console.log(ONU_API_BASE_URL + "delete_onu_zte?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&matram=" + matram+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend)
    return axios.get(ONU_API_BASE_URL + "delete_onu_zte?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&matram=" + matram+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend);
  }
  Delete_Onu_Gpon_zte_mini(ip, username, passoword,matram,slot,port,onustart,onuend) {
    return axios.get(ONU_API_BASE_URL + "delete_onu_zte_mini?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&matram=" + matram+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend);
  }
  Delete_Onu_Gpon_huawei(ip, username, passoword,matram,slot,port,onustart,onuend) {
    return axios.get(ONU_API_BASE_URL + "delete_onu_huawei?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&matram=" + matram+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend);
  }
  Delete_Onu_Gpon_dasan(ip, username, passoword,matram,slot,port,onustart,onuend) {
    return axios.get(ONU_API_BASE_URL + "delete_onu_dasan?address_ip=" + ip + "&user=" + username + "&password=" + passoword+"&matram=" + matram+"&slot="+slot+"&port="+port+"&onustart="+onustart+"&onuend="+onuend);
  }
  getdata() {
    return axios.get(EMPLOYEE_API_BASE_URL+"get_data")
  }
  deletedata(id) {
    return axios.get(EMPLOYEE_API_BASE_URL+"delete?id="+id)
  }
  getAll() {
    const url = `${SCHEMA}.json`;
    return axiosClient.get(url);
  }
  addData(liurlst) {
    return axios.post(EMPLOYEE_API_BASE_URL+"insert_data",liurlst)
  }
  UpdateData(data) {
    return axios.post(EMPLOYEE_API_BASE_URL+"update_data",data)
  }
  deletedata(id) {
    return axios.get(EMPLOYEE_API_BASE_URL+"delete?id="+id)
  }
}

export default new TramOLtService();