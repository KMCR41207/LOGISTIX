# Logistix Platform - Revenue & Profit Calculation
## Part 3 of System Architecture

---

## SECTION 6: REVENUE & PROFIT CALCULATION

### Profit Formula (Per Load)

```
REVENUE:
  Load Payment (from shipper)         $2,500
  + Fuel Surcharge                    $  150
  + Detention Fee                     $  100
  + Bonus                             $   50
  ────────────────────────────────────────────
  = Total Revenue                     $2,800

COSTS:
  Driver Wage                         $1,200
  + Fuel Costs                        $  450
  + Tolls & Parking                   $   75
  + Maintenance (allocated)           $    0
  ────────────────────────────────────────────
  = Total Costs                       $1,725

PROFIT:
  Net Profit = Revenue - Costs        $1,075
  Profit Margin = (1,075 / 2,800) × 100 = 38.4%
```

### Calculation Trigger

When load status changes to 'completed':

1. Collect all revenue entries for the load
2. Sum all costs (fuel, wages, tolls) for the load
3. Calculate net profit
4. Update truck totals
5. Update fleet owner totals
6. Update fleet totals
7. Generate financial records

### Database Updates

```sql
-- Update truck financials
UPDATE trucks
SET total_revenue = total_revenue + 2800,
    total_costs = total_costs + 1725,
    total_profit = total_profit + 1075,
    total_trips = total_trips + 1
WHERE truck_id = ?;

-- Update fleet owner totals
UPDATE fleet_owner_profiles
SET total_revenue = total_revenue + 2800,
    total_profit = total_profit + 1075
WHERE fleet_owner_id = ?;

-- Update fleet totals
UPDATE fleets
SET total_revenue = total_revenue + 2800,
    total_costs = total_costs + 1725,
    total_profit = total_profit + 1075
WHERE fleet_id = ?;
```

### Analytics Queries

```sql
-- Fleet Owner Total Performance
SELECT 
  SUM(total_revenue) as total_revenue,
  SUM(total_costs) as total_costs,
  SUM(total_profit) as total_profit,
  COUNT(*) as total_trucks,
  AVG(total_profit / NULLIF(total_trips, 0)) as avg_profit_per_trip
FROM trucks
WHERE fleet_owner_id = ?
  AND deleted_at IS NULL;

-- Per Truck Performance
SELECT 
  truck_id,
  license_plate,
  total_revenue,
  total_costs,
  total_profit,
  total_trips,
  (total_profit / NULLIF(total_trips, 0)) as avg_profit_per_trip,
  (total_profit / NULLIF(total_revenue, 0) * 100) as profit_margin_pct
FROM trucks
WHERE fleet_owner_id = ?
ORDER BY total_profit DESC;

-- Monthly Revenue Trend
SELECT 
  DATE_TRUNC('month', completed_at) as month,
  COUNT(*) as total_loads,
  SUM(offered_rate) as total_revenue,
  AVG(offered_rate) as avg_revenue_per_load
FROM loads l
JOIN load_assignments la ON l.load_id = la.load_id
WHERE la.fleet_owner_id = ?
  AND l.status = 'completed'
  AND l.completed_at >= NOW() - INTERVAL '12 months'
GROUP BY month
ORDER BY month DESC;
```

### Dashboard Metrics

Fleet Owner Dashboard displays:
- Total Revenue (all time)
- Total Costs (all time)
- Net Profit (all time)
- Profit Margin %
- Revenue per Mile
- Cost per Mile
- Average Profit per Trip
- Total Trips Completed
- Active Trucks
- Available Trucks

Per-Truck Analytics:
- Truck identification
- Total trips completed
- Total revenue earned
- Total costs incurred
- Net profit
- Average profit per trip
- Profit margin %
- Utilization rate

---

## IMPLEMENTATION CHECKLIST

### Database Setup
- [ ] Create all 15 tables with proper data types
- [ ] Add all primary keys and foreign keys
- [ ] Create indexes for performance
- [ ] Set up foreign key constraints
- [ ] Implement soft delete columns
- [ ] Create audit_logs table
- [ ] Define ENUM types for status fields

### Business Logic
- [ ] Implement user authentication
- [ ] Implement role-based access control
- [ ] Create load posting workflow
- [ ] Create load assignment workflow
- [ ] Implement driver acceptance flow
- [ ] Build GPS tracking system
- [ ] Create status update triggers
- [ ] Implement revenue calculation
- [ ] Build profit analytics

### API Endpoints
- [ ] User management (CRUD)
- [ ] Load management (CRUD)
- [ ] Truck management (CRUD)
- [ ] Driver management (CRUD)
- [ ] Assignment management
- [ ] Location tracking
- [ ] Financial reports
- [ ] Dashboard analytics

### Security
- [ ] Implement JWT authentication
- [ ] Add row-level security policies
- [ ] Encrypt sensitive data (bank accounts)
- [ ] Add rate limiting
- [ ] Implement audit logging
- [ ] Add input validation
- [ ] Sanitize SQL queries

### Performance
- [ ] Set up database indexes
- [ ] Implement Redis caching
- [ ] Configure connection pooling
- [ ] Set up read replicas
- [ ] Partition large tables
- [ ] Optimize slow queries
- [ ] Add database monitoring

### Testing
- [ ] Unit tests for business logic
- [ ] Integration tests for workflows
- [ ] Load testing for scalability
- [ ] Security penetration testing
- [ ] User acceptance testing

---

## TECHNOLOGY STACK RECOMMENDATIONS

### Backend
- Node.js with Express or NestJS
- PostgreSQL 14+ (with PostGIS for geospatial)
- Redis for caching
- JWT for authentication

### Frontend
- React with TypeScript
- Tailwind CSS (already in use)
- React Query for data fetching
- Mapbox/Google Maps for tracking

### Mobile
- React Native for iOS/Android driver app
- Real-time GPS tracking
- Push notifications

### Infrastructure
- AWS/GCP/Azure for hosting
- S3 for file storage (receipts, photos)
- CloudFront/CDN for static assets
- Load balancer for high availability

### Monitoring
- Datadog/New Relic for APM
- Sentry for error tracking
- CloudWatch for logs
- Grafana for metrics

---

**END OF DOCUMENTATION**

