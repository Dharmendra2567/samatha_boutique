// Curated product catalog - realistic Indian boutique inventory
const IMAGES = [
  'https://images.unsplash.com/photo-1610189335693-9e909b33aa32?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030469839-f909584b43f1?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610189019389-975bbbc2f8f3?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030468706-9a6dbad49b0a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030469245-ab65c4583802?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610189338175-0782dfdb0c04?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.pexels.com/photos/34155081/pexels-photo-34155081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.unsplash.com/photo-1600685890506-593fdf55949b?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/flagged/photo-1551854716-8b811be39e7e?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1614088685112-0a743e1d2348?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1632345031435-8797b2d58045?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.pexels.com/photos/34155081/pexels-photo-34155081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
];

const SAREE_IMAGES = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610189335693-9e909b33aa32?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030469839-f909584b43f1?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610189019389-975bbbc2f8f3?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030468706-9a6dbad49b0a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030469245-ab65c4583802?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610189338175-0782dfdb0c04?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1600685890506-593fdf55949b?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
];

const LEHENGA_IMAGES = [
  'https://images.unsplash.com/flagged/photo-1551854716-8b811be39e7e?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1614088685112-0a743e1d2348?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1632345031435-8797b2d58045?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.pexels.com/photos/34155081/pexels-photo-34155081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
];

const BLOUSE_IMAGES = [
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1608748010899-18f300247112?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1618220179428-22790b461013?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
];

const KURTI_IMAGES = [
  'https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.pexels.com/photos/17154861/pexels-photo-17154861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.unsplash.com/photo-1608748010899-18f300247112?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1631856955403-cc6a3c9be08a?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
];

const SALWAR_IMAGES = [
  'https://images.pexels.com/photos/17154861/pexels-photo-17154861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1608748010899-18f300247112?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
];

const GOWN_IMAGES = [
  'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.unsplash.com/photo-1618220179428-22790b461013?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1614088685112-0a743e1d2348?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
];

const BRIDAL_IMAGES = [
  'https://images.pexels.com/photos/34155081/pexels-photo-34155081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'https://images.unsplash.com/photo-1603005901058-b2a26c6d73c8?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
  'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=900',
];

const CATEGORIES = [
  { slug: 'kanjivaram', name: 'Kanjivaram Silk', group: 'Sarees', tagline: 'Timeless South Indian heritage', img: SAREE_IMAGES[4] },
  { slug: 'banarasi', name: 'Banarasi Silk', group: 'Sarees', tagline: 'Woven royalty from Varanasi', img: SAREE_IMAGES[0] },
  { slug: 'pochampally', name: 'Pochampally Ikat', group: 'Sarees', tagline: 'Pride of Telangana', img: SAREE_IMAGES[2] },
  { slug: 'cotton', name: 'Cotton Handloom', group: 'Sarees', tagline: 'Everyday elegance', img: SAREE_IMAGES[6] },
  { slug: 'silk', name: 'Pure Silk', group: 'Sarees', tagline: 'Luxurious lustre', img: SAREE_IMAGES[5] },
  { slug: 'organza', name: 'Organza', group: 'Sarees', tagline: 'Featherlight grace', img: SAREE_IMAGES[7] },
  { slug: 'chiffon', name: 'Chiffon', group: 'Sarees', tagline: 'Effortless drape', img: SAREE_IMAGES[8] },
  { slug: 'georgette', name: 'Georgette', group: 'Sarees', tagline: 'Modern flow', img: SAREE_IMAGES[1] },
  { slug: 'linen', name: 'Linen', group: 'Sarees', tagline: 'Cool sophistication', img: SAREE_IMAGES[3] },
  { slug: 'bridal', name: 'Bridal Couture', group: 'Occasion', tagline: 'Once-in-a-lifetime', img: BRIDAL_IMAGES[0] },
  { slug: 'blouse', name: 'Designer Blouse', group: 'Boutique', tagline: 'Statement pieces', img: BLOUSE_IMAGES[0] },
  { slug: 'lehenga', name: 'Lehenga', group: 'Boutique', tagline: 'Regal celebration wear', img: LEHENGA_IMAGES[0] },
  { slug: 'kurti', name: 'Kurti', group: 'Boutique', tagline: 'Everyday ethnic', img: KURTI_IMAGES[0] },
  { slug: 'salwar', name: 'Salwar Suit', group: 'Boutique', tagline: 'Classic three-piece', img: SALWAR_IMAGES[0] },
  { slug: 'gown', name: 'Indo-Western Gown', group: 'Boutique', tagline: 'Modern muse', img: GOWN_IMAGES[0] },
];

