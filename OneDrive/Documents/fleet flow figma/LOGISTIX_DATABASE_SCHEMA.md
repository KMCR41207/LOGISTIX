# Logistix Platform - Complete Database Schema
## Production-Ready PostgreSQL Implementation

---

## SECTION 1: DATABASE ENTITY RELATIONSHIP DIAGRAM (ERD)

PostgreSQL is recommended for its robust support for constraints, enums, JSONB (for unstructured audit logs/settings), and PostGIS (for GPS tracking).

**Notation Key:**
- **PK**: Primary Key (UUID recommended for distributed systems)
- **FK**: Foreign Key
- **UK**: Unique Constraint

---

### 1.1 Authentication & Core User Management

#### Table: roles
Defines system access levels.

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | SERIAL | PK | Internal identifier |
| name | VARCHAR(50) | UK, NOT NULL | 'ADMIN', 'FLEET_OWNER', 'SHIPPER', 'DRIVER' |
| permissions | JSONB | | Fine-grained application permissions |

#### Table: users
Central identity table. Authentication handles login, this table holds the resulting ID and associated role.

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | Global identifier |
| email | VARCHAR(255) | UK, NOT NULL | Login credential |
| password_hash | VARCHAR(255) | NOT NULL | Argon2 or bcrypt hash |
| role_id | INT | FK, NOT NULL | References roles.id |
| created_at | TIMESTAMPTZ | NOT NULL | Audit |
| updated_at | TIMESTAMPTZ | NOT NULL | Audit |
| is_active | BOOLEAN | DEFAULT TRUE | For soft locking users |

---

### 1.2 Profiles (Domain Specific)

Using a 1:1 relationship with the users table for domain-specific data minimizes sparse columns and improves query performance on core auth tables.

#### Table: shipper_profiles

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| user_id | UUID | PK, FK | References users.id |
| company_name | VARCHAR(255) | NOT NULL | |
| billing_address | TEXT | | |
| contact_phone | VARCHAR(20) | | |

#### Table: fleet_owner_profiles

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| user_id | UUID | PK, FK | References users.id |
| company_name | VARCHAR(255) | NOT NULL | |
| tax_id | VARCHAR(50) | | |
| payout_account_id | VARCHAR(255) | | Link to Stripe/Connect for payouts |

#### Table: driver_profiles

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| user_id | UUID | PK, FK | References users.id |
| fleet_owner_id | UUID | FK, NOT NULL | References users.id (Fleet Owner) |
| license_number | VARCHAR(50) | NOT NULL | |
| license_type | VARCHAR(20) | | e.g., 'CDL Class A' |
| is_available | BOOLEAN | DEFAULT TRUE | Manual/System toggle for availability |

---

### 1.3 Asset Management

#### Table: fleets
Used if a single Fleet Owner manages distinct logical groups of trucks (e.g., Regional vs. Long Haul).

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| owner_id | UUID | FK, NOT NULL | References users.id (Fleet Owner) |
| name | VARCHAR(100) | NOT NULL | |

#### Table: trucks

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| fleet_id | UUID | FK, NOT NULL | References fleets.id |
| vin | VARCHAR(17) | UK, NOT NULL | Vehicle Identification Number |
| license_plate | VARCHAR(20) | UK, NOT NULL | |
| make | VARCHAR(50) | | |
| model | VARCHAR(50) | | |
| max_load_weight | DECIMAL(10,2) | | For matching logic |
| status_enum | INT | NOT NULL | References Enum TruckStatus |

---

### 1.4 The Marketplace & Workflow (Loads)

#### Table: loads
The core transactional object of the marketplace.

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| shipper_id | UUID | FK, NOT NULL | References users.id (Shipper) |
| origin_address | TEXT | NOT NULL | Human readable origin |
| origin_point | GEOMETRY(Point, 4326) | INDEX | PostGIS point (Lon/Lat) |
| pickup_deadline | TIMESTAMPTZ | NOT NULL | |
| dest_address | TEXT | NOT NULL | Human readable destination |
| dest_point | GEOMETRY(Point, 4326) | INDEX | PostGIS point (Lon/Lat) |
| delivery_deadline | TIMESTAMPTZ | NOT NULL | |
| cargo_details | JSONB | | Weight, volume, hazmat status, etc. |
| offered_wage | DECIMAL(12,2) | NOT NULL | Gross revenue to Fleet Owner |
| currency | VARCHAR(3) | DEFAULT 'USD' | |
| status_enum | INT | NOT NULL | References Enum LoadStatus |

