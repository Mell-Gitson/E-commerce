import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import * as XLSX from 'xlsx';
import { ReactSpoiler } from 'react-simple-spoiler'
import { saveAs } from 'file-saver';

const AdminExcell = () => {
  const [users, setUsers] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const gridRef = useRef();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        console.log('Users:', data);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCommandes = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/commandes');
      if (response.ok) {
        const data = await response.json();
        setCommandes(data);
        console.log('commandes:', data);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCommandes();

  }, []);

  const exportUsers = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'users.xlsx');
  };

  const exportCommandes = () => {
    const worksheet = XLSX.utils.json_to_sheet(commandes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'commandes.xlsx');
  };

  const columnDefs = [
    { headerName: "First Name", field: "firstname" },
    { headerName: "Last Name", field: "lastname" },
    { headerName: "Email", field: "email" }
  ];

  const columnDefs2 = [
    { headerName: "id", field: "id" },
    { headerName: "id_user", field: "id_user" },
    { headerName: "Commandes", field: "command_number" },
    { headerName: "Tracking", field: "tracking_number" }
  ];

  return (
    <div>
      <h1>Admin Excell</h1>
 

 
      <div>
        <h1 className='bg-red-300 p-2 w-20 rounded-full'>USERS</h1>
      <button className='bg-red-300 hover:opacity-80 text-black' onClick={exportUsers}>Exporter en Excel</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          ref={gridRef}
          rowData={users}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true }}
        />
      </div>
      </div>

      <div>
        <h1 className='bg-green-300 p-2 w-28 rounded-full'>Commandes</h1>
      <button className='bg-green-300 hover:opacity-80 text-black' onClick={exportCommandes}>Exporter en Excel</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          ref={gridRef}
          rowData={commandes}
          columnDefs={columnDefs2}
          defaultColDef={{ sortable: true, filter: true }}
        />
      </div>
      </div>


    </div>
  );
};

export default AdminExcell;