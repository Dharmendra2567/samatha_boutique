'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import axios from 'axios';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Package, ShoppingCart, Users, TrendingUp, ShieldAlert, Plus, Trash2, Edit2, FolderOpen, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Active view state
  const [activeTab, setActiveTab] = useState('overview');

  // Stats states
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, sessions: 0, avgValue: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('');

  // Products states
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productFilter, setProductFilter] = useState('');

  // Categories states
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Users states
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');

  // Sales (POS) states
  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesFilter, setSalesFilter] = useState('');

  // Modals / forms states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '', category: '', categoryName: '', subcategory: '', subcategoryName: '', group: 'Sarees',
    price: '', mrp: '', discount: '10', color: 'Maroon', fabric: 'Pure Silk',
    work: 'Zari Work', occasion: 'Wedding', stock: '10', description: '', image: ''
  });

  // Categories CRUD states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ slug: '', name: '', group: 'Sarees', tagline: '', img: '' });

  // Subcategories CRUD states
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [subcategoryForm, setSubcategoryForm] = useState({ slug: '', name: '', categorySlug: '' });

  // POS Sales CRUD states
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isEditSaleOpen, setIsEditSaleOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [saleForm, setSaleForm] = useState({ productId: '', priceSold: '', quantity: '1', notes: '' });
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        toast.error('Access Denied. Admins only.');
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  // Fetch initial data based on active view
  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'overview') {
        fetchStats();
        fetchSales();
        fetchProducts();
        fetchOrders();
      }
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'products') {
        fetchProducts();
        fetchCategories();
      }
      if (activeTab === 'categories') fetchCategories();
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'sales') {
        fetchSales();
        fetchProducts(); // Products needed for POS dropdown list
      }
    }
  }, [user, activeTab]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data.stats || { revenue: 0, orders: 0, products: 0, sessions: 0, avgValue: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get('/api/admin/orders');
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data } = await axios.get('/api/products?limit=100');
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsersList(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchSales = async () => {
    setSalesLoading(true);
    try {
      const { data } = await axios.get('/api/admin/sales');
      setSales(data.sales || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load sales log');
    } finally {
      setSalesLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      if (data.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { data } = await axios.delete(`/api/admin/products/${prodId}`);
      if (data.ok) {
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p.id !== prodId));
      }
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        discount: Number(productForm.discount),
        stock: Number(productForm.stock),
      };
      const { data } = await axios.post('/api/admin/products', payload);
      if (data.ok) {
        toast.success('Product added successfully');
        setIsAddOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add product');
    }
  };

  const handleEditClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || '',
      categoryName: prod.categoryName || '',
      subcategory: prod.subcategory || '',
      subcategoryName: prod.subcategoryName || '',
      group: prod.group || 'Sarees',
      price: prod.price?.toString() || '',
      mrp: prod.mrp?.toString() || '',
      discount: prod.discount?.toString() || '0',
      color: prod.color || '',
      fabric: prod.fabric || '',
      work: prod.work || '',
      occasion: prod.occasion || '',
      stock: prod.stock?.toString() || '10',
      description: prod.description || '',
      image: prod.images?.[0] || ''
    });
    setIsEditOpen(true);
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        discount: Number(productForm.discount),
        stock: Number(productForm.stock),
      };
      const { data } = await axios.put(`/api/admin/products/${editingProduct.id}`, payload);
      if (data.ok) {
        toast.success('Product updated successfully');
        setIsEditOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update product');
    }
  };

  // Category CRUD Handlers
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/admin/categories', categoryForm);
      if (data.ok) {
        toast.success('Category created successfully');
        setIsAddCategoryOpen(false);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      slug: cat.slug,
      name: cat.name,
      group: cat.group || 'Sarees',
      tagline: cat.tagline || '',
      img: cat.img || ''
    });
    setIsEditCategoryOpen(true);
  };

  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/admin/categories/${editingCategory.slug}`, categoryForm);
      if (data.ok) {
        toast.success('Category updated successfully');
        setIsEditCategoryOpen(false);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (slug) => {
    if (!confirm('Are you sure you want to delete this category? All its subcategories will be deleted, and matching products will have their category and subcategory cleared.')) return;
    try {
      const { data } = await axios.delete(`/api/admin/categories/${slug}`);
      if (data.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete category');
    }
  };

  // Subcategory CRUD Handlers
  const handleAddSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/admin/subcategories', {
        ...subcategoryForm,
        categorySlug: selectedParentCategory
      });
      if (data.ok) {
        toast.success('Subcategory created successfully');
        setIsAddSubcategoryOpen(false);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create subcategory');
    }
  };

  const handleEditSubcategoryClick = (sub) => {
    setEditingSubcategory(sub);
    setSubcategoryForm({
      slug: sub.slug,
      name: sub.name,
      categorySlug: sub.categorySlug
    });
    setIsEditSubcategoryOpen(true);
  };

  const handleEditSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/admin/subcategories/${editingSubcategory.slug}`, {
        name: subcategoryForm.name
      });
      if (data.ok) {
        toast.success('Subcategory updated successfully');
        setIsEditSubcategoryOpen(false);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update subcategory');
    }
  };

  const handleDeleteSubcategory = async (slug) => {
    if (!confirm('Are you sure you want to delete this subcategory? Matching products will have their subcategory reference cleared.')) return;
    try {
      const { data } = await axios.delete(`/api/admin/subcategories/${slug}`);
      if (data.ok) {
        toast.success('Subcategory deleted successfully');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete subcategory');
    }
  };

  // User Management Handlers
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const { data } = await axios.put(`/api/admin/users/${userId}`, { role: newRole });
      if (data.ok) {
        toast.success(`User role updated to ${newRole}`);
        setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const { data } = await axios.delete(`/api/admin/users/${userId}`);
      if (data.ok) {
        toast.success('User deleted successfully');
        setUsersList(usersList.filter(u => u.id !== userId));
      }
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  // POS Sales Handlers
  const handleAddSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...saleForm,
        priceSold: Number(saleForm.priceSold),
        quantity: Number(saleForm.quantity)
      };
      const { data } = await axios.post('/api/admin/sales', payload);
      if (data.ok) {
        toast.success('In-store sale recorded successfully');
        setIsAddSaleOpen(false);
        fetchSales();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to record sale');
    }
  };

  const handleEditSaleClick = (saleItem) => {
    setEditingSale(saleItem);
    setSaleForm({
      productId: saleItem.productId,
      priceSold: saleItem.priceSold.toString(),
      quantity: saleItem.quantity.toString(),
      notes: saleItem.notes || ''
    });
    setIsEditOpen(false); // Make sure standard product edit is closed
    setIsEditSaleOpen(true);
  };

  const handleEditSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        priceSold: Number(saleForm.priceSold),
        quantity: Number(saleForm.quantity),
        notes: saleForm.notes
      };
      const { data } = await axios.put(`/api/admin/sales/${editingSale.id}`, payload);
      if (data.ok) {
        toast.success('Sale record updated successfully');
        setIsEditSaleOpen(false);
        fetchSales();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update sale record');
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (!confirm('Are you sure you want to delete this sale record? Associated product inventory will be restored.')) return;
    try {
      const { data } = await axios.delete(`/api/admin/sales/${saleId}`);
      if (data.ok) {
        toast.success('Sale record deleted and stock restored');
        fetchSales();
      }
    } catch (err) {
      toast.error('Failed to delete sale record');
    }
  };

  // Filtering
  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(orderFilter.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(orderFilter.toLowerCase()) ||
    o.customer?.email?.toLowerCase().includes(orderFilter.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productFilter.toLowerCase()) ||
    p.id.toLowerCase().includes(productFilter.toLowerCase()) ||
    (p.categoryName || p.category || '').toLowerCase().includes(productFilter.toLowerCase())
  );

  const filteredUsers = usersList.filter(u =>
    (u.name || '').toLowerCase().includes(userFilter.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userFilter.toLowerCase()) ||
    (u.id || '').toLowerCase().includes(userFilter.toLowerCase())
  );

  const filteredSales = sales.filter(s =>
    (s.productName || '').toLowerCase().includes(salesFilter.toLowerCase()) ||
    (s.productId || '').toLowerCase().includes(salesFilter.toLowerCase()) ||
    (s.id || '').toLowerCase().includes(salesFilter.toLowerCase())
  );

  const filteredDropdownProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(dropdownSearch.toLowerCase()) ||
    (p.id || '').toLowerCase().includes(dropdownSearch.toLowerCase()) ||
    (p.price || 0).toString().includes(dropdownSearch)
  );

  // Compute stats including In-Store Sales
  const inStoreRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const onlineRevenue = stats.revenue;
  const combinedRevenue = onlineRevenue + inStoreRevenue;
  const combinedOrdersCount = stats.orders + sales.length;
  const combinedAOV = combinedOrdersCount > 0 ? combinedRevenue / combinedOrdersCount : 0;
  const totalInventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const lowStockProducts = products.filter(p => (p.stock || 0) <= 3);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-maroon" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gold/10 pb-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-maroon flex items-center gap-2.5">
              <ShieldAlert className="w-8 h-8 text-gold-dark" />
              Boutique Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage product inventory, track orders, and configure boutique settings.</p>
          </div>
        </div>

        {/* Sidebar Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start">
          
          {/* Left Sidebar Menu */}
          <aside className="bg-cream/40 border border-gold/20 rounded-xl p-4 space-y-1.5 sticky top-28">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-3 mb-3">Dashboard Menu</div>
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'categories', label: 'Categories', icon: FolderOpen },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Online Orders', icon: ShoppingCart },
              { id: 'sales', label: 'In-Store Sales', icon: CreditCard },
              { id: 'users', label: 'User Management', icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-maroon text-cream font-semibold shadow-md'
                    : 'text-muted-foreground hover:bg-cream hover:text-maroon'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-cream' : 'text-gold-dark'}`} />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Right Content Panel */}
          <div className="space-y-6 min-w-0">
            
            {/* 1. OVERVIEW VIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {statsLoading ? (
                  <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-maroon" /></div>
                ) : (
                  <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Revenue Card */}
                      <Card className="border-gold/30 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</CardTitle>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="font-sans text-2xl font-bold text-maroon">
                            ₹{combinedRevenue.toLocaleString('en-IN')}
                          </div>
                          <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                            <span>Online: ₹{onlineRevenue.toLocaleString('en-IN')}</span>
                            <span>Shop: ₹{inStoreRevenue.toLocaleString('en-IN')}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Transactions Card */}
                      <Card className="border-gold/30 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transactions</CardTitle>
                          <ShoppingCart className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                          <div className="font-sans text-2xl font-bold text-maroon">
                            {combinedOrdersCount}
                          </div>
                          <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                            <span>Online: {stats.orders}</span>
                            <span>Shop: {sales.length}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Inventory Value Card */}
                      <Card className="border-gold/30 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inventory Value</CardTitle>
                          <Package className="w-4 h-4 text-gold-dark" />
                        </CardHeader>
                        <CardContent>
                          <div className="font-sans text-2xl font-bold text-maroon">
                            ₹{totalInventoryValue.toLocaleString('en-IN')}
                          </div>
                          <div className="mt-2 text-[10px] text-muted-foreground">
                            <span>Across {products.length} catalog items</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Low Stock Card */}
                      <Card className="border-gold/30 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Low Stock Alert</CardTitle>
                          <ShieldAlert className="w-4 h-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                          <div className={`font-sans text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-maroon'}`}>
                            {lowStockProducts.length}
                          </div>
                          <div className="mt-2 text-[10px] text-muted-foreground">
                            <span>Items with 3 or fewer units</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Channel Performance Breakdown */}
                    <Card className="border-gold/30">
                      <CardHeader>
                        <CardTitle className="font-serif text-lg text-maroon-dark">Revenue Channel Distribution</CardTitle>
                        <CardDescription>Performance comparison between online ecommerce store and offline storefront</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {combinedRevenue > 0 ? (
                          <div className="space-y-2">
                            <div className="h-4 w-full bg-cream rounded-full overflow-hidden flex border border-gold/10">
                              <div
                                style={{ width: `${(onlineRevenue / combinedRevenue) * 100}%` }}
                                className="bg-maroon h-full transition-all duration-500"
                                title={`Online: ${Math.round((onlineRevenue / combinedRevenue) * 100)}%`}
                              />
                              <div
                                style={{ width: `${(inStoreRevenue / combinedRevenue) * 100}%` }}
                                className="bg-gold-dark h-full transition-all duration-500"
                                title={`In-Store: ${Math.round((inStoreRevenue / combinedRevenue) * 100)}%`}
                              />
                            </div>
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-maroon flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-maroon rounded-full" />
                                Online Store ({Math.round((onlineRevenue / combinedRevenue) * 100)}%)
                              </span>
                              <span className="text-gold-dark flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-gold-dark rounded-full" />
                                In-Store POS ({Math.round((inStoreRevenue / combinedRevenue) * 100)}%)
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No sales recorded yet to calculate share.</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gold/10 text-sm">
                          <div>
                            <div className="font-semibold text-maroon mb-1.5">Ecommerce Channel (Online)</div>
                            <ul className="space-y-1 text-muted-foreground text-xs">
                              <li>Gross Revenue: ₹{onlineRevenue.toLocaleString('en-IN')}</li>
                              <li>Transactions: {stats.orders} orders</li>
                              <li>Average Order: ₹{stats.orders > 0 ? Math.round(onlineRevenue / stats.orders).toLocaleString('en-IN') : 0}</li>
                            </ul>
                          </div>
                          <div>
                            <div className="font-semibold text-gold-dark mb-1.5">Physical Shop Channel (POS)</div>
                            <ul className="space-y-1 text-muted-foreground text-xs">
                              <li>Gross Revenue: ₹{inStoreRevenue.toLocaleString('en-IN')}</li>
                              <li>Transactions: {sales.length} logged sales</li>
                              <li>Average Sale: ₹{sales.length > 0 ? Math.round(inStoreRevenue / sales.length).toLocaleString('en-IN') : 0}</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Side-by-side recent records & stock warnings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left: Recent In-Store manual Sales */}
                      <Card className="border-gold/30">
                        <CardHeader className="border-b border-gold/10 pb-4">
                          <CardTitle className="font-serif text-base text-maroon-dark">Recent In-Store Sales (POS)</CardTitle>
                          <CardDescription>Latest storefront manual sales transactions</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {sales.length === 0 ? (
                            <div className="text-center py-8 text-xs text-muted-foreground italic">No physical store sales logged.</div>
                          ) : (
                            <div className="space-y-3">
                              {sales.slice(0, 5).map((s) => (
                                <div key={s.id} className="flex justify-between items-center text-xs border-b border-gold/5 pb-2 last:border-0 last:pb-0">
                                  <div>
                                    <div className="font-semibold text-foreground truncate max-w-[200px]">{s.productName}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono">ID: {s.productId} &middot; Qty: {s.quantity}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-sans font-bold text-maroon">₹{s.totalAmount?.toLocaleString('en-IN')}</div>
                                    <div className="text-[9px] text-muted-foreground">{new Date(s.createdAt).toLocaleDateString('en-IN')}</div>
                                  </div>
                                </div>
                              ))}
                              {sales.length > 5 && (
                                <button onClick={() => setActiveTab('sales')} className="text-xs text-maroon font-semibold hover:underline block pt-2">
                                  View all manual sales &rarr;
                                </button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Right: Low Stock Warnings */}
                      <Card className="border-gold/30">
                        <CardHeader className="border-b border-gold/10 pb-4">
                          <CardTitle className="font-serif text-base text-maroon-dark">Inventory Restock Alerts</CardTitle>
                          <CardDescription>Items running out of stock or needing replenishment</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {lowStockProducts.length === 0 ? (
                            <div className="text-center py-8 text-xs text-green-600 font-medium">All items are sufficiently stocked!</div>
                          ) : (
                            <div className="space-y-3">
                              {lowStockProducts.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex justify-between items-center text-xs border-b border-gold/5 pb-2 last:border-0 last:pb-0">
                                  <div className="min-w-0 flex-1">
                                    <div className="font-semibold truncate max-w-[200px]">{p.name}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono">ID: {p.id} &middot; Category: {p.categoryName || 'General'}</div>
                                  </div>
                                  <div className="text-right shrink-0 ml-4">
                                    <Badge variant="destructive" className="text-[10px] py-0 px-2 rounded-full">
                                      {p.stock} left
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                              {lowStockProducts.length > 5 && (
                                <button onClick={() => setActiveTab('products')} className="text-xs text-maroon font-semibold hover:underline block pt-2">
                                  Manage full inventory &rarr;
                                </button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                    </div>
                  </>
                )}
              </div>
            )}

            {/* 2. CATEGORIES & SUBCATEGORIES CRUD VIEW */}
            {activeTab === 'categories' && (
              <Card className="border-gold/30">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-4">
                  <div>
                    <CardTitle className="font-serif text-2xl text-maroon-dark">Category Management</CardTitle>
                    <CardDescription>Configure boutique categories and subcategories mapping</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setCategoryForm({ slug: '', name: '', group: 'Sarees', tagline: '', img: '' });
                      setIsAddCategoryOpen(true);
                    }}
                    className="bg-maroon hover:bg-maroon-light text-cream rounded-full gap-1.5 h-10 px-4 text-xs font-semibold shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {categoriesLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-maroon" /></div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No categories defined yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead>Subcategories</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories.map((cat) => (
                            <TableRow key={cat.slug} className="align-top">
                              <TableCell className="max-w-[200px]">
                                <div className="font-semibold text-maroon">{cat.name}</div>
                                <div className="text-[11px] text-muted-foreground font-mono">slug: {cat.slug}</div>
                                {cat.tagline && <div className="text-xs text-muted-foreground mt-1 italic">"{cat.tagline}"</div>}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">{cat.group}</Badge>
                              </TableCell>
                              <TableCell className="max-w-[300px]">
                                <div className="space-y-3">
                                  {cat.subcategories && cat.subcategories.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                      {cat.subcategories.map(sub => (
                                        <Badge key={sub.slug} variant="secondary" className="flex items-center gap-1 text-[11px] pr-1.5 bg-cream/70 text-maroon border border-maroon/10">
                                          <span>{sub.name}</span>
                                          <button onClick={() => handleEditSubcategoryClick(sub)} className="text-muted-foreground hover:text-maroon ml-1">
                                            <Edit2 className="w-2.5 h-2.5" />
                                          </button>
                                          <button onClick={() => handleDeleteSubcategory(sub.slug)} className="text-muted-foreground hover:text-red-600">
                                            <Trash2 className="w-2.5 h-2.5" />
                                          </button>
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground italic block">No subcategories</span>
                                  )}
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    className="h-7 text-[10px] text-maroon hover:bg-cream/50 gap-1 border border-maroon/20 rounded-full"
                                    onClick={() => {
                                      setSelectedParentCategory(cat.slug);
                                      setSubcategoryForm({ slug: '', name: '', categorySlug: cat.slug });
                                      setIsAddSubcategoryOpen(true);
                                    }}
                                  >
                                    <Plus className="w-3 h-3" /> Add Subcategory
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap space-x-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-maroon" onClick={() => handleEditCategoryClick(cat)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDeleteCategory(cat.slug)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 3. PRODUCTS LISTING VIEW */}
            {activeTab === 'products' && (
              <Card className="border-gold/30">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-4">
                  <div>
                    <CardTitle className="font-serif text-2xl text-maroon-dark">Inventory Catalog</CardTitle>
                    <CardDescription>Update pricing, edit stock numbers, or upload new listings</CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Search product..."
                      value={productFilter}
                      onChange={(e) => setProductFilter(e.target.value)}
                      className="max-w-xs focus-visible:ring-maroon"
                    />
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setProductForm({
                              name: '', category: '', categoryName: '', subcategory: '', subcategoryName: '', group: 'Sarees',
                              price: '', mrp: '', discount: '10', color: 'Maroon', fabric: 'Pure Silk',
                              work: 'Zari Work', occasion: 'Wedding', stock: '10', description: '',
                              image: 'https://images.unsplash.com/photo-1610030469839-f909584b43f1?crop=entropy&cs=srgb&fm=jpg&q=85&w=900'
                            });
                          }}
                          className="bg-maroon hover:bg-maroon-light text-cream rounded-full gap-1.5 h-10 px-4 text-xs font-semibold shrink-0"
                        >
                          <Plus className="w-4 h-4" /> Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Product Listing</DialogTitle>
                          <DialogDescription>Input saree/boutique specs to publish to database.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddProductSubmit}>
                          <div className="grid grid-cols-2 gap-4 py-4 text-sm">
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="name">Product Title *</Label>
                              <Input id="name" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="product-category">Category *</Label>
                              <select
                                id="product-category"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={productForm.category}
                                onChange={(e) => {
                                  const catSlug = e.target.value;
                                  const cat = categories.find(c => c.slug === catSlug);
                                  setProductForm({
                                    ...productForm,
                                    category: catSlug,
                                    categoryName: cat ? cat.name : '',
                                    subcategory: '',
                                    subcategoryName: ''
                                  });
                                }}
                              >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                  <option key={c.slug} value={c.slug}>{c.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="product-subcategory">Subcategory</Label>
                              <select
                                id="product-subcategory"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={productForm.subcategory}
                                onChange={(e) => {
                                  const subSlug = e.target.value;
                                  const cat = categories.find(c => c.slug === productForm.category);
                                  const sub = cat?.subcategories?.find(s => s.slug === subSlug);
                                  setProductForm({
                                    ...productForm,
                                    subcategory: subSlug,
                                    subcategoryName: sub ? sub.name : ''
                                  });
                                }}
                                disabled={!productForm.category}
                              >
                                <option value="">Select Subcategory (Optional)</option>
                                {categories.find(c => c.slug === productForm.category)?.subcategories?.map((s) => (
                                  <option key={s.slug} value={s.slug}>{s.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="price">Price (₹) *</Label>
                              <Input id="price" type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mrp">Original MRP (₹) *</Label>
                              <Input id="mrp" type="number" required value={productForm.mrp} onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="stock">Stock Quantity *</Label>
                              <Input id="stock" type="number" required value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="color">Color</Label>
                              <Input id="color" required value={productForm.color} onChange={(e) => setProductForm({ ...productForm, color: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fabric">Fabric</Label>
                              <Input id="fabric" required value={productForm.fabric} onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="work">Work Embroidery</Label>
                              <Input id="work" required value={productForm.work} onChange={(e) => setProductForm({ ...productForm, work: e.target.value })} />
                            </div>
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="image">Image URL</Label>
                              <Input id="image" required value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Save Saree Listing</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {productsLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-maroon" /></div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No products found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Preview</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category / Subcategory</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="font-mono text-xs font-bold">{p.id}</TableCell>
                              <TableCell>
                                {p.images?.[0] && (
                                  <img src={p.images[0]} alt="" className="w-9 h-12 object-cover rounded border" />
                                )}
                              </TableCell>
                              <TableCell className="font-semibold">{p.name}</TableCell>
                              <TableCell className="text-xs">
                                <div className="font-medium capitalize text-maroon">{p.categoryName || p.category || <span className="text-muted-foreground italic">None</span>}</div>
                                {p.subcategoryName && <div className="text-muted-foreground text-[10px] capitalize">↳ {p.subcategoryName}</div>}
                              </TableCell>
                              <TableCell className="font-sans font-bold text-maroon">
                                ₹{p.price?.toLocaleString('en-IN')}
                                <div className="font-sans text-[10px] text-muted-foreground line-through">₹{p.mrp}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={p.stock > 3 ? 'secondary' : 'destructive'} className="text-xs">
                                  {p.stock} units
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap space-x-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-maroon" onClick={() => handleEditClick(p)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDeleteProduct(p.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 4. ORDERS INCOMING VIEW */}
            {activeTab === 'orders' && (
              <Card className="border-gold/30">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-4">
                  <div>
                    <CardTitle className="font-serif text-2xl text-maroon-dark">Incoming Orders</CardTitle>
                    <CardDescription>Track payments, view details, and change status</CardDescription>
                  </div>
                  <Input
                    placeholder="Search order ID, customer name..."
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="max-w-xs focus-visible:ring-maroon"
                  />
                </CardHeader>
                <CardContent className="pt-6">
                  {ordersLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-maroon" /></div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No orders match the filter criteria.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((o) => (
                            <TableRow key={o.id}>
                              <TableCell className="font-mono text-xs font-bold">{o.id}</TableCell>
                              <TableCell>
                                <div className="font-semibold">{o.customer?.name}</div>
                                <div className="text-xs text-muted-foreground">{o.customer?.email}</div>
                                <div className="text-[10px] text-muted-foreground">{o.customer?.phone}</div>
                              </TableCell>
                              <TableCell className="font-sans font-bold text-maroon">₹{o.total?.toLocaleString('en-IN')}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize text-xs">
                                  {o.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="capitalize text-xs">{o.payment}</TableCell>
                              <TableCell className="text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</TableCell>
                              <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                                {['Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                                  <Button
                                    key={st}
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => handleUpdateStatus(o.id, st)}
                                    disabled={o.status === st}
                                    className={`text-[10px] h-7 px-2 font-semibold ${
                                      st === 'Cancelled' ? 'hover:text-red-600' : 'hover:text-maroon'
                                    }`}
                                  >
                                    {st}
                                  </Button>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 5. IN-STORE SALES LOG VIEW */}
            {activeTab === 'sales' && (
              <Card className="border-gold/30">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-4">
                  <div>
                    <CardTitle className="font-serif text-2xl text-maroon-dark">In-Store Sales Log (POS)</CardTitle>
                    <CardDescription>Record manual in-store sales and track physical shop revenue</CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Search product name..."
                      value={salesFilter}
                      onChange={(e) => setSalesFilter(e.target.value)}
                      className="max-w-xs focus-visible:ring-maroon"
                    />
                    <Button
                      onClick={() => {
                        setSaleForm({ productId: '', priceSold: '', quantity: '1', notes: '' });
                        setDropdownSearch('');
                        setSelectedProductName('');
                        setIsDropdownOpen(false);
                        setIsAddSaleOpen(true);
                      }}
                      className="bg-maroon hover:bg-maroon-light text-cream rounded-full gap-1.5 h-10 px-4 text-xs font-semibold shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Record Saree Sale
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {salesLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-maroon" /></div>
                  ) : filteredSales.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No in-store sales logged.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sale ID</TableHead>
                            <TableHead>Product ID / Name</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Sold Price</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSales.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell className="font-mono text-xs font-bold">{s.id}</TableCell>
                              <TableCell>
                                <div className="font-semibold">{s.productName}</div>
                                <div className="text-xs text-muted-foreground font-mono">ID: {s.productId}</div>
                              </TableCell>
                              <TableCell className="text-xs">{s.quantity} units</TableCell>
                              <TableCell className="text-xs font-sans">₹{s.priceSold?.toLocaleString('en-IN')}</TableCell>
                              <TableCell className="font-sans font-bold text-maroon">₹{s.totalAmount?.toLocaleString('en-IN')}</TableCell>
                              <TableCell className="text-xs max-w-[150px] truncate" title={s.notes}>{s.notes || '-'}</TableCell>
                              <TableCell className="text-xs">{new Date(s.createdAt).toLocaleDateString('en-IN')}</TableCell>
                              <TableCell className="text-right whitespace-nowrap space-x-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-maroon" onClick={() => handleEditSaleClick(s)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={() => handleDeleteSale(s.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 6. USER MANAGEMENT VIEW */}
            {activeTab === 'users' && (
              <Card className="border-gold/30">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-4">
                  <div>
                    <CardTitle className="font-serif text-2xl text-maroon-dark">User Management</CardTitle>
                    <CardDescription>View registered customers, manage roles, and delete accounts</CardDescription>
                  </div>
                  <Input
                    placeholder="Search user name, email..."
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="max-w-xs focus-visible:ring-maroon"
                  />
                </CardHeader>
                <CardContent className="pt-6">
                  {usersLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-maroon" /></div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No users found matching filter.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell className="font-mono text-xs font-bold">{u.id}</TableCell>
                              <TableCell className="font-semibold">{u.name}</TableCell>
                              <TableCell className="font-mono text-xs">{u.email}</TableCell>
                              <TableCell>
                                <Badge variant={u.role === 'admin' ? 'success' : 'outline'} className="capitalize text-xs">
                                  {u.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap space-x-1">
                                {u.role === 'admin' ? (
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => handleUpdateUserRole(u.id, 'customer')}
                                    className="text-xs text-maroon hover:text-maroon-dark font-medium h-7"
                                    disabled={u.email === user.email} /* Prevent self-demotion */
                                  >
                                    Make Customer
                                  </Button>
                                ) : (
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    onClick={() => handleUpdateUserRole(u.id, 'admin')}
                                    className="text-xs text-maroon hover:text-maroon-dark font-medium h-7"
                                  >
                                    Make Admin
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                  onClick={() => handleDeleteUser(u.id)}
                                  disabled={u.email === user.email} /* Prevent self-deletion */
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </main>

      {/* EDIT PRODUCT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product Specs</DialogTitle>
            <DialogDescription>Modify product taxonomy, stock numbers, or pricing information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProductSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-name">Product Title *</Label>
                <Input id="edit-name" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <select
                  id="edit-category"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={productForm.category}
                  onChange={(e) => {
                    const catSlug = e.target.value;
                    const cat = categories.find(c => c.slug === catSlug);
                    setProductForm({
                      ...productForm,
                      category: catSlug,
                      categoryName: cat ? cat.name : '',
                      subcategory: '',
                      subcategoryName: ''
                    });
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subcategory">Subcategory</Label>
                <select
                  id="edit-subcategory"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={productForm.subcategory}
                  onChange={(e) => {
                    const subSlug = e.target.value;
                    const cat = categories.find(c => c.slug === productForm.category);
                    const sub = cat?.subcategories?.find(s => s.slug === subSlug);
                    setProductForm({
                      ...productForm,
                      subcategory: subSlug,
                      subcategoryName: sub ? sub.name : ''
                    });
                  }}
                  disabled={!productForm.category}
                >
                  <option value="">Select Subcategory (Optional)</option>
                  {categories.find(c => c.slug === productForm.category)?.subcategories?.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input id="edit-price" type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mrp">Original MRP (₹) *</Label>
                <Input id="edit-mrp" type="number" required value={productForm.mrp} onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock Quantity *</Label>
                <Input id="edit-stock" type="number" required value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <Input id="edit-color" required value={productForm.color} onChange={(e) => setProductForm({ ...productForm, color: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input id="edit-image" required value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RECORD SALE DIALOG */}
      <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record In-Store Sale</DialogTitle>
            <DialogDescription>Log a manual purchase from the physical storefront. This automatically deducts product inventory.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSaleSubmit}>
            <div className="space-y-4 py-4 text-sm">
              <div className="space-y-2">
                <Label>Select Saree / Product *</Label>
                <div className="relative">
                  <Input
                    placeholder="Search saree by name, ID, price..."
                    value={dropdownSearch || selectedProductName}
                    onChange={(e) => {
                      setDropdownSearch(e.target.value);
                      setSelectedProductName(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setIsDropdownOpen(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsDropdownOpen(false);
                        const currentProduct = products.find(p => p.id === saleForm.productId);
                        if (currentProduct) {
                          setSelectedProductName(`${currentProduct.id} - ${currentProduct.name} (Stock: ${currentProduct.stock} units, Price: ₹${currentProduct.price})`);
                        } else {
                          setSelectedProductName('');
                        }
                        setDropdownSearch('');
                      }, 250);
                    }}
                    className="focus-visible:ring-maroon font-medium text-sm pr-10"
                    required={!saleForm.productId}
                  />
                  <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none text-muted-foreground">
                    <Edit2 className="w-3.5 h-3.5" />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1.5 bg-popover border border-gold/30 rounded-lg shadow-xl max-h-60 overflow-y-auto bg-white dark:bg-zinc-950">
                      {filteredDropdownProducts.length === 0 ? (
                        <div className="text-center py-4 text-xs text-muted-foreground">No sarees found</div>
                      ) : (
                        filteredDropdownProducts.map((p) => (
                          <div
                            key={p.id}
                            onMouseDown={() => {
                              setSaleForm({
                                ...saleForm,
                                productId: p.id,
                                priceSold: p.price.toString()
                              });
                              setSelectedProductName(`${p.id} - ${p.name} (Stock: ${p.stock} units, Price: ₹{p.price})`);
                              setDropdownSearch('');
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-cream/40 cursor-pointer border-b border-gold/5 last:border-0 transition-colors"
                          >
                            {p.images?.[0] && (
                              <img src={p.images[0]} alt="" className="w-8 h-10 object-cover rounded border border-gold/10 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-xs text-foreground truncate">{p.name}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">ID: {p.id} &middot; Price: ₹{p.price}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <Badge variant={p.stock > 3 ? 'secondary' : 'destructive'} className="text-[9px] px-1.5 py-0 h-4 rounded-full">
                                {p.stock} units
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-price">Sold Price (₹) *</Label>
                <Input id="sale-price" type="number" required value={saleForm.priceSold} onChange={(e) => setSaleForm({ ...saleForm, priceSold: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-qty">Quantity Sold *</Label>
                <Input id="sale-qty" type="number" required value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-notes">Customer / Sale Notes (Optional)</Label>
                <Input id="sale-notes" placeholder="e.g. Walk-in customer, Cash payment" value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Record Sale</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT SALE DIALOG */}
      <Dialog open={isEditSaleOpen} onOpenChange={setIsEditSaleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Sale Record</DialogTitle>
            <DialogDescription>Modify details of this recorded in-store sale. Changing quantities will adjust product stock.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSaleSubmit}>
            <div className="space-y-4 py-4 text-sm">
              <div className="space-y-2">
                <Label>Associated Product</Label>
                <Input disabled value={`${saleForm.productId} - ${products.find(p => p.id === saleForm.productId)?.name || ''}`} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sale-price">Sold Price (₹) *</Label>
                <Input id="edit-sale-price" type="number" required value={saleForm.priceSold} onChange={(e) => setSaleForm({ ...saleForm, priceSold: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sale-qty">Quantity Sold *</Label>
                <Input id="edit-sale-qty" type="number" required value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sale-notes">Customer / Sale Notes (Optional)</Label>
                <Input id="edit-sale-notes" value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD CATEGORY DIALOG */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a main product category for the boutique storefront.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCategorySubmit}>
            <div className="space-y-4 py-4 text-sm">
              <div className="space-y-2">
                <Label htmlFor="cat-slug">Category Slug * (URL identifier, e.g. "pochampally")</Label>
                <Input id="cat-slug" required value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-name">Category Name * (e.g. "Pochampally Ikat")</Label>
                <Input id="cat-name" required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-group">Group (e.g. "Sarees", "Boutique", "Occasion")</Label>
                <Input id="cat-group" value={categoryForm.group} onChange={(e) => setCategoryForm({ ...categoryForm, group: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-tagline">Tagline</Label>
                <Input id="cat-tagline" value={categoryForm.tagline} onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Save Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT CATEGORY DIALOG */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category Details</DialogTitle>
            <DialogDescription>Modify parameters for this category.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategorySubmit}>
            <div className="space-y-4 py-4 text-sm">
              <div className="space-y-2">
                <Label>Category Slug (Cannot be changed)</Label>
                <Input disabled value={categoryForm.slug} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-name">Category Name *</Label>
                <Input id="edit-cat-name" required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-group">Group</Label>
                <Input id="edit-cat-group" value={categoryForm.group} onChange={(e) => setCategoryForm({ ...categoryForm, group: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat-tagline">Tagline</Label>
                <Input id="edit-cat-tagline" value={categoryForm.tagline} onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD SUBCATEGORY DIALOG */}
      <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Subcategory</DialogTitle>
            <DialogDescription>Create a subcategory under: <span className="font-semibold text-maroon font-serif">{selectedParentCategory}</span></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubcategorySubmit}>
            <div className="space-y-4 py-4 text-sm">
              <div className="space-y-2">
                <Label htmlFor="sub-slug">Subcategory Slug * (URL identifier, e.g. "silk-ikat")</Label>
                <Input id="sub-slug" required value={subcategoryForm.slug} onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-name">Subcategory Name * (e.g. "Silk Ikat")</Label>
                <Input id="sub-name" required value={subcategoryForm.name} onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Save Subcategory</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT SUBCATEGORY DIALOG */}
      <Dialog open={isEditSubcategoryOpen} onOpenChange={setIsEditSubcategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subcategory Details</DialogTitle>
            <DialogDescription>Modify parameters for this subcategory.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubcategorySubmit}>
            <div className="space-y-4 py-4 text-sm">
              <div className="space-y-2">
                <Label>Subcategory Slug (Cannot be changed)</Label>
                <Input disabled value={subcategoryForm.slug} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sub-name">Subcategory Name *</Label>
                <Input id="edit-sub-name" required value={subcategoryForm.name} onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-maroon hover:bg-maroon-light text-cream rounded-full">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
