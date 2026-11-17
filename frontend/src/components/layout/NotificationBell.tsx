import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";

import { api } from "../../core/api/client";
import { parseApiDate } from "../../core/api/mappers";
import type { NotificationDTO } from "../../core/api/types";

const POLL_MS = 30_000;

const timeAgo = (iso: string): string => {
  const minutes = Math.round((Date.now() - parseApiDate(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return parseApiDate(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/** Bell in the top bar: unread count, and a list of the newest messages. */
export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [unread, setUnread] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getMyNotifications();
      setItems(data.items);
      setUnread(data.unread);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  // Load now, then every 30 s while the tab is visible
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      api
        .getMyNotifications()
        .then((data) => {
          if (cancelled) return;
          setItems(data.items);
          setUnread(data.unread);
          setLoadError(false);
        })
        .catch(() => {
          if (!cancelled) setLoadError(true);
        });

    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    if (!open) void refresh();
    setOpen((value) => !value);
  };

  const openNotification = async (n: NotificationDTO) => {
    if (!n.is_read) {
      setItems((list) => list.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      setUnread((count) => Math.max(0, count - 1));
      api.markNotificationRead(n.id).catch(() => void refresh());
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    setItems((list) => list.map((x) => ({ ...x, is_read: true })));
    setUnread(0);
    try {
      await api.markAllNotificationsRead();
    } catch {
      void refresh();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="relative p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-all"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="w-4 h-4" />

        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-[18px] text-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {loadError && items.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-red-600">
                Could not load notifications.
              </li>
            )}

            {!loadError && items.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-500">
                Nothing yet. You'll hear here when your food moves.
              </li>
            )}

            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openNotification(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-slate-50 ${
                    n.is_read ? "" : "bg-emerald-50/50"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.is_read ? "bg-transparent" : "bg-emerald-500"
                    }`}
                  />
                  <span className="min-w-0">
                    <span
                      className={`block text-sm ${
                        n.is_read ? "text-slate-600" : "font-semibold text-slate-900"
                      }`}
                    >
                      {n.message}
                    </span>
                    <span className="block mt-0.5 text-xs text-slate-400">
                      {timeAgo(n.created_at)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
