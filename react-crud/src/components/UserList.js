function UserList({ users, editUser, deleteUser }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="edit" onClick={() => editUser(user.id, user)}>
                                    Edit
                                </button>
                                <button className="delete" onClick={() => deleteUser(user.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} style={{ textAlign: "center" }}>
                            No users found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default UserList;
