import React, { useEffect, useMemo, useState } from "react";

import {
  Users,
  Search,
  ShieldCheck,
  Building2,
  Truck,
  UserRound,
  CheckCircle2,
} from "lucide-react";

import { api } from "../../core/api/client";
import type { AdminUserDTO } from "../../core/api/types";

type UserRole = "DONOR" | "NGO" | "VOLUNTEER" | "ADMIN";

type Tone = "ok" | "warn" | "muted";

interface NetworkUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  /** ACTIVE once the account can take part (NGO and volunteer need a profile). */
  status: "ACTIVE" | "PENDING";
  verification: { label: string; tone: Tone };
}

const toNetworkUser = (u: AdminUserDTO): NetworkUser => {
  const role = (["DONOR", "NGO", "VOLUNTEER", "ADMIN"].includes(u.role)
    ? u.role
    : "DONOR") as UserRole;

  let verification: NetworkUser["verification"] = { label: "Not required", tone: "muted" };
  let status: NetworkUser["status"] = "ACTIVE";

  if (u.profile_status === "NO_PROFILE") {
    status = "PENDING";
    verification = { label: "Profile not set up", tone: "warn" };
  } else if (role === "NGO") {
    verification =
      u.profile_status === "VERIFIED"
        ? { label: "Verified", tone: "ok" }
        : { label: "Pending review", tone: "warn" };
    if (u.profile_status !== "VERIFIED") status = "PENDING";
  } else if (role === "VOLUNTEER") {
    verification =
      u.profile_status === "AVAILABLE"
        ? { label: "On duty", tone: "ok" }
        : { label: "Off duty or on a pickup", tone: "muted" };
  }

  return {
    id: u.id,
    name: role === "NGO" && u.organization_name ? `${u.organization_name} (${u.name})` : u.name,
    email: u.email,
    role,
    status,
    verification,
  };
};

const TONE_CLASS: Record<Tone, string> = {
  ok: "text-emerald-600",
  warn: "text-amber-600",
  muted: "text-slate-400",
};

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getAdminUsers()
      .then((rows) => {
        if (!cancelled) setUsers(rows.map(toNetworkUser));
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load users.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | UserRole
  >("ALL");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const donorCount = users.filter(
    (user) => user.role === "DONOR"
  ).length;

  const ngoCount = users.filter(
    (user) => user.role === "NGO"
  ).length;

  const volunteerCount = users.filter(
    (user) => user.role === "VOLUNTEER"
  ).length;

  return (
    <div className="min-h-full bg-[#f4f8f5] text-[#102a43]">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:px-7">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">

                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700">
                  <Users className="h-3.5 w-3.5" />
                  Administration
                </span>

                <span className="text-xs font-medium text-emerald-600">
                  Access control active
                </span>

              </div>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                User & Role Management
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Review registered participants and maintain visibility
                over donor, NGO and volunteer access across the RasoiGrid
                network.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
            </div>

          </div>

        </section>

        {/* METRICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Metric
            label="Registered Users"
            value={String(users.length)}
            icon={<Users className="h-5 w-5" />}
          />

          <Metric
            label="Donors"
            value={String(donorCount)}
            icon={<UserRound className="h-5 w-5" />}
          />

          <Metric
            label="NGOs"
            value={String(ngoCount)}
            icon={<Building2 className="h-5 w-5" />}
          />

          <Metric
            label="Volunteers"
            value={String(volunteerCount)}
            icon={<Truck className="h-5 w-5" />}
          />

        </section>

        {/* USER DIRECTORY */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="border-b border-slate-100 p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                  Network directory
                </p>

                <h2 className="mt-1 text-lg font-extrabold">
                  Registered Participants
                </h2>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="relative">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search users..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-medium outline-none transition focus:border-indigo-300 focus:bg-white sm:w-64"
                  />

                </div>

                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(
                      event.target.value as
                        | "ALL"
                        | UserRole
                    )
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-indigo-300"
                >
                  <option value="ALL">All roles</option>
                  <option value="DONOR">Donors</option>
                  <option value="NGO">NGOs</option>
                  <option value="VOLUNTEER">
                    Volunteers
                  </option>
                  <option value="ADMIN">Admins</option>
                </select>

              </div>

            </div>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px] text-left">

              <thead className="border-b border-slate-100 bg-slate-50/70">

                <tr>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Participant
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Role
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Account
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Profile
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50/70"
                  >

                    <td className="px-5 py-4">

                      <div>
                        <p className="text-xs font-bold text-[#102a43]">
                          {user.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {user.email}
                        </p>
                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <RoleBadge role={user.role} />

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${
                          user.status === "ACTIVE"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {user.status === "ACTIVE" ? "Active" : "Needs action"}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${TONE_CLASS[user.verification.tone]}`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {user.verification.label}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {loadError && (
            <p role="alert" className="mx-5 my-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {filteredUsers.length === 0 && !loadError && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              {isLoading
                ? "Loading users…"
                : users.length === 0
                  ? "No one has registered yet."
                  : "No participants match your search."}
            </div>
          )}

        </section>

        {/* SECURITY NOTE */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-center text-xs text-indigo-800">
          <span className="font-bold">
            Admin access principle:
          </span>{" "}
          role permissions are enforced by the backend as well as the
          frontend. NGOs are verified on the NGO Verification page.
        </div>

      </div>
    </div>
  );
};

/* =========================================================
   METRIC
========================================================= */

interface MetricProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const Metric: React.FC<MetricProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-extrabold text-[#102a43]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
          {icon}
        </div>

      </div>

    </div>
  );
};

/* =========================================================
   ROLE BADGE
========================================================= */

const RoleBadge: React.FC<{ role: UserRole }> = ({
  role,
}) => {
  const config = {
    DONOR: {
      label: "Donor",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    NGO: {
      label: "NGO",
      className:
        "border-indigo-200 bg-indigo-50 text-indigo-700",
    },
    VOLUNTEER: {
      label: "Volunteer",
      className:
        "border-cyan-200 bg-cyan-50 text-cyan-700",
    },
    ADMIN: {
      label: "Admin",
      className:
        "border-slate-200 bg-slate-100 text-slate-700",
    },
  };

  const item = config[role];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${item.className}`}
    >
      {item.label}
    </span>
  );
};

export default AdminUsersPage;