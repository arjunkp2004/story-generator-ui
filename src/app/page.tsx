import Image from "next/image";
import Login from "./login/page";

export default function Home() {
  let data = [
    { email: "prijesh@gmail.com", name: "Prijesh", phone: 999999, active: true },
    { email: "rajesh@gmail.com", name: "Rajesh", phone: 77777, active: false },
    { email: "arjun@gmail.com", name: "Arjun", phone: 88888, active: true },
    { email: "rahul@gmail.com", name: "Rahul", phone: 88888, active: true }
  ];

  return <Login/>
    
}
