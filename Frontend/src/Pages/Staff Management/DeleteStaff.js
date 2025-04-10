import React, { useState } from "react";
import '../Modal/Modal';

const DeleteStaff= ({ fetchData }) => {
  const [staff_id, setStaffID] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/remove_staff', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staff_id }), // Send Aadhar Number in the request body
      });

      if (response.ok) {
        fetchData();
        setMessage('Staff deleted successfully!');
      } else {
        setMessage('Failed to delete staff. Please check the staff id.');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      setMessage('An error occurred while deleting the staff.');
    }
  };

  return (
    <div className="modal-content">
      <h2>Delete Staff</h2>
      <form onSubmit={handleSubmit}>
        <label>Staff ID:</label>
        <input
          type="number"
          value={staff_id}
          onChange={(e) => setStaffID(e.target.value)}
          placeholder="Enter Staff ID of staff member to delete"
        />
        <button type="submit">Delete</button>
      </form>
      {message && <p>{message}</p>} {/* Display success/error message */}
    </div>
  );
};

export default DeleteStaff;