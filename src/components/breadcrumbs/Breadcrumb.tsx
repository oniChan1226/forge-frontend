import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ROUTE_PATHS } from "@/routes/route-paths";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Overview",
  login: "Login",
  signup: "Sign Up",
};

const BreadcrumbNav = () => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  // If you're inside dashboard, treat it as root "Overview"
  const isDashboardRoot =
    location.pathname === ROUTE_PATHS.dashboard;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Root */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={ROUTE_PATHS.dashboard}>Overview</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Hide extra segments if only /dashboard */}
        {!isDashboardRoot &&
          pathnames.map((segment, index) => {
            const path =
              "/" + pathnames.slice(0, index + 1).join("/");

            const isLast = index === pathnames.length - 1;

            const label =
              ROUTE_LABELS[segment] ??
              segment.replace("-", " ");

            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="capitalize">
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={path} className="capitalize">
                        {label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;