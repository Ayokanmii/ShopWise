import React, { useState, useEffect } from 'react';
     import axios from 'axios';
     import { toast } from 'react-toastify';

     const AdminDashboard = () => {
       const [products, setProducts] = useState([]);
       const [newProduct, setNewProduct] = useState({
         name: '',
         description: '',
         price: '',
         category: '',
         image: '',
         stock: ''
       });
       const [loading, setLoading] = useState(false);

       useEffect(() => {
         fetchProducts();
       }, []);

       const fetchProducts = async () => {
         setLoading(true);
         try {
           const res = await axios.get('http://localhost:5000/api/products', {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           setProducts(res.data);
         } catch (err) {
           toast.error('Failed to fetch products');
         } finally {
           setLoading(false);
         }
       };

       const handleAddProduct = async (e) => {
         e.preventDefault();
         try {
           await axios.post('http://localhost:5000/api/products', newProduct, {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           toast.success('Product added successfully');
           setNewProduct({ name: '', description: '', price: '', category: '', image: '', stock: '' });
           fetchProducts();
         } catch (err) {
           toast.error('Failed to add product');
         }
       };

       const handleDeleteProduct = async (id) => {
         try {
           await axios.delete(`http://localhost:5000/api/products/${id}`, {
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           toast.success('Product deleted successfully');
           fetchProducts();
         } catch (err) {
           toast.error('Failed to delete product');
         }
       };

       return (
         <div className="min-h-screen bg-secondary dark:bg-primary p-6">
           <h2 className="text-3xl font-bold text-center mb-8 text-primary dark:text-white">Admin Dashboard</h2>
           <div className="max-w-4xl mx-auto">
             <form onSubmit={handleAddProduct} className="bg-white dark:bg-[#2d2d2d] p-6 rounded-xl shadow-2xl mb-8">
               <h3 className="text-2xl font-semibold mb-4 text-primary dark:text-white">Add New Product</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-gray-700 dark:text-[#b0b0b0] mb-2" htmlFor="name">Name</label>
                   <input
                     type="text"
                     id="name"
                     value={newProduct.name}
                     onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                     className="w-full p-3 border rounded-lg dark:bg-[#3a3a3a] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-gray-700 dark:text-[#b0b0b0] mb-2" htmlFor="price">Price</label>
                   <input
                     type="number"
                     id="price"
                     value={newProduct.price}
                     onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                     className="w-full p-3 border rounded-lg dark:bg-[#3a3a3a] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-gray-700 dark:text-[#b0b0b0] mb-2" htmlFor="category">Category</label>
                   <input
                     type="text"
                     id="category"
                     value={newProduct.category}
                     onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                     className="w-full p-3 border rounded-lg dark:bg-[#3a3a3a] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-gray-700 dark:text-[#b0b0b0] mb-2" htmlFor="stock">Stock</label>
                   <input
                     type="number"
                     id="stock"
                     value={newProduct.stock}
                     onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                     className="w-full p-3 border rounded-lg dark:bg-[#3a3a3a] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                     required
                   />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-gray-700 dark:text-[#b0b0b0] mb-2" htmlFor="description">Description</label>
                   <textarea
                     id="description"
                     value={newProduct.description}
                     onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                     className="w-full p-3 border rounded-lg dark:bg-[#3a3a3a] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                     rows="4"
                     required
                   />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-gray-700 dark:text-[#b0b0b0] mb-2" htmlFor="image">Image URL</label>
                   <input
                     type="text"
                     id="image"
                     value={newProduct.image}
                     onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                     className="w-full p-3 border rounded-lg dark:bg-[#3a3a3a] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                     required
                   />
                 </div>
               </div>
               <button
                 type="submit"
                 className="btn-primary mt-6 w-full"
                 disabled={loading}
               >
                 {loading ? 'Adding...' : 'Add Product'}
               </button>
             </form>
             <h3 className="text-2xl font-semibold mb-4 text-primary dark:text-white">Manage Products</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {products.map((product) => (
                 <div key={product.id} className="bg-white dark:bg-[#2d2d2d] p-4 rounded-lg shadow-md">
                   <h4 className="text-lg font-semibold text-primary dark:text-white">{product.name}</h4>
                   <p className="text-gray-700 dark:text-[#b0b0b0]">{product.description}</p>
                   <p className="text-gray-700 dark:text-[#b0b0b0]">Price: ${product.price}</p>
                   <p className="text-gray-700 dark:text-[#b0b0b0]">Stock: {product.stock}</p>
                   <button
                     onClick={() => handleDeleteProduct(product.id)}
                     className="btn-primary bg-red-500 mt-2"
                     disabled={loading}
                   >
                     Delete
                   </button>
                 </div>
               ))}
             </div>
           </div>
         </div>
       );
     };

     export default AdminDashboard;