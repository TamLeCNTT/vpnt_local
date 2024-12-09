import pandas as pd
import mysql.connector
from mysql.connector import Error
import bcrypt


def insert_data_from_excel(file_path):
    try:
        # Kết nối tới MySQL server và cơ sở dữ liệu
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Dhtthost@3",
            database="vnpt"
        )
        if conn.is_connected():
            print("Kết nối thành công tới MySQL server và cơ sở dữ liệu 'mydatabase'")

            # Đọc dữ liệu từ file Excel
            df = pd.read_excel(file_path)

            # Tạo một đối tượng cursor
            cursor = conn.cursor()

            # Thêm dữ liệu vào bảng
            for index, row in df.iterrows():
                hashed_diachi = bcrypt.hashpw(
                    row['diachi'].encode('utf-8'), bcrypt.gensalt())
                hashed_username = bcrypt.hashpw(
                    row['username'].encode('utf-8'), bcrypt.gensalt())
                hashed_password = bcrypt.hashpw(
                    row['password'].encode('utf-8'), bcrypt.gensalt())

                sql = """
                INSERT INTO suyhao (id, diachi, username, password, tenthietbi, loai, port)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                values = (row['id'], hashed_diachi.decode('utf-8'), hashed_username.decode('utf-8'),
                          hashed_password.decode('utf-8'), row['tenthietbi'], row['loai'], row['port'])
                cursor.execute(sql, values)

            # Lưu thay đổi
            conn.commit()
            print("Dữ liệu đã được thêm vào bảng 'mytable'")

    except Error as e:
        print("Lỗi khi kết nối hoặc thêm dữ liệu:", e)

    finally:
        if conn.is_connected():
            # cursor.close()
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


# Đường dẫn tới file Excel
file_path = 'data_suyhao.xlsx'

# Gọi hàm để thêm dữ liệu từ file Excel vào bảng
insert_data_from_excel(file_path)
