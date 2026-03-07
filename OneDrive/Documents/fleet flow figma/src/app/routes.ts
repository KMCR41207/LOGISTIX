import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { FleetOwnerDashboard } from "./pages/FleetOwnerDashboard";
import { DriverDashboard } from "./pages/DriverDashboard";
import { ShipperDashboard } from "./pages/ShipperDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminFleetOwners } from "./pages/AdminFleetOwners";
import { AdminAnalytics } from "./pages/AdminAnalytics";
import { TruckManagement } from "./pages/TruckManagement";
import { DriverManagement } from "./pages/DriverManagement";
import { LoadManagement } from "./pages/LoadManagement";
import { DriverProfile } from "./pages/DriverProfile";
import { DriversList } from "./pages/DriversList";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/fleet-owner",
    Component: FleetOwnerDashboard,
  },
  {
    path: "/fleet-owner/trucks",
    Component: TruckManagement,
  },
  {
    path: "/fleet-owner/drivers",
    Component: DriverManagement,
  },
  {
    path: "/fleet-owner/loads",
    Component: LoadManagement,
  },
  {
    path: "/driver",
    Component: DriverDashboard,
  },
  {
    path: "/driver/:driverId",
    Component: DriverProfile,
  },
  {
    path: "/shipper",
    Component: ShipperDashboard,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/users",
    Component: AdminUsers,
  },
  {
    path: "/admin/fleet-owners",
    Component: AdminFleetOwners,
  },
  {
    path: "/admin/analytics",
    Component: AdminAnalytics,
  },
  {
    path: "/admin/drivers",
    Component: DriversList,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
