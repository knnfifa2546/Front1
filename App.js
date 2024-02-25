import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    price: "",
    img: ""
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:5000/product")
      .then(response => setProducts(response.data.product))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };  

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const handleNewProductSubmit = (event) => {
    event.preventDefault();

    const newProductId = parseInt(newProduct.id);

    if (!isNaN(newProductId) && Number.isInteger(newProductId)) {
      const updatedProduct = { ...newProduct, id: newProductId };

      axios.post("http://localhost:5000/product", updatedProduct)
        .then(response => {
          setNewProduct({ id: "", name: "", price: "", img: "" });
          fetchData();
        })
        .catch(error => {
          console.error('Error adding new product:', error);
        });
    } else {
      console.error('Invalid ID. Please enter a valid integer for ID.');
    }
  };
  
  const handleAddProduct = () => {
    axios.post("http://localhost:5000/product", newProduct)
      .then(response => {
        setProducts([...products, response.data.product]);
        setNewProduct({ id: "", name: "", price: "", img: "" });
      })
      .catch(error => console.error('Error adding product:', error));
  };
  
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/product/${parseInt(productId)}`);
      setProducts((prevProducts) => prevProducts.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (id) => {
    axios.get(`http://localhost:5000/product/${id}`)
      .then(response => {
        setEditProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product for edit:', error);
      });
  };

  const handleUpdateProduct = () => {
    if (editProduct) {
      axios.put(`http://localhost:5000/product/${editProduct._id}`, editProduct)
        .then(response => {
          setEditProduct(null);
          fetchData();
        })
        .catch(error => {
          console.error('Error updating product:', error);
        });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const productList = products.map(product => (
    <div className="product-item" key={product._id}>
      <p>ID: {product._id}</p>
      <p>Name: {product.name}</p>
      <p>Price: {product.price}</p>
      <p><img src={product.img} alt={product.name} /></p>
      <button className="edit-btn" onClick={() => handleEditProduct(product._id)}>Edit</button>
      <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
    </div>
  ));

  return (
    <div>
      <h1>Laptop Product </h1>

      <div className="input-container">
        <input type="text" placeholder="ID" name="id" value={newProduct.id} onChange={handleNewProductChange} />
        <input type="text" placeholder="Name" name="name" value={newProduct.name} onChange={handleNewProductChange} />
        <input type="text" placeholder="Price" name="price" value={newProduct.price} onChange={handleNewProductChange} />
        <input type="text" placeholder="Image URL" name="img" value={newProduct.img} onChange={handleNewProductChange} />
        <button onClick={handleAddProduct}>Add Product</button>
        <button onClick={handleNewProductSubmit}>Update Product</button>
      </div>
      <div className="product-container">
        {productList}
      </div>

       {editProduct && (
          <div>
            <h2>Edit Product</h2>
            <input type="text" placeholder="Name" name="name" value={editProduct.name} onChange={handleInputChange} className="product-input"/>
            <input type="text" placeholder="Price" name="price" value={editProduct.price} onChange={handleInputChange} className="product-input"/>
            <input type="text" placeholder="Image URL" name="img" value={editProduct.img} onChange={handleInputChange} className="product-input"/>
            <button className="Add-product" onClick={handleUpdateProduct}>Update Product</button>
          </div>
        )}
    </div>
  );
};

export default ProductManagement;
