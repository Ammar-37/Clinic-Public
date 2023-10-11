import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllInOneMedicine() {
    const [meds, setMeds] = useState([]);
    const [message, setMessage] = useState('');
    const [medicinalUse, setMedicinalUse] = useState('');
    const [medicinalUses, setMedicinalUses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        // Fetch distinct medicinal uses from the server
        axios.get(`http://localhost:3001/medicinal-uses`)
            .then(response => {
                setMedicinalUses(response.data);
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicinal uses');
            });

        // Fetch all medicines from the backend
        axios.get('http://localhost:3001/medicines')
            .then(response => {
                setMedicines(response.data);
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicines');
            });
    }, []);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px',
    };

    const componentStyle = {
        border: '1px solid #ccc',
        padding: '20px',
        width: '80%',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    };

    const selectStyle = {
        width: '48%',
        padding: '8px',
        fontSize: '16px',
    };

    const inputStyle = {
        width: '48%',
        padding: '8px',
        fontSize: '16px',
    };

    const handleFilter = (event) => {
        const input = event.target.value;
        setMedicinalUse(input);
        filterMedicines(searchQuery, input);
    };

    const handleSearch = (event) => {
        const input = event.target.value;
        setSearchQuery(input);
        filterMedicines(input, medicinalUse);
    };

    const filterMedicines = (search, filter) => {
        const filtered = medicines.filter(medicine =>
            medicine.name.toLowerCase().startsWith(search.toLowerCase()) &&
            (filter === '' || medicine.medicinalUse === filter)
        );
        setMeds(filtered);
    };

    useEffect(() => {
        filterMedicines(searchQuery, medicinalUse);
    }, [searchQuery, medicinalUse, medicines]);
    return (
        <div style={containerStyle}>
            <div style={componentStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Medicine Filter and Search</h2>
                <div style={rowStyle}>
                    <select onChange={handleFilter} style={selectStyle}>
                        <option value="">Filter Medicines by Medicinal Use</option>
                        {medicinalUses.map((use, index) => (
                            <option key={index} value={use}>{use}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search for a medication by name"
                        value={searchQuery}
                        onChange={handleSearch}
                        style={inputStyle}
                    />
                </div>
                {meds.map(med => (
                    <div key={med._id} style={{ marginBottom: '20px' }}>
                        <h3>{med.name}</h3>
                        <img src={med.imageUrl} alt={med.name} style={{ width: '100px' }} />
                        <p>{med.description}</p>
                        <p>Medicinal Use: {med.medicinalUse}</p>
                    </div>
                ))}
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AllInOneMedicine;
