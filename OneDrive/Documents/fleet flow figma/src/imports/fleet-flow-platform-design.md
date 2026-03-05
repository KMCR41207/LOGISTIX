ROLE:
You are a senior full-stack SaaS architect and product designer.

OBJECTIVE:
Design a complete, production-ready website platform called "Fleet Flow".

COMPANY:
The platform is created and owned by SVLT.

CORE IDEA:
Fleet Flow is a digital logistics platform connecting:

1) Fleet Owners
2) Truck Drivers
3) Shippers

The system allows:
- Shippers to post loads (with full shipment details)
- Fleet owners to assign trucks and drivers to loads
- Drivers to accept and manage assigned jobs
- Fleet owners to track trucks, loads, revenue, and profit

PLATFORM REQUIREMENTS:

1) USER ROLES:
Define separate dashboards and permissions for:
- Admin (SVLT)
- Fleet Owner
- Truck Driver
- Shipper

2) CORE FEATURES:

A) For Shippers:
- Post load (origin, destination, weight, type, rate, deadline)
- View load status
- See assigned truck and driver
- Track shipment status

B) For Fleet Owners:
- Add/manage trucks
- Add/manage drivers
- Assign trucks to loads
- Track:
  - Which trucks are running
  - Driver assigned to each truck
  - Current load
  - Location (assume GPS integration)
  - Revenue per load
  - Fuel cost
  - Driver wage
  - Maintenance cost
  - Profit per truck
  - Total fleet revenue and profit dashboard

C) For Drivers:
- View assigned loads
- Accept/Reject job
- Update delivery status
- View payment details

3) DASHBOARD ANALYTICS:
Fleet dashboard must include:
- Active trucks
- Idle trucks
- Revenue (daily, weekly, monthly)
- Profit per truck
- Total fleet profit
- Performance metrics

4) TECHNICAL ARCHITECTURE:
Provide:
- Suggested tech stack
- Database schema structure
- Core tables and relationships
- API structure
- Authentication model
- Scalability considerations

5) UI STRUCTURE:
- Homepage structure
- Role-based dashboard layout
- Navigation flow
- Mobile responsiveness considerations

6) MONETIZATION:
Suggest revenue model:
- Subscription?
- Commission per load?
- Hybrid?

7) FUTURE EXPANSION:
Suggest scalable features:
- AI load optimization
- Route efficiency
- Predictive maintenance
- Smart pricing

CONSTRAINTS:
- Be specific.
- Avoid generic descriptions.
- Structure the response clearly.
- Do not invent unnecessary features beyond logistics scope.
- Think step-by-step before finalizing.
- Ensure business logic is realistic for trucking industry.

OUTPUT FORMAT:

Return the response structured in these sections:

1. Executive Summary
2. Platform Architecture
3. User Roles & Permissions
4. Feature Breakdown by Role
5. Database Schema Overview
6. Dashboard & Analytics Design
7. UI/UX Structure
8. Monetization Strategy
9. Scalability & Future Roadmap
10. Implementation Roadmap (Phase 1, 2, 3)