export const SUBCATEGORIES = [
  { slug: 'traditional-kanjivaram', name: 'Traditional Kanjivaram', categorySlug: 'kanjivaram' },
  { slug: 'contemporary-kanjivaram', name: 'Contemporary Kanjivaram', categorySlug: 'kanjivaram' },
  { slug: 'katan-banarasi', name: 'Katan Banarasi', categorySlug: 'banarasi' },
  { slug: 'meenakari-banarasi', name: 'Meenakari Banarasi', categorySlug: 'banarasi' },
  { slug: 'silk-pochampally', name: 'Silk Pochampally', categorySlug: 'pochampally' },
  { slug: 'cotton-pochampally', name: 'Cotton Pochampally', categorySlug: 'pochampally' },
  { slug: 'handloom-cotton', name: 'Handloom Cotton', categorySlug: 'cotton' },
  { slug: 'printed-cotton', name: 'Printed Cotton', categorySlug: 'cotton' },
  { slug: 'tussar-silk', name: 'Tussar Silk', categorySlug: 'silk' },
  { slug: 'raw-silk', name: 'Raw Silk', categorySlug: 'silk' },
  { slug: 'printed-organza', name: 'Printed Organza', categorySlug: 'organza' },
  { slug: 'embroidered-organza', name: 'Embroidered Organza', categorySlug: 'organza' },
  { slug: 'solid-chiffon', name: 'Solid Chiffon', categorySlug: 'chiffon' },
  { slug: 'printed-chiffon', name: 'Printed Chiffon', categorySlug: 'chiffon' },
  { slug: 'designer-georgette', name: 'Designer Georgette', categorySlug: 'georgette' },
  { slug: 'party-georgette', name: 'Party Wear Georgette', categorySlug: 'georgette' },
  { slug: 'pure-linen', name: 'Pure Linen', categorySlug: 'linen' },
  { slug: 'linen-cotton', name: 'Linen Cotton', categorySlug: 'linen' },
  { slug: 'bridal-lehenga-sub', name: 'Bridal Lehenga', categorySlug: 'bridal' },
  { slug: 'bridal-saree-sub', name: 'Bridal Saree', categorySlug: 'bridal' },
  { slug: 'aari-blouse', name: 'Aari Work Blouse', categorySlug: 'blouse' },
  { slug: 'zardosi-blouse', name: 'Zardosi Blouse', categorySlug: 'blouse' },
  { slug: 'sangeet-lehenga', name: 'Sangeet Lehenga', categorySlug: 'lehenga' },
  { slug: 'reception-lehenga', name: 'Reception Lehenga', categorySlug: 'lehenga' },
  { slug: 'anarkali-kurti-sub', name: 'Anarkali Kurti', categorySlug: 'kurti' },
  { slug: 'straight-kurti-sub', name: 'Straight Cut Kurti', categorySlug: 'kurti' },
  { slug: 'sharara-suit-sub', name: 'Sharara Suit', categorySlug: 'salwar' },
  { slug: 'palazzo-suit-sub', name: 'Palazzo Suit', categorySlug: 'salwar' },
  { slug: 'indo-western-gown-sub', name: 'Indo-Western Gown', categorySlug: 'gown' },
  { slug: 'cocktail-gown-sub', name: 'Cocktail Gown', categorySlug: 'gown' }
];


