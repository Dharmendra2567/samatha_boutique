import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { getDb } from '@/lib/mongo';
import { generateProducts, CATEGORIES_DATA, TESTIMONIALS } from '@/lib/products-data';

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

async function ensureSeeded() {
  const db = await getDb();
  const count = await db.collection('products').countDocuments();
  if (count === 0) {
    const products = generateProducts();
    await db.collection('products').insertMany(products);
    await db.collection('categories').insertMany(CATEGORIES_DATA);
    await db.collection('testimonials').insertMany(TESTIMONIALS);
  }
  return db;
}

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

async function router(req, method, segments) {
  const [root, ...rest] = segments;

  if (!root || root === '') return json({ ok: true, service: 'Samatha Reddy Boutique API', time: new Date().toISOString() });

  if (root === 'seed') {
    const db = await getDb();
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('testimonials').deleteMany({});
    const products = generateProducts();
    await db.collection('products').insertMany(products);
    await db.collection('categories').insertMany(CATEGORIES_DATA);
    await db.collection('testimonials').insertMany(TESTIMONIALS);
    return json({ ok: true, seeded: { products: products.length, categories: CATEGORIES_DATA.length, testimonials: TESTIMONIALS.length } });
  }

  if (root === 'categories') {
    const db = await ensureSeeded();
    const cats = await db.collection('categories').find({}).toArray();
    return json(cats.map(({ _id, ...c }) => c));
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
    // similar products
    const similar = await db.collection('products').find({ category, id: { $ne: id } }).limit(6).toArray();
    return json({ product: item, similar: similar.map(({ _id, ...p }) => p) });
  }

  if (root === 'orders' && method === 'POST') {
    const db = await getDb();
    const body = await req.json();
    const order = {
      id: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
      items: body.items || [],
      customer: body.customer || {},
      address: body.address || {},
      payment: body.payment || 'cod',
      subtotal: body.subtotal || 0,
      shipping: body.shipping || 0,
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

  // Razorpay: create a payment order tied to an internal orderId
  if (root === 'razorpay' && rest[0] === 'order' && method === 'POST') {
    const rzp = getRazorpay();
    if (!rzp) return json({ error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env and restart.' }, 503);
    const { orderId } = await req.json();
    if (!orderId) return json({ error: 'orderId required' }, 400);
    const db = await getDb();
    const dbOrder = await db.collection('orders').findOne({ id: orderId });
    if (!dbOrder) return json({ error: 'Order not found' }, 404);
    if (dbOrder.status === 'Confirmed') return json({ error: 'Order already confirmed' }, 409);
    if (dbOrder.payment === 'cod') return json({ error: 'COD order cannot use Razorpay' }, 409);

    // Reuse existing razorpay order if present (idempotent retries)
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

  // Razorpay: verify HMAC + payment status, mark Confirmed
  if (root === 'razorpay' && rest[0] === 'verify' && method === 'POST') {
    const rzp = getRazorpay();
    if (!rzp) return json({ error: 'Razorpay keys not configured' }, 503);
    const body = await req.json();
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json({ error: 'Incomplete payment response' }, 400);
    }

    const db = await getDb();
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

    // Signature valid — cross-check payment on Razorpay before fulfilment
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

  if (root === 'razorpay' && rest[0] === 'config' && method === 'GET') {
    return json({ configured: !!getRazorpay(), keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null });
  }

  if (root === 'orders' && method === 'GET' && rest[0]) {
    const db = await getDb();
    const order = await db.collection('orders').findOne({ id: rest[0] });
    if (!order) return json({ error: 'Not found' }, 404);
    delete order._id;
    return json(order);
  }

  return json({ error: 'Route not found', path: segments.join('/') }, 404);
}

export async function GET(req, { params }) {
  try {
    const { path = [] } = await params;
    return await router(req, 'GET', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
export async function POST(req, { params }) {
  try {
    const { path = [] } = await params;
    return await router(req, 'POST', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
export async function PUT(req, { params }) {
  try {
    const { path = [] } = await params;
    return await router(req, 'PUT', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
export async function DELETE(req, { params }) {
  try {
    const { path = [] } = await params;
    return await router(req, 'DELETE', path);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
