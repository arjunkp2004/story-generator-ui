"use client"; // This line tells Next.js that this component should run on the client

import { useEffect, useState } from "react";
import TableNew from "../reusable-components/TableNew";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

// Define the type for each row in the table
interface RowData extends Record<string, unknown> {
  orgName: string;
  userLimit: number;
  active: boolean;
}

// Define the Header type that is used by TableNew
interface Header<T> {
  key: keyof T;
  label: string;
  render?: (data: unknown) => React.ReactNode;
}

// Define headers for the table, explicitly typing the render function for 'active'
const dataHeaders: Header<RowData>[] = [
  { key: "orgName", label: "Organization" },
  { key: "userLimit", label: "User Limit" },
  {
    key: "active",
    label: "Status",
    render: (data: unknown) =>
      typeof data === "boolean" ? (data ? "Active" : "Inactive") : "", // Render for 'active'
  },
];

// const initialData: RowData[] = [
//   { orgName: "ABC", userLimit: 10, active: true },
//   { orgName: "Rajesh", userLimit: 100, active: false },
//   { orgName: "Arjun", userLimit: 20, active: true },
// ];

// Define the action buttons for each row
const actionButtons = [
  {
    actionType: "view", // Unique identifier
    icon: <FaEye />,
    colorClass: "bg-blue-500 hover:bg-blue-600",
    onClick: (
      rowData: RowData,
      setShowModal: (show: boolean) => void,
      setModalMode: (mode: "view" | "edit" | null) => void,
      setSelectedItem: (item: RowData) => void
    ) => {
      setSelectedItem(rowData); // Set the item to be viewed
      setShowModal(true); // Show the modal
      setModalMode("view"); // Set the modal mode to 'view'
    },
  },
  {
    actionType: "edit", // Unique identifier
    icon: <FaEdit />,
    colorClass: "bg-yellow-500 hover:bg-yellow-600",
    onClick: (
      rowData: RowData,
      setShowModal: (show: boolean) => void,
      setModalMode: (mode: "view" | "edit" | null) => void,
      setSelectedItem: (item: RowData) => void
    ) => {
      setSelectedItem(rowData); // Set the item to be edited
      setShowModal(true); // Show the modal
      setModalMode("edit"); // Set the modal mode to 'edit'
    },
  },
  {
    actionType: "delete", // Unique identifier
    icon: <FaTrash />,
    colorClass: "bg-red-500 hover:bg-red-600",
    onClick: (
      rowData: RowData,
      setSelectedItem: (item: RowData) => void,
      setShowConfirmModal: (show: boolean) => void
    ) => {
      setSelectedItem(rowData); // Set the item to be deleted
      setShowConfirmModal(true); // Show confirmation modal
    },
  },
];

export default function SuperAdmin() {
  const [data, setData] = useState<RowData[]>([]); // Manage table data state
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control confirmation modal visibility
  const [selectedItem, setSelectedItem] = useState<RowData | null>(null); // Store the item to be deleted

  const [showModal, setShowModal] = useState(false); // State to control view/edit modal visibility
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null); // State to manage modal mode
  const [formData, setFormData] = useState<RowData | null>(null); // Form data for edit/view modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/superadmin/organizations"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result.organizations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleDelete = () => {
    if (selectedItem) {
      setData(data.filter((item) => item !== selectedItem)); // Remove the selected item from the data
      setShowConfirmModal(false); // Close the modal
      setSelectedItem(null); // Clear selected item
    }
  };

  const handleModalSave = () => {
    if (modalMode === "edit" && formData) {
      const updatedData = data.map((item) =>
        item.orgName === formData.orgName ? formData : item
      );
      setData(updatedData);
    }
    setShowModal(false); // Close the modal after saving
    setFormData(null); // Clear form data
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal
    setFormData(null); // Clear form data
  };

  return (
    <div>
      <p>Super Admin Landing Page</p>
      <TableNew<RowData>
        dataHeaders={dataHeaders}
        data={data}
        actionButtons={actionButtons.map((button) => ({
          ...button,
          onClick: (rowData: RowData) => {
            if (button.actionType === "view") {
              button.onClick(
                rowData,
                setShowModal,
                setModalMode,
                setSelectedItem
              ); // Open view modal
            } else if (button.actionType === "edit") {
              button.onClick(
                rowData,
                setShowModal,
                setModalMode,
                setSelectedItem
              ); // Open edit modal
            } else if (button.actionType === "delete") {
              button.onClick(rowData, setSelectedItem, setShowConfirmModal); // Handle delete action
            }
          },
        }))}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800">
              Are you sure you want to delete this organization?
            </h3>
            <div className="mt-4 text-gray-700">
              <p>
                <strong>Organization:</strong> {selectedItem.orgName}
              </p>
              <p>
                <strong>User Limit:</strong> {selectedItem.userLimit}
              </p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-md transition duration-200"
                  onClick={() => setShowConfirmModal(false)} // Close the modal without deleting
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition duration-200"
                  onClick={handleDelete} // Confirm deletion
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            {modalMode === "view" ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800">
                  View Organization
                </h3>
                <div className="mt-4 text-gray-700">
                  <p>
                    <strong>Organization:</strong> {selectedItem?.orgName}
                  </p>
                  <p>
                    <strong>User Limit:</strong> {selectedItem?.userLimit}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedItem?.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-md transition duration-200"
                    onClick={handleModalClose} // Close the modal
                  >
                    Close
                  </button>
                </div>
              </>
            ) : modalMode === "edit" ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800">
                  Edit Organization
                </h3>
                <div className="mt-4">
                  <label className="block text-gray-600">
                    Organization Name:
                  </label>
                  <input
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    type="text"
                    value={formData?.orgName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, orgName: e.target.value })
                    }
                  />
                  <label className="block text-gray-600 mt-4">
                    User Limit:
                  </label>
                  <input
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    type="number"
                    value={formData?.userLimit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userLimit: Number(e.target.value),
                      })
                    }
                  />
                  <label className="block text-gray-600 mt-4">Status:</label>
                  <select
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={formData?.active ? "active" : "inactive"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: e.target.value === "active",
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-md transition duration-200"
                    onClick={handleModalClose} // Close the modal
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-md transition duration-200"
                    onClick={handleModalSave} // Save edited data
                  >
                    Save
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
