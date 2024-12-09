
import axios from "axios";
const EMPLOYEE_API_BASE_URL = "http://10.102.20.135:5000";

class suyhao_olt_Service {
  get_rx_power_by_alu(ip, username, passoword, port) {
    console.log(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_alu?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_alu?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_zte(ip, username, passoword, port) {
    console.log(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_zte?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_zte?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_zte_mini(ip, username, passoword, port) {
    console.log(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_zte_mini?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_zte_mini?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_huawei(ip, username, passoword, port) {
    console.log(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_huawei?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_huawei?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_huawei_mini(ip, username, passoword, port) {
    console.log(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_huawei_mini?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_huawei_mini?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_rx_power_by_dasan(ip, username, passoword, port) {
   // console.log(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_dasan?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/suyhao_olt_dasan?port=" + port + "&address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }


  get_degree_by_alu(ip, username, passoword) {
   // console.log(EMPLOYEE_API_BASE_URL + "/olt/degree_olt_alu?address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/degree_olt_alu?address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }
  get_degree_by_zte(ip, username, passoword) {
   // console.log(EMPLOYEE_API_BASE_URL + "/olt/degree_olt_zte?address_ip=" + ip + "&user=" + username + "&password=" + passoword);
   return axios.get(EMPLOYEE_API_BASE_URL + "/olt/degree_olt_zte?address_ip=" + ip + "&user=" + username + "&password=" + passoword);
  }

}

export default new suyhao_olt_Service();