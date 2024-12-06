import Image from "next/image";

export default function Table({dataHeaders, data}: {
    dataHeaders: any[];
    data: any[];
  }) {
//   let dataHeaders = ["Email", "Name", "Mobile", "Status", "Actions"];
//   let data = [
//     { email: "prijesh@gmail.com", name: "Prijesh", phone: 999999, active: true },
//     { email: "rajesh@gmail.com", name: "Rajesh", phone: 77777, active: false },
//     { email: "arjun@gmail.com", name: "Arjun", phone: 88888, active: true },
//     { email: "rahul@gmail.com", name: "Rahul", phone: 88888, active: true }
//   ];

  return (
    <table className="table-fixed border-collapse border border-gray-300 w-full text-left">
      <thead>
        <tr>
            {
                dataHeaders.map(h => {
                    return <th className="border border-gray-300 px-4 py-2">{h.label}</th>
                })
            }
        </tr>
      </thead>
      <tbody>
      {
        data.map(d => {
          return <tr className="hover:bg-gray-100">
            {
                dataHeaders.map(h => {
                    if(h.key === 'active') {
                        return <td className="border border-gray-300 px-4 py-2">
                        <span
                            className={`px-2 py-1 rounded text-white text-sm ${
                              d.active ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {d.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                    } 
                    return <td className="border border-gray-300 px-4 py-2">{d[h.key]}</td>
                })
            }
            {/* <td className="border border-gray-300 px-4 py-2">{d[dataHeaders[0].key]}</td>
            <td className="border border-gray-300 px-4 py-2">{d[dataHeaders[1].key]}</td>
            <td className="border border-gray-300 px-4 py-2">{d[dataHeaders[2].key]}</td> */}
            {/* <td className="border border-gray-300 px-4 py-2">
              <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    d.active ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {d.active ? "Active" : "Disabled"}
              </span>
            </td> */}
            <td className="border border-gray-300 px-4 py-2">
            <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-white text-sm rounded ${
                    d.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
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
        })
      }
      </tbody>
      
    </table>
  );
}
