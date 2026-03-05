-- ============================================================================
-- LOGISTIX PLATFORM - POSTGRESQL DATABASE SCHEMA
-- Production-Ready Implementation
-- Requires: PostgreSQL 14+ with PostGIS extension
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial operations
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- SECTION 1: ENUMS
-- ============================================================================

CREATE TYPE load_status AS ENUM (
    'POSTED',
    'ASSIGNED',
    'ACCEPTED_BY_DRIVER',
    'IN_TRANSIT',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE truck_status AS ENUM (
    'ACTIVE',
    'MAINTENANCE',
    'INACTIVE'
);

CREATE TYPE cost_category AS ENUM (
    'FUEL',
    'MAINTENANCE',
    'DRIVER_WAGE',
    'INSURANCE',
    'TOLL',
    'PARKING',
    'OTHER'
);

-- ============================================================================
-- SECTION 2: AUTHENTICATION & CORE USER MANAGEMENT
-- ============================================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('ADMIN', 'FLEET_OWNER', 'SHIPPER', 'DRIVER')),
    permissions JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- SECTION 3: DOMAIN-SPECIFIC PROFILES
-- ============================================================================

CREATE TABLE shipper_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    billing_address TEXT,
    contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fleet_owner_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    payout_account_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE driver_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    fleet_owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_type VARCHAR(20),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for driver_profiles
CREATE INDEX idx_driver_fleet_owner ON driver_profiles(fleet_owner_id);
CREATE INDEX idx_driver_available ON driver_profiles(is_available) WHERE is_available = TRUE;

-- ============================================================================
-- SECTION 4: ASSET MANAGEMENT
-- ============================================================================

CREATE TABLE fleets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fleets_owner ON fleets(owner_id);

CREATE TABLE trucks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fleet_id UUID NOT NULL REFERENCES fleets(id) ON DELETE RESTRICT,
    vin VARCHAR(17) UNIQUE NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    year INT CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    max_load_weight DECIMAL(10,2),
    status_enum truck_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for trucks
CREATE INDEX idx_trucks_fleet ON trucks(fleet_id);
CREATE INDEX idx_trucks_status ON trucks(status_enum);
CREATE INDEX idx_trucks_fleet_status ON trucks(fleet_id, status_enum);

-- ============================================================================
-- SECTION 5: MARKETPLACE & WORKFLOW (LOADS)
-- ============================================================================

CREATE TABLE loads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipper_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    origin_address TEXT NOT NULL,
    origin_point GEOMETRY(Point, 4326) NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,
    dest_address TEXT NOT NULL,
    dest_point GEOMETRY(Point, 4326) NOT NULL,
    delivery_deadline TIMESTAMPTZ NOT NULL,
    cargo_details JSONB,
    offered_wage DECIMAL(12,2) NOT NULL CHECK (offered_wage > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    status_enum load_status NOT NULL DEFAULT 'POSTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_deadlines CHECK (delivery_deadline > pickup_deadline)
);

-- Indexes for loads
CREATE INDEX idx_loads_shipper ON loads(shipper_id);
CREATE INDEX idx_loads_status ON loads(status_enum);
CREATE INDEX idx_loads_shipper_status ON loads(shipper_id, status_enum);
CREATE INDEX idx_loads_pickup_deadline ON loads(pickup_deadline);

-- Geospatial indexes
CREATE INDEX idx_loads_origin_point ON loads USING GIST(origin_point);
CREATE INDEX idx_loads_dest_point ON loads USING GIST(dest_point);

CREATE TABLE load_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    load_id UUID UNIQUE NOT NULL REFERENCES loads(id) ON DELETE CASCADE,
    truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE RESTRICT,
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT one_response CHECK (
        (accepted_at IS NULL AND rejected_at IS NULL) OR
        (accepted_at IS NOT NULL AND rejected_at IS NULL) OR
        (accepted_at IS NULL AND rejected_at IS NOT NULL)
    )
);

-- Indexes for load_assignments
CREATE INDEX idx_assignments_load ON load_assignments(load_id);
CREATE INDEX idx_assignments_truck ON load_assignments(truck_id);
CREATE INDEX idx_assignments_driver ON load_assignments(driver_id);
CREATE INDEX idx_assignments_assigned_at ON load_assignments(assigned_at);

-- ============================================================================
-- SECTION 6: REAL-TIME OPERATIONS (GPS TRACKING)
-- ============================================================================

