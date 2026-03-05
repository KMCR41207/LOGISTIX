# Logistix Platform - Complete System Architecture
## Created by SVLT

---

## TABLE OF CONTENTS
1. [Entity Relationship Diagram (ERD)](#section-1-entity-relationship-diagram)
2. [Relationships Logic](#section-2-relationships-logic)
3. [Business Logic Flow](#section-3-business-logic-flow)
4. [Permission Matrix](#section-4-permission-matrix)
5. [Database Optimization](#section-5-database-optimization)
6. [Revenue & Profit Calculation](#section-6-revenue-profit-calculation)

---

## SECTION 1: ENTITY RELATIONSHIP DIAGRAM

### 1. User
```sql
Table: users
Primary Key: user_id (UUID)

Attributes:
- user_id: UUID (PK)
- email: VARCHAR(255) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- phone: VARCHAR(20)
- first_name: VARCHAR(100)
- last_name: VARCHAR(100)
- role_id: INT (FK → roles.role_id)
- is_active: BOOLEAN DEFAULT true
- email_verified: BOOLEAN DEFAULT false
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- last_login: TIMESTAMP
- deleted_at: TIMESTAMP (soft delete)

Indexes:
- PRIMARY KEY (user_id)
- UNIQUE INDEX idx_email (email)
- INDEX idx_role (role_id)
- INDEX idx_active (is_active, deleted_at)
```

### 2. Role
```sql
Table: roles
Primary Key: role_id (INT)

Attributes:
- role_id: INT (PK, AUTO_INCREMENT)
- role_name: ENUM('admin', 'fleet_owner', 'driver', 'shipper')
- description: TEXT
- created_at: TIMESTAMP

Indexes:
- PRIMARY KEY (role_id)
- UNIQUE INDEX idx_role_name (role_name)
```

### 3. FleetOwnerProfile
```sql
Table: fleet_owner_profiles
Primary Key: fleet_owner_id (UUID)

Attributes:
- fleet_owner_id: UUID (PK)
- user_id: UUID (FK → users.user_id) UNIQUE
- company_name: VARCHAR(255)
- business_license: VARCHAR(100)
- tax_id: VARCHAR(50)
- address: TEXT
- city: VARCHAR(100)
- state: VARCHAR(50)
- zip_code: VARCHAR(20)
- country: VARCHAR(100)
- bank_account_number: VARCHAR(100) ENCRYPTED
- bank_routing_number: VARCHAR(50) ENCRYPTED
- total_trucks: INT DEFAULT 0
- total_revenue: DECIMAL(15,2) DEFAULT 0
- total_profit: DECIMAL(15,2) DEFAULT 0
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (fleet_owner_id)
- UNIQUE INDEX idx_user (user_id)
- INDEX idx_company (company_name)
```

### 4. DriverProfile
```sql
Table: driver_profiles
Primary Key: driver_id (UUID)

Attributes:
- driver_id: UUID (PK)
- user_id: UUID (FK → users.user_id) UNIQUE
- license_number: VARCHAR(50) UNIQUE NOT NULL
- license_expiry: DATE
- license_state: VARCHAR(50)
- cdl_class: ENUM('A', 'B', 'C')
- endorsements: VARCHAR(100)
- date_of_birth: DATE
- address: TEXT
- city: VARCHAR(100)
- state: VARCHAR(50)
- zip_code: VARCHAR(20)
- emergency_contact_name: VARCHAR(100)
- emergency_contact_phone: VARCHAR(20)
- current_truck_id: UUID (FK → trucks.truck_id) NULLABLE
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- status: ENUM('available', 'on_trip', 'off_duty', 'suspended') DEFAULT 'available'
- total_earnings: DECIMAL(12,2) DEFAULT 0
- rating: DECIMAL(3,2) DEFAULT 5.00
- total_trips: INT DEFAULT 0
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (driver_id)
- UNIQUE INDEX idx_user (user_id)
- UNIQUE INDEX idx_license (license_number)
- INDEX idx_fleet_owner (fleet_owner_id)
- INDEX idx_current_truck (current_truck_id)
- INDEX idx_status (status)
```

### 5. ShipperProfile
```sql
Table: shipper_profiles
Primary Key: shipper_id (UUID)

Attributes:
- shipper_id: UUID (PK)
- user_id: UUID (FK → users.user_id) UNIQUE
- company_name: VARCHAR(255)
- business_license: VARCHAR(100)
- tax_id: VARCHAR(50)
- address: TEXT
- city: VARCHAR(100)
- state: VARCHAR(50)
- zip_code: VARCHAR(20)
- country: VARCHAR(100)
- industry_type: VARCHAR(100)
- payment_terms: ENUM('prepaid', 'net_15', 'net_30', 'net_60')
- credit_limit: DECIMAL(12,2)
- total_loads_posted: INT DEFAULT 0
- rating: DECIMAL(3,2) DEFAULT 5.00
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (shipper_id)
- UNIQUE INDEX idx_user (user_id)
- INDEX idx_company (company_name)
```

### 6. Fleet
```sql
Table: fleets
Primary Key: fleet_id (UUID)

Attributes:
- fleet_id: UUID (PK)
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- fleet_name: VARCHAR(255)
- description: TEXT
- total_trucks: INT DEFAULT 0
- active_trucks: INT DEFAULT 0
- total_revenue: DECIMAL(15,2) DEFAULT 0
- total_costs: DECIMAL(15,2) DEFAULT 0
- total_profit: DECIMAL(15,2) DEFAULT 0
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (fleet_id)
- INDEX idx_fleet_owner (fleet_owner_id)
```

### 7. Truck
```sql
Table: trucks
Primary Key: truck_id (UUID)

Attributes:
- truck_id: UUID (PK)
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- fleet_id: UUID (FK → fleets.fleet_id) NULLABLE
- vin: VARCHAR(17) UNIQUE NOT NULL
- license_plate: VARCHAR(20) UNIQUE NOT NULL
- make: VARCHAR(100)
- model: VARCHAR(100)
- year: INT
- truck_type: ENUM('dry_van', 'refrigerated', 'flatbed', 'tanker', 'box_truck')
- capacity_weight: DECIMAL(10,2)
- capacity_volume: DECIMAL(10,2)
- current_driver_id: UUID (FK → driver_profiles.driver_id) NULLABLE
- status: ENUM('available', 'assigned', 'in_transit', 'maintenance', 'inactive') DEFAULT 'available'
- current_location_lat: DECIMAL(10,8)
- current_location_lng: DECIMAL(11,8)
- last_location_update: TIMESTAMP
- odometer: DECIMAL(10,2)
- insurance_policy: VARCHAR(100)
- insurance_expiry: DATE
- registration_expiry: DATE
- total_revenue: DECIMAL(12,2) DEFAULT 0
- total_costs: DECIMAL(12,2) DEFAULT 0
- total_profit: DECIMAL(12,2) DEFAULT 0
- total_trips: INT DEFAULT 0
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- deleted_at: TIMESTAMP (soft delete)

Indexes:
- PRIMARY KEY (truck_id)
- UNIQUE INDEX idx_vin (vin)
- UNIQUE INDEX idx_license_plate (license_plate)
- INDEX idx_fleet_owner (fleet_owner_id)
- INDEX idx_fleet (fleet_id)
- INDEX idx_current_driver (current_driver_id)
- INDEX idx_status (status, deleted_at)
- INDEX idx_location (current_location_lat, current_location_lng)
```

### 8. Load
```sql
Table: loads
Primary Key: load_id (UUID)

Attributes:
- load_id: UUID (PK)
- shipper_id: UUID (FK → shipper_profiles.shipper_id)
- load_number: VARCHAR(50) UNIQUE NOT NULL
- cargo_type: VARCHAR(100)
- cargo_description: TEXT
- weight: DECIMAL(10,2)
- volume: DECIMAL(10,2)
- required_truck_type: ENUM('dry_van', 'refrigerated', 'flatbed', 'tanker', 'box_truck')
- pickup_address: TEXT NOT NULL
- pickup_city: VARCHAR(100)
- pickup_state: VARCHAR(50)
- pickup_zip: VARCHAR(20)
- pickup_lat: DECIMAL(10,8)
- pickup_lng: DECIMAL(11,8)
- pickup_date: TIMESTAMP
- delivery_address: TEXT NOT NULL
- delivery_city: VARCHAR(100)
- delivery_state: VARCHAR(50)
- delivery_zip: VARCHAR(20)
- delivery_lat: DECIMAL(10,8)
- delivery_lng: DECIMAL(11,8)
- delivery_date: TIMESTAMP
- distance: DECIMAL(10,2)
- offered_rate: DECIMAL(10,2) NOT NULL
- driver_wage: DECIMAL(10,2)
- special_instructions: TEXT
- status: ENUM('posted', 'assigned', 'in_transit', 'delivered', 'completed', 'cancelled') DEFAULT 'posted'
- priority: ENUM('standard', 'urgent', 'critical') DEFAULT 'standard'
- requires_signature: BOOLEAN DEFAULT false
- requires_insurance: BOOLEAN DEFAULT false
- temperature_controlled: BOOLEAN DEFAULT false
- temperature_min: DECIMAL(5,2) NULLABLE
- temperature_max: DECIMAL(5,2) NULLABLE
- posted_at: TIMESTAMP
- assigned_at: TIMESTAMP
- pickup_completed_at: TIMESTAMP
- delivered_at: TIMESTAMP
- completed_at: TIMESTAMP
- cancelled_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (load_id)
- UNIQUE INDEX idx_load_number (load_number)
- INDEX idx_shipper (shipper_id)
- INDEX idx_status (status)
- INDEX idx_pickup_date (pickup_date)
- INDEX idx_delivery_date (delivery_date)
- INDEX idx_truck_type (required_truck_type)
- INDEX idx_pickup_location (pickup_lat, pickup_lng)
- INDEX idx_delivery_location (delivery_lat, delivery_lng)
```

### 9. LoadAssignment
```sql
Table: load_assignments
Primary Key: assignment_id (UUID)

Attributes:
- assignment_id: UUID (PK)
- load_id: UUID (FK → loads.load_id) UNIQUE
- truck_id: UUID (FK → trucks.truck_id)
- driver_id: UUID (FK → driver_profiles.driver_id)
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- assigned_at: TIMESTAMP
- accepted_at: TIMESTAMP
- rejected_at: TIMESTAMP
- started_at: TIMESTAMP
- completed_at: TIMESTAMP
- status: ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending'
- driver_notes: TEXT
- proof_of_pickup: VARCHAR(255)
- proof_of_delivery: VARCHAR(255)
- signature_image: VARCHAR(255)
- actual_pickup_time: TIMESTAMP
- actual_delivery_time: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (assignment_id)
- UNIQUE INDEX idx_load (load_id)
- INDEX idx_truck (truck_id)
- INDEX idx_driver (driver_id)
- INDEX idx_fleet_owner (fleet_owner_id)
- INDEX idx_status (status)
```

### 10. LocationTracking
```sql
Table: location_tracking
Primary Key: tracking_id (UUID)

Attributes:
- tracking_id: UUID (PK)
- truck_id: UUID (FK → trucks.truck_id)
- driver_id: UUID (FK → driver_profiles.driver_id)
- load_id: UUID (FK → loads.load_id) NULLABLE
- latitude: DECIMAL(10,8) NOT NULL
- longitude: DECIMAL(11,8) NOT NULL
- speed: DECIMAL(5,2)
- heading: DECIMAL(5,2)
- altitude: DECIMAL(8,2)
- accuracy: DECIMAL(6,2)
- timestamp: TIMESTAMP NOT NULL
- created_at: TIMESTAMP

Indexes:
- PRIMARY KEY (tracking_id)
- INDEX idx_truck (truck_id)
- INDEX idx_driver (driver_id)
- INDEX idx_load (load_id)
- INDEX idx_timestamp (timestamp)
- INDEX idx_location (latitude, longitude)
```

### 11. Revenue
```sql
Table: revenues
Primary Key: revenue_id (UUID)

Attributes:
- revenue_id: UUID (PK)
- load_id: UUID (FK → loads.load_id)
- truck_id: UUID (FK → trucks.truck_id)
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- driver_id: UUID (FK → driver_profiles.driver_id)
- shipper_id: UUID (FK → shipper_profiles.shipper_id)
- revenue_type: ENUM('load_payment', 'bonus', 'fuel_surcharge', 'detention', 'other')
- amount: DECIMAL(12,2) NOT NULL
- description: TEXT
- payment_status: ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending'
- payment_date: TIMESTAMP
- invoice_number: VARCHAR(50)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (revenue_id)
- INDEX idx_load (load_id)
- INDEX idx_truck (truck_id)
- INDEX idx_fleet_owner (fleet_owner_id)
- INDEX idx_driver (driver_id)
- INDEX idx_shipper (shipper_id)
- INDEX idx_payment_status (payment_status)
- INDEX idx_payment_date (payment_date)
```

### 12. Cost
```sql
Table: costs
Primary Key: cost_id (UUID)

Attributes:
- cost_id: UUID (PK)
- truck_id: UUID (FK → trucks.truck_id)
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- load_id: UUID (FK → loads.load_id) NULLABLE
- driver_id: UUID (FK → driver_profiles.driver_id) NULLABLE
- cost_type: ENUM('fuel', 'maintenance', 'driver_wage', 'insurance', 'toll', 'parking', 'fine', 'other')
- amount: DECIMAL(12,2) NOT NULL
- description: TEXT
- receipt_image: VARCHAR(255)
- vendor_name: VARCHAR(255)
- transaction_date: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (cost_id)
- INDEX idx_truck (truck_id)
- INDEX idx_fleet_owner (fleet_owner_id)
- INDEX idx_load (load_id)
- INDEX idx_driver (driver_id)
- INDEX idx_cost_type (cost_type)
- INDEX idx_transaction_date (transaction_date)
```

### 13. Payment
```sql
Table: payments
Primary Key: payment_id (UUID)

Attributes:
- payment_id: UUID (PK)
- payer_id: UUID (FK → users.user_id)
- payee_id: UUID (FK → users.user_id)
- load_id: UUID (FK → loads.load_id) NULLABLE
- payment_type: ENUM('load_payment', 'driver_wage', 'refund', 'bonus', 'other')
- amount: DECIMAL(12,2) NOT NULL
- currency: VARCHAR(3) DEFAULT 'USD'
- payment_method: ENUM('bank_transfer', 'credit_card', 'debit_card', 'check', 'cash', 'wallet')
- transaction_id: VARCHAR(100) UNIQUE
- status: ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending'
- initiated_at: TIMESTAMP
- completed_at: TIMESTAMP
- failed_at: TIMESTAMP
- failure_reason: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (payment_id)
- UNIQUE INDEX idx_transaction (transaction_id)
- INDEX idx_payer (payer_id)
- INDEX idx_payee (payee_id)
- INDEX idx_load (load_id)
- INDEX idx_status (status)
- INDEX idx_initiated (initiated_at)
```

### 14. Maintenance
```sql
Table: maintenance_records
Primary Key: maintenance_id (UUID)

Attributes:
- maintenance_id: UUID (PK)
- truck_id: UUID (FK → trucks.truck_id)
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- maintenance_type: ENUM('routine', 'repair', 'inspection', 'emergency', 'recall')
- description: TEXT
- service_provider: VARCHAR(255)
- cost: DECIMAL(10,2)
- odometer_reading: DECIMAL(10,2)
- scheduled_date: TIMESTAMP
- completed_date: TIMESTAMP
- next_service_date: TIMESTAMP
- next_service_odometer: DECIMAL(10,2)
- status: ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled'
- parts_replaced: TEXT
- invoice_number: VARCHAR(50)
- invoice_image: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (maintenance_id)
- INDEX idx_truck (truck_id)
- INDEX idx_fleet_owner (fleet_owner_id)
- INDEX idx_scheduled_date (scheduled_date)
- INDEX idx_status (status)
```

### 15. FuelLog
```sql
Table: fuel_logs
Primary Key: fuel_log_id (UUID)

Attributes:
- fuel_log_id: UUID (PK)
- truck_id: UUID (FK → trucks.truck_id)
- driver_id: UUID (FK → driver_profiles.driver_id)
- load_id: UUID (FK → loads.load_id) NULLABLE
- fleet_owner_id: UUID (FK → fleet_owner_profiles.fleet_owner_id)
- fuel_type: ENUM('diesel', 'gasoline', 'electric', 'cng', 'other')
- quantity: DECIMAL(8,2)
- price_per_unit: DECIMAL(6,2)
- total_cost: DECIMAL(10,2) NOT NULL
- odometer_reading: DECIMAL(10,2)
- station_name: VARCHAR(255)
- station_address: TEXT
- latitude: DECIMAL(10,8)
- longitude: DECIMAL(11,8)
- receipt_image: VARCHAR(255)
- payment_method: ENUM('company_card', 'cash', 'driver_advance', 'other')
- transaction_date: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

Indexes:
- PRIMARY KEY (fuel_log_id)
- INDEX idx_truck (truck_id)
- INDEX idx_driver (driver_id)
- INDEX idx_load (load_id)
- INDEX idx_fleet_owner (fleet_owner_id)
- INDEX idx_transaction_date (transaction_date)
```

---

## SECTION 2: RELATIONSHIPS LOGIC

### Relationship Cardinality

#### User ↔ Role
- **Type**: Many-to-One (N:1)
- **Logic**: Many users can have the same role
- **FK**: users.role_id → roles.role_id
- **Constraint**: ON DELETE RESTRICT (cannot delete role if users exist)

#### User ↔ Profile Tables
- **Type**: One-to-One (1:1)
- **Logic**: 
  - One User can be ONE of: FleetOwner, Driver, or Shipper
  - Each profile links to exactly one user
- **FK**: 
  - fleet_owner_profiles.user_id → users.user_id (UNIQUE)
  - driver_profiles.user_id → users.user_id (UNIQUE)
  - shipper_profiles.user_id → users.user_id (UNIQUE)
- **Constraint**: ON DELETE CASCADE (delete profile when user deleted)

#### FleetOwner ↔ Fleet
- **Type**: One-to-Many (1:N)
- **Logic**: One FleetOwner can create multiple Fleets for organization
- **FK**: fleets.fleet_owner_id → fleet_owner_profiles.fleet_owner_id
- **Constraint**: ON DELETE CASCADE

#### FleetOwner ↔ Truck
- **Type**: One-to-Many (1:N)
- **Logic**: One FleetOwner owns multiple Trucks
- **FK**: trucks.fleet_owner_id → fleet_owner_profiles.fleet_owner_id
- **Constraint**: ON DELETE RESTRICT (cannot delete owner if trucks exist)

#### FleetOwner ↔ Driver
- **Type**: One-to-Many (1:N)
- **Logic**: One FleetOwner employs multiple Drivers
- **FK**: driver_profiles.fleet_owner_id → fleet_owner_profiles.fleet_owner_id
- **Constraint**: ON DELETE RESTRICT (cannot delete owner if drivers exist)

#### Fleet ↔ Truck
- **Type**: One-to-Many (1:N)
- **Logic**: One Fleet contains multiple Trucks (optional grouping)
- **FK**: trucks.fleet_id → fleets.fleet_id (NULLABLE)
- **Constraint**: ON DELETE SET NULL

#### Truck ↔ Driver (Current Assignment)
- **Type**: One-to-One (1:1)
- **Logic**: 
  - One Truck can have ONE current Driver
  - One Driver can be assigned to ONE current Truck
- **FK**: 
  - trucks.current_driver_id → driver_profiles.driver_id (NULLABLE)
  - driver_profiles.current_truck_id → trucks.truck_id (NULLABLE)
- **Constraint**: ON DELETE SET NULL
- **Business Rule**: Both fields must be synchronized

#### Shipper ↔ Load
- **Type**: One-to-Many (1:N)
- **Logic**: One Shipper posts multiple Loads
- **FK**: loads.shipper_id → shipper_profiles.shipper_id
- **Constraint**: ON DELETE RESTRICT (cannot delete shipper if loads exist)

#### Load ↔ LoadAssignment
- **Type**: One-to-One (1:1)
- **Logic**: One Load has exactly ONE assignment (when assigned)
- **FK**: load_assignments.load_id → loads.load_id (UNIQUE)
- **Constraint**: ON DELETE CASCADE

#### LoadAssignment ↔ Truck
- **Type**: Many-to-One (N:1)
- **Logic**: Many assignments can use the same Truck (over time)
- **FK**: load_assignments.truck_id → trucks.truck_id
- **Constraint**: ON DELETE RESTRICT

#### LoadAssignment ↔ Driver
- **Type**: Many-to-One (N:1)
- **Logic**: Many assignments can be completed by the same Driver
- **FK**: load_assignments.driver_id → driver_profiles.driver_id
- **Constraint**: ON DELETE RESTRICT

#### LoadAssignment ↔ FleetOwner
- **Type**: Many-to-One (N:1)
- **Logic**: Many assignments belong to the same FleetOwner
- **FK**: load_assignments.fleet_owner_id → fleet_owner_profiles.fleet_owner_id
- **Constraint**: ON DELETE RESTRICT

#### Truck ↔ LocationTracking
- **Type**: One-to-Many (1:N)
- **Logic**: One Truck has many location tracking points
- **FK**: location_tracking.truck_id → trucks.truck_id
- **Constraint**: ON DELETE CASCADE

#### Load ↔ LocationTracking
- **Type**: One-to-Many (1:N)
- **Logic**: One Load has many tracking points during transit
- **FK**: location_tracking.load_id → loads.load_id (NULLABLE)
- **Constraint**: ON DELETE SET NULL

#### Load ↔ Revenue
- **Type**: One-to-Many (1:N)
- **Logic**: One Load can generate multiple revenue entries (payment, surcharges, bonuses)
- **FK**: revenues.load_id → loads.load_id
- **Constraint**: ON DELETE RESTRICT

#### Truck ↔ Revenue
- **Type**: One-to-Many (1:N)
- **Logic**: One Truck generates multiple revenue entries
- **FK**: revenues.truck_id → trucks.truck_id
- **Constraint**: ON DELETE RESTRICT

#### Load ↔ Cost
- **Type**: One-to-Many (1:N)
- **Logic**: One Load incurs multiple costs (fuel, tolls, etc.)
- **FK**: costs.load_id → loads.load_id (NULLABLE)
- **Constraint**: ON DELETE SET NULL

#### Truck ↔ Cost
- **Type**: One-to-Many (1:N)
- **Logic**: One Truck incurs multiple costs
- **FK**: costs.truck_id → trucks.truck_id
- **Constraint**: ON DELETE RESTRICT

#### Truck ↔ Maintenance
- **Type**: One-to-Many (1:N)
- **Logic**: One Truck has multiple maintenance records
- **FK**: maintenance_records.truck_id → trucks.truck_id
- **Constraint**: ON DELETE CASCADE

#### Truck ↔ FuelLog
- **Type**: One-to-Many (1:N)
- **Logic**: One Truck has multiple fuel log entries
- **FK**: fuel_logs.truck_id → trucks.truck_id
- **Constraint**: ON DELETE CASCADE

#### Load ↔ Payment
- **Type**: One-to-Many (1:N)
- **Logic**: One Load can have multiple payment transactions
- **FK**: payments.load_id → loads.load_id (NULLABLE)
- **Constraint**: ON DELETE SET NULL

### Relationship Summary Table

| Parent Entity | Child Entity | Relationship | Cardinality | Delete Rule |
|--------------|--------------|--------------|-------------|-------------|
| Role | User | Has | 1:N | RESTRICT |
| User | FleetOwnerProfile | Has | 1:1 | CASCADE |
| User | DriverProfile | Has | 1:1 | CASCADE |
| User | ShipperProfile | Has | 1:1 | CASCADE |
| FleetOwner | Fleet | Owns | 1:N | CASCADE |
| FleetOwner | Truck | Owns | 1:N | RESTRICT |
| FleetOwner | Driver | Employs | 1:N | RESTRICT |
| Fleet | Truck | Contains | 1:N | SET NULL |
| Truck | Driver | Assigned To | 1:1 | SET NULL |
| Shipper | Load | Posts | 1:N | RESTRICT |
| Load | LoadAssignment | Has | 1:1 | CASCADE |
| Truck | LoadAssignment | Used In | 1:N | RESTRICT |
| Driver | LoadAssignment | Completes | 1:N | RESTRICT |
| Truck | LocationTracking | Generates | 1:N | CASCADE |
| Load | LocationTracking | Tracked By | 1:N | SET NULL |
| Load | Revenue | Generates | 1:N | RESTRICT |
| Truck | Revenue | Earns | 1:N | RESTRICT |
| Load | Cost | Incurs | 1:N | SET NULL |
| Truck | Cost | Incurs | 1:N | RESTRICT |
| Truck | Maintenance | Requires | 1:N | CASCADE |
| Truck | FuelLog | Consumes | 1:N | CASCADE |
| Load | Payment | Involves | 1:N | SET NULL |

---

## SECTION 3: BUSINESS LOGIC FLOW

### A) Shipper Posts a Load

```
FLOW: Shipper Posts Load
═══════════════════════════════════════════════════════════════

Step 1: Authentication & Authorization
├─ User logs in with shipper credentials
├─ System validates role = 'shipper'
└─ Retrieve shipper_id from shipper_profiles

Step 2: Load Creation Form
├─ Shipper fills load details:
│  ├─ Cargo type, weight, volume
│  ├─ Pickup location (address, city, state, zip, coordinates)
│  ├─ Delivery location (address, city, state, zip, coordinates)
│  ├─ Pickup date/time
│  ├─ Delivery date/time
│  ├─ Required truck type
│  ├─ Offered rate (total payment)
│  ├─ Driver wage (optional, can be set by fleet owner)
│  └─ Special instructions
└─ System calculates distance using coordinates

Step 3: Validation
├─ Validate required fields
├─ Validate pickup_date < delivery_date
├─ Validate offered_rate > 0
├─ Check shipper credit limit (if applicable)
└─ Validate coordinates are valid

Step 4: Database Transaction
BEGIN TRANSACTION
├─ Generate unique load_number
├─ INSERT INTO loads (
│    load_id, shipper_id, load_number, cargo_type,
│    pickup_address, pickup_lat, pickup_lng, pickup_date,
│    delivery_address, delivery_lat, delivery_lng, delivery_date,
│    offered_rate, status='posted', posted_at=NOW()
│  )
├─ UPDATE shipper_profiles 
│    SET total_loads_posted = total_loads_posted + 1
│    WHERE shipper_id = ?
└─ COMMIT

Step 5: Notification
├─ Send notification to all fleet owners
├─ Email: "New load available: [load_number]"
└─ Push notification to mobile app

Step 6: Response
└─ Return load_id and confirmation to shipper

STATUS: Load status = 'posted'
```

### B) Fleet Owner Views Available Loads

```
FLOW: Fleet Owner Views Available Loads
═══════════════════════════════════════════════════════════════

Step 1: Authentication
├─ User logs in with fleet_owner credentials
└─ Retrieve fleet_owner_id

Step 2: Query Available Loads
SELECT 
  l.load_id, l.load_number, l.cargo_type, l.weight,
  l.pickup_city, l.pickup_state, l.pickup_date,
  l.delivery_city, l.delivery_state, l.delivery_date,
  l.distance, l.offered_rate, l.required_truck_type,
  l.priority, l.special_instructions,
  s.company_name as shipper_name, s.rating as shipper_rating
FROM loads l
JOIN shipper_profiles s ON l.shipper_id = s.shipper_id
WHERE l.status = 'posted'
  AND l.pickup_date >= NOW()
ORDER BY l.priority DESC, l.posted_at ASC

Step 3: Filter Options
├─ Filter by truck_type (match available trucks)
├─ Filter by pickup location (proximity)
├─ Filter by delivery location
├─ Filter by date range
├─ Filter by minimum rate
└─ Sort by rate, distance, or date

Step 4: Display Load Details
For each load show:
├─ Load number and cargo details
├─ Route: Pickup → Delivery
├─ Distance and estimated duration
├─ Offered rate
├─ Pickup/delivery dates
├─ Shipper rating
└─ "Assign Truck" button

Step 5: Match with Available Trucks
├─ Query fleet owner's trucks:
│  SELECT * FROM trucks
│  WHERE fleet_owner_id = ?
│    AND status = 'available'
│    AND truck_type = load.required_truck_type
│    AND deleted_at IS NULL
└─ Show compatible trucks for assignment

STATUS: Load remains 'posted' until assigned
```

### C) Fleet Owner Assigns Truck + Driver

```
FLOW: Fleet Owner Assigns Truck and Driver to Load
═══════════════════════════════════════════════════════════════

Step 1: Select Load
├─ Fleet owner clicks "Assign Truck" on a posted load
└─ System retrieves load details

Step 2: Select Truck
├─ Display available trucks matching criteria:
│  ├─ truck_type matches load.required_truck_type
│  ├─ status = 'available'
│  ├─ capacity >= load.weight
│  └─ not in maintenance
└─ Fleet owner selects truck_id

Step 3: Select Driver
├─ Display available drivers:
│  ├─ fleet_owner_id matches
│  ├─ status = 'available'
│  ├─ license is valid (not expired)
│  └─ not currently on another trip
└─ Fleet owner selects driver_id

Step 4: Set Driver Wage
├─ Fleet owner enters driver_wage
├─ System validates: driver_wage < offered_rate
└─ Calculate estimated profit: offered_rate - driver_wage - estimated_fuel

Step 5: Validation
├─ Verify truck is still available
├─ Verify driver is still available
├─ Verify load is still 'posted'
├─ Verify driver belongs to this fleet owner
└─ Verify truck belongs to this fleet owner

Step 6: Database Transaction
BEGIN TRANSACTION

├─ INSERT INTO load_assignments (
│    assignment_id, load_id, truck_id, driver_id,
│    fleet_owner_id, assigned_at=NOW(), status='pending'
│  )
│
├─ UPDATE loads
│    SET status='assigned', assigned_at=NOW(),
│        driver_wage=?
│    WHERE load_id=?
│
├─ UPDATE trucks
│    SET status='assigned', current_driver_id=?
│    WHERE truck_id=?
│
├─ UPDATE driver_profiles
│    SET status='on_trip', current_truck_id=?
│    WHERE driver_id=?
│
└─ COMMIT

Step 7: Notification
├─ Send notification to driver:
│  "New load assigned: [load_number]"
│  "Pickup: [location] on [date]"
│  "Payment: $[driver_wage]"
├─ Send notification to shipper:
│  "Your load [load_number] has been assigned"
│  "Truck: [license_plate]"
│  "Driver: [driver_name]"
└─ Email confirmations to all parties

Step 8: Response
└─ Show assignment confirmation with details

STATUS: 
- Load: 'posted' → 'assigned'
- Truck: 'available' → 'assigned'
- Driver: 'available' → 'on_trip'
- LoadAssignment: 'pending'
```

### D) Driver Accepts Job

```
FLOW: Driver Accepts Assigned Load
═══════════════════════════════════════════════════════════════

Step 1: Driver Login
├─ Driver logs in to mobile app
└─ System retrieves driver_id

Step 2: View Assigned Load
├─ Query pending assignments:
│  SELECT la.*, l.*, t.license_plate
│  FROM load_assignments la
│  JOIN loads l ON la.load_id = l.load_id
│  JOIN trucks t ON la.truck_id = t.truck_id
│  WHERE la.driver_id = ?
│    AND la.status = 'pending'
└─ Display load details:
   ├─ Pickup location and time
   ├─ Delivery location and time
   ├─ Cargo details
   ├─ Payment amount (driver_wage)
   ├─ Distance and route
   └─ Special instructions

Step 3: Driver Decision
├─ Option 1: Accept
│  └─ Driver clicks "Accept Load"
└─ Option 2: Reject
   └─ Driver clicks "Reject" with reason

Step 4A: If Driver Accepts
BEGIN TRANSACTION

├─ UPDATE load_assignments
│    SET status='accepted', accepted_at=NOW()
│    WHERE assignment_id=?
│
├─ UPDATE loads
│    SET status='assigned'
│    WHERE load_id=?
│
└─ COMMIT

Notification:
├─ Notify fleet owner: "Driver accepted load [load_number]"
└─ Notify shipper: "Driver confirmed for load [load_number]"

Step 4B: If Driver Rejects
BEGIN TRANSACTION

├─ UPDATE load_assignments
│    SET status='rejected', rejected_at=NOW(),
│        driver_notes='[rejection reason]'
│    WHERE assignment_id=?
│
├─ UPDATE loads
│    SET status='posted', assigned_at=NULL
│    WHERE load_id=?
│
├─ UPDATE trucks
│    SET status='available', current_driver_id=NULL
│    WHERE truck_id=?
│
├─ UPDATE driver_profiles
│    SET status='available', current_truck_id=NULL
│    WHERE driver_id=?
│
└─ COMMIT

Notification:
└─ Notify fleet owner: "Driver rejected load [load_number]"
   "Reason: [rejection reason]"
   "Please reassign to another driver"

Step 5: Start Trip (if accepted)
├─ Driver clicks "Start Trip" when ready
├─ System enables GPS tracking
└─ Update status to 'in_progress'

STATUS:
- If Accepted: LoadAssignment 'pending' → 'accepted'
- If Rejected: Load 'assigned' → 'posted', Truck/Driver back to 'available'
```

### E) Load Status Updates (Complete Lifecycle)

```
FLOW: Load Status Lifecycle
═══════════════════════════════════════════════════════════════

STATUS 1: POSTED
├─ Trigger: Shipper creates load
├─ State:
│  ├─ Load visible to all fleet owners
│  ├─ No truck/driver assigned
│  └─ Awaiting assignment
└─ Next: Fleet owner assigns → ASSIGNED

STATUS 2: ASSIGNED
├─ Trigger: Fleet owner assigns truck + driver
├─ State:
│  ├─ LoadAssignment created (status='pending')
│  ├─ Truck status = 'assigned'
│  ├─ Driver status = 'on_trip'
│  ├─ Awaiting driver acceptance
│  └─ Shipper notified
└─ Next: Driver accepts → IN_TRANSIT

STATUS 3: IN_TRANSIT
├─ Trigger: Driver starts trip
├─ Actions:
│  BEGIN TRANSACTION
│  ├─ UPDATE loads
│  │    SET status='in_transit'
│  │    WHERE load_id=?
│  ├─ UPDATE load_assignments
│  │    SET status='in_progress', started_at=NOW()
│  │    WHERE assignment_id=?
│  ├─ UPDATE trucks
│  │    SET status='in_transit'
│  │    WHERE truck_id=?
│  └─ COMMIT
│
├─ State:
│  ├─ GPS tracking active
│  ├─ Location updates every 30 seconds:
│  │  INSERT INTO location_tracking (
│  │    truck_id, driver_id, load_id,
│  │    latitude, longitude, speed, heading, timestamp
│  │  )
│  ├─ Real-time tracking visible to:
│  │  ├─ Fleet owner
│  │  ├─ Shipper
│  │  └─ Admin
│  └─ Driver can log fuel stops, breaks
│
├─ Pickup Checkpoint:
│  ├─ Driver arrives at pickup location
│  ├─ Driver uploads proof_of_pickup (photo)
│  ├─ UPDATE load_assignments
│  │    SET actual_pickup_time=NOW(),
│  │        proof_of_pickup='[file_path]'
│  ├─ Notification: "Pickup completed for load [load_number]"
│  └─ Continue to delivery
│
└─ Next: Driver delivers → DELIVERED

STATUS 4: DELIVERED
├─ Trigger: Driver completes delivery
├─ Actions:
│  ├─ Driver arrives at delivery location
│  ├─ Driver uploads:
│  │  ├─ proof_of_delivery (photo)
│  │  └─ signature_image (recipient signature)
│  │
│  BEGIN TRANSACTION
│  ├─ UPDATE loads
│  │    SET status='delivered', delivered_at=NOW()
│  │    WHERE load_id=?
│  │
│  ├─ UPDATE load_assignments
│  │    SET actual_delivery_time=NOW(),
│  │        proof_of_delivery='[file_path]',
│  │        signature_image='[signature_path]'
│  │    WHERE assignment_id=?
│  │
│  └─ COMMIT
│
├─ State:
│  ├─ Awaiting shipper confirmation
│  ├─ Proof documents available for review
│  └─ Payment processing initiated
│
└─ Next: Shipper confirms → COMPLETED

STATUS 5: COMPLETED
├─ Trigger: Shipper confirms delivery OR auto-confirm after 24h
├─ Actions:
│  BEGIN TRANSACTION
│  
│  ├─ UPDATE loads
│  │    SET status='completed', completed_at=NOW()
│  │    WHERE load_id=?
│  │
│  ├─ UPDATE load_assignments
│  │    SET status='completed', completed_at=NOW()
│  │    WHERE assignment_id=?
│  │
│  ├─ UPDATE trucks
│  │    SET status='available',
│  │        current_driver_id=NULL,
│  │        total_revenue = total_revenue + offered_rate,
│  │        total_trips = total_trips + 1
│  │    WHERE truck_id=?
│  │
│  ├─ UPDATE driver_profiles
│  │    SET status='available',
│  │        current_truck_id=NULL,
│  │        total_earnings = total_earnings + driver_wage,
│  │        total_trips = total_trips + 1
│  │    WHERE driver_id=?
│  │
│  ├─ INSERT INTO revenues (
│  │    load_id, truck_id, fleet_owner_id, driver_id, shipper_id,
│  │    revenue_type='load_payment', amount=offered_rate,
│  │    payment_status='pending'
│  │  )
│  │
│  ├─ INSERT INTO costs (
│  │    truck_id, fleet_owner_id, load_id, driver_id,
│  │    cost_type='driver_wage', amount=driver_wage
│  │  )
│  │
│  ├─ Calculate and update profit (see Section 6)
│  │
│  └─ COMMIT
│
├─ State:
│  ├─ Load completed successfully
│  ├─ Revenue and costs recorded
│  ├─ Truck and driver available for new loads
│  ├─ Payment processing
│  └─ Rating/review enabled
│
└─ Final: Archive and analytics

STATUS 6: CANCELLED (Alternative Path)
├─ Trigger: Shipper, Fleet Owner, or Admin cancels
├─ Can occur at any stage before 'delivered'
├─ Actions:
│  BEGIN TRANSACTION
│  ├─ UPDATE loads
│  │    SET status='cancelled', cancelled_at=NOW()
│  ├─ UPDATE load_assignments
│  │    SET status='cancelled'
│  ├─ UPDATE trucks
│  │    SET status='available', current_driver_id=NULL
│  ├─ UPDATE driver_profiles
│  │    SET status='available', current_truck_id=NULL
│  └─ COMMIT
│
├─ Cancellation fees may apply based on stage
└─ Notifications sent to all parties

═══════════════════════════════════════════════════════════════
SUMMARY: Load Status Flow

POSTED → ASSIGNED → IN_TRANSIT → DELIVERED → COMPLETED
   ↓         ↓           ↓            ↓
   └─────────┴───────────┴────────────┴──→ CANCELLED
```

### F) Revenue & Profit Calculation Flow

```
FLOW: Revenue and Profit Calculation
═══════════════════════════════════════════════════════════════

TRIGGER: Load status changes to 'completed'

Step 1: Collect Revenue Data
├─ Load Payment (from shipper):
│  └─ offered_rate = $2,500
│
├─ Additional Revenue (if any):
│  ├─ Fuel surcharge = $150
│  ├─ Detention fee = $100
│  └─ Bonus = $50
│
└─ Total Revenue = $2,800

Step 2: Collect Cost Data
├─ Driver Wage:
│  └─ driver_wage = $1,200
│
├─ Fuel Costs:
│  SELECT SUM(total_cost) FROM fuel_logs
│  WHERE load_id = ? AND truck_id = ?
│  └─ fuel_cost = $450
│
├─ Tolls and Fees:
│  SELECT SUM(amount) FROM costs
│  WHERE load_id = ? AND cost_type IN ('toll', 'parking')
│  └─ tolls = $75
│
├─ Maintenance (if during trip):
│  SELECT SUM(cost) FROM maintenance_records
│  WHERE truck_id = ? 
│    AND completed_date BETWEEN trip_start AND trip_end
│  └─ maintenance = $0
│
└─ Total Costs = $1,725

Step 3: Calculate Profit
Net Profit = Total Revenue - Total Costs
Net Profit = $2,800 - $1,725 = $1,075

Profit Margin = (Net Profit / Total Revenue) × 100
Profit Margin = ($1,075 / $2,800) × 100 = 38.4%

Step 4: Update Database
BEGIN TRANSACTION

├─ UPDATE trucks
│    SET total_revenue = total_revenue + 2800,
│        total_costs = total_costs + 1725,
│        total_profit = total_profit + 1075
│    WHERE truck_id = ?
│
├─ UPDATE fleet_owner_profiles
│    SET total_revenue = total_revenue + 2800,
│        total_profit = total_profit + 1075
│    WHERE fleet_owner_id = ?
│
├─ UPDATE fleets
│    SET total_revenue = total_revenue + 2800,
│        total_costs = total_costs + 1725,
│        total_profit = total_profit + 1075
│    WHERE fleet_id = ?
│
└─ COMMIT

Step 5: Generate Financial Records
├─ INSERT INTO revenues (
│    revenue_id, load_id, truck_id, fleet_owner_id,
│    revenue_type='load_payment', amount=2500,
│    payment_status='pending', invoice_number='INV-2026-001'
│  )
│
├─ INSERT INTO revenues (
│    revenue_type='fuel_surcharge', amount=150
│  )
│
├─ INSERT INTO costs (
│    cost_id, truck_id, load_id, fleet_owner_id, driver_id,
│    cost_type='driver_wage', amount=1200
│  )
│
└─ All fuel_logs and other costs already recorded during trip

Step 6: Dashboard Analytics Update
├─ Fleet Owner Dashboard shows:
│  ├─ Total Revenue: $2,800
│  ├─ Total Costs: $1,725
│  ├─ Net Profit: $1,075
│  ├─ Profit Margin: 38.4%
│  ├─ Revenue per Mile: $2,800 / 450 miles = $6.22/mile
│  └─ Cost per Mile: $1,725 / 450 miles = $3.83/mile
│
└─ Per-Truck Analytics:
   ├─ Truck #ABC123 Performance
   ├─ Total Trips: 47
   ├─ Total Revenue: $125,000
   ├─ Total Costs: $78,000
   ├─ Total Profit: $47,000
   └─ Average Profit per Trip: $1,000

═══════════════════════════════════════════════════════════════
PROFIT FORMULA (Per Load):

Gross Revenue (from shipper)
  + Fuel Surcharge
  + Detention Fees
  + Bonuses
  = Total Revenue

Driver Wage
  + Fuel Costs
  + Tolls & Parking
  + Maintenance (allocated)
  + Insurance (allocated)
  + Other Costs
  = Total Costs

Net Profit = Total Revenue - Total Costs
Profit Margin % = (Net Profit / Total Revenue) × 100

═══════════════════════════════════════════════════════════════
AGGREGATION QUERIES:

-- Fleet Owner Total Profit
SELECT 
  SUM(total_revenue) as total_revenue,
  SUM(total_costs) as total_costs,
  SUM(total_profit) as total_profit,
  AVG(total_profit / NULLIF(total_trips, 0)) as avg_profit_per_trip
FROM trucks
WHERE fleet_owner_id = ?
  AND deleted_at IS NULL

-- Per Truck Performance
SELECT 
  truck_id, license_plate,
  total_revenue, total_costs, total_profit,
  total_trips,
  (total_profit / NULLIF(total_trips, 0)) as avg_profit_per_trip,
  (total_profit / NULLIF(total_revenue, 0) * 100) as profit_margin
FROM trucks
WHERE fleet_owner_id = ?
ORDER BY total_profit DESC

-- Monthly Revenue Trend
SELECT 
  DATE_TRUNC('month', completed_at) as month,
  COUNT(*) as total_loads,
  SUM(offered_rate) as total_revenue,
  AVG(offered_rate) as avg_revenue_per_load
FROM loads
WHERE fleet_owner_id IN (
  SELECT fleet_owner_id FROM load_assignments WHERE load_id = loads.load_id
)
  AND status = 'completed'
  AND completed_at >= NOW() - INTERVAL '12 months'
GROUP BY month
ORDER BY month DESC
```

---

