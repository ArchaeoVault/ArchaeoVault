import React, { useEffect, useState } from "react";
import Header from './Header';
import Footer from './Footer';
import './AdminPage.css';

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.DJANGO_ALLOWED_HOST_1}/api/`;}
else{ backend_url = 'http://localhost:8000/api/';}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Invalid email address.";
  };
  
  const validatePassword = (password) => {
    if (!password) return null; // allow blank if not updating password
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password.toLowerCase() === "password") return "Password cannot be 'password'.";
    if (/^\d+$/.test(password)) return "Password cannot be all numbers.";
    return null;
  };

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirm_password: "",
    permission: "",
    activated: false
  });
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(backend_url+'get_csrf_token/', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are included
        });
        const data = await response.json();
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }

      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch(backend_url + 'admin_see_all_users/',
    { credentials: "include" });
    const data = await res.json();
    console.log(data);
    setUsers(data.Users);
  };

  const handleCreateUser = async () => {
    const emailError = validateEmail(newUser.email);
    const passwordError = validatePassword(newUser.password);
  
    if (emailError || passwordError) {
      alert(emailError || passwordError);
      return;
    }
  
    if (newUser.password !== newUser.confirm_password) {
      alert("Passwords do not match.");
      return;
    }
  
    await fetch(backend_url + 'admin_create_user/', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json",
      'X-CSRFToken': csrfToken, 
    },
      body: JSON.stringify(newUser),
    });
  
    fetchUsers();
    setNewUser({ email: "", password: "", confirm_password: "", permission: "", activated: false });
  };

  const handleEditUser = async () => {
    const emailError = editUser.newEmail ? validateEmail(editUser.newEmail) : null;
    const passwordError = editUser.password ? validatePassword(editUser.password) : null;
  
    if (emailError || passwordError) {
      alert(emailError || passwordError);
      return;
    }
  
    const body = {
      oldEmail: editUser.email,
      ...(editUser.newEmail && { newEmail: editUser.newEmail }),
      ...(editUser.password && { password: editUser.password }),
      ...(editUser.permission && { permission: editUser.permission }),
      activated: editUser.activated, 
    };
  
    await fetch(backend_url + 'admin_edit_user/', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", 
      'X-CSRFToken': csrfToken,
     },
      body: JSON.stringify(body),
    });
  
    setEditUser(null);
    fetchUsers();
  };
  

  const handleDeleteUser = async (email) => {
    await fetch(backend_url + 'admin_delete_user/', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", 
      'X-CSRFToken': csrfToken,
     },
      body: JSON.stringify({ email }),
    });
    fetchUsers();
  };

  return (
    <>
    <Header />
    <div className="admin-users-dashboard">
      <h2>All Users</h2>
      <div className="create-user-toggle">
      {!showCreateForm ? (
        <button onClick={() => setShowCreateForm(true)}>+ Create New User</button>
        ) : ( <div className = "create-user-form">
          <h3>Create New User</h3>
      <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
      <input placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
      <input placeholder="Confirm Password" value={newUser.confirm_password} onChange={(e) => setNewUser({ ...newUser, confirm_password: e.target.value })}/>

      <select
            value={newUser.permission}
            onChange={(e) => setNewUser({ ...newUser, permission: e.target.value })}
            >
            <option value="">Select Permission</option>
            <option value="GeneralPublic">GeneralPublic</option>
            <option value="Researchers">Researchers</option>
            <option value="SuperAdmin">SuperAdmin</option>
        </select>
      <label>
        <input type="checkbox" checked={newUser.activated} onChange={(e) => setNewUser({ ...newUser, activated: e.target.checked })} />
        Activated
      </label>
      <button onClick={handleCreateUser}>Add User</button>
      <button onClick={() => setShowCreateForm(false)}>Cancel</button>
    </div>
    )}
    </div>
      <input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="user-search"
      />
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Password</th>
            <th>Permissions</th>
            <th>Activated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {users .filter((u) => u.email.toLowerCase().includes(searchTerm.toLowerCase())) .map((u) => [
                <tr key={u.email}>
                <td>{u.email}</td>
                <td>{u.password}</td>
                <td>{u.permission}</td>
                <td>{u.activated ? "Yes" : "No"}</td>
                <td>
                    <button onClick={() => setEditUser(u)}>Edit</button>
                    <button onClick={() => handleDeleteUser(u.email)}>Delete</button>
                </td>
                </tr>,
                editUser?.email === u.email && (
                <tr key={`${u.email}-edit`}>
                    <td colSpan="5">
                    <div className="inline-edit-form">
                        <input value={editUser.email} readOnly />
                        <input
                        value={editUser.newEmail || ""}
                        placeholder="New Email"
                        onChange={(e) => setEditUser({ ...editUser, newEmail: e.target.value })}
                        />
                        <input
                        value={editUser.password || ""}
                        placeholder="New Password"
                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                        />
                        <select
                        value={editUser.permission || ""}
                        onChange={(e) => setEditUser({ ...editUser, permission: e.target.value })}
                        >
                        <option value="">Select Permission</option>
                        <option value="GeneralPublic">GeneralPublic</option>
                        <option value="Researchers">Researchers</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                        </select>
                        <label>
                            <select
                                value={editUser.activated ? "yes" : "no"}
                                onChange={(e) =>
                                setEditUser({ ...editUser, activated: e.target.value === "yes" })
                                }
                            >
                                <option value="">Select Activation</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </label>
                        <button onClick={handleEditUser}>Save</button>
                        <button onClick={() => setEditUser(null)}>Cancel</button>
                    </div>
                    </td>
                </tr>
                )
            ])}
            </tbody>
      </table>
    </div>
    <Footer /> 
    </>
  );
};

export default AdminPage;
