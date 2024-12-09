from flask import Flask, request, jsonify,send_from_directory
import telnetlib
import re
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime
import pandas as pd
import time 
import schedule
from threading import Thread
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import requests
import threading
# Thông tin kết nối
# Tạo tên file và thư mục
today = datetime.today()
year_dir = today.strftime("%Y")
month_dir = today.strftime("%m")
day_dir = today.strftime("%d")
full_path = os.path.join(year_dir, month_dir, day_dir)
if not os.path.exists(full_path):
    os.makedirs(full_path)
# Kết nối Telnet
app = Flask(__name__)

CORS(app)
host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"


chrome_driver_path = "C:/Users/OMC_BaoCao/chromedriver-win64/chromedriver.exe"

# Hàm để mở trình duyệt và truy cập trang web

import subprocess

def monitor_flask():
    while True:
        # Kiểm tra Flask có đang chạy
        response = os.system("tasklist | findstr python.exe")
        if response != 0:  # Flask không chạy
            print("Restarting Flask...")
            subprocess.Popen(["python", "app.py"])
        time.sleep(60)  # Kiểm tra mỗi phút
def truy_cap_trang_web():
    try:
        # Tạo đối tượng Service cho ChromeDriver
        service = Service(executable_path=chrome_driver_path)

        # Khởi động trình duyệt Chrome
        browser = webdriver.Chrome(service=service)

        # Mở trang web
        browser.get(
            "http://localhost:3000/suyhao/mainE")
        time.sleep(7200)
        print("ok")

    except Exception as e:
        print(f"Lỗi khi truy cập trang web: {e}")

# Hàm để lên lịch chạy với thời gian truyền vào


def schedule_task(time_str):
    schedule.clear()
    # Lập lịch chạy tác vụ vào thời gian được truyền vào
    # schedule.every(2).minutes.do(truy_cap_trang_web)
    schedule.every().day.at(time_str).do(truy_cap_trang_web).tag('daily_task')
    while True:
        schedule.run_pending()
        time.sleep(60)  # Chờ 60 giây trước khi kiểm tra lịch lại

# Route để truyền giờ chạy thông qua phương thức GET


@app.route('/mainE/autorun', methods=['GET'])
def autorun():
    # Lấy giá trị time từ query string
    time_run = request.args.get('time')

    # Kiểm tra xem có truyền giá trị 'time' hay không
    if time_run:
        try:
            # Bắt đầu lập lịch dựa trên giờ truyền vào
            thread = Thread(target=schedule_task, args=(time_run,))
            thread.start()

            return jsonify({"message": f"Lịch trình đã được lên vào {time_run} mỗi ngày","status":200}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Thiếu tham số 'time'"}), 400

@app.route('/mainE/read_file', methods=['GET'])
def read_file():
    # Lấy tên file từ query parameter trong URL
    file_name = request.args.get('name')
    
    try:
        # Mở và đọc nội dung tệp
        with open(file_name, 'r') as file:
            content = file.read()
        return  jsonify({"data":content})
    except FileNotFoundError:
        return "File not found", 404

@app.route('/mainE/write_file', methods=['GET'])
def write_file():
    # Lấy tên file và nội dung muốn ghi từ query parameter
    file_name = request.args.get('name')
    content = request.args.get('content')
    
    try:
        # Ghi đè nội dung vào file
        with open(file_name, 'w') as file:
            file.write(content)
        return f"Successfully wrote to {file_name}"
    except Exception as e:
        return str(e), 500

def insert_data(data_list):
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
         host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO suyhao (id, diachi, username, password, tenthietbi, loai, port,tenthuongmai,ring)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)
                """
                values = (data['id'], data['diachi'], data['username'],
                          data['password'], data['tenthietbi'], data['loai'], data['port'],data['tenthuongmai'],data['ring'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'mytable'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


def get_data():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
     host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM suyhao")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/update_data', methods=['POST'])
def update_data():
    data = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
     host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Cập nhật dữ liệu trong bảng
            sql = """
            UPDATE suyhao
            SET diachi = %s, username = %s, password = %s, tenthietbi = %s, tenthuongmai = %s,loai = %s, port = %s, ring = %s
            WHERE id = %s
            """
            values = (data['diachi'], data['username'], data['password'],
                      data['tenthietbi'],  data['tenthuongmai'],data['loai'], data['port'], data['ring'], data['id'])
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được cập nhật trong bảng 'suyhao'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc cập nhật dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/delete', methods=['GET'])
def delete_data():
    data_id = request.args.get('id')
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
      host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Xóa dữ liệu từ bảng
            sql = "DELETE FROM suyhao WHERE id = %s"
            values = (data_id,)
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được xóa khỏi bảng 'suyhao'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc xóa dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/get_data', methods=['GET'])
def get_data_api():
    data, status_code = get_data()
    return jsonify(data), status_code


@app.route('/insert_data', methods=['POST'])
def insert_data_api():

    data_list = request.json
  
    message, status_code = insert_data(data_list)
    return jsonify({"message": message}), status_code


# -----------------------------------Portup-------------------


@app.route('/port/insert_data', methods=['POST'])
def insert_data_port_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
             host="localhost",
            user="root",
            password="Dhtthost@3",
            database="vnpt",
            auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO port (matram,switch,port,username,password,ip,loai)
                VALUES ( %s, %s, %s, %s, %s, %s,%s)
                """
                values = (data['matram'], data['switch'],
                          data['port'], data['username'], data['password'], data['ip'], data['loai'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'port'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/port/get_data', methods=['GET'])
def get_data_port_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Dhtthost@3",
            database="vnpt",
            auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM port")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/port/status/A6400', methods=['GET'])
def get_port_status_by_A6400():
    # Lấy tham số từ query string
    log_message = ""
    switch_ip = request.args.get('switch_ip')
    eth_ports = request.args.get('eth_ports')
    user = request.args.get('username')
    password = request.args.get('password')

    if not switch_ip or not eth_ports:
        return jsonify({'error': 'switch_ip and eth_port are required'})
    try:
        # Thông tin kết nối Telnet
        HOST = switch_ip
        # Kết nối Telnet
        tn = telnetlib.Telnet(HOST)
        # Đăng nhập
        tn.read_until(b"login : ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword : ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch
        tn.read_until(b"#")

        list = []
        with open("portUp.txt", "wb") as f:

            cmd = f" show interfaces port\n"
            tn.write(cmd.encode('ascii'))
            tn.read_until(b"#")
            out = tn.read_until(b"#")
            f.write(out)


# Trích xuất giá trị từ các dòng 1, 3, và 4
            for eth_port in eth_ports.split(','):
                link_status = ""
                lines = out.decode('ascii')

                pattern = rf"^\s*1/{eth_port}\s*(\S+)\s*(\S+)"
                match = re.search(pattern, lines, re.MULTILINE)

                if match:
                    # Cột "Link Status" là cột thứ hai trong mẫu tìm kiếm
                    link_status = match.group(2)

                list.append(
                    {"port": f"{eth_port}", "status": f"{link_status}"})

        log_message = f"{switch_ip} kết nối thành công"
        return list
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/port/status/vft', methods=['GET'])
def get_port_status_by_vft():
    # Lấy tham số từ query string
    log_message = ""
    switch_ip = request.args.get('switch_ip')
    eth_ports = request.args.get('eth_ports')
    user = request.args.get('username')
    password = request.args.get('password')
    if not switch_ip or not eth_ports:
        return jsonify({'error': 'switch_ip and eth_port are required'})
    try:
        # Thông tin kết nối Telnet
        HOST = switch_ip
        # Kết nối Telnet
        tn = telnetlib.Telnet(HOST)
        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b" terminal length 0\n")
        tn.read_until(b"#")
        list = []
        with open("portUp.txt", "wb") as f:

            cmd = f"show port status {eth_ports}\n"
            tn.write(cmd.encode('ascii'))
            out = tn.read_until(b"#")
            f.write(out)


# Trích xuất giá trị từ các dòng 1, 3, và 4
            for eth_port in eth_ports.split(','):
                link_status = ""
                lines = out.decode('ascii')

                pattern = rf"^\s*{eth_port}\s*(\S+)\s*(\S+)\s*(\S+)"
                match = re.search(pattern, lines, re.MULTILINE)

                if match:
                    # Cột "Link Status" là cột thứ hai trong mẫu tìm kiếm
                    link_status = match.group(3)

                list.append(
                    {"port": f"{eth_port}", "status": f"{link_status}"})

        log_message = f"{switch_ip} kết nối thành công"
        return list
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/port/status/v2724', methods=['GET'])
def get_port_status_by_v2724():
    # Lấy tham số từ query string
    log_message = ""
    switch_ip = request.args.get('switch_ip')
    eth_ports = request.args.get('eth_ports')
    user = request.args.get('username')
    password = request.args.get('password')
    if not switch_ip or not eth_ports:
        return jsonify({'error': 'switch_ip and eth_port are required'})
    try:
        # Thông tin kết nối Telnet
        HOST = switch_ip
        # Kết nối Telnet
        tn = telnetlib.Telnet(HOST)
        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b" terminal length 0\n")
        tn.read_until(b"#")
        list = []
        with open("portUp.txt", "wb") as f:

            cmd = f"show interface brief\n"
            tn.write(cmd.encode('ascii'))
            tn.read_until(b"#")
            out = tn.read_until(b"#")
            f.write(out)


# Trích xuất giá trị từ các dòng 1, 3, và 4
            for eth_port in eth_ports.split(','):
                link_status = ""
                lines = out.decode('ascii')

                pattern = rf"^\s*eth0/{eth_port}\s+\S+\s+\S+\s+\S+\s+(\S+)"
                match = re.search(pattern, lines, re.MULTILINE)

                if match:
                    # Cột "Link Status" là cột thứ hai trong mẫu tìm kiếm
                    link_status = match.group(1)

                list.append(
                    {"port": f"{eth_port}", "status": f"{link_status}"})

        log_message = f"{switch_ip} kết nối thành công"
        return list
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")




# ---------------------------------- onu---------------------
# ---------------------------------------------------------
# xoa onu


@app.route('/onu/delete_onu_alu', methods=['GET'])
def delete_alu():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    matram = request.args.get('matram')
    
    # return jsonify({'status':password})
    # Thông tin kết nối
    try:
    # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Danh sách để lưu giá trị subslocid
        subslocid_list = []

        # Gửi lệnh đến switch để lấy thông tin transceiver và thực hiện các lệnh
        tn.read_until(b"#")
        
        onu=int(onustart)
        with open("outputDelete.txt", "wb") as f:
            while onu <= int(onuend):
                onu_str = str(onu) if onu >= 10 else "0" + str(onu)

                # Lệnh info để lấy thông tin ONU trước khi xoá
                info_command = f"info configure equipment ont interface 1/1/{slot}/{port}/{onu_str}\n"
                tn.write(info_command.encode('ascii'))
                info_output = b""
                while True:
                    part = tn.read_until(b"#")
                    info_output += part
                    # Kiểm tra nếu gặp dấu nhắc cuối cùng (có số trước dấu #)
                    if re.search(r'\d+#$', part.decode('ascii').strip()):
                        break

                info_output_str = info_output.decode('ascii')


                # Ghi lệnh và kết quả vào file

                f.write(info_command.encode('ascii'))
                f.write(info_output_str.encode('ascii') + b"\n")
                
                # Tìm giá trị subslocid (ZVTH221140)
                if(info_output_str!=None):
                    onu += 1     
                    match = re.search(r'subslocid\s+(\S+)', info_output_str)
                    if match:
                        subslocid_value = match.group(1)
                    else:
                        subslocid_value = f"{matram}{slot}{port}{onu_str}"

                    # Lưu ONU và subslocid vào danh sách
                    subslocid_list.append(subslocid_value)
                    f.write(f"subslocid:{onu_str} {subslocid_value}\n".encode('ascii'))

                    # Thêm dòng trống để dễ đọc
                    f.write(b"\n\n")
                commands = [
                    f"configure equipment ont interface 1/1/" +
                    str(slot) + "/" + str(port) + "/" +
                    str(onu_str) + " admin-state down",
                    f"configure equipment ont no interface  1/1/" +
                    str(slot) + "/" + str(port) + "/" + str(onu_str),
                    f"exit all"

                ]

                # # Send each command and write the output to the file
                for command in commands:
                        # tn.write(command.encode('ascii') + b"\n")
                        # output = tn.read_until(b"#")
                    # # Add new lines for better readability in the output file

                        f.write(command.encode('ascii') + b"\n")
            # # Add new lines for better readability in the output file
                f.write(b"\n\n")
                # Tăng giá trị ONU lên 1 cho vòng lặp tiếp theo
                  
        tn.close()

          

        log_message = f"kết nối ok"
        return jsonify({'status': "ok", 'subslocid_list': subslocid_list})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")
   


@app.route('/onu/delete_onu_zte', methods=['GET'])
def delete_zte():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    matram = request.args.get('matram')
    # Thông tin kết nối
  
    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
      
        with open("outputDelete.txt", "wb") as f:
            subslocid_list=[]
            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure terminal",
                    f"interface gpon-olt_1/{slot}/{port}",
                    f"no onu {onu}",
                    f"end"


                ]
              
                info_command = f"show gpon onu baseinfo gpon-olt_1/{slot}/{port} {onu}\n"
                tn.write(info_command.encode('ascii'))
                info_output = tn.read_until(b"#").decode('ascii')
                
                # Ghi lệnh và kết quả vào file
                f.write(info_command.encode('ascii'))
                f.write(info_output.encode('ascii') + b"\n")
                
                # Tìm giá trị subslocid (ZVTH221140)
                pw_value = ""
                number_value = ""
                subslocid_value=""

                # Tìm PW và số tương ứng
                for line in info_output.splitlines():
                    # Tìm PW:
                    pw_match = re.search(r'PW:(\S+)', line)
                    if pw_match:
                        pw_value = pw_match.group(1)
                    
                    # Tìm số ở dòng tiếp theo
                    number_match = re.search(r'\b(\d{6})\b', line)
                    if number_match:
                        number_value = number_match.group(1)

                # Ghép hai giá trị lại
                if pw_value and number_value:
                    subslocid_value = pw_value + number_value
                if (len(subslocid_value)<10): 
                    subslocid_value=f"{matram}{slot}{port}{onu}"
                # Lưu ONU và subslocid vào danh sách
                subslocid_list.append(subslocid_value)
                f.write(f"subslocid:{onu} {subslocid_value}\n".encode('ascii'))

                # # Send each command and write the output to the file
                for command in commands:
                        # tn.write(command.encode('ascii') + b"\n")
                        # output = tn.read_until(b"#")
                    # # Add new lines for better readability in the output file

                        f.write(command.encode('ascii') + b"\n")
            # # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({'status': "ok", 'subslocid_list': subslocid_list})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/onu/delete_onu_zte_mini', methods=['GET'])
