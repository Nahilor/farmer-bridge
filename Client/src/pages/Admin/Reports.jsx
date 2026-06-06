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

	const getOrderTotal = (o) => {
		if (!o) return 0;
		if (o.totalPrice) return Number(o.totalPrice) || 0;
		if (Array.isArray(o.items) && o.items.length > 0) {
			return o.items.reduce((s, it) => s + (Number(it.totalPrice) || (Number(it.pricePerUnit) * Number(it.quantity)) || 0), 0);
		}
		// fallback to pricePerUnit * quantity
		return (Number(o.pricePerUnit) || 0) * (Number(o.quantity) || 0);
	};

	const totalRevenue = orders.reduce((sum, o) => sum + getOrderTotal(o), 0);

	// Group orders per day (YYYY-MM-DD)
	const revenueByDay = orders.reduce((acc, o) => {
		const day = new Date(o.createdAt).toISOString().slice(0, 10);
		acc[day] = acc[day] || { orders: 0, revenue: 0 };
		acc[day].orders += 1;
		acc[day].revenue += getOrderTotal(o);
		return acc;
	}, {});

	const revenueByDayList = Object.keys(revenueByDay).sort((a, b) => b.localeCompare(a)).slice(0, 7);

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

				{/* Summary cards */}
				<div className="grid md:grid-cols-3 gap-4 mb-6">
					<div className="bg-white p-4 rounded-lg shadow-sm">
						<p className="text-sm text-gray-500">Total Orders</p>
						<p className="text-2xl font-bold">{orders.length}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm">
						<p className="text-sm text-gray-500">Total Revenue</p>
						<p className="text-2xl font-bold">ETB {totalRevenue.toLocaleString()}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-sm">
						<p className="text-sm text-gray-500">Unique Days</p>
						<p className="text-2xl font-bold">{Object.keys(revenueByDay).length}</p>
					</div>
				</div>

				{/* Revenue by Day */}
				<div className="bg-white p-6 rounded-xl shadow-sm mb-6">
					<h2 className="text-lg font-semibold mb-3">Revenue (last 7 days)</h2>
					{revenueByDayList.length === 0 ? (
						<p className="text-gray-500">No data</p>
					) : (
						<ul>
							{revenueByDayList.map(day => (
								<li key={day} className="flex justify-between py-2 border-b">
									<span>{day}</span>
									<span className="font-semibold">ETB {revenueByDay[day].revenue.toLocaleString()} ({revenueByDay[day].orders} orders)</span>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Orders table */}
				<div className="bg-white p-6 rounded-xl shadow-sm">
					<h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Order ID</th>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Farmer</th>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Retailer</th>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Product</th>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Qty</th>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Total (ETB)</th>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Status</th>
									<th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Date</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{orders.map((o) => {
									const farmerName = o.farmerName || (o.farmer && (o.farmer.name || o.farmer.fullName));
									const retailerName = o.retailerName || (o.retailer && (o.retailer.name || o.retailer.fullName));
									const orderTotal = getOrderTotal(o);
									return (
										<tr key={o._id} className="bg-white border-b">
											<td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{o._id}</td>
											<td className="px-6 py-4 text-sm text-gray-500">{farmerName}</td>
											<td className="px-6 py-4 text-sm text-gray-500">{retailerName}</td>
											<td className="px-6 py-4 text-sm text-gray-900">ETB {orderTotal.toLocaleString()}</td>
											<td className="px-6 py-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reports;
