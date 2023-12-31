import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const addMedContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  display: 'grid', // Set the container to use grid layout
  gridTemplateColumns: '1fr 1fr', // Two equal-width columns
  gap: '20px', // Spacing between columns
};

const labelStyle = {
  fontWeight: 'bold',
};

const checkboxStyle = {
  marginLeft: '5px',
};

const addMedButtonStyle = {
  gridColumn: 'span 2', // Make the button span both columns
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
};

const successMessageStyle = {
  gridColumn: 'span 2', // Make the success message span both columns
  color: 'green',
};

const errorMessageStyle = {
  gridColumn: 'span 2', // Make the error message span both columns
  color: 'red',
};

const formColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const AddMed = () => {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState({
    name: '',
    activeIngredients: [],
    medicinalUse: '',
    price: 0,
    quantity: 0,
    sales: 0,
    imageUrl: '',
    isPrescriptionRequired: false,
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/add-medicine`)
      .then((response) => {
        const responseData = response.data;
        console.log(responseData.type,responseData.in)
        if (responseData.type !== "pharmacist" || responseData.in !== true) {
          navigate('/login')
        }
      })
  }, []);
  const handleChange = (event) => {
    setSuccessMessage('');
    const { name, value } = event.target;

    // Check if the field being updated is 'activeIngredients'
    if (name === 'activeIngredients') {
      const ingredientsArray = value.split(',').map((ingredient) => ingredient.trim());
      setMedicine((prevState) => ({
        ...prevState,
        [name]: ingredientsArray,
      }));
    } else if (name === 'price' || name === 'quantity') {
      // Ensure that the value is a non-negative number
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setMedicine((prevState) => ({
          ...prevState,
          [name]: numericValue,
        }));
      }
    } else {
      setMedicine((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (medicine.price <= 0 || medicine.quantity <= 0) {
        setErrorMessage('Price and quantity must be greater than 0.');
      } else {
        const response = await axios.post('http://localhost:3001/add-medicine', medicine);
        console.log(response.data);
        setSuccessMessage('Medicine added successfully');
        setErrorMessage('');
        setMedicine({
          name: '',
          activeIngredients: [],
          medicinalUse: '',
          price: 0,
          quantity: 0,
          sales: 0,
          imageUrl: '',
          isPrescriptionRequired: false,
          description: '',
        });
      }
      navigate('/add-med');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={addMedContainerStyle}>
      <h1 style={{ margin: '20px', gridColumn: 'span 2' }}>Add Medicine</h1>
      <form onSubmit={handleSubmit} style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={formColumnStyle}>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="name">
              Name:
            </label>
            <input type="text" id="name" name="name" value={medicine.name} onChange={handleChange} required />
          </div>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="activeIngredients">
              Active Ingredients (Separate with a comma):
            </label>
            <input
              type="text"
              id="activeIngredients"
              name="activeIngredients"
              placeholder="e.g., 1st ingredient, 2nd ingredient"
              value={medicine.activeIngredients.join(', ')}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="medicinalUse">
              Medicinal Use:
            </label>
            <input type="text" id="medicinalUse" name="medicinalUse" value={medicine.medicinalUse} onChange={handleChange} required />
          </div>
        </div>
        <div style={formColumnStyle}>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="price">
              Price:
            </label>
            <input type="number" id="price" name="price" value={medicine.price} onChange={handleChange} required />
          </div>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="quantity">
              Quantity:
            </label>
            <input type="number" id="quantity" name="quantity" value={medicine.quantity} onChange={handleChange} required />
          </div>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="imageUrl">
              Image URL:
            </label>
            <input type="text" id="imageUrl" name="imageUrl" value={medicine.imageUrl} onChange={handleChange} required />
          </div>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="isPrescriptionRequired">
              Prescription Required:
            </label>
            <input
              type="checkbox"
              id="isPrescriptionRequired"
              name="isPrescriptionRequired"
              checked={medicine.isPrescriptionRequired}
              onChange={() =>
                setMedicine((prevState) => ({
                  ...prevState,
                  isPrescriptionRequired: !prevState.isPrescriptionRequired,
                }))
              }
            />
          </div>
          <div style={{ ...formColumnStyle, marginBottom: '20px' }}>
            <label style={labelStyle} htmlFor="description">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={medicine.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" style={addMedButtonStyle}>
          Add Medicine
        </button>
        {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
        {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default AddMed;
