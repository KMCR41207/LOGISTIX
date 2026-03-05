# Logistix Platform - Permissions & Database Optimization
## Part 2 of System Architecture

---

## SECTION 4: PERMISSION MATRIX

### Admin (SVLT) - Full Platform Access
- Full CRUD on all resources
- View all financial data
- Suspend/activate users
- Process refunds
- Platform-wide analytics
- System configuration

### Fleet Owner - Fleet Management
- Manage own trucks and drivers
- View all posted loads
- Assign trucks to loads
- Track revenue and profit
- View real-time locations
- Financial analytics (own fleet only)

### Driver - Job Management
- View assigned loads only
- Accept/reject assignments
- Update load status
- Upload proof documents
- Log fuel stops
- View own earnings

### Shipper - Load Management
- Post and manage own loads
- Track shipments in real-time
- View assigned truck/driver
- Confirm delivery
- Make payments
- Rate drivers

---

## SECTION 5: DATABASE OPTIMIZATION

### Indexing Strategy
- Primary keys auto-indexed
- Foreign keys indexed
- Status fields indexed
- Date fields indexed
- Geospatial indexes for locations
- Composite indexes for common queries

### Soft Delete
- Users: deleted_at timestamp
- Trucks: deleted_at timestamp
- Loads: use status='cancelled'

### Audit Logs
- Track all CRUD operations
- Store old/new values as JSONB
- Include user, IP, timestamp

### Scalability
- Partition location_tracking by month
- Read replicas for analytics
- Redis caching (30s for loads, 10s for locations)
- Connection pooling (max 20)
- Archive old data after 90 days

---