def delete_zte_mini():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    matram = request.args.get('matram')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        with open("outputDelete.txt", "wb") as f:
            subslocid_list=[]
            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure terminal",
                    f"interface gpon_olt-1/{slot}/{port}",
                    f"no onu {onu}",
                    f"end"


                ]
                info_command = f"show gpon onu baseinfo gpon_olt-1/{slot}/{port} {onu}\n"
                tn.write(info_command.encode('ascii'))
                info_output = tn.read_until(b"#").decode('ascii')
                
                # Ghi lệnh và kết quả vào file
                f.write(info_command.encode('ascii'))
                f.write(info_output.encode('ascii') + b"\n")
                
                # Tìm giá trị subslocid (ZVTH221140)
                match = re.search(r'PW:(\S+).*?\n\s+(\d+)', info_output)
                if match:
                    subslocid_value = match.group(1)+""+match.group(2)
                else:
                    match = re.search(r'PW:(\S+)', info_output)
                    if match:
                        subslocid_value = match.group(1)
                    else:
                        subslocid_value = f"{matram}{port}{onu}"

                # Lưu ONU và subslocid vào danh sách
                subslocid_list.append(subslocid_value)
                f.write(f"subslocid:{onu} {subslocid_value}\n".encode('ascii'))
                # # Send each command and write the output to the file
                for command in commands:
                        # tn.write(command.encode('ascii') + b"\n")
                        # output = tn.read_until(b"#")
                    # # Add new lines for better readability in the output file

                        f.write(command.encode('ascii') + b"\n")
            # # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({'status': "ok", 'subslocid_list': subslocid_list})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/onu/delete_onu_huawei', methods=['GET'])
def delete_huawai():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    matram = request.args.get('matram')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")
        subslocid_list=[]
        with open("outputDelete.txt", "wb") as f:
            tn.write(f"scroll 512 \n".encode('ascii'))
            tn.read_until(b"#")
            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"interface gpon 0/{slot}",
                    f"ont delete {port} {onu}",
                    f"quit",

                ]
               
                tn.write(f"config \n".encode('ascii'))
                tn.read_until(b"#")
                tn.write(f"interface gpon 0/{slot} \n".encode('ascii'))
                tn.read_until(b"#")


                info_command = f"display ont info  {port} {onu} \n\n"
                tn.write(info_command.encode('ascii'))
                info_output = tn.read_until(b"#").decode('ascii')
                # Ghi lệnh và kết quả vào file
                f.write(info_command.encode('ascii'))
                f.write(info_output.encode('ascii') + b"\n")
                tn.write(f"quit \n".encode('ascii'))
                tn.read_until(b"#")
                tn.write(f"quit \n".encode('ascii'))
                tn.read_until(b"#")
                match = re.search(r'PW:(\S+).*?\n\s+(\d+)', info_output)
                if match:
                    subslocid_value = match.group(1)+""+match.group(2)
                else:
                    match = re.search(r'PW:(\S+)', info_output)
                    if match:
                        subslocid_value = match.group(1)
                    else:
                        subslocid_value = f"{matram}{slot}{port}{onu}"

                # Lưu ONU và subslocid vào danh sách
                subslocid_list.append(subslocid_value)
                f.write(f"subslocid:{onu} {subslocid_value}\n".encode('ascii'))
                tn.write(b"config\n")
                tn.read_until(b"#")
                tn.write(
                        f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
                tn.read_until(b"]:")
                tn.write(b"y\n")
                tn.read_until(b"#")

                f.write(b"config\n")

                f.write(
                    f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))

                f.write(b"y\n")
                # Send each command and write the output to the file

                for command in commands:

                        # tn.write(command.encode('ascii') + b"\n")
                        # output = tn.read_until(b"#")
                    # # Add new lines for better readability in the output file

                        f.write(command.encode('ascii') + b"\n")

            # # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({'status': "ok", 'subslocid_list': subslocid_list})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/onu/delete_onu_dasan', methods=['GET'])
def delete_dasan():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    slot = request.args.get('slot')
    port = request.args.get('port')
    onustart = request.args.get('onustart')
    onuend = request.args.get('onuend')
    matram = request.args.get('matram')
   
    log_message=""
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        # Đăng nhập
        tn.read_until(b"login:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")
        
        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")
        with open("outputDelete.txt", "wb") as f:
            commands = [
                    f"conf t",
                    f"gpon",
                    f"gpon-olt {port}",
                     f"show onu active",

                ]
            tn.write(" terminal length 0 \n".encode('ascii'))
            out=tn.read_until(b"#")
            f.write(out)
            tn.write("conf t \n".encode('ascii'))
            out=tn.read_until(b"#")
            f.write(out)
           
            tn.write(f"gpon \n".encode('ascii'))
            out=tn.read_until(b"#")
            f.write(out)
            tn.write(f"gpon-olt {port} \n".encode('ascii'))
            out=tn.read_until(b"#")
            f.write(out)
            
            tn.write(f"show onu active \n".encode('ascii'))
            out=tn.read_until(b"#")
            
            matches = re.findall(r'\|\s+(\d+)\s+\|.*\|\s+([A-Z0-9]+)\s*\n', out.decode('ascii'))
            i=1
            subslocid_list=[]
            item=''
            for onu, password in matches:
                f.write(onu.encode('ascii')+" ".encode('ascii')+password.encode('ascii')+'\n'.encode('ascii'))
                if (int(onu)>=int(onustart) and int(onu)<=int(onuend)):
                    for j in range(int(onustart), int(onu)):
                        if (j<10):
                             onus="0"+str(j)
                        else:
                            onus=j
                       
                        item=f"{matram}{slot}{port}{onus}"
                        subslocid_list.append(item)
                    subslocid_list.append(password)
                    onustart=int(onu)+1
                    # if(i==int(onu)):
                    #     item=password
                    #     subslocid_list.append(item)
                    #     i=i+1
                    # else:
                    #     if(i<int(onu)):
                    #        start=i
                    #        for j in range(start, int(onu)+1):
                    #                 if (j<10):
                    #                     onus="0"+str(j)
                    #                 else:
                    #                     onus=j
                                    
                    #                 print(i)
                    #                 item=f"{matram}{slot}{port}{onus}"
                    #                 i=i+1
                    #                 subslocid_list.append(item)

           
            if (int(onustart<=int(onuend))):

                 for j in range(int(onustart), int(onuend)+1):
                        if (j<10):
                             onus="0"+str(j)
                        else:
                            onus=j
                
                        item=f"{matram}{slot}{port}{onus}"
                        subslocid_list.append(item)
            # i=1
            # subslocid_list=[]
            # for password in passwords:
            #     if (i>=int(onustart) and i<=int(onuend)):
            #      f.write(password.encode('ascii')+'\n'.encode('ascii'))
            #      subslocid_list.append(password)
            #      i=i+1

            # for onu in range(int(onustart), int(onuend) + 1):
            #     if (onu < 10):
            #         onu = "0"+str(onu)
            #     commands = [
            #         f"conf t",
            #         f"gpon",
            #         f"gpon-olt {port}",
            #         f"no onu {onu}",
            #         f"end",

            #     ]

            #     # # Send each command and write the output to the file
            #     for command in commands:
            #             # tn.write(command.encode('ascii') + b"\n")
            #             # output = tn.read_until(b"#")
            #         # # Add new lines for better readability in the output file

            #             f.write(command.encode('ascii') + b"\n")
            # # # Add new lines for better readability in the output file
            #     f.write(b"\n\n")

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({'status': "ok", 'subslocid_list': subslocid_list})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


# ---------------------------------------------------------
# insrt olt



@app.route('/tram_olt/insert_data', methods=['POST'])
def insert_data_tram_olt_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
       host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
,
             auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO tram_olt (matram,tentram,his,mytv,ims,loai,username,password,ip,port,tenhethong)
                VALUES ( %s, %s, %s, %s,%s, %s, %s, %s, %s, %s,%s)
                """
                values = (data['matram'], data['tentram'],
                          data['his'], data['mytv'], data['ims'], data['loai'], data['username'], data['password'], data['ip'], data['port'],data['tenhethong'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'mytable'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/tram_olt/get_data', methods=['GET'])
def get_data_tram_olt_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
      host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt",

              auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM tram_olt")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")



@app.route('/tram_olt/update_data', methods=['POST'])
def update_tram_olt_data():
    data = request.json
    
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
     host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Cập nhật dữ liệu trong bảng
            sql = """
            UPDATE tram_olt
            SET matram = %s, tentram = %s, his = %s, mytv = %s, ims = %s,loai = %s, username = %s, password = %s, ip = %s, port = %s, tenhethong = %s
            WHERE id = %s
            """
            values = (data['matram'], data['tentram'],
                          data['his'], data['mytv'], data['ims'], data['loai'], data['username'], data['password'], data['ip'], data['port'],data['tenhethong'], data['id'])
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được cập nhật trong bảng 'suyhao'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc cập nhật dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")



@app.route('/tram_olt/delete', methods=['GET'])
def delete_tram_olt_data():
    data_id = request.args.get('id')
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
      host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Xóa dữ liệu từ bảng
            sql = "DELETE FROM tram_olt WHERE id = %s"
            values = (data_id,)
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được xóa khỏi bảng 'tram_olt'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc xóa dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


# --------------------------------------------------------------
# Data Ring


@app.route('/port/ring/insert_data', methods=['POST'])
def insert_data_ring_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Dhtthost@3",
            database="vnpt",
             auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO ring (ten,donvi)
                VALUES ( %s, %s)
                """
                values = (data['ten'], data['donvi']
                          )
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'mytable'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/port/ring/get_data', methods=['GET'])
def get_data_ring_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Dhtthost@3",
            database="vnpt",
            auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM ring")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")




# kích onu
# -----------------------------------------------------------------------#
@app.route('/download')
def download_file():
    # Giả sử file của bạn tên là 'output.txt' và nằm cùng thư mục
    return send_from_directory(directory='.', path='output_many.txt', as_attachment=True)
