import React, { useState } from "react";

function EditUserForm({ currentUser, updateUser, setEditing }) {
    const [user, setUser] = useState(currentUser);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(user.id, user);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={user.name} onChange={handleInputChange} />
            <label>Email</label>
            <input type="email" name="email" value={user.email} onChange={handleInputChange} />
            <button>Update User</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
        </form>
    );
}

export default EditUserForm;