#### Table: load_assignments
Connects the marketplace Load to the physical assets executing it.

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| load_id | UUID | FK, UK, NOT NULL | References loads.id (1 Load : 1 Active Assignment) |
| truck_id | UUID | FK, NOT NULL | References trucks.id |
| driver_id | UUID | FK, NOT NULL | References users.id (Driver) |
| assigned_at | TIMESTAMPTZ | NOT NULL | When Fleet Owner assigned assets |
| accepted_at | TIMESTAMPTZ | | When Driver accepted |
| rejected_at | TIMESTAMPTZ | | When Driver rejected |
| rejection_reason | TEXT | | |

---

### 1.5 Real-Time Operations

#### Table: location_tracking
High-write table designed for optimization (time-series).

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | BIGSERIAL | PK | Long integer PK needed due to high volume |
| truck_id | UUID | FK, NOT NULL | References trucks.id |
| load_id | UUID | FK | References loads.id (nullable, only set when on assignment) |
| coordinates | GEOMETRY(Point, 4326) | NOT NULL | Current GPS point |
| recorded_at | TIMESTAMPTZ | NOT NULL, INDEX | Timestamp from GPS device |
| speed | DECIMAL(5,2) | | km/h or mph |

---

### 1.6 Financials, Maintenance & Logs

#### Table: revenue_entries
Gross earnings directly tied to loads.

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| load_id | UUID | FK, UK, NOT NULL | References loads.id |
| amount | DECIMAL(12,2) | NOT NULL | Matched loads.offered_wage |
| is_paid | BOOLEAN | DEFAULT FALSE | Status of payment from Shipper to SVLT |
| payment_date | DATE | | |

#### Table: cost_entries
Granular cost tracking per truck or load.

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| truck_id | UUID | FK, NOT NULL | References trucks.id |
| load_id | UUID | FK | References loads.id (nullable, for variable costs like fuel during a load) |
| cost_category_enum | INT | NOT NULL | 'FUEL', 'MAINTENANCE', 'DRIVER_WAGE', 'INSURANCE' |
| amount | DECIMAL(12,2) | NOT NULL | |
| cost_date | DATE | NOT NULL | |
| reference_table | VARCHAR(50) | | e.g., 'fuel_logs', 'maintenance_records' |
| reference_id | UUID | | FK to the source record |

#### Table: fuel_logs

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| truck_id | UUID | FK, NOT NULL | References trucks.id |
| driver_id | UUID | FK, NOT NULL | References users.id (Driver submitting log) |
| load_id | UUID | FK | References loads.id (null if fueling between loads) |
| date | DATE | NOT NULL | |
| gallons_liters | DECIMAL(10,2) | NOT NULL | |
| total_cost | DECIMAL(10,2) | NOT NULL | Generates linked cost_entries record |
| odometer | INT | NOT NULL | For IFTA/efficiency tracking |

#### Table: maintenance_records

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| id | UUID | PK | |
| truck_id | UUID | FK, NOT NULL | References trucks.id |
| service_date | DATE | NOT NULL | |
| service_type | VARCHAR(100) | | e.g., 'Oil Change', 'Tire Rotation' |
| cost | DECIMAL(10,2) | NOT NULL | Generates linked cost_entries record |
| odometer | INT | NOT NULL | |

---

## SECTION 2: RELATIONSHIP & CARDINALITY LOGIC

### Fleet Owner Profile & Fleets (1:N)
A unique user registered as a FleetOwner can manage multiple logically separated fleets of trucks. A Fleet must belong to exactly one FleetOwner.

### Fleet & Trucks (1:N)
A Fleet aggregates multiple trucks. Each Truck belongs to exactly one Fleet, which dictates its ultimate ownership.

### Driver & Truck (Semi-permanent 1:1, Historic 1:N)
**System Requirement:** "One Driver can be assigned to one Truck at a time."

**Implementation:** Enforced by software logic checking active LoadAssignment records. In the DB, the connection is historic via load_assignments. 

**Alternative strategy:** A current_driver_id column on trucks is technically feasible but creates complex state management during off-hours/shift changes. The assignment-based approach is cleaner.

### Shipper Profile & Loads (1:N)
One unique user registered as a Shipper posts many Loads. A Load is posted by exactly one Shipper.

### Load & Load Assignment (1:1 Active)
A posted Load can be assigned to exactly one set of assets (Truck + Driver) for execution at any given time. The Unique Constraint on load_id in the load_assignments table enforces this. If an assignment is rejected, the record is flagged or deleted, and a new 1:1 assignment can be created.

