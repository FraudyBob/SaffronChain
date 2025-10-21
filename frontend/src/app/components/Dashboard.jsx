import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since the /products endpoint needs smart contract modification
      // In a real implementation, you'd call: const response = await axios.get('/products');
      setProducts([
        { id: 'TUR001', name: 'Premium Turmeric Powder', turmeric_origin: 'Kerala, India', status: 'Farm', manufacturer: 'SpiceCo' },
        { id: 'TUR002', name: 'Organic Turmeric Root', turmeric_origin: 'Tamil Nadu, India', status: 'Factory', manufacturer: 'OrganicSpices' },
        { id: 'TUR003', name: 'Golden Turmeric Extract', turmeric_origin: 'Andhra Pradesh, India', status: 'Store', manufacturer: 'GoldenSpices' }
      ]);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: ['Farm', 'Factory', 'Store'], // Supply chain steps
    datasets: [{ 
      label: 'Products in Supply Chain', 
      data: [
        products.filter(p => p.status === 'Farm').length,
        products.filter(p => p.status === 'Factory').length,
        products.filter(p => p.status === 'Store').length
      ],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Supply Chain Distribution'
      }
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dark:bg-gray-800 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="dark:bg-gray-800 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Supply Chain Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Supply Chain Overview</h2>
          <Line data={data} options={options} />
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total Products:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">At Farm:</span>
              <span className="font-semibold text-green-600">{products.filter(p => p.status === 'Farm').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">At Factory:</span>
              <span className="font-semibold text-yellow-600">{products.filter(p => p.status === 'Factory').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">At Store:</span>
              <span className="font-semibold text-blue-600">{products.filter(p => p.status === 'Store').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Origin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Manufacturer</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{JSON.stringify(product.id)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{JSON.stringify(product.name)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{JSON.stringify(product.turmeric_origin)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'Farm' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      product.status === 'Factory' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{JSON.stringify(product.manufacturer)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;