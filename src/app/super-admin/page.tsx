"use client"; // This line tells Next.js that this component should run on the client

import { useEffect, useState } from "react";
import TableNew from "../reusable-components/TableNew";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Button from "../reusable-components/Button";

// Define the type for each row in the table
interface RowData extends Record<string, unknown> {
  name: string;
  user_limit: number;
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
  { key: "name", label: "Organization" },
  { key: "user_limit", label: "User Limit" },
  {
    key: "status",
    label: "Status",
    render: (data: unknown) =>
      typeof data === "number" ? (data === 1 ? "Active" : "Inactive") : "", // Render for 'active'
  },
];

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
    actionType: "edit",
    icon: <FaEdit />,
    colorClass: "bg-yellow-500 hover:bg-yellow-600",
    onClick: (
      rowData: RowData,
      setShowModal: (show: boolean) => void,
      setModalMode: (mode: "view" | "edit" | null) => void,
      setSelectedItem: (item: RowData) => void,
      setFormData: (data: RowData | null) => void
    ) => {
      setSelectedItem(rowData);
      setFormData(rowData);
      setShowModal(true);
      setModalMode("edit");
    },
  },
  {
    actionType: "delete",
    icon: <FaTrash />,
    colorClass: "bg-red-500 hover:bg-red-600",
    onClick: (
      rowData: RowData,
      setSelectedItem: (item: RowData) => void,
      setShowConfirmModal: (show: boolean) => void
    ) => {
      setSelectedItem(rowData);
      setShowConfirmModal(true);
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

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/superadmin/organizations"
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setData(result.organizations);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateOrganization = async (
    orgId: number,
    updatedData: Partial<RowData>
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8000/superadmin/organizations/${orgId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update organization");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      fetchData(); // Refresh data after update
      setShowModal(false);
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteOrganization = async (orgId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/superadmin/organizations/${orgId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete organization");
      }

      console.log("Delete successful");
      fetchData(); // Refresh data after delete
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdate = () => {
    if (selectedItem && formData) {
      updateOrganization(selectedItem.id, formData);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteOrganization(selectedItem.id);
    }
  };

  // const handleModalSave = () => {
  //   if (modalMode === "edit" && formData) {
  //     const updatedData = data.map((item) =>
  //       item.name === formData.name ? formData : item
  //     );
  //     setData(updatedData);
  //   }
  //   setShowModal(false); // Close the modal after saving
  //   setFormData(null); // Clear form data
  // };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal
    setFormData(null); // Clear form data
  };

  const addOrganization = async (newOrg: Omit<RowData, "id">) => {
    try {
      debugger;
      const response = await fetch(
        "http://127.0.0.1:8000/superadmin/organizations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrg),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add organization");
      }

      console.log("Organization added successfully");
      fetchData(); // Refresh data
      setShowModal(false);
    } catch (error) {
      console.error("Error adding organization:", error);
    }
  };

  const handleAddOrganization = () => {
    debugger;
    if (formData) {
      addOrganization({
        name: formData.name,
        user_limit: formData.user_limit,
        status: formData.active,
        created_by: 1,
      });
    }
  };

  return (
    <div>
      <p>Super Admin Landing Page</p>
      <Button
        onClick={() => {
          setShowModal(true);
          setModalMode("add");
          setFormData({ name: "", user_limit: 0, active: true });
        }}
      >
        Add Organization
      </Button>
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
              );
            } else if (button.actionType === "edit") {
              button.onClick(
                rowData,
                setShowModal,
                setModalMode,
                setSelectedItem,
                setFormData
              );
            } else if (button.actionType === "delete") {
              button.onClick(rowData, setSelectedItem, setShowConfirmModal);
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
                <strong>Organization:</strong> {selectedItem.name}
              </p>
              <p>
                <strong>User Limit:</strong> {selectedItem.user_limit}
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
                    <strong>Organization:</strong> {selectedItem?.name}
                  </p>
                  <p>
                    <strong>User Limit:</strong> {selectedItem?.user_limit}
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
                    value={formData?.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <label className="block text-gray-600 mt-4">
                    User Limit:
                  </label>
                  <input
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    type="number"
                    value={formData?.user_limit || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user_limit: Number(e.target.value),
                      })
                    }
                  />
                  <label className="block text-gray-600 mt-4">Status:</label>
                  <select
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={formData?.active ? "1" : "2"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: e.target.value,
                      })
                    }
                  >
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
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
                    onClick={handleUpdate} // Save edited data
                  >
                    Save
                  </button>
                </div>
              </>
            ) : null}

            {modalMode === "add" && (
              <>
                <h3 className="text-xl font-semibold text-gray-800">
                  Add Organization
                </h3>
                <div className="mt-4">
                  <label className="block text-gray-600">
                    Organization Name:
                  </label>
                  <input
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                    type="text"
                    value={formData?.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                  />
                  <label className="block text-gray-600 mt-4">
                    User Limit:
                  </label>
                  <input
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                    type="number"
                    value={formData?.user_limit || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev!,
                        user_limit: Number(e.target.value),
                      }))
                    }
                  />
                  <label className="block text-gray-600 mt-4">Status:</label>
                  <select
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                    value={formData?.active}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev!,
                        active: e.target.value,
                      }))
                    }
                  >
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-md"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                    onClick={handleAddOrganization}
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
