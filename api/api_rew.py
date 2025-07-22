import telnetlib3
import asyncio
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

OLT_HOST = "10.102.54.26"  # Thay bằng IP OLT của bạn
OLT_PORT = 23
OLT_USER = "isadmin"        # Tài khoản OLT
OLT_PASS = "ans#150"        # Mật khẩu OLT

# Lưu kết nối Telnet
telnet_session = None

async def telnet_connect():
    """ Kết nối Telnet và đăng nhập """
    global telnet_session
    if telnet_session:
        return telnet_session  # Dùng lại kết nối cũ nếu có
    
    reader, writer = await telnetlib3.open_connection(OLT_HOST, OLT_PORT)
    
    # Đăng nhập vào OLT
    await reader.readuntil(b"login:")
    writer.write(OLT_USER + "\n")
    await reader.readuntil(b"assword:")
    writer.write(OLT_PASS + "\n")
    
    await reader.readuntil(b"#")  # Đợi OLT sẵn sàng
    telnet_session = (reader, writer)  # Lưu kết nối
    return reader, writer

@socketio.on("connect")
def handle_connect():
    print("Client connected!")

@socketio.on("send_command")
def handle_command(data):
    """ Nhận lệnh từ React, gửi đến OLT và trả kết quả """
    command = data.get("command", "").strip()
    if command:
        response = asyncio.run(execute_command(command))
        socketio.emit("command_response", {"response": response})

async def execute_command(command, sid):
    reader, writer = await telnet_connect()
    writer.write(command + "\n")
    await writer.drain()

    while True:
        line = await reader.readline()  # Đọc từng dòng từ Telnet
        if not line:
            break

        formatted_line = line.decode(errors="ignore")  # Giữ nguyên định dạng
        socketio.emit("command_response", {"response": formatted_line}, room=sid)  # Gửi về React

    writer.write("exit\n")
    await writer.drain()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
