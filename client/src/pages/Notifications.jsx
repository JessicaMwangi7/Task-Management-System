import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data.notifications || res.data);
      } catch {
        toast.error("Failed to load notifications.");
      }
    }
    fetchNotifications();
  }, []);

  return (

    <div className=" bg-gray-50 py-8 px-4">

      <div className="max-w-7xl mx-auto border rounded-lg shadow bg-white">
        <h1 className="text-3xl font-bold text-primary p-4 border-b">
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            🎉 You’re all caught up. No new notifications.
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map((notif) => (
              <li key={notif.id} className="p-4 hover:bg-gray-50">
                <p className="text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500">
                  {notif.time || new Date(notif.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
