import React, { useState } from "react";

function AddUserForm({ addUser }) {
    const initialFormState = { id: null, name: "", email: "" };
    const [user, setUser] = useState(initialFormState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user.name || !user.email) return;
        addUser(user);
        setUser(initialFormState);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={user.name} onChange={handleInputChange} />
            <label>Email</label>
            <input type="email" name="email" value={user.email} onChange={handleInputChange} />
            <button>Add User</button>
        </form>
    );
}

export default AddUserForm;
