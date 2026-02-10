from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection

app = Flask(__name__)
CORS(app)

# ----------------------------
# HOME ROUTE (TEST)
# ----------------------------
@app.route("/")
def home():
    return "Backend is running successfully"


# ----------------------------
# CREATE EMERGENCY REQUEST
# ----------------------------
@app.route("/api/emergency", methods=["POST"])
def create_emergency():
    data = request.json

    name = data.get("name")
    phone = data.get("phone")
    service_type = data.get("service_type")
    description = data.get("description")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO service_requests
        (user_name, user_phone, service_type, description, is_emergency, status)
        VALUES (%s, %s, %s, %s, 1, 'PENDING')
        """,
        (name, phone, service_type, description)
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Emergency request created"})


# ----------------------------
# GET EMERGENCY REQUESTS (PROVIDER SIDE)
# ----------------------------
@app.route("/api/emergency/<service_type>", methods=["GET"])
def get_emergencies(service_type):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT * FROM service_requests
        WHERE service_type = %s AND status = 'PENDING'
        """,
        (service_type,)
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(rows)


# ----------------------------
# ACCEPT EMERGENCY REQUEST
# ----------------------------
@app.route("/api/accept", methods=["POST"])
def accept_request():
    data = request.json
    request_id = data.get("request_id")
    provider_id = data.get("provider_id")

    conn = get_db_connection()
    cur = conn.cursor()

    # Assign request
    cur.execute(
        """
        UPDATE service_requests
        SET status = 'ASSIGNED', assigned_provider = %s
        WHERE id = %s
        """,
        (provider_id, request_id)
    )

    # Mark provider busy
    cur.execute(
        """
        UPDATE providers
        SET availability = 'BUSY'
        WHERE id = %s
        """,
        (provider_id,)
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Request assigned successfully"})


# ----------------------------
# RUN SERVER
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)
