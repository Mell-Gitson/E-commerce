import React, { useState } from 'react';

function UserItem({ user, onUserUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
   console.log(userData)
   fetch("http://localhost:8000/admin/users", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify(userData)
   })
    setIsEditing(false);
    console.log(user)
  };

  const DeleteUser = () => {
    fetch("http://localhost:8000/admin/users", {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(userData)
     })

     setUserData('')
  }

  return (
    <div className="user-item">
      {isEditing ? (
        <div>
          <input type="text" name="email" value={userData.email} onChange={handleChange} />
          <input type="text" name="lastname" value={userData.lastname} onChange={handleChange} />
          <input type="text" name="firstname" value={userData.firstname} onChange={handleChange} />
          <input type="number" name="admin" value={userData.admin} onChange={handleChange} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <span>{userData.email} - {userData.lastname} - {userData.firstname} - {userData.admin}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={DeleteUser}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default UserItem;
