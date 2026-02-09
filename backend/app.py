from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection


app = Flask(__name__)
CORS(app)

DB_PATH = "../database/local_service.db"

def get_db():
    return sqlite3.connect(DB_PATH)

# 1) Create Emergency Request
@app.route("/api/emergency", methods=["POST"])
def create_emergency():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO service_requests
        (user_name, user_phone, service_type, description, is_emergency, status)
        VALUES (%s, %s, %s, %s, 1, 'PENDING')
    """, (
        data["name"],
        data["phone"],
        data["service_type"],
        data["description"]
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Emergency request created"}), 201


# 2) Get Emergency Requests for Provider
@app.route("/api/emergency/<service_type>", methods=["GET"])
def get_emergencies(service_type):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM service_requests
        WHERE service_type=? AND status='PENDING'
    """, (service_type,))

    rows = cur.fetchall()
    conn.close()

    return jsonify(rows)

# 3) Provider Accept Request
@app.route("/api/accept", methods=["POST"])
def accept_request():
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    # assign request
    cur.execute("""
        UPDATE service_requests
        SET status='ASSIGNED', assigned_provider=?
        WHERE id=?
    """, (data["provider_id"], data["request_id"]))

    # set provider BUSY
    cur.execute("""
        UPDATE providers SET availability='BUSY' WHERE id=?
    """, (data["provider_id"],))

    conn.commit()
    conn.close()

    return jsonify({"message": "Request assigned"})

if __name__ == "__main__":
    app.run(debug=True)