@app.route('/tram_olt/kich_onu_alu_many', methods=['POST'])
def get_active_alu_many():
    data = request.json
    # return jsonify({'status': data})
    address_ip = data['tramolt']['ip']
    user =  str(data['tramolt']['username']).encode('ascii')
    password =  str(data['tramolt']['password']).encode('ascii')
    slid =data['list_slid']
    vlan_net = data['tramolt']['his']
    vlan_mytv = data['tramolt']['mytv']
    slot =data['slot']
    port =data['portpon']
    onustart = data['onu_old']
    onuend = data['onu_new']
    checknet = data['checkNet']
    checkmytv = data['checkMytv']
    checkvoip= data['checkVoip']
   
    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        
        tn.read_until(b"login: ")
        tn.write(user + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        i=0
        with open("./output_many.txt", "wb") as f:
            for onu in range(int(onustart), int(onuend) + 1):
                if (onu < 10):
                    onu = "0"+str(onu)
                i=i+1
                commands = [
                    f"configure equipment ont interface 1/1/{slot}/{port}/{onu} admin-state down",
                    f"configure equipment ont no interface 1/1/{slot}/{port}/{onu}",
                    f"exit all",
                    f"configure equipment ont interface 1/1/{slot}/{port}/{onu} sw-ver-pland disabled sernum ALCL:00000000 subslocid {slid[i-1]} sw-dnload-version disabled plnd-var SIP enable-aes enable voip-allowed enable",
                    f"configure equipment ont interface 1/1/{slot}/{port}/{onu} admin-state up",
                    f"configure equipment ont slot 1/1/{slot}/{port}/{onu}/14 planned-card-type veip plndnumdataports 1 plndnumvoiceports 0 port-type uni admin-state up",
                    f"configure interface port uni:1/1/{slot}/{port}/{onu}/14/1 admin-up",
                    f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 max-unicast-mac 10",
                    f"exit all",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 queue 0 shaper-profile name:600M_HSI_Down",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 upstream-queue 0 bandwidth-profile name:600M_HSI_Up bandwidth-sharing uni-sharing",
                  
                    f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 4000 tag single-tagged network-vlan 4001 vlan-scope local",
                    f"exit all",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 queue 4 shaper-profile name:12M_IPTV_Down",
                    f"configure qos interface 1/1/{slot}/{port}/{onu}/14/1 upstream-queue 4 bandwidth-profile name:18M_IPTV_Up bandwidth-sharing uni-sharing",

                    f"configure igmp channel vlan:1/1/{slot}/{port}/{onu}/14/1:12 max-num-group 254",
                    f"exit all",

                ]
            
                if (checknet==True):
                 
                   commands.insert(11,  f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 11 tag single-tagged network-vlan {vlan_net} vlan-scope local")
                if (checkmytv==True and checknet==True):
                    commands.insert(16, f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 12 tag single-tagged network-vlan {vlan_mytv} vlan-scope local")
                if (checkmytv==True and checknet!=True):
                    commands.insert(15, f"configure bridge port 1/1/{slot}/{port}/{onu}/14/1 vlan-id 12 tag single-tagged network-vlan {vlan_mytv} vlan-scope local")
                              # # Send each command and write the output to the file
                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")
                    
                    out= tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")
                    f.write(out + b"\n")
                # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_zte_many', methods=['POST'])
def get_active_zte_many():
    # Lấy tham số từ query parameters
    data = request.json
    # return jsonify({'status': data})
    address_ip = data['tramolt']['ip']
    user =  str(data['tramolt']['username']).encode('ascii')
    password =  str(data['tramolt']['password']).encode('ascii')
    slid =data['list_slid']
    vlan_net = data['tramolt']['his']
    vlan_mytv = data['tramolt']['mytv']
    slot =data['slot']
    port =data['portpon']
    onustart = data['onu_old']
    onuend = data['onu_new']
    checknet = data['checkNet']
    checkmytv = data['checkMytv']
    checkvoip= data['checkVoip']
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        i=0
        tn.read_until(b"#")
        with open("output_many.txt", "wb") as f:
            for onu in range(int(onustart), int(onuend) + 1):
                i=i+1
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure terminal",
                    f"interface gpon-olt_1/{slot}/{port}",
                    f"no onu {onu}",
                    f"end",
                    f"configure t",
                    f"interface gpon-olt_1/{slot}/{port}",
                    f"onu {onu} type iGate-GW020 pw {slid[i-1]}",
                    f"end",
                    f"configure t",
                    f"interface gpon-onu_1/{slot}/{port}:{onu}",
                    f"sn-bind disable",
                    f"tcont 1 name HSI profile T5_600M",
                    f"tcont 2 name IPTV profile T2_512K",
                    f"gemport 1 name HSI tcont 1",
                    f"gemport 1 traffic-limit upstream G_600M downstream G_600M",
                    f"switchport mode hybrid vport 1",
                    f"gemport 2 name IPTV tcont 2",
                    f"gemport 2 traffic-limit upstream G_IPTV downstream G_18M",
                    f"switchport mode hybrid vport 2",
                  
                   
                    f"port-identification format VNPT vport 1",
                    f"pppoe-intermediate-agent enable vport 1",
                    f"pppoe-intermediate-agent trust true replace vport 1",
                    f"tcont 6 name ONT profile T4_100M",
                    f"gemport 6 name ONT tcont 6",
                    f"gemport 6 traffic-limit upstream G_24M downstream G_24M",
                    f"switchport mode hybrid vport 6",
                    f"service-port 6 vport 6 user-vlan 4000 vlan 4001",
                    f"end",
                    f"configure t",
                    f"pon-onu-mng gpon-onu_1/{slot}/{port}:{onu}",
                    f"service 1 gemport 1 vlan 11",
                    f"service 2 gemport 2 vlan 12",
                    f"service 6 gemport 6 vlan 4000",
                    f"mvlan 12",
                    f"wan-ip 1 mode pppoe vlan-profile HSI_PPPOE host 1",
                    f"wan 1 service internet host 1",
                    f"end",
                    f"configure t",
                    f"igmp mvlan 99 receive-port gpon-onu_1/{slot}/{port}:{onu} vport 2",
                    f"end"

                ]
                if (checknet==True):
                 
                   commands.insert(19,    f"service-port 1 vport 1 user-vlan 11 vlan {vlan_net}")
                if (checkmytv==True and checknet==True):
                    commands.insert(20,  f"service-port 2 vport 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkmytv==True and checknet!=True):
                    commands.insert(19,  f"service-port 2 vport 2 user-vlan 12 vlan {vlan_mytv}")
                              # # Send each command and write the output to the file
                # # Send each command and write the output to the file
                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")
                    out= tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")
                    f.write(out + b"\n")
                # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")



@app.route('/tram_olt/kich_onu_zte_mini_many', methods=['POST'])
def get_active_zte_mini_many():
    # Lấy tham số từ query parameters
    data = request.json
    # return jsonify({'status': data})
    address_ip = data['tramolt']['ip']
    user =  str(data['tramolt']['username']).encode('ascii')
    password =  str(data['tramolt']['password']).encode('ascii')
    slid =data['list_slid']
    vlan_net = data['tramolt']['his']
    vlan_mytv = data['tramolt']['mytv']
    vlan_ims=data['tramolt']['ims']
    slot =data['slot']
    port =data['portpon']
    onustart = data['onu_old']
    onuend = data['onu_new']
    checknet = data['checkNet']
    checkmytv = data['checkMytv']
    checkvoip= data['checkVoip']
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        i=0
        with open("output_many.txt", "wb") as f:

            for onu in range(int(onustart), int(onuend) + 1):
                i=i+1
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure terminal",
                    f"interface gpon_olt-1/3/{port}",
                    f"no onu {onu}",
                    f"end",
                    f"configure terminal",
                    f"interface gpon_olt-1/3/{port}",
                    f"onu {onu} type GW040-H pw {slid[i-1]}",
                    f"exit",
                    f"interface gpon_onu-1/3/{port}:{onu}",
                    f"vport-mode manual",
                    f"tcont 1 name HSI profile T4_600M",
                    f"tcont 2 name IPTV profile T2_512K",
                    f"tcont 3 name VOIP profile T3_10M",
                    f"gemport 3 name VOIP tcont 3",
                    f"gemport 1 name HSI tcont 1",
                    f"gemport 2 name IPTV tcont 2",
                    f"tcont 6 name onu profile T3_10M",
                    f"gemport 6 name onu tcont 6",
                    f"vport 1 map-type vlan",
                    f"vport-map 1 6 vlan 4001",
                    f"vport 1 map-type vlan",
                    f"vport-map 1 1 vlan 11",
                    f"vport-map 1 2 vlan 12",
                    f"vport-map 1 3 vlan 13",
                    f"exit",
                    f"interface vport-1/3/{port}.{onu}:1",
                   
                   
                   
                    f"service-port 6 user-vlan 4000 vlan 4001",
                    f"exit",
                    f"pon-onu-mng gpon_onu-1/3/{port}:{onu}",
                    f"dhcp-ip ethuni eth_0/4 from-internet",
                    f"service 6 gemport 6 vlan 4000",
                    f"mvlan 12",
                    f"mvlan tag eth_0/4 strip ",
                    f"service 1 gemport 1 vlan 11",
                    f"service 2 gemport 2 vlan 12",
                    f"service 3 gemport 3 vlan 13",
                    f"voip protocol sip",
                    f"voip-ip ipv4 mode dhcp vlan-profile VOIP host 2",
                    f"wan-ip 1 ipv4 mode pppoe username ftthttbang_hh password vnn123456 vlan-profile HSI host 1",
                    f"wan 1 service internet host 1",
                    f"vlan port eth_0/4 mode tag vlan 12",
                    f"exit",
                    f"igmp mvlan 99",
                    f"receive-port vport-1/3/{port}.{onu}:1",
                    f"end"

                ]
                if (checknet==True):
                 
                   commands.insert(26,    f"service-port 1 user-vlan 11 vlan {vlan_net}")
                if (checkmytv==True and checknet==True):
                    commands.insert(27,   f"service-port 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkmytv==True and checknet!=True):
                    commands.insert(26,   f"service-port 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkvoip==True and checkmytv==True and checknet==True):
                    commands.insert(28,   f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                else:
                    if (checkvoip==True and (checkmytv==True or checknet==True)):
                        commands.insert(27,    f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                if (checkvoip==True and (checkmytv!=True and checknet!=True)):
                    commands.insert(26,    f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                # # Send each command and write the output to the file
                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")
                    out= tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")
                    f.write(out + b"\n")
                # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_huawei_many', methods=['POST'])
def get_active_huawei_many():
    # Lấy tham số từ query parameters
   # Lấy tham số từ query parameters
    data = request.json
    # return jsonify({'status': data})
    address_ip = data['tramolt']['ip']
    user =  str(data['tramolt']['username']).encode('ascii')
    password =  str(data['tramolt']['password']).encode('ascii')
    slid =data['list_slid']
    vlan_net = data['tramolt']['his']
    vlan_mytv = data['tramolt']['mytv']
    vlan_ims=data['tramolt']['ims']
    slot =data['slot']
    port =data['portpon']
    onustart = data['onu_old']
    onuend = data['onu_new']
    checknet = data['checkNet']
    checkmytv = data['checkMytv']
    checkvoip= data['checkVoip']
    # Thông tin kết nối
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")

        with open("output_many.txt", "wb") as f:
            i=0
            for onu in range(int(onustart), int(onuend) + 1):
                i=i+1
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"interface gpon 0/{slot}",
                    f"ont delete {port} {onu}",
                    f"ont add {port} {onu} password-auth {slid[i-1]} always-on omci ont-lineprofile-name HSI_IPTV_VOIP_VPN ont-srvprofile-name ONT_020\n\n",
                    f"quit",
                    
                  
                   
                ]
                if (checknet==True):
                    commands.append( f"service-port vlan {vlan_net} gpon 0/{slot}/{port} ont {onu} gemport 1 multi-service user-vlan 11 inbound traffic-table name HSI outbound traffic-table name HSI"
                  )
                if (checkmytv==True):
                    commands.append(f"service-port vlan {vlan_mytv} gpon 0/{slot}/{port}  ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down")
                    commands.append(f"btv")
                    commands.append(f"igmp user add smart-vlan {vlan_mytv}\n\n")

                    commands.append(f"multicast-vlan 99\n\n")
                    commands.append(f"igmp multicast-vlan member smart-vlan {vlan_mytv}\n\n")
                    commands.append(f"quit")
                if (checkvoip==True):
                    commands.append(f"service-port vlan {vlan_ims}  gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                
                commands.append( f"service-port vlan 4001 gpon 0/{slot}/{port} ont {onu} gemport 5 multi-service user-vlan 4000 inbound traffic-table name GNMS outbound traffic-table name GNMS"
                   )
                commands.append( f"quit")
                tn.write(b"config\n")
                tn.read_until(b"#")
                tn.write(
                    f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
                tn.read_until(b"]:")
                tn.write(b"y\n")
                tn.read_until(b"#")
                f.write(b"config\n")
                f.write(
                    f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
                f.write(b"y\n")

                # # Send each command and write the output to the file

                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")

                 
                    out= tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")
                    f.write(out + b"\n")
                  

                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_huawei_mini_many', methods=['POST'])
def get_active_huawei_mini_many():
     # Lấy tham số từ query parameters
    data = request.json
    # return jsonify({'status': data})
    address_ip = data['tramolt']['ip']
    user =  str(data['tramolt']['username']).encode('ascii')
    password =  str(data['tramolt']['password']).encode('ascii')
    slid =data['list_slid']
    vlan_net = data['tramolt']['his']
    vlan_mytv = data['tramolt']['mytv']
    vlan_ims=data['tramolt']['ims']
    slot =data['slot']
    port =data['portpon']
    onustart = data['onu_old']
    onuend = data['onu_new']
    checknet = data['checkNet']
    checkmytv = data['checkMytv']
    checkvoip= data['checkVoip']
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password+ b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b"config\n")
        output = tn.read_until(b"#")

        with open("output_many.txt", "wb") as f:
            i=0
            for onu in range(int(onustart), int(onuend) + 1):
                i=i+1
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"interface gpon 0/{slot}",
                    f"ont delete {port} {onu}",
                    f"ont add {port} {onu} password-auth {slid[i-1]} always-on omci ont-lineprofile-name HSI_IPTV_VOIP_VPN ont-srvprofile-name DASAN\n\n",
                    f"quit",

                 
                    f"service-port vlan 4001 gpon 0/{slot}/{port} ont {onu} gemport 5 multi-service user-vlan 4000 inbound traffic-table name GNMS outbound traffic-table name GNMS",
                   
                    f"btv",
                    f"igmp user add smart-vlan {vlan_mytv}\n\n",

                    f"multicast-vlan 99\n\n",
                    f"igmp multicast-vlan member smart-vlan {vlan_mytv}\n\n",
                    f"quit",
                  
                    f"service-port vlan 0 gpon 0/1/01 ont 01 gemport 4 multi-service user-vlan 15 inbound traffic-table name VPN outbound traffic-table name VPN",
                    


                ]

                tn.write(
                    f"undo service-port port 0/{slot}/{port} ont {onu}\n".encode('ascii'))
                output = tn.read_until(b":")
                # f.write(output)
                tn.write(b"\n")
                output = tn.read_until(b"y/n)[n]:")
                # f.write(output)
                tn.write(b"y\n")
                output = tn.read_until(b"#")
                # f.write(output)

                f.write(b"config\n")
                f.write(
                    f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
                f.write(b"y\n")

                # # Send each command and write the output to the file
                if (checknet==True):
                 
                   commands.insert(4,      f"service-port vlan {vlan_net} gpon 0/{slot}/{port} ont {onu} gemport 1 multi-service user-vlan 11 inbound traffic-table name HSI outbound traffic-table name HSI")
                if (checkmytv==True and checknet==True):
                    commands.insert(6,   f"service-port vlan {vlan_mytv} gpon 0/{slot}/{port} ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down")
                if (checkmytv==True and checknet!=True):
                    commands.insert(5,   f"service-port vlan {vlan_mytv} gpon 0/{slot}/{port} ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down")
                if (checkvoip==True and checkmytv==True and checknet==True):
                    commands.insert(12,    f"service-port vlan {vlan_ims} gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                else:
                    if (checkvoip==True and (checkmytv==True or checknet==True)):
                        commands.insert(11,     f"service-port vlan {vlan_ims} gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                if (checkvoip==True and (checkmytv!=True and checknet!=True)):
                    commands.insert(10,    f"service-port vlan {vlan_ims} gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP")
                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")

                    output = b""
                    while not output.endswith(b"#"):
                        output += tn.read_some()

                    f.write(output)
                  
                    f.write(command.encode('ascii') + b"\n")
                    f.write(b"\n")

                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

@app.route('/tram_olt/kich_onu_dasan_many', methods=['POST'])
def get_active_dasan_many():
    # Lấy tham số từ query parameters
    data = request.json
    # return jsonify({'status': data})
    address_ip = data['tramolt']['ip']
    user =  str(data['tramolt']['username']).encode('ascii')
    password =  str(data['tramolt']['password']).encode('ascii')
    slid =data['list_slid']
    vlan_net = data['tramolt']['his']
    vlan_mytv = data['tramolt']['mytv']
    vlan_ims=data['tramolt']['ims']
    slot =data['slot']
    port =data['portpon']
    onustart = data['onu_old']
    onuend = data['onu_new']
    checknet = data['checkNet']
    checkmytv = data['checkMytv']
    checkvoip= data['checkVoip']

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        tn.read_until(b"login:")
        tn.write(user + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")

        with open("output_many.txt", "wb") as f:
            i=0
            for onu in range(int(onustart), int(onuend) + 1):
                i=i+1
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"conf t",
                    f"gpon",
                    f"gpon-olt {port}",
                    f"no onu {onu}",
                    f"end",
                    f"conf t",
                    f"gpon",
                    f"gpon-olt  {port}",
                    f"onu add {onu} registration-id {slid[i-1]}",
                    f"onu-profile {onu} HSI_MYTV_VOIP_GNMS_ONU",
                    f"end",
                    f"write memory"
                ]

                # # Send each command and write the output to the file

                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")
                    out= tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")
                    f.write(out + b"\n")
                # #Add new lines for better readability in the output file

                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

@app.route('/tram_olt/kich_onu_zte_c650_many', methods=['POST'])
def get_active_zte_c650_many():
    # Lấy tham số từ query parameters
    data = request.json
    # return jsonify({'status': data})
    address_ip = data['tramolt']['ip']
    user =  str(data['tramolt']['username']).encode('ascii')
    password =  str(data['tramolt']['password']).encode('ascii')
    slid =data['list_slid']
    vlan_net = data['tramolt']['his']
    vlan_mytv = data['tramolt']['mytv']
    vlan_ims=data['tramolt']['ims']
    slot =data['slot']
    port =data['portpon']
    onustart = data['onu_old']
    onuend = data['onu_new']
    checknet = data['checkNet']
    checkmytv = data['checkMytv']
    checkvoip= data['checkVoip']
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        i=0
        with open("output_many.txt", "wb") as f:

            for onu in range(int(onustart), int(onuend) + 1):
                i=i+1
                if (onu < 10):
                    onu = "0"+str(onu)
                commands = [
                    f"configure terminal",
                    f"interface gpon_olt-1/3/{port}",
                    f"no onu {onu}",
                    f"end",
                    f"configure terminal",
                    f"interface gpon_olt-1/3/{port}",
                    f"onu {onu} type GW040-H pw {slid[i-1]}",
                    f"exit",
                    f"interface gpon_onu-1/3/{port}:{onu}",
                    f"vport-mode manual",
                    f"tcont 1 name HSI profile T4_600M",
                    f"tcont 2 name IPTV profile T2_512K",
                    f"tcont 3 name VOIP profile T3_10M",
                    f"gemport 3 name VOIP tcont 3",
                    f"gemport 1 name HSI tcont 1",
                    f"gemport 2 name IPTV tcont 2",
                    f"tcont 6 name onu profile T3_10M",
                    f"gemport 6 name onu tcont 6",
                    f"vport 1 map-type vlan",
                    f"vport-map 1 6 vlan 4001",
                    f"vport 1 map-type vlan",
                    f"vport-map 1 1 vlan 11",
                    f"vport-map 1 2 vlan 12",
                    f"vport-map 1 3 vlan 13",
                    f"exit",
                    f"interface vport-1/3/{port}.{onu}:1",
                   
                   
                   
                    f"service-port 6 user-vlan 4000 vlan 4001",
                    f"exit",
                    f"pon-onu-mng gpon_onu-1/3/{port}:{onu}",
                    f"dhcp-ip ethuni eth_0/4 from-internet",
                    f"service 6 gemport 6 vlan 4000",
                    f"mvlan 12",
                    f"mvlan tag eth_0/4 strip ",
                    f"service 1 gemport 1 vlan 11",
                    f"service 2 gemport 2 vlan 12",
                    f"service 3 gemport 3 vlan 13",
                    f"voip protocol sip",
                    f"voip-ip ipv4 mode dhcp vlan-profile VOIP host 2",
                    f"wan-ip 1 ipv4 mode pppoe username ftthttbang_hh password vnn123456 vlan-profile HSI host 1",
                    f"wan 1 service internet host 1",
                    f"vlan port eth_0/4 mode tag vlan 12",
                    f"exit",
                    f"igmp mvlan 99",
                    f"receive-port vport-1/3/{port}.{onu}:1",
                    f"end"

                ]
                if (checknet==True):
                 
                   commands.insert(26,    f"service-port 1 user-vlan 11 vlan {vlan_net}")
                if (checkmytv==True and checknet==True):
                    commands.insert(27,   f"service-port 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkmytv==True and checknet!=True):
                    commands.insert(26,   f"service-port 2 user-vlan 12 vlan {vlan_mytv}")
                if (checkvoip==True and checkmytv==True and checknet==True):
                    commands.insert(28,   f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                else:
                    if (checkvoip==True and (checkmytv==True or checknet==True)):
                        commands.insert(27,    f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                if (checkvoip==True and (checkmytv!=True and checknet!=True)):
                    commands.insert(26,    f"service-port 3 user-vlan 13 vlan {vlan_ims}")
                # # Send each command and write the output to the file
                for command in commands:
                    tn.write(command.encode('ascii') + b"\n")
                    out= tn.read_until(b"#")
                    f.write(command.encode('ascii') + b"\n")
                    f.write(out + b"\n")
                # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

# ------------------------------------------------------------------


@app.route('/tram_olt/kich_onu_alu', methods=['GET'])
def get_active_alu():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')

    slid = request.args.get('slid')
    onuid = request.args.get('onuid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    
    commands = [
        f"configure equipment ont interface {onuid} admin-state down",
        f"configure equipment ont no interface {onuid}",
        f"exit all",
        f"configure equipment ont interface {onuid} sw-ver-pland disabled sernum ALCL:00000000 subslocid {slid} sw-dnload-version disabled plnd-var SIP enable-aes enable voip-allowed enable",
        f"configure equipment ont interface {onuid} admin-state up",
        f"configure equipment ont slot {onuid}/14 planned-card-type veip plndnumdataports 1 plndnumvoiceports 0 port-type uni admin-state up",
        f"configure interface port uni:{onuid}/14/1 admin-up",
        f"configure bridge port {onuid}/14/1 max-unicast-mac 10",
        f"exit all",
        f"configure qos interface {onuid}/14/1 queue 0 shaper-profile name:600M_HSI_Down",
        f"configure qos interface {onuid}/14/1 upstream-queue 0 bandwidth-profile name:600M_HSI_Up bandwidth-sharing uni-sharing",
        f"configure bridge port {onuid}/14/1 vlan-id 11 tag single-tagged network-vlan {vlan_net} vlan-scope local",
        f"configure bridge port {onuid}/14/1 vlan-id 4000 tag single-tagged network-vlan 4001 vlan-scope local",
        f"exit all",
        f"configure qos interface {onuid}/14/1 queue 4 shaper-profile name:12M_IPTV_Down",
        f"configure qos interface {onuid}/14/1 upstream-queue 4 bandwidth-profile name:18M_IPTV_Up bandwidth-sharing uni-sharing",
        f"configure bridge port {onuid}/14/1 vlan-id 12 tag single-tagged network-vlan {vlan_mytv} vlan-scope local",
        f"configure igmp channel vlan:{onuid}/14/1:12 max-num-group 254",
        f"exit all",

    ]

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")

        with open("outputs.txt", "wb") as f:
            # Send each command and write the output to the file
            for command in commands:
                tn.write(command.encode('ascii') + b"\n")
                output = tn.read_until(b"#")
                # f.write(output)
                # # Add new lines for better readability in the output file
                #         f.write(b"\n\n")
                f.write(command.encode('ascii') + b"\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_zte', methods=['GET'])
def get_active_zte():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    onu = request.args.get('onu')
    slid = request.args.get('slid')
    onuid = request.args.get('onuid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')

    commands = [
        f"configure terminal",
        f"interface gpon-olt_{onuid}",
        f"no onu {onu}",
        f"end",
        f"configure t",
        f"interface gpon-olt_{onuid}",
        f"onu {onu} type iGate-GW020 pw {slid}",
        f"end",
        f"configure t",
        f"interface gpon-onu_{onuid}:{onu}",
        f"sn-bind disable",
        f"tcont 1 name HSI profile T5_600M",
        f"tcont 2 name IPTV profile T2_512K",
        f"gemport 1 name HSI tcont 1",
        f"gemport 1 traffic-limit upstream G_600M downstream G_600M",
        f"switchport mode hybrid vport 1",
        f"gemport 2 name IPTV tcont 2",
        f"gemport 2 traffic-limit upstream G_IPTV downstream G_18M",
        f"switchport mode hybrid vport 2",
        f"service-port 1 vport 1 user-vlan 11 vlan {vlan_net}",
        f"service-port 2 vport 2 user-vlan 12 vlan {vlan_mytv}",
        f"port-identification format VNPT vport 1",
        f"pppoe-intermediate-agent enable vport 1",
        f"pppoe-intermediate-agent trust true replace vport 1",
        f"tcont 6 name ONT profile T4_100M",
        f"gemport 6 name ONT tcont 6",
        f"gemport 6 traffic-limit upstream G_24M downstream G_24M",
        f"switchport mode hybrid vport 6",
        f"service-port 6 vport 6 user-vlan 4000 vlan 4001",
        f"end",
        f"configure t",
        f"pon-onu-mng gpon-onu_{onuid}:{onu}",
        f"service 1 gemport 1 vlan 11",
        f"service 2 gemport 2 vlan 12",
        f"service 6 gemport 6 vlan 4000",
        f"mvlan 12",
        f"wan-ip 1 mode pppoe vlan-profile HSI_PPPOE host 1",
        f"wan 1 service internet host 1",
        f"end",
        f"configure t",
        f"igmp mvlan 99 receive-port gpon-onu_{onuid}:{onu} vport 2",
        f"end"


    ]

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")

        with open("outputs.txt", "wb") as f:
            # Send each command and write the output to the file
            for command in commands:
                tn.write(command.encode('ascii') + b"\n")
                output = tn.read_until(b"#")
                # f.write(output)
                f.write(command.encode('ascii') + b"\n")
        # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_zte_mini', methods=['GET'])
def get_active_zte_mini():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    onu = request.args.get('onu')
    slid = request.args.get('slid')
    onuid = request.args.get('onuid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    vlan_ims = request.args.get('vlanims')
    commands = [
        f"configure terminal",
        f"interface gpon_olt-{onuid}",
        f"no onu {onu}",
        f"end",
        f"configure terminal",
        f"interface gpon_olt-{onuid}",
        f"onu {onu} type GW040-H pw {slid}",
        f"exit",
        f"interface gpon_onu-{onuid}:{onu}",
        f"vport-mode manual",
        f"tcont 1 name HSI profile T4_600M",
        f"tcont 2 name IPTV profile T2_512K",
        f"tcont 3 name VOIP profile T3_10M",
        f"gemport 3 name VOIP tcont 3",
        f"gemport 1 name HSI tcont 1",
        f"gemport 2 name IPTV tcont 2",
        f"tcont 6 name onu profile T3_10M",
        f"gemport 6 name onu tcont 6",
        f"vport 1 map-type vlan",
        f"vport-map 1 6 vlan 4001",
        f"vport 1 map-type vlan",
        f"vport-map 1 1 vlan 11",
        f"vport-map 1 2 vlan 12",
        f"vport-map 1 3 vlan 13",
        f"exit",
        f"interface vport-{onuid}.{onu}:1",
        f"service-port 1 user-vlan 11 vlan {vlan_net}",
        f"service-port 2 user-vlan 12 vlan {vlan_mytv}",
        f"service-port 3 user-vlan 13 vlan {vlan_ims}",
        f"service-port 6 user-vlan 4000 vlan 4001",
        f"exit",
        f"pon-onu-mng gpon_onu-{onuid}:{onu}",
        f"dhcp-ip ethuni eth_0/4 from-internet",
        f"service 6 gemport 6 vlan 4000",
        f"mvlan 12",
        f"mvlan tag eth_0/4 strip ",
        f"service 1 gemport 1 vlan 11",
        f"service 2 gemport 2 vlan 12",
        f"service 3 gemport 3 vlan 13",
        f"voip protocol sip",
        f"voip-ip ipv4 mode dhcp vlan-profile VOIP host 2",
        f"wan-ip 1 ipv4 mode pppoe username ftthttbang_hh password vnn123456 vlan-profile HSI host 1",
        f"wan 1 service internet host 1",
        f"vlan port eth_0/4 mode tag vlan 12",
        f"exit",
        f"igmp mvlan 99",
        f"receive-port vport-{onuid}.{onu}:1",
        f"end"
    ]

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        # tn.write(b"show running-config-interface  gpon_onu-1/3/3:50\n")
        # out = tn.read_until(b"#")
        with open("outputs.txt", "wb") as f:
            # Send each command and write the output to the file
            for command in commands:
                tn.write(command.encode('ascii') + b"\n")
                output = tn.read_until(b"#")
                # f.write(output)
                f.write(command.encode('ascii') + b"\n")
        # Add new lines for better readability in the output file
                f.write(b"\n\n")

        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_huawei', methods=['GET'])
def get_active_huawei():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    onu = request.args.get('onu')
    slot = request.args.get('slot')
    port = request.args.get('port')
    slid = request.args.get('slid')
    onuid = request.args.get('onuid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    vlan_ims = request.args.get('vlanims')
    commands = [

        f"interface gpon 0/{slot}",
        f"ont delete {port} {onu}",
        f"ont add {port} {onu} password-auth {slid} always-on omci ont-lineprofile-name HSI_IPTV_VOIP_VPN ont-srvprofile-name ONT_020\n\n",
        f"quit",
        f"service-port vlan {vlan_net} gpon {onuid} ont {onu} gemport 1 multi-service user-vlan 11 inbound traffic-table name HSI outbound traffic-table name HSI",
        f"service-port vlan {vlan_mytv} gpon {onuid}  ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down",
        f"service-port vlan {vlan_ims} gpon {onuid} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP",
        f"service-port vlan 4001 gpon {onuid} ont {onu} gemport 5 multi-service user-vlan 4000 inbound traffic-table name GNMS outbound traffic-table name GNMS",
    ]

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b"config\n")
        tn.read_until(b"#")
        tn.write(
            f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
        tn.read_until(b"]:")
        tn.write(b"y\n")
        tn.read_until(b"#")
        with open("outputs.txt", "wb") as f:
            # Send each command and write the output to the file
            for command in commands:
                tn.write(command.encode('ascii') + b"\n")
                output = tn.read_until(b"#")
                # f.write(output)
                f.write(command.encode('ascii') + b"\n")
        # Add new lines for better readability in the output file
        # with open("outputs.txt", "wb") as f:
        #     # Send each command and write the output to the file
        #     for command in commands:
        #         tn.write(command.encode('ascii') + b"\n\n")
        #         output = tn.read_until(b"#")
        #         f.write(output)
        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_huawei_mini', methods=['GET'])
def get_active_huawei_mini():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    onu = request.args.get('onu')
    slot = request.args.get('slot')
    port = request.args.get('port')
    slid = request.args.get('slid')
    vlan_net = request.args.get('vlannet')
    vlan_mytv = request.args.get('vlanmytv')
    vlan_ims = request.args.get('vlanims')
    commands = [

        f"interface gpon 0/{slot}",
        f"ont delete {port} {onu}",
        f"ont add {port} {onu} password-auth {slid} always-on omci ont-lineprofile-name HSI_IPTV_VOIP_VPN ont-srvprofile-name ONT\n\n",
        f"quit",
        f"interface gpon 0/{slot}",
        f"ont delete {port} {onu}",
        f"ont add {port} {onu} password-auth {slid} always-on omci ont-lineprofile-name HSI_IPTV_VOIP_VPN ont-srvprofile-name ONT\n\n",
        f"quit",
        f"service-port vlan {vlan_net} gpon 0/{slot}/{port} ont {onu} gemport 1 multi-service user-vlan 11 inbound traffic-table name HSI outbound traffic-table name HSI",
        f"service-port vlan 4001 gpon 0/{slot}/{port} ont {onu} gemport 5 multi-service user-vlan 4000 inbound traffic-table name GNMS outbound traffic-table name GNMS",
        f"service-port vlan {vlan_mytv} gpon 0/{slot}/{port} ont {onu} gemport 2 multi-service user-vlan 12 inbound traffic-table name IPTV_up outbound traffic-table name IPTV_down",
        f"btv",
        f"igmp user add smart-vlan {vlan_mytv}\n\n",

        f"multicast-vlan 99\n\n",
        f"igmp multicast-vlan member smart-vlan {vlan_mytv}\n\n",
        f"quit",
        f"service-port vlan {vlan_ims} gpon 0/{slot}/{port} ont {onu} gemport 3 multi-service user-vlan 13 inbound traffic-table name VOIP outbound traffic-table name VOIP",
        f"service-port vlan 0 gpon 0/1/01 ont 01 gemport 4 multi-service user-vlan 15 inbound traffic-table name VPN outbound traffic-table name VPN",

    ]

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b"config\n")
        tn.read_until(b"#")
        tn.write(
            f"undo service-port port 0/{slot}/{port} ont {onu}\n\n".encode('ascii'))
        tn.read_until(b"]:")
        tn.write(b"y\n")
        tn.read_until(b"#")
        with open("outputs.txt", "wb") as f:
            # Send each command and write the output to the file
            for command in commands:
                tn.write(command.encode('ascii') + b"\n")
                output = b""
                while not output.endswith(b"#"):
                    output += tn.read_some()

                # f.write(output)
                # f.write(command.encode('ascii') + b"\n")
        # # Add new lines for better readability in the output file

        #     # Send each command and write the output to the file
        #     for command in commands:
        #         tn.write(command.encode('ascii') + b"\n\n")
        #         output = tn.read_until(b"#")
        #         f.write(output)
        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/tram_olt/kich_onu_dasan', methods=['GET'])
def get_active_dasan():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    onu = request.args.get('onu')
    port = request.args.get('port')
    slid = request.args.get('slid')
    commands = [
        f"conf t",
        f"gpon",
        f"gpon-olt {port}",
        f"no onu {onu}",
        f"end",
        f"conf t",
        f"gpon",
        f"gpon-olt  {port}",
        f"onu add {onu} registration-id {slid}",
        f"onu-profile {onu} HSI_MYTV_VOIP_GNMS_ONU",
        f"end",
        f"write memory"


    ]
    commandss = [f"conf t",
                 f"gpon",
                 f"gpon-olt  {port}",
                 f"onu add {onu} registration-id {slid}",
                 f"onu-profile {onu} HSI_MYTV_VOIP_GNMS_ONU",
                 f"end",
                 f"write memory"]

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"login:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        tn.read_until(b"#")

        with open("outputs.txt", "wb") as f:
            # Send each command and write the output to the file
            for command in commands:
                tn.write(command.encode('ascii') + b"\n")
                output = tn.read_until(b"#")
                # f.write(output)
                f.write(command.encode('ascii') + b"\n")

            # Send each command and write the output to the file
            # for command in commandss:
            #     tn.write(command.encode('ascii') + b"\n\n")
            #     output = tn.read_until(b"#")
            #     f.write(output)
        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'status': "ok"})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

#  ---------------------------------------------------------------------
# Suy hao Main E
@app.route('/mainE/get_data', methods=['GET'])
def get_data_mainE_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
      host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt",

              auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM mainE")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")
   

@app.route('/mainE/insert_data', methods=['POST'])
def insert_data_mainE_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
       host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
,
             auth_plugin='mysql_native_password',
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO mainE (ip,username,password,tentram,tenhethong)
                VALUES ( %s, %s, %s, %s,%s)
                """
                values = (data['ip'], data['username'], data['password'], data['tentram'], data['tenhethong'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'mainE'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")

@app.route('/mainE/suyhao_upe', methods=['GET'])
def suyhao_mainE_upe():
        # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    
    
    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")
        
        # Gửi lệnh đến switch để lấy thông tin transceiver
        out = tn.read_until(b"#")
    
        tn.write(  f"terminal length 0\n".encode('ascii'))
        tn.read_until(b"#")
        listsave = []
        with open("output_main.txt", "wb") as f:
            tn.write(
            f"show ipv4 int bri | inc TenGigE0 | in Up\n".encode('ascii'))
            out = tn.read_until(b"#")
            f.write(out)
         
            pattern = re.compile(r'TenGigE0/\d+/\d+/\d+(?!\.\d+)')
            interfaces = pattern.findall(out.decode('ascii'))
            interfaces = list(set(interfaces))
            tn.write(f"show cdp neighbors | include HGI\n".encode('ascii'))
            out = tn.read_until(b"#")
            f.write(out)
            output = out.decode('ascii')  # Chuyển đổi kết quả từ bytes thành chuỗi
            lines = output.strip().split('\n')

            # Tạo danh sách kết quả
            results = []

            # Duyệt qua các dòng dữ liệu
            for line in lines:
                # Sử dụng regular expression để phân tích cú pháp dòng dữ liệu
                match = re.match(r'(\S+)\s+(\S+)\s+\d+\s+\S+\s+\S+\s+\S+\s+(\S+)', line)
                if match:
                    device_id, local_intrfce, port_id = match.groups()
                    results.append({
                        'DeviceID': device_id,
                        'LocalIntrfce': local_intrfce,
                        'PortID': port_id
                    })

         
    
            for interface in interfaces:
                rx_min=0
                rx_power=0
                tn.write(f"show contro {interface} phy | include dBm \n".encode('ascii'))
                out = tn.read_until(b"#")
                f.write(out)
                match = re.search(
                    r'Rx Power:.*?([-?\d.]+) dBm', out.decode('ascii'))

                if match:
                    rx_power = match.group(1)
                match = re.search(
                   r'Receive Power:\s*+[-?\d.]+ mW \([-?\d.]+ dBm\)\s*+[-?\d.]+ mW \([-?\d.]+ dBm\)\s*+[-?\d.]+ mW \(([-?\d.]+) dBm\)', out.decode('ascii'))

                if match:
                    rx_min = match.group(1)
                
                item = {'rx_power': rx_power, "rx_min": rx_min,"port":interface}
                listsave.append(item)
                f.write((str(rx_power) + '\n').encode('ascii'))
       

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({"data1": results,"data": listsave})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")
# -------------------------------------------------------------
# Nhien lieu mau no
@app.route('/nhienlieu/insert_data', methods=['POST'])
def insert_data_nhienlieu_api():
   
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO nhienlieu (tencsht,tentram,nhienlieu,dinhmuc)
                VALUES ( %s, %s, %s, %s)
                """
                values = (data['tencsht'], data['tentram'], data['nhienlieu'], data['dinhmuc'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'tuyen_kt'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/nhienlieu/get_data', methods=['GET'])
def get_data_nhienlieu_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM nhienlieu")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/nhienlieu/update_data', methods=['POST'])
def update_nhienlieu_data():
    data = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
     host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Cập nhật dữ liệu trong bảng
            sql = """
            UPDATE nhienlieu
            SET tencsht = %s, dinhmuc = %s, nhienlieu = %s
            WHERE tentram = %s
            """
            values = (data['tencsht'], data['dinhmuc'], data['nhienlieu'], data['tentram'])
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được cập nhật trong bảng 'nhienlieu'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc cập nhật dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/nhienlieu/delete', methods=['GET'])
def delete_nhienlieu_data():
    data_id = request.args.get('id')
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
      host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Xóa dữ liệu từ bảng
            sql = "DELETE FROM nhienlieu WHERE tentram = %s"
            values = (data_id,)
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được xóa khỏi bảng 'tram_olt'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc xóa dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


# --------------------Tuyen KT-----------------------------------
# -------------------------------------------------------------


@app.route('/tuyen_kt/insert_data', methods=['POST'])
def insert_data_tuyen_kt_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO tuyen_kt (id,tenhethong,ip,pon,tuyenkt,trungtamvienthong)
                VALUES ( %s, %s, %s, %s, %s, %s)
                """
                values = (data['id'], data['tenhethong'],
                          data['ip'], data['pon'], data['tuyenkt'], data['trungtamvienthong'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'tuyen_kt'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/tuyen_kt/get_data', methods=['GET'])
def get_data_tuyen_kt_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
            user="root",
            password="Dhtthost@3",
            database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM tuyen_kt")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")

@app.route('/tuyen_kt/update_data', methods=['POST'])
def update_tuyen_kt_data():
    data = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
     host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Cập nhật dữ liệu trong bảng
            sql = """
            UPDATE tuyen_kt
            SET tenhethong = %s, ip = %s, pon = %s , tuyenkt = %s, trungtamvienthong = %s 
            WHERE id = %s
            """
            values = (data['tenhethong'], data['ip'],data['pon'], data['tuyenkt'], data['trungtamvienthong'], data['id'])
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được cập nhật trong bảng 'nhienlieu'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc cập nhật dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/tuyen_kt/delete', methods=['GET'])
def delete_tuyen_kt_data():
    data_id = request.args.get('id')
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
      host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Xóa dữ liệu từ bảng
            sql = "DELETE FROM tuyen_kt WHERE id = %s"
            values = (data_id,)
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được xóa khỏi bảng 'tram_olt'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc xóa dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")





@app.route('/tuyen_kt_tt/insert_data', methods=['POST'])
def insert_data_tuyen_kt_tt_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO tuyen_kt_tt (tuyenkt,ttvt,sl,matt,tennv)
                VALUES ( %s, %s, %s,%s,%s)
                """
                values = (data['tuyenkt'], data['ttvt'],
                          data['sl'], data['matt'], data['tennv'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng tuyen_KT_TT", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/tuyen_kt_tt/get_data', methods=['GET'])
def get_data_tuyen_kt_tt_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM tuyen_kt_tt")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/tuyen_kt_tt/update_data', methods=['POST'])
def update_tuyen_kt_tt_data():
    data = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
     host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Cập nhật dữ liệu trong bảng
            sql = """
            UPDATE tuyen_kt_tt
            SET ttvt = %s, sl = %s, matt = %s , tennv = %s
            WHERE tuyenkt = %s
            """
            values = (data['ttvt'], data['sl'],data['matt'], data['tennv'], data['tuyenkt'])
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được cập nhật trong bảng 'tuyen_kt_tt'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc cập nhật dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")

@app.route('/tuyen_kt_tt/delete', methods=['GET'])
def delete_tuyen_kt_tt_data():
    data_id = request.args.get('id')
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
      host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"

        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Xóa dữ liệu từ bảng
            sql = "DELETE FROM tuyen_kt_tt WHERE tuyenkt = %s"
            values = (data_id,)
            cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được xóa khỏi bảng 'tuyen_kt_tt'", 200

    except Error as e:
        print("Lỗi khi kết nối hoặc xóa dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")



# -------------------------------------------------------------
# Binh quan suy hao-------------------------------------------------------------


@app.route('/binhquan_suyhao/insert_data', methods=['POST'])
def insert_data_binhquan_suyhao_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO binhquan_suyhao ( KT1A ,KT1B,KT2,KT3,KT4,TongTT1,KT5,KT6,KT7,KT8,KT9,TongTT2,KT15,KT16,KT17,KT18,KT19,TongTT3,KT10,KT10A,KT11,KT12,KT13,TongTT4,HGI,ngay )
                VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
                """
                values = (data['KT1A'], data['KT1B'], data['KT2'], data['KT3'], data['KT4'], data['TongTT1'], data['KT5'], data['KT6'], data['KT7'], data['KT8'], data['KT9'], data['TongTT2'], data['KT15'],
                          data['KT16'], data['KT17'], data['KT18'], data['KT19'], data['TongTT3'], data['KT10'], data['KT10A'], data['KT11'], data['KT12'], data['KT13'], data['TongTT4'], data['HGI'], data['ngay'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'binhquan_suyhao'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/binhquan_suyhao/get_data', methods=['GET'])
def get_data_binhquan_suyhao_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM binhquan_suyhao")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/binhquan_suyhao/get_data_by_date', methods=['GET'])
def get_data_by_month():
    month = request.args.get('month')
    year = request.args.get('year')

    if not month or not year:
        return jsonify({'error': 'Vui lòng cung cấp cả tháng và năm'}), 400

    try:
        # Chuyển đổi month và year thành số
        month = int(month)
        year = int(year)
    except ValueError:
        return jsonify({'error': 'Tháng và năm phải là số'}), 400

    try:
        # Kết nối đến MySQL
        connection = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Truy vấn để lấy dữ liệu theo tháng và năm
            query = """
                SELECT * FROM binhquan_suyhao
                WHERE MONTH(STR_TO_DATE(ngay, '%d/%m/%Y')) = %s AND YEAR(STR_TO_DATE(ngay, '%d/%m/%Y')) = %s
            """
            cursor.execute(query, (month, year))
            result = cursor.fetchall()

            # Đóng kết nối sau khi lấy dữ liệu
            cursor.close()
            connection.close()

            # Trả kết quả dưới dạng JSON
            return jsonify(result), 200

    except Error as e:
        print(f"Lỗi khi kết nối MySQL hoặc truy vấn: {e}")
        return jsonify({'error': 'Lỗi khi kết nối với cơ sở dữ liệu'}), 500
# -------------------------------------------------------------

#  binhquan_suyhao_vb8362
# ------------------------------------------------


@app.route('/binhquan_suyhao_vb8362/insert_data', methods=['POST'])
def insert_data_binhquan_suyhao_vb8362_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO binhquan_suyhao_vb8362 ( KT1A ,KT1B,KT2,KT3,KT4,TongTT1,KT5,KT6,KT7,KT8,KT9,TongTT2,KT15,KT16,KT17,KT18,KT19,TongTT3,KT10,KT10A,KT11,KT12,KT13,TongTT4,HGI,ngay )
                VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s)
                """
                values = (data['KT1A'], data['KT1B'], data['KT2'], data['KT3'], data['KT4'], data['TongTT1'], data['KT5'], data['KT6'], data['KT7'], data['KT8'], data['KT9'], data['TongTT2'], data['KT15'],
                          data['KT16'], data['KT17'], data['KT18'], data['KT19'], data['TongTT3'], data['KT10'], data['KT10A'], data['KT11'], data['KT12'], data['KT13'], data['TongTT4'], data['HGI'], data['ngay'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'binhquan_suyhao_vb8362'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/binhquan_suyhao_vb8362/get_data', methods=['GET'])
def get_data_binhquan_suyhao_vb8362_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM binhquan_suyhao_vb8362")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/binhquan_suyhao_vb8362/get_data_by_date', methods=['GET'])
def get_data_binhquan_suyhao_vb8362_by_month():
    month = request.args.get('month')
    year = request.args.get('year')

    if not month or not year:
        return jsonify({'error': 'Vui lòng cung cấp cả tháng và năm'}), 400

    try:
        # Chuyển đổi month và year thành số
        month = int(month)
        year = int(year)
    except ValueError:
        return jsonify({'error': 'Tháng và năm phải là số'}), 400

    try:
        # Kết nối đến MySQL
        connection = mysql.connector.connect(
              host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Truy vấn để lấy dữ liệu theo tháng và năm
            query = """
                SELECT * FROM binhquan_suyhao_vb8362
                WHERE MONTH(STR_TO_DATE(ngay, '%d/%m/%Y')) = %s AND YEAR(STR_TO_DATE(ngay, '%d/%m/%Y')) = %s
            """
            cursor.execute(query, (month, year))
            result = cursor.fetchall()

            # Đóng kết nối sau khi lấy dữ liệu
            cursor.close()
            connection.close()

            # Trả kết quả dưới dạng JSON
            return jsonify(result), 200

    except Error as e:
        print(f"Lỗi khi kết nối MySQL hoặc truy vấn: {e}")
        return jsonify({'error': 'Lỗi khi kết nối với cơ sở dữ liệu'}), 500

# Thong ke so lan suy hao


@app.route('/thongkesolansuyhao/insert_data', methods=['POST'])
def insert_data_thongkesolansuyhao_api():
    data_list = request.json
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO thongkesolansuyhao (nguoidung,ngay,nhanvien,tkt,ttvt)
                VALUES ( %s, %s, %s, %s, %s)
                """
                values = (data['nguoidung'], data['ngay'],
                          data['nhanvien'], data['tkt'], data['ttvt'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            return "Dữ liệu đã được thêm vào bảng 'thongkesolansuyhao'", 201

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/thongkesolansuyhao/get_data', methods=['GET'])
def get_data_thongkesolansuyhao_api():
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM thongkesolansuyhao")
            result = cursor.fetchall()
            return result, 200

    except Error as e:
        print("Lỗi khi kết nối hoặc lấy dữ liệu:", e)
        return str(e), 500

    finally:
        if cursor:
            cursor.close()
        if conn.is_connected():
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


@app.route('/thongkesolansuyhao/get_data_by_month', methods=['GET'])
def get_data_thongkesolansuyhao_by_month():
    month = request.args.get('month')
    year = request.args.get('year')

    if not month or not year:
        return jsonify({'error': 'Vui lòng cung cấp cả tháng và năm'}), 400

    try:
        # Chuyển đổi month và year thành số
        month = int(month)
        year = int(year)
    except ValueError:
        return jsonify({'error': 'Tháng và năm phải là số'}), 400

    try:
        # Kết nối đến MySQL
        connection = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Truy vấn để lấy dữ liệu theo tháng và năm
            query = """
                SELECT * FROM thongkesolansuyhao
                WHERE MONTH(STR_TO_DATE(ngay, '%d/%m/%Y')) = %s AND YEAR(STR_TO_DATE(ngay, '%d/%m/%Y')) = %s
            """
            cursor.execute(query, (month, year))
            result = cursor.fetchall()

            # Đóng kết nối sau khi lấy dữ liệu
            cursor.close()
            connection.close()

            # Trả kết quả dưới dạng JSON
            return jsonify(result), 200

    except Error as e:
        print(f"Lỗi khi kết nối MySQL hoặc truy vấn: {e}")
        return jsonify({'error': 'Lỗi khi kết nối với cơ sở dữ liệu'}), 500


@app.route('/thongkesolansuyhao/get_data_by_date', methods=['GET'])
def get_data_thongkesolansuyhao_by_day():
    day = request.args.get('date')

    try:
        # Kết nối đến MySQL
        connection = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # Truy vấn để lấy dữ liệu theo tháng và năm
            query = """
                SELECT * FROM thongkesolansuyhao
                WHERE ngay like %s
            """
            cursor.execute(query, (day,))
            result = cursor.fetchall()

            # Đóng kết nối sau khi lấy dữ liệu
            cursor.close()
            connection.close()

            # Trả kết quả dưới dạng JSON
            return jsonify(result), 200

    except Error as e:
        print(f"Lỗi khi kết nối MySQL hoặc truy vấn: {e}")
        return jsonify({'error': 'Lỗi khi kết nối với cơ sở dữ liệu'}), 500



@app.route('/thongkesolansuyhao/deletebymonth', methods=['GET'])
def delete_thongkesolansuyhao_by_month():
    month = request.args.get('month')

    try:
        # Kết nối đến MySQL
        connection = mysql.connector.connect(
               host="localhost",
user="root",
password="Dhtthost@3",
database="vnpt"
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            month = int(month)
            # Truy vấn để lấy dữ liệu theo tháng và năm
            query = """
              SET SQL_SAFE_UPDATES = 0;
            """
            cursor.execute(query)
            query = """
             
                DELETE FROM thongkesolansuyhao
                WHERE MONTH(STR_TO_DATE(ngay, '%d/%m/%Y')) = %s;

            """
            cursor.execute(query, (month,))
            query = """
                SET SQL_SAFE_UPDATES = 1;
            """
            cursor.execute(query)
            result = cursor.fetchall()

            # Đóng kết nối sau khi lấy dữ liệu
            cursor.close()
            connection.close()

            # Trả kết quả dưới dạng JSON
            return jsonify(result), 200

    except Error as e:
        print(f"Lỗi khi kết nối MySQL hoặc truy vấn: {e}")
        return jsonify({'error': 'Lỗi khi kết nối với cơ sở dữ liệu'}), 500

# ------------------------------------------------



# -------------------------------------------------------------------#


# Suy hao Olt




# ---------------------------------------------------------------



@app.route('/olt/suyhao_olt_alu', methods=['GET'])
def suyhao_alu():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    port = request.args.get('port')

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        out = tn.read_until(b"#")

        listsave = []
        with open("output.txt", "wb") as f:
            f.write(out)

        for eth_port in port.split(','):
            with open("output.txt", "wb") as f:
                f.write(eth_port.encode('ascii'))
                tn.write(
                    f"show equipment diagnostics sfp {eth_port} detail | match exact:rx-po\n".encode('ascii'))
                out = tn.read_until(b"#")
                f.write(out)
                match = re.search(
                    r'rx-power\s*:\s*"\s*([-+]?[0-9]*\.?[0-9]+)\s*dBm"', out.decode('ascii'))

                if match:
                    rx_power = match.group(1)

                else:
                    rx_power = 0
                match = re.search(
                   r'rx-power-tca\s*:\s*([\w\.\-+]+)', out.decode('ascii'))

                if match:
                    rx_min = match.group(1)

                else:
                    rx_min = 0
                item = {'rx_power': rx_power, "rx_min": rx_min,"port":eth_port}
                listsave.append(item)
        # Gửi lệnh đến switch để lấy thông tin transceiver

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({"data": listsave})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/olt/suyhao_olt_zte', methods=['GET'])
def suyhao_zte():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    port = request.args.get('port')

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        tn.write(b"terminal length 0\n")
        tn.read_until(b"#")

        listsave = []

        for eth_port in port.split(','):
            with open("output.txt", "wb") as f:
                f.write(eth_port.encode('ascii'))
                tn.write(
                    f"show interface optical-module-info {eth_port}\n".encode('ascii'))
                out = tn.read_until(b"#")
                f.write(out)
                match = re.search(
                    r"RxPower\s*:\s*(-?\d+\.\d+)\s*\(?dbm\)?\s*\[?\s*(-?\d+\.\d+)", out.decode('ascii'))

                if match:
                    rx_power = float(match.group(1))
                    rx_min = float(match.group(2))
                else:
                    rx_power = 0
                    rx_min = 0
                item = {'rx_power': rx_power, "rx_min": rx_min,"port":eth_port}
                listsave.append(item)
        # Gửi lệnh đến switch để lấy thông tin transceiver

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({"data": listsave})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/olt/suyhao_olt_zte_mini', methods=['GET'])
def suyhao_zte_mini():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    port = request.args.get('port')

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        tn.write(b"terminal length 0\n")
        tn.read_until(b"#")

        listsave = []

        for eth_port in port.split(','):

            tn.write(f"show optical-module-info {eth_port}\n".encode('ascii'))
            out = tn.read_until(b"#")
            with open("output.txt", "wb") as f:
                f.write(out)
            match = re.search(
                r"RxPower\s*:\s*(-?\d+\.\d+)\s*\(?dbm\)?\s*\[?\s*(-?\d+\.\d+)", out.decode('ascii'))

            if match:
                rx_power = float(match.group(1))
                rx_min = float(match.group(2))
            else:
                match = re.search(
                r"RxPower\s*:\s*(-?\d+\.\d+)\s*\(?dbm\)", out.decode('ascii'))

                if match:
                    rx_power = float(match.group(1))
                    rx_min = 0
                else:
                    rx_power = 0
                    rx_min = 0
            item = {'rx_power': rx_power, "rx_min": rx_min,"port":eth_port}
            listsave.append(item)
        # Gửi lệnh đến switch để lấy thông tin transceiver

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({"data": listsave})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/olt/suyhao_olt_huawei', methods=['GET'])
def suyhao_hw():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')

    port = request.args.get('port')

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write("config".encode('ascii') + b"\n")
        tn.read_until(b"#")
        listsave = []

        for eth_port in port.split(','):
            parts = eth_port.split("-")
            slot = parts[0]
            onu = parts[1]

            tn.write(f"interface mpu {slot}".encode('ascii') + b"\n")
            tn.read_until(b"#")
            tn.write(f"display port ddm-info {onu}\n\n".encode('ascii'))
            out = tn.read_until(b"#").decode('ascii')
            match = re.search(
                r"RX power\(dBm\)\s+:\s+(-?\d+\.\d+)\s+\[\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\]", out)
            if match:
                rx_power = float(match.group(1))
                rx_min = float(match.group(2))
                rx_max = float(match.group(3))

            item = {'rx_power': rx_power, "rx_min": rx_min,"port":eth_port}
            listsave.append(item)
        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"quit\n")
        tn.read_until(b"#")
        tn.close()

        log_message = f"kết nối ok"
        return jsonify({"data": listsave})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})


@app.route('/olt/suyhao_olt_huawei_mini', methods=['GET'])
def suyhao_hw_mini():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')

    port = request.args.get('port')

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"name:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write("config".encode('ascii') + b"\n")
        tn.read_until(b"#")
        tn.write("interface eth 0/2".encode('ascii') + b"\n")
        tn.read_until(b"#")
        tn.write(f"display port ddm-info {port}\n\n".encode('ascii'))
        out = tn.read_until(b"#")
        with open("output.txt", "wb") as f:
            f.write(out)
        match = re.search(
            r"RX power\(dBm\)\s+:\s+(-?\d+\.\d+)\s+\[\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\]", out.decode('ascii'))
        if match:
            rx_power = float(match.group(1))
            rx_min = float(match.group(2))
            rx_max = float(match.group(3))
        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"quit\n")
        tn.read_until(b"#")
        tn.close()

        log_message = f"kết nối ok"
        return jsonify({'rx_power': rx_power, "rx_min": rx_min,"port":port})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})


@app.route('/olt/suyhao_olt_dasan', methods=['GET'])
def suyhao_olt_dasan():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')

    port = request.args.get('port')

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"login:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.write(b"enable\n")
        out = tn.read_until(b"#")
        with open("output.txt", "wb") as f:
            f.write(out)

        rx_power = 0
        tn.write(b" terminal length 0\n")
        tn.read_until(b"#")
        tn.write(f"show port module-info 9\n".encode('ascii'))
        out = tn.read_until(b"#")
        match = re.search(r"DMI RX power:\s+(-?\d+\.\d+) dBm",
                          out.decode('ascii'))
        if match:
            rx_power = float(match.group(1))
        tn.close()
        log_message = f"kết nối ok"
        return jsonify({'rx_power': rx_power, "rx_min": "-40.0000","port":port})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


# ---------------------------------
# Nhiet dô OLT
# -----------------
@app.route('/olt/degree_olt_alu', methods=['GET'])
def degree_alu():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
   

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        out = tn.read_until(b"#")

        listsave = []
       
        
        with open("output_degree_olt.txt", "wb") as f:
              
                tn.write(
                    f"show equipment temperature\n".encode('ascii'))
                out = tn.read_until(b"#")
                f.write(out)
                pattern = r"(lt:\d+/\d+/\d+)\s+(\d+)\s+(\d+)\s+(\d+)"

                # Extract matches
                matches = re.findall(pattern, out.decode('ascii'))
                for match in matches:
                     item={"port":f"{match[0]}/{match[1]}","degree":match[2],"degree_low": int(match[3])-10}
                     listsave.append(item)
              
        # Gửi lệnh đến switch để lấy thông tin transceiver

        tn.close()

        log_message = f"kết nối ok"
        return listsave
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/olt/degree_olt_zte', methods=['GET'])
def degree_zte():
    # Lấy tham số từ query parameters
    address_ip = request.args.get('address_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    port = request.args.get('port')

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(address_ip)

        # Đăng nhập
        tn.read_until(b"Username:")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword:")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        tn.write(b"terminal length 0\n")
        tn.read_until(b"#")

        listsave = []

       
        with open("output_degree_olt.txt", "wb") as f:
               
                tn.write(
                    f"show card-temperature \n".encode('ascii'))
                out = tn.read_until(b"#")
                f.write(out)
                pattern = r"(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)"

                    # Extract matches
                matches = re.findall(pattern, out.decode('ascii'))
                for match in matches:
                        item={"port":f"{match[0]}/{match[1]}/{match[2]}","degree":match[3],"degree_low":60}
                        listsave.append(item)

        tn.close()

        log_message = f"kết nối ok"
        return jsonify({"data": listsave})
    except Exception as e:
        log_message = f"kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")





# -------------------------------------------------------------------#


# Suy hao Switch




# ---------------------------------------------------------------
@app.route('/get_rx_power_by_ECS', methods=['GET'])
def get_rx_power_by_ECS():
    # Lấy tham số từ query parameters
    eth_ports = request.args.get('eth_ports')
    switch_ip = request.args.get('switch_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(switch_ip)

        # Đăng nhập
        tn.read_until(b"Username: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        list = []

        for eth_port in eth_ports.split(','):
            command = f"show interfaces transceiver ethernet 1/{eth_port}\n"
            tn.write(command.encode('ascii'))
        # Đọc và lấy kết quả đầu ra
            out = b""
            while True:
                chunk = tn.read_very_eager()
                out += chunk
                if b"#" in chunk:
                    break
                if b"exit ---" in chunk:
                    tn.write(b"\n")

            # Đóng kết nối Telnet

        # Trích xuất giá trị RX Power từ kết quả đầu ra
            rx_power = None
            lines = out.decode('utf-8').splitlines()

            rx_power = None

# Biến lưu giá trị w_high và w_low
            w_high = None
            w_low = None
            T_high = None
            T_low = None
            temperature=None
            # Lặp qua các dòng để tìm giá trị RX Power và DDM Thresholds
            for line in lines:
                if "RX Power" in line:
                    match = re.search(r'RX Power\s+:\s+([-.\d]+)\s+dBm', line)
                    if match:
                        rx_power = match.group(1)
                elif "RxPower(dBm)" in line:
                    match = re.search(
                        r'\s*RxPower\(dBm\)\s+([-.\d]+)\s+([-.\d]+)\s+([-.\d]+)\s+([-.\d]+)', line)
                    if match:
                        w_high = match.group(3)
                        w_low = match.group(2)

                if "Temperature" in line:
                    match = re.search(r'Temperature\s+:\s+([-.\d]+)\s+degree C', line)
                    if match:
                        temperature = match.group(1)
                if "Temperature(Celsius)" in line:
                    with open("outputests.txt", "wb") as f:
                        f.write(line.encode('ascii'))
                        f.write("line".encode('ascii'))
                    match = re.search(
                        r'\s*Temperature\(Celsius\)\s+([-.\d]+)\s+([-.\d]+)\s+([-.\d]+)\s+([-.\d]+)', line)
                    if match:
                        T_high = match.group(3)
                        T_low = match.group(2)

            # Giá trị eth_port giả định

            # Kiểm tra và thêm vào danh sách kết quả
            if rx_power is not None and "N" not in rx_power:
                list.append({"port": eth_port, "rx_power": rx_power,
                            "w_high": w_high, "w_low": w_low ,"temperature":temperature,"T_high":T_high,"T_low":T_low})
            else:
                list.append({"port": eth_port, "rx_power": 9999,
                            "w_high": 99999, "w_low": 0 ,"temperature":9999,"T_high":99999,"T_low":0})

        tn.close()
        log_message = f"{switch_ip} kết nối thành công"
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/get_rx_power_by_SW2724', methods=['GET'])
def get_rx_power_by_sw2724():
    host = request.args.get('switch_ip')
    eth_ports = request.args.get('eth_ports')
    user = request.args.get('user')
    password = request.args.get('password')
    if not host or not eth_ports:
        return jsonify({'error': 'HOST and eth_port parameters are required'})

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(host)
        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")
        # Gửi lệnh đến switch
        tn.write(b"enable\n")
        tn.read_until(b"#")
        list = []
        for eth_port in eth_ports.split(','):
            tn.write(b"terminal length 0\n")
            tn.read_until(b"#")
            command = f"show interface module-info ethernet 0/{eth_port}\n"
            tn.write(command.encode('ascii'))
        # Đọc và lấy kết quả đầu ra
            # out = b""
            # while True:
            #     chunk = tn.read_very_eager()
            #     out += chunk
            #     if b"#" in chunk:
            #         break
            #     if b"--More--" in chunk:
            #         tn.write(b"\n")
            # Đóng kết nối Telnet
       
            out=tn.read_until(b"#")
        # Trích xuất giá trị DDM RX power từ kết quả đầu ra
            rx_power = None
            w_high = None
            w_low = None
            temperature = None
            T_high = None
            T_low = None
            lines = out.decode('utf-8').splitlines()
            for line in lines:
                if "RX power:" in line:
                    # Lấy giá trị RX power
                    match = re.search(
                        r'\s*DDM RX power:\s+([-.\d]+)\s+dBm\s+\(Warn :\s+([-.\d]+)\s+/\s+([-.\d]+)\)', line)
                    if match:
                        rx_power = match.group(1)
                        w_low = match.group(2)
                        w_high = match.group(3)
                if "Temperature:" in line:
                    # Lấy giá trị RX power
                    match = re.search(
                        r'\s*DDM Temperature:\s+([-.\d]+)\s+C\s+\(Warn :\s+([-.\d]+)\s+/\s+([-.\d]+)\)', line)
                    if match:
                        temperature = match.group(1)
                        T_low = match.group(2)
                        T_high = match.group(3)        

            if rx_power is not None and rx_power.find("N") == -1:
                list.append(
                    {"port": f"{eth_port}", "rx_power": f"{rx_power}", "w_high": w_high, "w_low": w_low,"temperature":temperature,"T_high":T_high,"T_low":T_low})
            else:
                list.append(
                    {"port": f"{eth_port}", "rx_power": 9999, "w_high": 99999, "w_low": 0,"temperature":9999,"T_high":99999,"T_low":0})

        log_message = f"{host} kết nối thành công"
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        log_message = f"{host} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/get_rx_power_by_SW2224', methods=['GET'])
def get_rx_power_by_SW2224():
    # Lấy tham số từ query string
    eth_ports = request.args.get('eth_ports')
    switch_ip = request.args.get('switch_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    if not eth_ports or not switch_ip:
        return jsonify({'error': 'eth_port and switch_ip are required'})

    try:
        # Thông tin kết nối Telnet
        HOST = switch_ip

        # Kết nối Telnet
        tn = telnetlib.Telnet(HOST)

        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch
        tn.write(b"enable\n")
        tn.read_until(b"#")
        list = []
        for eth_port in eth_ports.split(','):

            cmd = f"show port module-info {eth_port}\n"
            tn.write(cmd.encode('ascii'))

        # Đọc và lấy kết quả đầu ra
            out = b""
            while True:
                chunk = tn.read_very_eager()
                out += chunk
                if b"#" in chunk:
                    break
                if b"--More--" in chunk:
                    tn.write(b"\n")

            # Đóng kết nối Telnet

        # Trích xuất giá trị RX power từ kết quả đầu ra
            rx_power = None
            w_high = None
            w_low = None
            temperature = None
            T_high = None
            T_low = None
            lines = out.decode('utf-8').splitlines()
            for line in lines:
                if "RX power:" in line:
                    # Lấy giá trị RX power
                    match = re.search(
                        r'\s*DDM RX power:\s+([-.\d]+)\s+dBm\s+\(Warn :\s+([-.\d]+)\s+/\s+([-.\d]+)\)', line)
                    if match:
                        rx_power = match.group(1)
                        w_low = match.group(2)
                        w_high = match.group(3)
                if "Temperature:" in line:
                    # Lấy giá trị RX power
                    match = re.search(
                        r'\s*DDM Temperature:\s+([-.\d]+)\s+C\s+\(Warn :\s+([-.\d]+)\s+/\s+([-.\d]+)\)', line)
                    if match:
                        temperature = match.group(1)
                        T_low = match.group(2)
                        T_high = match.group(3)

            if rx_power is not None and rx_power.find("N") == -1:
                list.append(
                    {"port": f"{eth_port}", "rx_power": f"{rx_power}", "w_high": w_high, "w_low": w_low,"temperature":temperature,"T_high":T_high,"T_low":T_low})
            else:
                list.append(
                    {"port": f"{eth_port}", "rx_power": 9999, "w_high": 99999, "w_low": 0,"temperature":9999,"T_high":99999,"T_low":0})

        log_message = f"{switch_ip} kết nối thành công"
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/get_rx_power_by_A6400', methods=['GET'])
def get_rx_power_by_A6400():
    # Lấy tham số từ query string
    switch_ip = request.args.get('switch_ip')
    eth_ports = request.args.get('eth_ports')
    user = request.args.get('user')
    password = request.args.get('password')
    if not switch_ip or not eth_ports:
        return jsonify({'error': 'switch_ip and eth_port are required'})
    try:
        # Thông tin kết nối Telnet
        HOST = switch_ip
        # Kết nối Telnet
        tn = telnetlib.Telnet(HOST)
        # Đăng nhập
        tn.read_until(b"login : ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword : ")
            tn.write(password.encode('ascii') + b"\n")
        # Gửi lệnh đến switch
        tn.read_until(b"#")
        list = []
        for eth_port in eth_ports.split(','):

            cmd = f"show interfaces 1/{eth_port} transceiver\n"
            tn.write(cmd.encode('ascii'))
            # Đọc và lấy kết quả đầu ra
            out = b""
            while True:
                chunk = tn.read_very_eager()
                out += chunk
                if b"#" in chunk:
                    break
                if b"--More--" in chunk:
                    tn.write(b"\n")

            rx_power = None
            w_low = None

            w_high = None
            data_str = out.decode('utf-8')
            lines = data_str.splitlines()
            temp_pattern = re.compile(r'\b(?:Actual|A-High|W-High|W-Low|A-Low)\s+(-?\d+\.\d+)')

            # Extract temperature values
            temp_values = []
            for line in lines:
                match = temp_pattern.search(line)
                if match:
                    temp = match.group(1)
                    temp_values.append(float(temp))
# Tạo mẫu regex để trích xuất giá trị cuối cùng từ cột Input
            pattern = re.compile(r'(-?\d+\.\d+)\s*$')

            def get_value_or_default(lines, index, default="9999"):
                if index < len(lines):
                    match = pattern.search(lines[index])
                    if match:
                        return match.group(1)
                return default

            def get_value_or_defaults(lines, index, default="0"):
                if index < len(lines):
                    match = pattern.search(lines[index])
                    if match:
                        return match.group(1)
                return default

            def get_value_or_defaultss(lines, index, default="99999"):
                if index < len(lines):
                    match = pattern.search(lines[index])
                    if match:
                        return match.group(1)
                return default
            # Trích xuất giá trị từ các dòng 1, 3, và 4
            actual = get_value_or_default(lines, 4)
            w_low = get_value_or_defaults(lines, 7)
            w_high = get_value_or_defaultss(lines, 6)

# Trích xuất giá trị từ các dòng 1, 3, và 4

            list.append({"port": f"{eth_port}", "rx_power": f"{actual}",
                         "w_low": f"{w_low}", "w_high": f"{w_high}","temperature":temp_values[0],"T_high":temp_values[2],"T_low":temp_values[3]})

        log_message = f"{switch_ip} kết nối thành công"
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

# ---------------------------------
# Nhiet dô Switch
# -----------------
@app.route('/get_degree_by_ECS', methods=['GET'])
def get_degree_by_ECS():
    # Lấy tham số từ query parameters
    switch_ip = request.args.get('switch_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(switch_ip)

        # Đăng nhập
        tn.read_until(b"Username: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch để lấy thông tin transceiver
        tn.read_until(b"#")
        tn.write(b"terminal length 0\n")
        tn.read_until(b"#")
        tn.write(b"show sys\n")
        out = tn.read_until(b"#")
        list = []
        
        match_temp_1 = re.search(r'\s*Temperature\s*1\s*:\s*([\d\-]+)\s*degrees', out.decode('ascii'))
        if match_temp_1:
            temp_1 = match_temp_1.group(1)
            print("Temperature 1:", temp_1)
        item={"degree":temp_1,"threshold_high":50}
        
        tn.close()
        log_message = f"{switch_ip} kết nối thành công"
        return item
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

@app.route('/get_degree_by_SW2724', methods=['GET'])
def get_degree_by_sw2724():
    host = request.args.get('switch_ip')
    user = request.args.get('user')
    password = request.args.get('password')
    

    # Thông tin kết nối

    try:
        # Kết nối Telnet
        tn = telnetlib.Telnet(host)
        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")
        # Gửi lệnh đến switch
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b"show status temp\n")
        out= tn.read_until(b"#")
        temp_threshold_high=None
        match_threshold_high = re.search(r'Temperature threshold\s+:\s+High\s+\(\s*([\d\-]+)\s*C\)', out.decode('ascii'))
        if match_threshold_high:
            temp_threshold_high = match_threshold_high.group(1)
            print("Temperature threshold High:", temp_threshold_high)

        # Pattern to match 'Temperature 1'
        match_temp_1 = re.search(r'Temperature\s+1\s+:\s+([\d\-]+)\s*C', out.decode('ascii'))
        if match_temp_1:
            temp_1 = match_temp_1.group(1)
            print("Temperature 1:", temp_1)
        item={"degree":temp_1,"threshold_high":temp_threshold_high}

        log_message = f"{host} kết nối thành công"
        return item
    except Exception as e:
        log_message = f"{host} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

@app.route('/get_degree_by_SW2224', methods=['GET'])
def get_degree_by_SW2224():
    # Lấy tham số từ query string
   
    switch_ip = request.args.get('switch_ip')
    user = request.args.get('user')
    password = request.args.get('password')
   

    try:
        # Thông tin kết nối Telnet
        HOST = switch_ip

        # Kết nối Telnet
        tn = telnetlib.Telnet(HOST)

        # Đăng nhập
        tn.read_until(b"login: ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword: ")
            tn.write(password.encode('ascii') + b"\n")

        # Gửi lệnh đến switch
        tn.write(b"enable\n")
        tn.read_until(b"#")
        tn.write(b"show status temp\n")
        out= tn.read_until(b"#")
        match_threshold_high = re.search(r'Temperature Threshold\s+:\s+High\s+\(\s*([\d\-]+)\s*C\)', out.decode('ascii'))
        if match_threshold_high:
            temp_threshold_high = match_threshold_high.group(1)
            print("Temperature threshold High:", temp_threshold_high)

        # Pattern to match 'Temperature 1'
        match_temp_1 = re.search(r'Temperature\s+1\s+current\s+:\s+([\d\-]+)\s*C', out.decode('ascii'))
        if match_temp_1:
            temp_1 = match_temp_1.group(1)
            print("Temperature 1:", temp_1)
        item={"degree":temp_1,"threshold_high":temp_threshold_high}
        log_message = f"{switch_ip} kết nối thành cônng"
        return item
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")


@app.route('/get_degree_by_A6400', methods=['GET'])
def get_degree_by_A6400():
    # Lấy tham số từ query string
    switch_ip = request.args.get('switch_ip')
   
    user = request.args.get('user')
    password = request.args.get('password')
    
    try:
        # Thông tin kết nối Telnet
        HOST = switch_ip
        # Kết nối Telnet
        tn = telnetlib.Telnet(HOST)
        # Đăng nhập
        tn.read_until(b"login : ")
        tn.write(user.encode('ascii') + b"\n")
        if password:
            tn.read_until(b"assword : ")
            tn.write(password.encode('ascii') + b"\n")
        # Gửi lệnh đến switch
        tn.read_until(b"#")
        tn.write(b"show temperature\n")
        out= tn.read_until(b"#")
        match_temp_1 = re.search(r'\s*Hardware\s*Board\s*Temperature\s*\(deg\s*C\)\s*=\s*([\d\-]+),', out.decode('ascii'))
        if match_temp_1:
            temp_1 = match_temp_1.group(1)
            print("Temperature 1:", temp_1)
        item={"degree":temp_1,"threshold_high":50}
        log_message = f"{switch_ip} kết nối thành công"
        return item
    except Exception as e:
        log_message = f"{switch_ip} kết nối thất bại: {e}"
        return jsonify({'error': str(e)})
    finally:
        # Ghi log vào file log
        log_file_path = os.path.join(full_path, "log.txt")
        with open(log_file_path, 'a', encoding='utf-8') as log_file:
            log_file.write(f"{datetime.now()}: {log_message}\n")

# ---------------------------auto run---------------
def access_url():
    url = "http://localhost:3000/suyhao/mainE"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Truy cập thành công vào:", url)
        else:
            print("Lỗi khi truy cập:", url, "| Mã lỗi:", response.status_code)
    except requests.exceptions.RequestException as e:
        print("Lỗi kết nối:", e)
def run_app():
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5000)


if __name__ == '__main__':
    # scheduler_thread = threading.Thread(target=run_scheduler)
    # scheduler_thread.start()
    # app.run(host='0.0.0.0',port=5000)
    thread = threading.Thread(target=run_app)
    thread.start()
   
