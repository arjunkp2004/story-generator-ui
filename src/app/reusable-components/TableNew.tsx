"use client"; // This line tells Next.js that this component should run on the client

import React from "react";

interface Header<T> {
  key: keyof T;
  label: string;
  render?: (data: T[keyof T]) => React.ReactNode;
}

interface ActionButtonType<T> {
  text?: string;
  icon?: React.ReactNode;
  colorClass?: string;
  onClick: (rowData: T) => void;
}

interface TableProps<T> {
  dataHeaders: Header<T>[];
  data: T[];
  actionButtons?: ActionButtonType<T>[];
}

const TableNew = <T extends Record<string, unknown>>({
  dataHeaders,
  data,
  actionButtons,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-gray-200 text-gray-800 uppercase text-sm font-semibold">
          <tr>
            {dataHeaders.map((header) => (
              <th
                key={String(header.key)}
                className="border border-gray-300 px-4 py-3 text-left text-gray-700"
              >
                {header.label}
              </th>
            ))}
            {actionButtons && (
              <th className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, index) => (
            <tr
              key={index}
              className="border border-gray-300 even:bg-gray-100 odd:bg-white hover:bg-gray-200"
            >
              {dataHeaders.map((header) => (
                <td
                  key={String(header.key)}
                  className="border border-gray-300 px-4 py-2 text-gray-800"
                >
                  {header.render
                    ? header.render(rowData[header.key])
                    : (rowData[header.key] as React.ReactNode)}
                </td>
              ))}
              {actionButtons && (
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex justify-center space-x-2">
                    {actionButtons.map((button, idx) => (
                      <ActionButton
                        key={idx}
                        buttonText={button.text || ""}
                        colorClass={
                          button.colorClass || "bg-blue-500 hover:bg-blue-700"
                        }
                        icon={button.icon}
                        onClick={() => button.onClick(rowData)}
                      />
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ActionButton = ({
  buttonText = "",
  icon,
  colorClass,
  onClick,
}: {
  buttonText: string;
  icon: React.ReactNode;
  colorClass: string;
  onClick: () => void;
}) => {
  return (
    <button
      className={`px-3 py-1 text-white text-sm rounded-md transition duration-200 ease-in-out flex items-center ${colorClass}`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {buttonText}
    </button>
  );
};

export default TableNew;
