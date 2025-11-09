import React, { useEffect, useState } from 'react';
import UserItem from './UserItem';
import './DashboardContent.css';

function UserList({ onUserUpdate }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  
    fetch('http://localhost:8000/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="dashboard-content">
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>User List</h2>
      {users.map(user => (
        <UserItem key={user.id} user={user} onUserUpdate={onUserUpdate} />
      ))}
    </div>
  );
}

export default UserList;