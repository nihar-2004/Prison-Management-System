import React, { useMemo, useState, useEffect } from "react";
import { useTable } from 'react-table'; 
import axios from 'axios'; // Make sure to install axios
import './CellManagement.css'; // Import the CSS file
import Modal from "../Modal/Modal";
import DeleteCell from "./DeleteCell";
import ReallocateCell from "./RellocateCell";

function CellDetails() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // State to show/hide modal
    const [activeOperation, setActiveOperation] = useState(null);
    const fetchData = async () => {
        try {
            const response = await axios.get('/cells');
            setData(response.data);
        } catch (error) {
            setError("Error fetching data. Please try again.");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        
        fetchData();
    }, []);

    const columns = useMemo(() => [
        { Header: "Cell No.", accessor: "cell_no" },
        { Header: "Vacant", accessor: "vacant" },
        { Header: "Prisoner ID", accessor: "prisoner_id" },
        { Header: "Name", accessor: "name" }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
        getSubRows: () => undefined, // Explicitly tell react-table that there are no subRows
    });    

    if (loading) {
        return <div className="loader"></div>; // Consider using a spinner here
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const handleOpenModal = (operation) => {
        setActiveOperation(operation);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setActiveOperation(null);
    };

    // Function to add a new cell directly
    const handleAddCell = async () => {
        try {
            const response = await axios.post('/add_cell'); // Adjust according to your backend requirements
            alert(response.data.message);
            fetchData()// Success message
            setData(prevData => [...prevData, response.data.newCell]); // Update the table data if the response contains new cell info
        } catch (error) {
            console.error("Error adding cell:", error);
            setError("Failed to add cell. Please try again.");
        }
    };

    return (
        <div className="App">
            <div className="table-container">
                <h1>Cell Table</h1>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="Operations">
                <button className="Add" onClick={handleAddCell}>Add Cell</button> {/* Directly calls the function */}
                <button className="Delete" onClick={() => handleOpenModal('delete')}>Delete Cell</button>
                <button className="Reallocate" onClick={() => handleOpenModal('reallocate')}>Reallocate Prisoner</button> {/* New button */}
            </div>


            {showModal && (
                <Modal onClose={handleCloseModal}>
                    {activeOperation === 'delete' && <div><DeleteCell fetchData={fetchData}/></div>}
                    {activeOperation === 'reallocate' && <div><ReallocateCell fetchData={fetchData}/></div>}
                </Modal>
            )}
        </div>
    );
}

export default CellDetails;