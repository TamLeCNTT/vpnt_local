import mysql.connector
from mysql.connector import Error


def create_database_and_table():
    try:
        # Kết nối tới MySQL server
        conn = mysql.connector.connect(
             host="localhost",
            user="root",
            password="Dhtthost@3",
            auth_plugin='mysql_native_password'
        )
        if conn.is_connected():
            print("Kết nối thành công tới MySQL server")

            # Tạo một đối tượng cursor
            cursor = conn.cursor()

            # Tạo cơ sở dữ liệu nếu chưa có
            cursor.execute("CREATE DATABASE IF NOT EXISTS vnpt")
            print("Cơ sở dữ liệu 'mydatabase' đã được tạo hoặc đã tồn tại.")

            # Kết nối tới cơ sở dữ liệu mới tạo
            conn.database = 'vnpt'

            # Tạo bảng với các cột: id, diachi, username, password, tenthietbi, loai, port
            # cursor.execute("""
            # CREATE TABLE IF NOT EXISTS suyhao (
            #     id INT AUTO_INCREMENT PRIMARY KEY,
            #     diachi VARCHAR(255),
            #     username VARCHAR(255),
            #     password VARCHAR(255),
            #     tenthietbi VARCHAR(255),
            #     loai VARCHAR(255),
            #     port VARCHAR(255)
            # )
            # """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS mainE (
                id INT AUTO_INCREMENT PRIMARY KEY,
        
                ip VARCHAR(255),
                username VARCHAR(255),
                password VARCHAR(255),
                 tentram VARCHAR(255),
                             tenhethong VARCHAR(255)
            )
            """)
            print("Bảng 'mytable' đã được tạo hoặc đã tồn tại.")

    except Error as e:
        print("Lỗi khi kết nối hoặc tạo bảng:", e)

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("Đã đóng kết nối tới MySQL server")


# Gọi hàm để tạo cơ sở dữ liệu và bảng
create_database_and_table()
