import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { getDb } from '@/lib/mongo';
import { generateProducts, CATEGORIES_DATA, TESTIMONIALS, SUBCATEGORIES } from '@/lib/products-data';
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/jwt';
import { withLogging } from '@/lib/logger';

export const runtime = 'nodejs';

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

function safeEqualHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  try {
    const A = Buffer.from(a, 'hex');
    const B = Buffer.from(b, 'hex');
    return A.length === B.length && crypto.timingSafeEqual(A, B);
  } catch { return false; }
}

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function getSessionUser(req) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/session_token=([^;]+)/);
    if (!tokenMatch || !tokenMatch[1]) return null;
    return verifyToken(tokenMatch[1]);
  } catch {
    return null;
  }
}

async function logAuthSession(db, email, role, action, req) {
  try {
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    await db.collection('user_sessions').insertOne({
      email,
      role,
      action,
      ipAddress,
      userAgent,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('[AUTH LOGGER ERROR] Failed logging session:', err.message);
  }
}

async function ensureSeeded() {
  const db = await getDb();
  const count = await db.collection('products').countDocuments();
  if (count === 0) {
    const products = generateProducts();
    await db.collection('products').insertMany(products);
    await db.collection('categories').insertMany(CATEGORIES_DATA);
    await db.collection('subcategories').insertMany(SUBCATEGORIES);
    await db.collection('testimonials').insertMany(TESTIMONIALS);

    // Seed default admin
    const adminCreds = hashPassword('admin123');
    await db.collection('users').insertOne({
      id: 'usr-admin-01',
      name: 'Boutique Admin',
      email: 'admin@samatha.com',
      passwordHash: adminCreds.hash,
      salt: adminCreds.salt,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    // Seed default customer
    const customerCreds = hashPassword('customer123');
    await db.collection('users').insertOne({
      id: 'usr-cust-02',
      name: 'Samatha Customer',
      email: 'customer@samatha.com',
      passwordHash: customerCreds.hash,
      salt: customerCreds.salt,
      role: 'customer',
      createdAt: new Date().toISOString()
    });
  }
  return db;
}

async function router(req, method, segments) {
  const [root, ...rest] = segments;

  if (!root || root === '') return json({ ok: true, service: 'Samatha Reddy Sarees Collection & Boutique Services API', time: new Date().toISOString() });

  const db = await getDb();

  // ----------------------------------------------------
  // 1. DATABASE SEEDING
  // ----------------------------------------------------
  if (root === 'seed') {
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('subcategories').deleteMany({});
    await db.collection('testimonials').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('user_sessions').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('in_store_sales').deleteMany({});

    const products = generateProducts();
    await db.collection('products').insertMany(products);
    await db.collection('categories').insertMany(CATEGORIES_DATA);
    await db.collection('subcategories').insertMany(SUBCATEGORIES);
    await db.collection('testimonials').insertMany(TESTIMONIALS);

    // Seed default admin
    const adminCred = hashPassword('admin123');
    const adminUser = {
      id: 'usr-admin-01',
      name: 'Boutique Admin',
      email: 'admin@samatha.com',
      passwordHash: adminCred.hash,
      salt: adminCred.salt,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    await db.collection('users').insertOne(adminUser);

    // Seed default customer
    const customerCred = hashPassword('customer123');
    const customerUser = {
      id: 'usr-cust-02',
      name: 'Samatha Customer',
      email: 'customer@samatha.com',
      passwordHash: customerCred.hash,
      salt: customerCred.salt,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    await db.collection('users').insertOne(customerUser);

    // Seed mock session history
    await db.collection('user_sessions').insertMany([
      { email: 'admin@samatha.com', role: 'admin', action: 'login', ipAddress: '127.0.0.1', userAgent: 'System Seed Initializer', timestamp: new Date(Date.now() - 3600000) },
      { email: 'customer@samatha.com', role: 'customer', action: 'login', ipAddress: '127.0.0.1', userAgent: 'System Seed Initializer', timestamp: new Date(Date.now() - 1800000) }
    ]);

    // Seed mock order history
    const mockOrder = {
      id: `ORD-SEED001`,
      userId: customerUser.id,
      userEmail: customerUser.email,
      items: [
        {
          id: products[0].id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
          category: products[0].category,
          color: products[0].color,
          fabric: products[0].fabric,
          image: products[0].images?.[0] || null
        }
      ],
      customer: { name: customerUser.name, phone: '9988776655', email: customerUser.email },
      shippingAddress: { line1: 'Flat 402, Gachibowli Heights', landmark: 'Near DLF Cybercity', city: 'Hyderabad', state: 'Telangana', pincode: '500032' },
      payment: 'cod',
      subtotal: products[0].price,
      shipping: 0,
      savings: products[0].mrp - products[0].price,
      total: products[0].price,
      status: 'Confirmed',
      timeline: [
        { status: 'Pending', at: new Date(Date.now() - 90000).toISOString(), note: 'Order placed' },
        { status: 'Confirmed', at: new Date(Date.now() - 60000).toISOString(), note: 'Order confirmed by store admin' }
      ],
      createdAt: new Date(Date.now() - 90000).toISOString()
    };
    await db.collection('orders').insertOne(mockOrder);

    return json({
      ok: true,
      seeded: {
        products: products.length,
        categories: CATEGORIES_DATA.length,
        subcategories: SUBCATEGORIES.length,
        testimonials: TESTIMONIALS.length,
        users: 2,
        orders: 1,
        sessions: 2
      }
    });
  }

  // ----------------------------------------------------
  // 2. AUTHENTICATION ENDPOINTS
  // ----------------------------------------------------
  if (root === 'auth') {
    const sub = rest[0];

    if (sub === 'signup' && method === 'POST') {
      const { name, email, password, phone, address } = await req.json();
      if (!name || !email || !password || !phone) {
        return json({ error: 'Name, email, password, and phone number are required' }, 400);
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = await db.collection('users').findOne({ email: normalizedEmail });
      if (existing) return json({ error: 'An account with this email already exists' }, 409);

      const credentials = hashPassword(password);
      const newUser = {
        id: `usr-${uuidv4().slice(0, 8)}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        address: address ? address.trim() : '',
        passwordHash: credentials.hash,
        salt: credentials.salt,
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      await db.collection('users').insertOne(newUser);
      await logAuthSession(db, newUser.email, newUser.role, 'login', req);

      const token = signToken({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });

      const cleanUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, address: newUser.address, role: newUser.role };
      const response = json({ ok: true, user: cleanUser });
      response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: '/'
      });
      return response;
    }

    if (sub === 'login' && method === 'POST') {
      const { email, password } = await req.json();
      if (!email || !password) return json({ error: 'Email and password required' }, 400);

      const normalizedEmail = email.toLowerCase().trim();
      const user = await db.collection('users').findOne({ email: normalizedEmail });
      if (!user) return json({ error: 'Invalid email or password' }, 401);

      const isValid = verifyPassword(password, user.passwordHash, user.salt);
      if (!isValid) return json({ error: 'Invalid email or password' }, 401);

      await logAuthSession(db, user.email, user.role, 'login', req);

      const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });

      const cleanUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role
      };
      const response = json({ ok: true, user: cleanUser });
      response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });
      return response;
    }

    if (sub === 'logout' && method === 'POST') {
      const user = getSessionUser(req);
      if (user) {
        await logAuthSession(db, user.email, user.role, 'logout', req);
      }
      const response = json({ ok: true });
      response.cookies.set('session_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
      });
      return response;
    }

    if (sub === 'me' && method === 'GET') {
      const decodedUser = getSessionUser(req);
      if (!decodedUser) return json({ user: null });
      
      const user = await db.collection('users').findOne({ id: decodedUser.id });
      if (!user) return json({ user: null });
      
      const cleanUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role
      };
      return json({ user: cleanUser });
    }

    return json({ error: 'Auth route not found' }, 404);
  }

  // ----------------------------------------------------
  // 3. STOREFRONT DATA PATHS
  // ----------------------------------------------------
  if (root === 'categories') {
    const db = await ensureSeeded();
    const cats = await db.collection('categories').find({}).toArray();
    const subcats = await db.collection('subcategories').find({}).toArray();
    const enriched = cats.map(c => {
      const match = subcats.filter(sc => sc.categorySlug === c.slug).map(({ _id, ...s }) => s);
      return { ...c, subcategories: match };
    });
    return json(enriched.map(({ _id, ...c }) => c));
  }

  if (root === 'testimonials') {
    const db = await ensureSeeded();
    const t = await db.collection('testimonials').find({}).toArray();
    return json(t.map(({ _id, ...x }) => x));
  }

  if (root === 'products') {
    const db = await ensureSeeded();
    if (rest.length === 0) {
      const { searchParams } = new URL(req.url);
      const q = (searchParams.get('q') || '').trim();
      const category = searchParams.get('category');
      const color = searchParams.get('color');
      const minPrice = Number(searchParams.get('minPrice') || 0);
      const maxPrice = Number(searchParams.get('maxPrice') || 999999);
      const sort = searchParams.get('sort') || 'featured';
      const flag = searchParams.get('flag');
      const limit = Number(searchParams.get('limit') || 100);

      const filter = { price: { $gte: minPrice, $lte: maxPrice } };
      if (category && category !== 'all') filter.category = category;
      if (color) filter.color = color;
      if (flag === 'featured') filter.isFeatured = true;
      if (flag === 'bestseller') filter.isBestSeller = true;
      if (flag === 'new') filter.isNewArrival = true;
      if (flag === 'bridal') filter.isBridal = true;
      if (q) filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { fabric: { $regex: q, $options: 'i' } },
        { work: { $regex: q, $options: 'i' } },
        { occasion: { $regex: q, $options: 'i' } },
        { color: { $regex: q, $options: 'i' } },
      ];

      const sortMap = {
        'price-asc': { price: 1 },
        'price-desc': { price: -1 },
        rating: { rating: -1 },
        newest: { createdAt: -1 },
        featured: { isFeatured: -1, rating: -1 },
      };

      const items = await db.collection('products').find(filter).sort(sortMap[sort] || sortMap.featured).limit(limit).toArray();
      return json(items.map(({ _id, ...p }) => p));
    }
    const id = rest[0];
    const item = await db.collection('products').findOne({ id });
    if (!item) return json({ error: 'Not found' }, 404);
    const { _id, category } = item;
    delete item._id;

    const similar = await db.collection('products').find({ category, id: { $ne: id } }).limit(6).toArray();
    return json({ product: item, similar: similar.map(({ _id, ...p }) => p) });
  }

  // ----------------------------------------------------
  // 4. CUSTOMER ORDER PLACEMENT & ORDER HISTORY
  // ----------------------------------------------------
  if (root === 'orders') {
    const user = getSessionUser(req);

    if (method === 'POST') {
      const body = await req.json();
      const order = {
        id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
        userId: user ? user.id : null,
        userEmail: user ? user.email : null,
        items: body.items || [],
        customer: body.customer || {},
        shippingAddress: body.address || {},
        payment: body.payment || 'cod',
        subtotal: body.subtotal || 0,
        shipping: body.shipping || 0,
        savings: body.savings || 0,
        total: body.total || 0,
        totalPaise: Math.round((body.total || 0) * 100),
        status: body.payment === 'razorpay' ? 'PaymentPending' : 'Pending',
        razorpayOrderId: null,
        razorpayPaymentId: null,
        timeline: [{ status: body.payment === 'razorpay' ? 'PaymentPending' : 'Pending', at: new Date().toISOString(), note: 'Order placed' }],
        createdAt: new Date().toISOString(),
      };
      await db.collection('orders').insertOne(order);
      const { _id, ...clean } = order;
      return json({ ok: true, order: clean });
    }

    if (method === 'GET') {
      const sub = rest[0];

      // GET /api/orders/history: Returns logged-in customer's order history
      if (sub === 'history') {
        if (!user) return json({ error: 'Authentication required' }, 401);
        const customerOrders = await db.collection('orders').find({ userEmail: user.email }).sort({ createdAt: -1 }).toArray();
        return json({ orders: customerOrders.map(({ _id, ...o }) => o) });
      }

      // GET /api/orders/[id]: Returns single order receipt
      if (sub) {
        const order = await db.collection('orders').findOne({ id: sub });
        if (!order) return json({ error: 'Not found' }, 404);
        
        // Security check: Only allow customer who placed it OR store admin to inspect
        if (order.userEmail && (!user || (user.email !== order.userEmail && user.role !== 'admin'))) {
          return json({ error: 'Access Denied' }, 403);
        }

        delete order._id;
        return json(order);
      }
    }
  }

  // ----------------------------------------------------
  // 5. RAZORPAY API INTEGRATION
  // ----------------------------------------------------
  if (root === 'razorpay') {
    const sub = rest[0];

    if (sub === 'order' && method === 'POST') {
      const rzp = getRazorpay();
      if (!rzp) return json({ error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.' }, 503);
      const { orderId } = await req.json();
      if (!orderId) return json({ error: 'orderId required' }, 400);

      const dbOrder = await db.collection('orders').findOne({ id: orderId });
      if (!dbOrder) return json({ error: 'Order not found' }, 404);
      if (dbOrder.status === 'Confirmed') return json({ error: 'Order already confirmed' }, 409);
      if (dbOrder.payment === 'cod') return json({ error: 'COD order cannot use Razorpay' }, 409);

      if (dbOrder.razorpayOrderId) {
        return json({
          keyId: process.env.RAZORPAY_KEY_ID,
          razorpayOrderId: dbOrder.razorpayOrderId,
          amount: dbOrder.totalPaise,
          currency: 'INR',
          internalOrderId: dbOrder.id,
        });
      }

      const amount = Number(dbOrder.totalPaise);
      if (!Number.isSafeInteger(amount) || amount <= 0) return json({ error: 'Invalid amount' }, 422);

      const rpOrder = await rzp.orders.create({
        amount, currency: 'INR', receipt: dbOrder.id,
        notes: { internalOrderId: dbOrder.id, customer: dbOrder.customer?.name || '' },
      });

      await db.collection('orders').updateOne(
        { id: dbOrder.id },
        { $set: { razorpayOrderId: rpOrder.id, razorpayOrderCreatedAt: new Date().toISOString() } }
      );

      return json({
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        internalOrderId: dbOrder.id,
      });
    }

    if (sub === 'verify' && method === 'POST') {
      const rzp = getRazorpay();
      if (!rzp) return json({ error: 'Razorpay keys not configured' }, 503);
      const body = await req.json();
      const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
      if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return json({ error: 'Incomplete payment response' }, 400);
      }

      const dbOrder = await db.collection('orders').findOne({ id: orderId, razorpayOrderId: razorpay_order_id });
      if (!dbOrder) return json({ error: 'Order mismatch' }, 404);

      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (!safeEqualHex(expected, razorpay_signature)) {
        await db.collection('orders').updateOne({ id: dbOrder.id }, { $set: { status: 'Failed' } });
        return json({ error: 'Invalid payment signature' }, 400);
      }

      const payment = await rzp.payments.fetch(razorpay_payment_id);
      if (payment.order_id !== razorpay_order_id || payment.currency !== 'INR' || payment.amount !== dbOrder.totalPaise) {
        return json({ error: 'Payment details do not match order' }, 400);
      }

      if (payment.status !== 'captured') {
        await db.collection('orders').updateOne(
          { id: dbOrder.id, status: { $ne: 'Confirmed' } },
          { $set: { status: 'PaymentPending', razorpayPaymentId: razorpay_payment_id } }
        );
        return json({ ok: true, status: payment.status });
      }

      await db.collection('orders').updateOne(
        { id: dbOrder.id, status: { $ne: 'Confirmed' } },
        {
          $set: {
            status: 'Confirmed',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentVerifiedAt: new Date().toISOString(),
          },
          $push: { timeline: { status: 'Confirmed', at: new Date().toISOString(), note: `Razorpay payment ${razorpay_payment_id} captured` } },
        }
      );

      const confirmed = await db.collection('orders').findOne({ id: dbOrder.id });
      delete confirmed._id;
      return json({ ok: true, status: 'Confirmed', order: confirmed });
    }

    if (sub === 'config' && method === 'GET') {
      return json({ configured: !!getRazorpay(), keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null });
    }
  }

  // ----------------------------------------------------
  // 6. ADMIN PRIVATE API ENDPOINTS (ADMIN ROLE CHECK ENFORCED)
  // ----------------------------------------------------
  if (root === 'admin') {
    const user = getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return json({ error: 'Access denied. Administrator privileges required.' }, 403);
    }

    const sub = rest[0];
    const id = rest[1];

    if (sub === 'stats' && method === 'GET') {
      const activeProductsCount = await db.collection('products').countDocuments();
      
      const ordersCursor = await db.collection('orders').find({ status: { $in: ['Confirmed', 'Shipped', 'Delivered'] } }).toArray();
      const revenue = ordersCursor.reduce((sum, o) => sum + (o.total || 0), 0);
      const ordersCount = ordersCursor.length;
      
      const sessionsCount = await db.collection('user_sessions').countDocuments();
      const avgValue = ordersCount > 0 ? revenue / ordersCount : 0;

      return json({
        stats: {
          revenue,
          orders: ordersCount,
          products: activeProductsCount,
          sessions: sessionsCount,
          avgValue
        }
      });
    }

    if (sub === 'orders') {
      if (method === 'GET') {
        const allOrders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
        return json({ orders: allOrders.map(({ _id, ...o }) => o) });
      }

      if (method === 'PUT' && id) {
        const { status } = await req.json();
        const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
          return json({ error: 'Invalid status value' }, 400);
        }

        const updateResult = await db.collection('orders').updateOne(
          { id },
          {
            $set: { status },
            $push: { timeline: { status, at: new Date().toISOString(), note: `Status updated to ${status} by administrator` } }
          }
        );

        if (updateResult.matchedCount === 0) return json({ error: 'Order not found' }, 404);
        return json({ ok: true });
      }
    }

    if (sub === 'products') {
      if (method === 'POST') {
        const body = await req.json();
        if (!body.name || !body.price || !body.category) {
          return json({ error: 'Product name, price, and category are required' }, 400);
        }

        // Auto-generate ID: Find highest SR prefix ID and increment
        const lastProd = await db.collection('products').find({}).sort({ id: -1 }).limit(1).toArray();
        let nextNum = 1;
        if (lastProd.length > 0 && lastProd[0].id.startsWith('SR')) {
          const numPart = parseInt(lastProd[0].id.substring(2));
          if (!isNaN(numPart)) {
            nextNum = numPart + 1;
          }
        }
        const autoId = `SR${String(nextNum).padStart(4, '0')}`;
        const autoSlug = `sr-${nextNum}-${body.category}-${body.color?.toLowerCase()?.replace(/\s+/g, '-') || 'piece'}`;

        const newProduct = {
          id: autoId,
          name: body.name,
          slug: autoSlug,
          category: body.category,
          categoryName: body.categoryName || body.category,
          subcategory: body.subcategory || null,
          subcategoryName: body.subcategoryName || null,
          group: body.group || 'Sarees',
          color: body.color || 'Multi',
          fabric: body.fabric || 'Cotton',
          work: body.work || 'None',
          occasion: body.occasion || 'Casual',
          price: Number(body.price),
          mrp: Number(body.mrp || body.price),
          discount: Number(body.discount || 0),
          images: [body.image || ''],
          stock: Number(body.stock || 5),
          rating: 4.5,
          reviewCount: 0,
          isNewArrival: true,
          createdAt: new Date().toISOString()
        };

        await db.collection('products').insertOne(newProduct);
        return json({ ok: true, product: newProduct });
      }

      if (method === 'PUT' && id) {
        const body = await req.json();
        const updateFields = {
          name: body.name,
          category: body.category,
          categoryName: body.categoryName,
          subcategory: body.subcategory || null,
          subcategoryName: body.subcategoryName || null,
          price: Number(body.price),
          mrp: Number(body.mrp),
          discount: Number(body.discount),
          color: body.color,
          fabric: body.fabric,
          stock: Number(body.stock),
          images: [body.image || '']
        };

        const updateResult = await db.collection('products').updateOne({ id }, { $set: updateFields });
        if (updateResult.matchedCount === 0) return json({ error: 'Product not found' }, 404);
        return json({ ok: true });
      }

      if (method === 'DELETE' && id) {
        const deleteResult = await db.collection('products').deleteOne({ id });
        if (deleteResult.deletedCount === 0) return json({ error: 'Product not found' }, 404);
        return json({ ok: true });
      }
    }

    if (sub === 'categories') {
      if (method === 'POST') {
        const body = await req.json();
        if (!body.slug || !body.name) {
          return json({ error: 'Slug and Name are required' }, 400);
        }
        const existing = await db.collection('categories').findOne({ slug: body.slug });
        if (existing) return json({ error: 'Category with this slug already exists' }, 409);

        const newCat = {
          slug: body.slug.toLowerCase().trim(),
          name: body.name.trim(),
          group: body.group || 'Boutique',
          tagline: body.tagline || '',
          img: body.img || 'https://images.unsplash.com/photo-1610030469839-f909584b43f1?crop=entropy&cs=srgb&fm=jpg&q=85&w=900'
        };
        await db.collection('categories').insertOne(newCat);
        return json({ ok: true, category: newCat });
      }

      if (method === 'PUT' && id) {
        const body = await req.json();
        const updateFields = {
          name: body.name.trim(),
          group: body.group || 'Boutique',
          tagline: body.tagline || '',
          img: body.img || ''
        };
        const updateResult = await db.collection('categories').updateOne({ slug: id }, { $set: updateFields });
        if (updateResult.matchedCount === 0) return json({ error: 'Category not found' }, 404);

        // Also update matching products' categoryName
        await db.collection('products').updateMany({ category: id }, { $set: { categoryName: body.name.trim() } });

        return json({ ok: true });
      }

      if (method === 'DELETE' && id) {
        // Delete category
        const deleteResult = await db.collection('categories').deleteOne({ slug: id });
        if (deleteResult.deletedCount === 0) return json({ error: 'Category not found' }, 404);

        // Delete all child subcategories
        await db.collection('subcategories').deleteMany({ categorySlug: id });

        // Set matching products' category and subcategory to null
        await db.collection('products').updateMany(
          { category: id },
          { $set: { category: null, categoryName: null, subcategory: null, subcategoryName: null } }
        );

        return json({ ok: true });
      }
    }

    if (sub === 'subcategories') {
      if (method === 'POST') {
        const body = await req.json();
        if (!body.slug || !body.name || !body.categorySlug) {
          return json({ error: 'Slug, Name, and Parent Category Slug are required' }, 400);
        }
        const existing = await db.collection('subcategories').findOne({ slug: body.slug });
        if (existing) return json({ error: 'Subcategory with this slug already exists' }, 409);

        const newSub = {
          slug: body.slug.toLowerCase().trim(),
          name: body.name.trim(),
          categorySlug: body.categorySlug
        };
        await db.collection('subcategories').insertOne(newSub);
        return json({ ok: true, subcategory: newSub });
      }

      if (method === 'PUT' && id) {
        const body = await req.json();
        const updateFields = {
          name: body.name.trim()
        };
        const updateResult = await db.collection('subcategories').updateOne({ slug: id }, { $set: updateFields });
        if (updateResult.matchedCount === 0) return json({ error: 'Subcategory not found' }, 404);

        // Also update matching products' subcategoryName
        await db.collection('products').updateMany({ subcategory: id }, { $set: { subcategoryName: body.name.trim() } });

        return json({ ok: true });
      }

      if (method === 'DELETE' && id) {
        // Delete subcategory
        const deleteResult = await db.collection('subcategories').deleteOne({ slug: id });
        if (deleteResult.deletedCount === 0) return json({ error: 'Subcategory not found' }, 404);

        // Set matching products' subcategory fields to null
        await db.collection('products').updateMany(
          { subcategory: id },
          { $set: { subcategory: null, subcategoryName: null } }
        );

        return json({ ok: true });
      }
    }

    if (sub === 'users') {
      if (method === 'GET') {
        const allUsers = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
        const cleanUsers = allUsers.map(({ passwordHash, salt, ...u }) => u);
        return json({ users: cleanUsers });
      }

      if (method === 'POST') {
        const { name, email, password, phone, address, role } = await req.json();
        if (!name || !email || !password || !phone || !role) {
          return json({ error: 'Name, email, password, phone number, and role are required' }, 400);
        }
        if (role !== 'admin' && role !== 'customer') {
          return json({ error: 'Invalid role value' }, 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await db.collection('users').findOne({ email: normalizedEmail });
        if (existing) return json({ error: 'An account with this email already exists' }, 409);

        const credentials = hashPassword(password);
        const newUser = {
          id: `usr-${uuidv4().slice(0, 8)}`,
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          address: address ? address.trim() : '',
          passwordHash: credentials.hash,
          salt: credentials.salt,
          role,
          createdAt: new Date().toISOString()
        };

        await db.collection('users').insertOne(newUser);
        const cleanUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, address: newUser.address, role: newUser.role, createdAt: newUser.createdAt };
        return json({ ok: true, user: cleanUser });
      }

      if (method === 'PUT' && id) {
        const { name, email, phone, address, role } = await req.json();
        const updateFields = {};
        
        if (name !== undefined) updateFields.name = name.trim();
        if (email !== undefined) {
          const normalizedEmail = email.toLowerCase().trim();
          updateFields.email = normalizedEmail;
          // Check uniqueness
          const existing = await db.collection('users').findOne({ email: normalizedEmail, id: { $ne: id } });
          if (existing) return json({ error: 'An account with this email already exists' }, 409);
        }
        if (phone !== undefined) updateFields.phone = phone.trim();
        if (address !== undefined) updateFields.address = address.trim();
        if (role !== undefined) {
          if (role !== 'admin' && role !== 'customer') {
            return json({ error: 'Invalid role value' }, 400);
          }
          updateFields.role = role;
        }

        const updateResult = await db.collection('users').updateOne({ id }, { $set: updateFields });
        if (updateResult.matchedCount === 0) return json({ error: 'User not found' }, 404);
        return json({ ok: true });
      }

      if (method === 'DELETE' && id) {
        const deleteResult = await db.collection('users').deleteOne({ id });
        if (deleteResult.deletedCount === 0) return json({ error: 'User not found' }, 404);
        return json({ ok: true });
      }
    }

    if (sub === 'sales') {
      if (method === 'GET') {
        const sales = await db.collection('in_store_sales').find({}).sort({ createdAt: -1 }).toArray();
        return json({ sales });
      }

      if (method === 'POST') {
        const body = await req.json();
        const { productId, priceSold, quantity, notes } = body;
        if (!productId || !priceSold || !quantity) {
          return json({ error: 'Product ID, Price Sold, and Quantity are required' }, 400);
        }

        const product = await db.collection('products').findOne({ id: productId });
        if (!product) return json({ error: 'Product not found' }, 404);

        const qtyNum = Number(quantity);
        if (qtyNum <= 0) return json({ error: 'Quantity must be greater than zero' }, 400);

        if (product.stock < qtyNum) {
          return json({ error: `Insufficient stock. Current stock is ${product.stock} units.` }, 400);
        }

        // Deduct stock
        await db.collection('products').updateOne(
          { id: productId },
          { $inc: { stock: -qtyNum } }
        );

        const newSale = {
          id: `SAL-${uuidv4().slice(0, 8).toUpperCase()}`,
          productId,
          productName: product.name,
          priceSold: Number(priceSold),
          quantity: qtyNum,
          totalAmount: Number(priceSold) * qtyNum,
          notes: notes || '',
          createdAt: new Date().toISOString()
        };

        await db.collection('in_store_sales').insertOne(newSale);
        return json({ ok: true, sale: newSale });
      }

      if (method === 'PUT' && id) {
        const body = await req.json();
        const { priceSold, quantity, notes } = body;
        if (!priceSold || !quantity) {
          return json({ error: 'Price Sold and Quantity are required' }, 400);
        }

        const qtyNum = Number(quantity);
        if (qtyNum <= 0) return json({ error: 'Quantity must be greater than zero' }, 400);

        // Fetch original sale
        const originalSale = await db.collection('in_store_sales').findOne({ id });
        if (!originalSale) return json({ error: 'Sales record not found' }, 404);

        const product = await db.collection('products').findOne({ id: originalSale.productId });
        if (!product) return json({ error: 'Associated product not found' }, 404);

        const qtyDiff = qtyNum - originalSale.quantity;

        // If we are increasing sold quantity, check if there is enough stock
        if (qtyDiff > 0 && product.stock < qtyDiff) {
          return json({ error: `Insufficient stock to adjust quantity. Available stock is ${product.stock} units.` }, 400);
        }

        // Adjust stock
        await db.collection('products').updateOne(
          { id: originalSale.productId },
          { $inc: { stock: -qtyDiff } }
        );

        const updateFields = {
          priceSold: Number(priceSold),
          quantity: qtyNum,
          totalAmount: Number(priceSold) * qtyNum,
          notes: notes || ''
        };

        await db.collection('in_store_sales').updateOne({ id }, { $set: updateFields });
        return json({ ok: true });
      }

      if (method === 'DELETE' && id) {
        const sale = await db.collection('in_store_sales').findOne({ id });
        if (!sale) return json({ error: 'Sales record not found' }, 404);

        // Restore stock
        await db.collection('products').updateOne(
          { id: sale.productId },
          { $inc: { stock: sale.quantity } }
        );

        // Delete sale
        await db.collection('in_store_sales').deleteOne({ id });
        return json({ ok: true });
      }
    }
  }

  return json({ error: 'Route not found', path: segments.join('/') }, 404);
}

export const GET = withLogging(async (req, { params }) => {
  try {
    const { path = [] } = await params;
    return await router(req, 'GET', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});

export const POST = withLogging(async (req, { params }) => {
  try {
    const { path = [] } = await params;
    return await router(req, 'POST', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});

export const PUT = withLogging(async (req, { params }) => {
  try {
    const { path = [] } = await params;
    return await router(req, 'PUT', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});

export const DELETE = withLogging(async (req, { params }) => {
  try {
    const { path = [] } = await params;
    return await router(req, 'DELETE', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
});
