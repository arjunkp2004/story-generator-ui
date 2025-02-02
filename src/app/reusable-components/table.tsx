interface Header {
  key: string;
  label: string;
}

export default function Table<T extends Record<string, unknown>>({
  dataHeaders,
  data,
}: {
  dataHeaders: Header[];
  data: T[];
}) {
  return (
    <table className="table-fixed border-collapse border border-gray-300 w-full text-left">
      <thead>
        <tr>
          {dataHeaders.map((h) => (
            <th key={h.key} className="border border-gray-300 px-4 py-2">
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr key={i} className="hover:bg-gray-100">
            {dataHeaders.map((h) => {
              if (h.key === "active") {
                return (
                  <td key={h.key} className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        d[h.key] ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {d[h.key] ? "Active" : "Disabled"}
                    </span>
                  </td>
                );
              }
              return (
                <td key={h.key} className="border border-gray-300 px-4 py-2">
                  {d[h.key]}
                </td>
              );
            })}
            <td className="border border-gray-300 px-4 py-2">
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-white text-sm rounded ${
                    d.active
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {d.active ? "Deactivate" : "Activate"}
                </button>
                <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded">
                  Edit
                </button>
                <button className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
