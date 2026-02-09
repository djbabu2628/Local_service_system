import sqlite3

conn = sqlite3.connect("../../database/local_service.db")
cursor = conn.cursor()

with open("schema.sql", "r") as f:
    cursor.executescript(f.read())

conn.commit()
conn.close()

print("Database & tables created successfully")