### Load Assignment & Truck/Driver (N:1)
A unique LoadAssignment record links exactly one Truck and one Driver to a Load. Historically, a specific Truck or Driver will appear in many different LoadAssignment records.

### Truck & Location Tracking (1:N)
A Truck generates thousands of location entries over its lifespan. Location tracking must enforce integrity with the Truck, regardless of whether a load is currently assigned.

### Loads, Revenue, and Costs (1:1:N)
- A completed Load generates exactly one Revenue entry (Gross).
- A completed Load can be associated with many Cost entries (Driver wage payout, fuel consumed specific to that load, allocated insurance). 
- These entries aggregate to calculate Net Profit per Load.

---

## SECTION 3: BUSINESS LOGIC FLOW

### A) Shipper Posts a Load

```
INPUT: Shipper submits form (origin, dest, deadline, offered_wage)
       origin/dest addresses are geocoded to Lat/Lon points

VALIDATION: 
  - Validate geocoding
  - offered wage (>0)
  - future-dated deadlines

DB INSERT: Create new record in loads table

STATE CHANGE: LoadStatus = POSTED

EVENT: Emit LOAD_POSTED event to Marketplace via WebSocket/PubSub
```

### B) Fleet Owner Views Available Loads

```
QUERY: Fleet Owner requests available loads

DB READ: 
  - Query loads table where status_enum = POSTED
  - Query includes geography distance from Fleet Owner's yard if preferred 
    (using PostGIS)

FILTERING: 
  - Exclude loads already claimed by other fleet owners via optimistic 
    locking mechanisms (if applicable in marketplace logic)

RESPONSE: Deliver JSON payload of loads
```

### C) Fleet Owner Assigns Truck + Driver

```
INPUT: Fleet Owner selects Load ID, Truck ID, Driver ID

VALIDATION:
  - Verify selected Driver and Truck belong to the Fleet Owner's profile
  - Verify Driver (driver_profiles.is_available = True)
  - Verify Truck (trucks.status_enum = ACTIVE)

DB TRANSACTION:
  - Create record in load_assignments
  - Update loads.status_enum = ASSIGNED

EVENT: Push notification to selected Driver's mobile app
```

### D) Driver Accepts/Rejects Job

```
INPUT: Driver selects 'Accept' on mobile app

VALIDATION: 
  - Verify load_assignments record still exists 
    (Fleet Owner hasn't rescinded it)

DB TRANSACTION:
  - Set load_assignments.accepted_at = NOW()
  - Set driver_profiles.is_available = FALSE
  - Update loads.status_enum = ACCEPTED_BY_DRIVER

EVENT: Emit notification to Fleet Owner
```

### E) Load Status Lifecycle Updates

The system receives events from Driver Mobile App (manual update or geofence trigger):

```
EVENT: Start Driving
  → Validate Driver is in proximity to origin
  → Update loads.status_enum = IN_TRANSIT

EVENT: GPS Update
  → Insert into location_tracking
  → Software logic updates ETA based on current coordinates and destination

EVENT: Arrive Destination
  → Validate GPS coordinates are within geofence of dest_point
  → Driver app requires electronic Proof of Delivery (ePOD) capture 
    (signature/photo)

DB TRANSACTION (Finalization):
  → Update ePOD metadata in loads.cargo_details
  → Update loads.status_enum = DELIVERED
  → Update driver_profiles.is_available = TRUE
```

### F) Revenue, Cost, & Profit Calculation Flow

Triggered upon the loads.status_enum reaching DELIVERED.

```
CALCULATE REVENUE:
  - Retrieve loads.offered_wage

DB INSERT (Revenue):
  - Create record in revenue_entries matching the load amount

CALCULATE COSTS (Fixed/Variable):
  - System creates cost_entries (category: DRIVER_WAGE) based on 
    pre-configured Fleet Owner settings for that driver (per-mile or fixed)
  - System queries fuel_logs associated with the Truck + Driver during 
    the time window between load_assignments.accepted_at and load completion 
    to generate variable cost_entries for fuel

AGGREGATION (The Formula):
  Net Profit per Load = revenue_entries.amount - 
                        SUM(cost_entries.amount related to load_id)

  Fleet Dashboard Aggregate = Query all trucks.id under Fleet Owner
    → SUM(revenue_entries.amount) - SUM(cost_entries.amount) 
      for the requested time frame (Month/Quarter)
```

---

## SECTION 4: PERMISSION MATRIX (RBAC)

