"use client";

import { useEffect, useState } from "react";
import TableNew from "../reusable-components/TableNew";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Button from "../reusable-components/Button";

interface RowData {
  id: number;
  username: string;
  role: string;
  organization_id: number;
  created_at: string;
  status: boolean;
}

const roles = ["superadmin", "admin", "normal"];

const dataHeaders = [
  { key: "username", label: "Username" },
  { key: "role", label: "Role" },
  { key: "organization_id", label: "Organization ID" },
  { key: "created_at", label: "Created At" },
  {
    key: "status",
    label: "Status",
    render: (data: unknown) =>
      typeof data === "boolean" ? (data ? "Active" : "Inactive") : "Unknown",
  },
];

export default function OrgAdmin() {
  const [users, setUsers] = useState<RowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "add" | null>(
    null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RowData | null>(null);
  const [formData, setFormData] = useState<Partial<RowData>>({});

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/orgadmin/users");
      if (!response.ok) throw new Error("Failed to fetch users");

      const apiData = (await response.json())?.users || [];
      const formattedData: RowData[] = apiData.map((user: any) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        organization_id: user.organization_id,
        created_at: new Date(user.created_at).toLocaleString(),
        status: user.status === 1,
      }));

      setUsers(formattedData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleModalOpen = (mode: "view" | "edit" | "add", user?: RowData) => {
    setSelectedUser(user || null);
    setFormData(
      user || { username: "", role: "normal", organization_id: 0, status: true }
    );
    setModalMode(mode);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({});
    setSelectedUser(null);
  };

  const actionButtons = [
    {
      icon: <FaEye />,
      colorClass: "bg-blue-500 hover:bg-blue-600",
      onClick: (rowData: RowData) => handleModalOpen("view", rowData),
    },
    {
      icon: <FaEdit />,
      colorClass: "bg-yellow-500 hover:bg-yellow-600",
      onClick: (rowData: RowData) => handleModalOpen("edit", rowData),
    },
    {
      icon: <FaTrash />,
      colorClass: "bg-red-500 hover:bg-red-600",
      onClick: (rowData: RowData) => handleModalOpen("delete", rowData),
    },
  ];

  return (
    <div>
      <h1>Manage Users</h1>
      <Button onClick={() => handleModalOpen("add")}>
        {" "}
        <FaPlus /> Add User{" "}
      </Button>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <TableNew<RowData>
          dataHeaders={dataHeaders}
          data={users}
          actionButtons={actionButtons}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold">
              {modalMode === "view"
                ? "View User"
                : modalMode === "edit"
                ? "Edit User"
                : "Add User"}
            </h2>
            <div className="mt-4">
              <label>Username:</label>
              <input
                className="border p-2 w-full"
                type="text"
                value={formData.username || ""}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={modalMode === "view"}
              />
              <label>Role:</label>
              <select
                className="border p-2 w-full"
                value={formData.role || "normal"}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                disabled={modalMode === "view"}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="bg-gray-400 px-4 py-2"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              {modalMode !== "view" && (
                <button className="bg-green-500 px-4 py-2">Save</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
