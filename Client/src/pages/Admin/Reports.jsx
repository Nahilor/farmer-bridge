import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const Reports = () => {
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState([]);
	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await api.adminGetOrders();
			setOrders(res.data || res || []);
		} catch (err) {
			console.error('Failed to load reports', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const id = setTimeout(() => fetchData(), 0);
		return () => clearTimeout(id);
	}, []);

	if (loading) return <div className="p-8">Loading...</div>;

	const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<h1 className="text-2xl font-bold mb-4">Reports</h1>
				<div className="bg-white p-6 rounded-xl shadow-sm">
					<p>Total Orders: {orders.length}</p>
					<p>Total Revenue: ETB {totalRevenue.toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
};

export default Reports;
