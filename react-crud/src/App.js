import React, { useState, useEffect } from "react";
import UserList from "./components/UserList";
import AddUserForm from "./components/AddUserForm";
import EditUserForm from "./components/EditUserForm";
import './App.css';
import api from "./api/axios"; // Assuming you're using axios from a custom api setup

function App() {
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: null, name: "", email: "" });

    // Fetch users from the API
    useEffect(() => {
        api.get("/users") // Use your custom api here
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []); // Empty dependency array ensures this runs once when the component mounts

    // Add a new user
    const addUser = (user) => {
        api.post("/users", user) // Assuming you have this POST endpoint in your custom API
            .then((response) => {
                setUsers([...users, response.data]);
            })
            .catch((error) => console.error("Error adding user:", error));
    };

    // Delete a user
    const deleteUser = (id) => {
        api.delete(`/users/${id}`) // Assuming you have this DELETE endpoint in your custom API
            .then(() => {
                setUsers(users.filter((user) => user.id !== id));
            })
            .catch((error) => console.error("Error deleting user:", error));
    };

    // Edit a user
    const editUser = (id, updatedUser) => {
        setEditing(true);
        setCurrentUser(updatedUser);
    };

    // Update a user
    const updateUser = (id, updatedUser) => {
        api.put(`/users/${id}`, updatedUser) // Assuming you have this PUT endpoint in your custom API
            .then(() => {
                setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
                setEditing(false);
                setCurrentUser({ id: null, name: "", email: "" });
            })
            .catch((error) => console.error("Error updating user:", error));
    };

    return (
        <div className="container">
            <h1>React CRUD App</h1>
            {editing ? (
                <EditUserForm
                    currentUser={currentUser}
                    updateUser={updateUser}
                    setEditing={setEditing}
                />
            ) : (
                <AddUserForm addUser={addUser} />
            )}
            <UserList users={users} editUser={editUser} deleteUser={deleteUser} />
        </div>
    );
}

export default App;
