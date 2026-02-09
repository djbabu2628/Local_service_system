CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT
);

CREATE TABLE IF NOT EXISTS providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    service_type TEXT,
    phone TEXT,
    availability TEXT
);

CREATE TABLE IF NOT EXISTS service_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    user_phone TEXT,
    service_type TEXT,
    description TEXT,
    is_emergency INTEGER,
    status TEXT,
    assigned_provider INTEGER
);
