import MyLoginPage from '../login/page'
import Table from '../reusable-components/table';

export default function Login() {
    let dataHeaders = [
        { key: "orgName", label: "Organization" }, 
        { key: "userLimit", label: "User Limit" }, 
        { key: "active", label: "Status" }, 
    ];
    let data = [
      { orgName: "ABC", userLimit: 10, active: true },
      { orgName: "Rajesh", userLimit: 100, active: false },
      { orgName: "Arjun", userLimit: 20, active: true }
    ];

    return <p>Super Admin Landing Page
        <Table data={data} dataHeaders={dataHeaders}/>
    </p>;
}