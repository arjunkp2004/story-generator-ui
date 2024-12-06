import Image from "next/image";
import Table from "../reusable-components/table";

export default function OrgAdmin() {
  let dataHeaders = [
    { key: "email", label: "Email" }, 
    { key: "name", label: "Name" }, 
    { key: "phone", label: "Mobile" }, 
    { key: "active", label: "Status" },
];
  let data = [
    { email: "prijesh@gmail.com", name: "Prijesh M", phone: 999999, active: true },
    { email: "rajesh@gmail.com", name: "Rajesh", phone: 77777, active: false },
    { email: "arjun@gmail.com", name: "Arjun", phone: 88888, active: true },
    { email: "rahul@gmail.com", name: "Rahul", phone: 88888, active: true }
  ];

  return (
    <Table data={data} dataHeaders={dataHeaders}/>
  );
}