CREATE TABLE location_tracking (
    id BIGSERIAL PRIMARY KEY,
    truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
    load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    speed DECIMAL(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Critical indexes for location_tracking
CREATE INDEX idx_tracking_truck_time ON location_tracking(truck_id, recorded_at DESC);
CREATE INDEX idx_tracking_load ON location_tracking(load_id) WHERE load_id IS NOT NULL;
CREATE INDEX idx_tracking_coordinates ON location_tracking USING GIST(coordinates);

-- Partition location_tracking by month for scalability
-- Example: Create partitions for 2026
CREATE TABLE location_tracking_2026_01 PARTITION OF location_tracking
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE location_tracking_2026_02 PARTITION OF location_tracking
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE location_tracking_2026_03 PARTITION OF location_tracking
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- Continue creating partitions as needed...

-- ============================================================================
-- SECTION 7: FINANCIALS
-- ============================================================================

CREATE TABLE revenue_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    load_id UUID UNIQUE NOT NULL REFERENCES loads(id) ON DELETE RESTRICT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    is_paid BOOLEAN DEFAULT FALSE,
    payment_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_revenue_load ON revenue_entries(load_id);
CREATE INDEX idx_revenue_paid ON revenue_entries(is_paid);
CREATE INDEX idx_revenue_payment_date ON revenue_entries(payment_date);

CREATE TABLE cost_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE RESTRICT,
    load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
    cost_category_enum cost_category NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    cost_date DATE NOT NULL,
    reference_table VARCHAR(50),
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for cost_entries
CREATE INDEX idx_costs_truck ON cost_entries(truck_id);
CREATE INDEX idx_costs_load ON cost_entries(load_id);
CREATE INDEX idx_costs_truck_date ON cost_entries(truck_id, cost_date);
CREATE INDEX idx_costs_category ON cost_entries(cost_category_enum);

-- ============================================================================
-- SECTION 8: OPERATIONAL LOGS
-- ============================================================================

CREATE TABLE fuel_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    gallons_liters DECIMAL(10,2) NOT NULL CHECK (gallons_liters > 0),
    total_cost DECIMAL(10,2) NOT NULL CHECK (total_cost >= 0),
    odometer INT NOT NULL CHECK (odometer >= 0),
    station_name VARCHAR(255),
    station_location GEOMETRY(Point, 4326),
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fuel_logs
CREATE INDEX idx_fuel_truck ON fuel_logs(truck_id);
CREATE INDEX idx_fuel_driver ON fuel_logs(driver_id);
CREATE INDEX idx_fuel_load ON fuel_logs(load_id);
CREATE INDEX idx_fuel_date ON fuel_logs(date);

CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
    odometer INT NOT NULL CHECK (odometer >= 0),
    service_provider VARCHAR(255),
    notes TEXT,
    invoice_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for maintenance_records
CREATE INDEX idx_maintenance_truck ON maintenance_records(truck_id);
CREATE INDEX idx_maintenance_date ON maintenance_records(service_date);

-- ============================================================================
-- SECTION 9: AUDIT LOGS
-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit_logs
CREATE INDEX idx_audit_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_changed_by ON audit_logs(changed_by);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================================
-- SECTION 10: TRIGGERS
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipper_profiles_updated_at BEFORE UPDATE ON shipper_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fleet_owner_profiles_updated_at BEFORE UPDATE ON fleet_owner_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fleets_updated_at BEFORE UPDATE ON fleets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trucks_updated_at BEFORE UPDATE ON trucks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loads_updated_at BEFORE UPDATE ON loads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_load_assignments_updated_at BEFORE UPDATE ON load_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically create cost_entry when fuel_log is inserted
CREATE OR REPLACE FUNCTION create_fuel_cost_entry()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO cost_entries (
        truck_id,
        load_id,
        cost_category_enum,
        amount,
        cost_date,
        reference_table,
        reference_id
    ) VALUES (
        NEW.truck_id,
        NEW.load_id,
        'FUEL',
        NEW.total_cost,
        NEW.date,
        'fuel_logs',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fuel_log_cost_trigger AFTER INSERT ON fuel_logs
    FOR EACH ROW EXECUTE FUNCTION create_fuel_cost_entry();

-- Trigger to automatically create cost_entry when maintenance_record is inserted
CREATE OR REPLACE FUNCTION create_maintenance_cost_entry()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO cost_entries (
        truck_id,
        load_id,
        cost_category_enum,
        amount,
        cost_date,
        reference_table,
        reference_id
    ) VALUES (
        NEW.truck_id,
        NULL,
        'MAINTENANCE',
        NEW.cost,
        NEW.service_date,
        'maintenance_records',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintenance_cost_trigger AFTER INSERT ON maintenance_records
    FOR EACH ROW EXECUTE FUNCTION create_maintenance_cost_entry();

-- ============================================================================
-- SECTION 11: SEED DATA
-- ============================================================================

-- Insert default roles
INSERT INTO roles (name, permissions) VALUES
    ('ADMIN', '{"all": true}'::jsonb),
    ('FLEET_OWNER', '{"manage_trucks": true, "manage_drivers": true, "view_financials": true}'::jsonb),
    ('SHIPPER', '{"post_loads": true, "track_shipments": true}'::jsonb),
    ('DRIVER', '{"view_assignments": true, "update_status": true}'::jsonb);

-- ============================================================================
-- SECTION 12: USEFUL VIEWS
-- ============================================================================

-- View for active loads with shipper info
CREATE VIEW active_loads_view AS
SELECT 
    l.id,
    l.origin_address,
    l.dest_address,
    l.pickup_deadline,
    l.delivery_deadline,
    l.offered_wage,
    l.status_enum,
    sp.company_name as shipper_company,
    u.email as shipper_email
FROM loads l
JOIN users u ON l.shipper_id = u.id
JOIN shipper_profiles sp ON u.id = sp.user_id
WHERE l.status_enum IN ('POSTED', 'ASSIGNED', 'ACCEPTED_BY_DRIVER', 'IN_TRANSIT');

-- View for truck performance metrics
CREATE VIEW truck_performance_view AS
SELECT 
    t.id as truck_id,
    t.license_plate,
    t.make,
    t.model,
    COUNT(DISTINCT la.id) as total_trips,
    COALESCE(SUM(re.amount), 0) as total_revenue,
    COALESCE(SUM(ce.amount), 0) as total_costs,
    COALESCE(SUM(re.amount), 0) - COALESCE(SUM(ce.amount), 0) as net_profit
FROM trucks t
LEFT JOIN load_assignments la ON t.id = la.truck_id AND la.accepted_at IS NOT NULL
LEFT JOIN loads l ON la.load_id = l.id AND l.status_enum = 'COMPLETED'
LEFT JOIN revenue_entries re ON l.id = re.load_id
LEFT JOIN cost_entries ce ON t.id = ce.truck_id
GROUP BY t.id, t.license_plate, t.make, t.model;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