const COLORS = ['Maroon', 'Emerald Green', 'Royal Blue', 'Ivory', 'Blush Pink', 'Deep Red', 'Mustard Yellow', 'Peacock Teal', 'Powder Blue', 'Wine', 'Sage', 'Copper', 'Lavender', 'Onyx Black'];
const OCCASIONS = ['Bridal', 'Wedding', 'Party Wear', 'Festive', 'Reception', 'Sangeet', 'Casual', 'Office Wear'];
const WORKS = ['Zari Work', 'Zardosi', 'Mirror Work', 'Aari Embroidery', 'Kundan', 'Sequins', 'Handblock Print', 'Chikankari', 'Kalamkari Print', 'Thread Work'];

const PRODUCT_TEMPLATES = {
  kanjivaram: ['Regal Kanjivaram Silk Saree', 'Temple Border Kanjivaram', 'Bridal Kanjivaram Pattu', 'Traditional Kanchipuram Silk', 'Peacock Motif Kanjivaram'],
  banarasi: ['Pure Banarasi Silk Saree', 'Katan Silk Banarasi', 'Meenakari Banarasi', 'Jamdani Banarasi', 'Georgette Banarasi'],
  pochampally: ['Pochampally Ikat Silk Saree', 'Telangana Pochampally Weave', 'Double Ikat Pochampally', 'Handwoven Pochampally', 'Silk Cotton Pochampally'],
  cotton: ['Mangalgiri Cotton Saree', 'Chettinad Cotton Handloom', 'Kalamkari Cotton', 'Ikat Cotton Saree', 'Jamdani Cotton'],
  silk: ['Mysore Silk Saree', 'Tussar Silk Saree', 'Raw Silk Saree', 'Art Silk Saree', 'Dupion Silk Saree'],
  organza: ['Floral Organza Saree', 'Embroidered Organza', 'Sequin Organza', 'Handpainted Organza', 'Zari Border Organza'],
  chiffon: ['Bollywood Chiffon Saree', 'Printed Chiffon', 'Sequin Chiffon Saree', 'Embellished Chiffon', 'Solid Chiffon'],
  georgette: ['Designer Georgette Saree', 'Party Wear Georgette', 'Sequin Georgette', 'Embroidered Georgette', 'Printed Georgette'],
  linen: ['Pure Linen Saree', 'Linen Cotton Blend', 'Zari Linen Saree', 'Handloom Linen', 'Designer Linen'],
  bridal: ['Bridal Lehenga Choli', 'Reception Saree', 'Kanjivaram Bridal Saree', 'Designer Bridal Ensemble', 'Nikah Bridal Set'],
  blouse: ['Aari Work Designer Blouse', 'Zardosi Bridal Blouse', 'Mirror Work Blouse', 'Embroidered Silk Blouse', 'Boat Neck Designer Blouse'],
  lehenga: ['Bridal Lehenga Choli', 'Sangeet Lehenga', 'Reception Lehenga', 'Half Saree Lehenga', 'Designer Party Lehenga'],
  kurti: ['Anarkali Kurti', 'Straight Cut Kurti', 'A-line Kurti', 'Chikankari Kurti', 'Designer Party Kurti'],
  salwar: ['Patiala Salwar Suit', 'Anarkali Suit', 'Straight Cut Suit', 'Palazzo Suit Set', 'Sharara Suit'],
  gown: ['Indo-Western Gown', 'Reception Gown', 'Anarkali Gown', 'Cocktail Gown', 'Designer Party Gown'],
};

function seedRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateProducts() {
  const rand = seedRandom(42);
  const products = [];
  let id = 1;
  CATEGORIES.forEach((cat, ci) => {
    const templates = PRODUCT_TEMPLATES[cat.slug] || ['Designer Piece'];
    const count = ['bridal', 'kanjivaram', 'banarasi'].includes(cat.slug) ? 8 : 6;
    const catSubcats = SUBCATEGORIES.filter(sc => sc.categorySlug === cat.slug);

    const imgList = cat.slug === 'bridal' ? BRIDAL_IMAGES :
                    cat.slug === 'lehenga' ? LEHENGA_IMAGES :
                    cat.slug === 'blouse' ? BLOUSE_IMAGES :
                    cat.slug === 'kurti' ? KURTI_IMAGES :
                    cat.slug === 'salwar' ? SALWAR_IMAGES :
                    cat.slug === 'gown' ? GOWN_IMAGES : SAREE_IMAGES;

    for (let i = 0; i < count; i++) {
      const color = COLORS[Math.floor(rand() * COLORS.length)];
      const template = templates[i % templates.length];
      const work = WORKS[Math.floor(rand() * WORKS.length)];
      const occasion = OCCASIONS[Math.floor(rand() * OCCASIONS.length)];
      const mrp = Math.floor(2000 + rand() * 45000);
      const discount = 15 + Math.floor(rand() * 40);
      const price = Math.floor(mrp * (100 - discount) / 100 / 10) * 10 + 9;
      
      const imgIdx1 = i % imgList.length;
      const imgIdx2 = (imgIdx1 + 1) % imgList.length;
      const imgIdx3 = (imgIdx1 + 2) % imgList.length;

      const stock = Math.floor(3 + rand() * 25);
      const rating = Number((3.8 + rand() * 1.2).toFixed(1));
      const reviewCount = Math.floor(12 + rand() * 340);
      const subcat = catSubcats.length > 0 ? catSubcats[i % catSubcats.length] : null;
      products.push({
        id: `SR${String(id).padStart(4, '0')}`,
        name: `${color} ${template}`,
        slug: `sr-${id}-${cat.slug}-${color.toLowerCase().replace(/\s+/g, '-')}`,
        category: cat.slug,
        categoryName: cat.name,
        subcategory: subcat ? subcat.slug : null,
        subcategoryName: subcat ? subcat.name : null,
        group: cat.group,
        color,
        fabric: cat.name,
        work,
        occasion,
        price,
        mrp,
        discount,
        images: [imgList[imgIdx1], imgList[imgIdx2], imgList[imgIdx3]],
        description: `Exquisite ${color.toLowerCase()} ${template.toLowerCase()} handcrafted with intricate ${work.toLowerCase()}. Perfect for ${occasion.toLowerCase()} occasions, this piece from Samatha Reddy Sarees Collection & Boutique Services celebrates the timeless artistry of Indian weavers with a contemporary silhouette.`,
        specs: {
          Fabric: cat.name,
          Work: work,
          Occasion: occasion,
          Color: color,
          Length: cat.group === 'Sarees' ? '6.3 meters (with blouse piece)' : 'Standard boutique size',
          Weight: `${(400 + Math.floor(rand() * 800))}g`,
          'Wash Care': 'Dry clean only',
          Delivery: '4-7 business days across India',
        },
        stock,
        rating,
        reviewCount,
        isFeatured: i < 2,
        isBestSeller: rand() > 0.65,
        isNewArrival: rand() > 0.6,
        isBridal: cat.slug === 'bridal' || (cat.slug === 'kanjivaram' && i < 3),
        createdAt: new Date(Date.now() - Math.floor(rand() * 60) * 86400000).toISOString(),
      });
      id++;
    }
  });
  return products;
}

export const CATEGORIES_DATA = CATEGORIES;

export const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Hyderabad', rating: 5, text: 'The Kanjivaram I bought for my wedding was absolutely stunning. Craftsmanship is unmatched — every guest asked where I got it from!', avatar: 'P' },
  { name: 'Ananya Reddy', city: 'Secunderabad', rating: 5, text: 'Samatha akka personally helped me pick the perfect Pochampally saree. Her taste and attention to detail is why I keep coming back.', avatar: 'A' },
  { name: 'Divya Iyer', city: 'Bengaluru', rating: 5, text: 'Ordered a designer blouse — arrived in 5 days, perfect stitching. This boutique understands Indian women.', avatar: 'D' },
  { name: 'Meera Rao', city: 'Chennai', rating: 5, text: 'The Banarasi collection is next level. Prices are honest, quality is boutique-level. Highly recommend for festive shopping.', avatar: 'M' },
];
