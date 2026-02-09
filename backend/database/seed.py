import sqlite3

conn = sqlite3.connect("../../database/local_service.db")
cur = conn.cursor()

providers = [
    ("Ramesh", "plumber", "9991112221", "FREE"),
    ("Suresh", "electrician", "9991112222", "FREE"),
    ("Mahesh", "mechanic", "9991112223", "BUSY"),
]

cur.executemany(
    "INSERT INTO providers (name, service_type, phone, availability) VALUES (?,?,?,?)",
    providers
)

conn.commit()
conn.close()
print("Sample providers inserted")
