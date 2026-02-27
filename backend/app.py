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
    try:
        data = request.json
        request_id = data.get("request_id")
        provider_id = data.get("provider_id")

        conn = get_db_connection()
        cur = conn.cursor()

        # Accept only if still pending
        cur.execute("""
            UPDATE service_requests
            SET status = 'ASSIGNED',
                assigned_provider = %s
            WHERE id = %s AND status = 'PENDING'
        """, (provider_id, request_id))

        if cur.rowcount == 0:
            cur.close()
            conn.close()
            return jsonify({"error": "Request already assigned"}), 400

        # Mark provider busy
        cur.execute("""
            UPDATE providers
            SET availability = 'BUSY'
            WHERE id = %s
        """, (provider_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Request assigned successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------
# COMPLETE JOB
# ----------------------------
@app.route("/api/complete", methods=["POST"])
def complete_request():
    try:
        data = request.json
        request_id = data.get("request_id")
        provider_id = data.get("provider_id")

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE service_requests
            SET status = 'COMPLETED',
                completed_at = NOW()
            WHERE id = %s AND assigned_provider = %s
        """, (request_id, provider_id))

        cur.execute("""
            UPDATE providers
            SET availability = 'AVAILABLE'
            WHERE id = %s
        """, (provider_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Job completed successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------------------
# TRACK REQUEST (USER SIDE)
# ----------------------------
@app.route("/api/track/<phone>", methods=["GET"])
def track_request(phone):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT sr.status, p.name
            FROM service_requests sr
            LEFT JOIN providers p
            ON sr.assigned_provider = p.id
            WHERE sr.user_phone = %s
            ORDER BY sr.id DESC
            LIMIT 1
        """, (phone,))

        result = cur.fetchone()

        cur.close()
        conn.close()

        if not result:
            return jsonify({"message": "No request found"})

        return jsonify({
            "status": result[0],
            "provider_name": result[1] if result[1] else None
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# New route 
@app.route("/api/provider/jobs/<int:provider_id>/<service_type>", methods=["GET"])
def get_provider_jobs(provider_id, service_type):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1️⃣ Pending jobs
        cur.execute("""
            SELECT * FROM service_requests
            WHERE service_type = %s AND status = 'PENDING'
        """, (service_type,))
        pending_jobs = cur.fetchall()

        # 2️⃣ Active job (assigned to this provider)
        cur.execute("""
            SELECT * FROM service_requests
            WHERE assigned_provider = %s AND status = 'ASSIGNED'
        """, (provider_id,))
        active_job = cur.fetchone()

        cur.close()
        conn.close()

        return jsonify({
            "pending": pending_jobs,
            "active": active_job
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# New route for log-in
@app.route("/api/provider/login", methods=["POST"])
def provider_login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name FROM providers
        WHERE email = %s AND password = %s
    """, (email, password))

    provider = cur.fetchone()

    cur.close()
    conn.close()

    if provider:
        return jsonify({
            "success": True,
            "provider_id": provider[0],
            "provider_name": provider[1]
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        })



@app.route("/api/provider/<int:id>", methods=["GET"])
def get_provider(id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT availability FROM providers WHERE id = %s", (id,))
    result = cur.fetchone()

    cur.close()
    conn.close()

    return jsonify({"availability": result[0]})

# ----------------------------
# RUN SERVER
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)

