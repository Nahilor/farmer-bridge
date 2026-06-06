import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ProductModeration = () => {
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await api.adminGetProducts();
			setProducts(res.data || res || []);
		} catch (err) {
			console.error('Failed to load products', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const id = setTimeout(() => fetchData(), 0);
		return () => clearTimeout(id);
	}, []);

	if (loading) return <div className="p-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<h1 className="text-2xl font-bold mb-4">Product Moderation</h1>
				<div className="bg-white p-6 rounded-xl shadow-sm">
					{products.length === 0 ? (
						<p>No products found.</p>
					) : (
						<div className="grid gap-4">
							{products.map(p => (
								<div key={p._id || `${p.farmerId}-${p.name}`} className="p-4 border rounded-lg">
									<div className="flex justify-between items-center">
										<div>
											<div className="font-semibold">{p.name}</div>
											<div className="text-sm text-gray-500">By: {p.farmerName}</div>
										</div>
										<div>ETB {p.price}</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductModeration;
