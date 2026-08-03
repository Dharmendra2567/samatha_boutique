import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/mongo';
import { generateProducts, CATEGORIES_DATA, TESTIMONIALS } from '@/lib/products-data';

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
      status: 'Pending',
      timeline: [{ status: 'Pending', at: new Date().toISOString(), note: 'Order placed' }],
      createdAt: new Date().toISOString(),
    };
    await db.collection('orders').insertOne(order);
    const { _id, ...clean } = order;
    return json({ ok: true, order: clean });
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
