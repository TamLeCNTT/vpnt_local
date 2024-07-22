from flask import Flask, request, jsonify
import telnetlib
import re
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
app = Flask(__name__)

CORS(app)


def insert_data(data_list):
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="vnpt"
        )
        if conn.is_connected():
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for data in data_list:
                sql = """
                INSERT INTO suyhao (id, diachi, username, password, tenthietbi, loai, port)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                values = (data['id'], data['diachi'], data['username'],
                          data['password'], data['tenthietbi'], data['loai'], data['port'])
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
            password="",
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


@app.route('/get_data', methods=['GET'])
def get_data_api():
    data, status_code = get_data()
    return jsonify(data), status_code


@app.route('/insert_data', methods=['POST'])
def insert_data_api():
    data_list = request.json
    message, status_code = insert_data(data_list)
    return jsonify({"message": message}), status_code


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

            # Giá trị eth_port giả định

            # Kiểm tra và thêm vào danh sách kết quả
            if rx_power is not None and "N" not in rx_power:
                list.append({"port": eth_port, "rx_power": rx_power,
                            "w_high": w_high, "w_low": w_low})
            else:
                list.append({"port": eth_port, "rx_power": 9999,
                            "w_high": 99999, "w_low": 0})

        tn.close()
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        return jsonify({'error': str(e)})


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
            command = f"show interface module-info ethernet 0/{eth_port}\n"
            tn.write(command.encode('ascii'))
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
        # Ghi kết quả ra file (không bắt buộc, chỉ để kiểm tra)
            with open("output.txt", "wb") as f:
                f.write(out)

        # Trích xuất giá trị DDM RX power từ kết quả đầu ra
            rx_power = None
            w_high = None
            w_low = None
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
                        break

            if rx_power is not None and rx_power.find("N") == -1:
                list.append(
                    {"port": f"{eth_port}", "rx_power": f"{rx_power}", "w_high": w_high, "w_low": w_low})
            else:
                list.append(
                    {"port": f"{eth_port}", "rx_power": 9999, "w_high": 99999, "w_low": 0})

        tn.close()
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        return jsonify({'error': str(e)})


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
                        break

            if rx_power is not None and rx_power.find("N") == -1:
                list.append(
                    {"port": f"{eth_port}", "rx_power": f"{rx_power}", "w_high": w_high, "w_low": w_low})
            else:
                list.append(
                    {"port": f"{eth_port}", "rx_power": 9999, "w_high": 99999, "w_low": 0})

        tn.close()
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        return jsonify({'error': str(e)})


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
                         "w_low": f"{w_low}", "w_high": f"{w_high}"})

        tn.close()
        return jsonify({'RXpower': f"{list}"})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
