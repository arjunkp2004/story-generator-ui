"use client"; // This line tells Next.js that this component should run on the client

import TableNew from "../reusable-components/TableNew";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Import icons

// Define the type for each row in the table
interface RowData extends Record<string, unknown> {
  email: string;
  name: string;
  phone: number;
  active: boolean;
}

// Define headers without directly passing the function to `render`
const dataHeaders = [
  { key: "email", label: "Email" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Mobile" },
  {
    key: "active",
    label: "Status",
    render: (data: unknown) =>
      typeof data === "boolean" ? (data ? "Active" : "Inactive") : "Unknown", // Render for 'Status'
  },
];

// Example data for the table
const data: RowData[] = [
  {
    email: "prijesh@gmail.com",
    name: "Prijesh M",
    phone: 999999,
    active: true,
  },
  { email: "rajesh@gmail.com", name: "Rajesh", phone: 77777, active: false },
  { email: "arjun@gmail.com", name: "Arjun", phone: 88888, active: true },
  { email: "rahul@gmail.com", name: "Rahul", phone: 88888, active: true },
];

// Example action buttons for each row
const actionButtons = [
  {
    icon: <FaEye />,
    colorClass: "bg-blue-500 hover:bg-blue-600", // Action button style for View
    onClick: (rowData: RowData) => {
      console.log("Viewing:", rowData);
    },
  },
  {
    icon: <FaEdit />,
    colorClass: "bg-yellow-500 hover:bg-yellow-600", // Action button style for Edit
    onClick: (rowData: RowData) => {
      console.log("Editing:", rowData);
    },
  },
  {
    icon: <FaTrash />,
    colorClass: "bg-red-500 hover:bg-red-600", // Action button style for Delete
    onClick: (rowData: RowData) => {
      console.log("Deleting:", rowData);
    },
  },
];

export default function OrgAdmin() {
  return (
    <div>
      <h1>Manage Users</h1>
      <TableNew<RowData>
        dataHeaders={dataHeaders}
        data={data}
        actionButtons={actionButtons}
      />
    </div>
  );
}