Access levels enforce data compartmentalization necessary for a multi-tenant platform.

| Resource / Action | Admin (SVLT) | Fleet Owner (FO) | Driver | Shipper |
|-------------------|--------------|------------------|--------|---------|
| User/Role Mgmt | ALL | Manage Drivers linked to FO Profile | Self only | Manage own profile |
| Shipper Profiles | ALL | None | None | Own only |
| Trucks | ALL | Own Only (CRUD) | None | None |
| Loads (Posted) | ALL | View All available | None | Own Only (Create/View) |
| Loads (Executing) | ALL | View own assignments | View assigned only | View own (limited detail) |
| Load Assignment | ALL | Own Only (Manage) | None (Accept/Reject only) | None |
| Financials (Rev/Cost) | ALL | View own aggregates/details | View own earnings logs | View own invoices |
| Tracking Data | ALL | View own active trucks | None | View own shipments only |

---

## SECTION 5: DATABASE OPTIMIZATION SPECIFICATION

Production-grade configurations for Postgres.

### 5.1 Status Enums (Database Constraints)

The following enums are critical for enforcing business logic and must be declared in the DB to prevent invalid state injection.

**LoadStatus:**
- 1: POSTED
- 2: ASSIGNED
- 3: ACCEPTED_BY_DRIVER
- 4: IN_TRANSIT
- 5: DELIVERED
- 6: COMPLETED (Paid)
- 7: CANCELLED

**TruckStatus:**
- 1: ACTIVE
- 2: MAINTENANCE
- 3: INACTIVE (No longer in use)

### 5.2 Indexing Recommendations

Beyond standard PK indexes:

**Performance Indexes (Composite):** Optimize common Fleet Owner dashboard queries:
- `trucks (fleet_id, status_enum)`
- `loads (shipper_id, status_enum)`
- `cost_entries (truck_id, cost_date)`

**Time-Series Optimization:**
- `location_tracking (truck_id, recorded_at DESC)`: Absolutely required for rapid historical replay and current position lookup

**Geospatial Indexes:**
- GIST indexes on `loads.origin_point`, `loads.dest_point`, and `location_tracking.coordinates`

### 5.3 Foreign Key & Constraint Strategy

**Strong Consistency:** Use restrictive foreign key constraints (e.g., `ON DELETE RESTRICT`) for transactional data to prevent orphan records. For example, do not delete a Truck if cost_entries refer to it.

**Unique Constraints:** Enforced on VIN, License Plates, Emails, and the 1:1 active LoadAssignment link.

### 5.4 Audit Logs & Soft Deletes

**Soft Deletes:** Use an `is_active` boolean on the `users` and `trucks` tables. Transactional data (Loads, Financials, Assignments) must not be soft-deleted; they should move to a 'CANCELLED' or 'INACTIVE' status via the status enums to preserve financial history.

**System Audit Log (JSONB):** Create a system-wide `audit_logs` table:
- id
- table_name
- record_id
- changed_by
- old_values (jsonb)
- new_values (jsonb)
- timestamp

Track critical changes, particularly in the loads, roles, and financial tables.

---

## SECTION 6: SAAS SCALABILITY NOTES

To handle the anticipated high write volume from GPS tracking and multi-tenant marketplace traffic:

### Read/Write Splitting
Implement Postgres Master/Replica architecture. Direct all GPS write traffic (location_tracking) to the Master, and Fleet Owner analytical/dashboard reads to Replicas.

### PostGIS Proximity Querying
For the marketplace, do not use naive linear distance math. Use the PostGIS `ST_DWithin` function combined with GIST indexes to efficiently find trucks near available loads within a given radius.

### Time-Series Partitioning
The `location_tracking` table must be partitioned by time (e.g., monthly). This keeps indexes small, maintains fast lookup times for active trucks, and allows for efficient archival/pruning of old tracking data (e.g., dropping partitions older than 1 year).

### Asynchronous Cost Generation
Payout calculations and variable cost aggregations should not be done synchronously on the request-response cycle. Use a reliable event processor (e.g., Kafka or RabbitMQ) to trigger financial record creation in the background upon a load status changing to 'DELIVERED'.

### Multi-Tenancy Isolation
If SVLT requires extreme data isolation (e.g., for regulatory compliance), consider moving from a single shared schema (current design) to an "Isolated Schema per Tenant" (Fleet Owner) approach. This increases maintenance overhead but simplifies database backups and strict data separation. However, for a marketplace connector, the shared schema is the optimized default.

---

**END OF DATABASE SCHEMA DOCUMENTATION**
