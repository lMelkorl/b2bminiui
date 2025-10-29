import { http, HttpResponse, delay } from 'msw';
import mockData from './data.json';

const API_BASE = '/api';

export const handlers = [
  // Login endpoint
  http.post(`${API_BASE}/login`, async ({ request }) => {
    await delay(500);
    const body = await request.json() as { email: string; password: string };
    
    const user = mockData.users.find(
      (u) => u.email === body.email && u.password === body.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return HttpResponse.json({
        success: true,
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + user.id,
      });
    }

    return HttpResponse.json(
      { success: false, message: 'Geçersiz email veya şifre' },
      { status: 401 }
    );
  }),

  // Summary endpoint
  http.get(`${API_BASE}/summary`, async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: mockData.summary,
    });
  }),

  // Products endpoints
  http.get(`${API_BASE}/products`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const category = url.searchParams.get('category') || '';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const minWeight = url.searchParams.get('minWeight');
    const maxWeight = url.searchParams.get('maxWeight');

    console.log('[MSW Products] Search:', search, 'Category:', category, 'Price:', minPrice, '-', maxPrice, 'Weight:', minWeight, '-', maxWeight);

    let filtered = mockData.products;

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.material.toLowerCase().includes(search)
      );
      console.log('[MSW Products] After search filter:', filtered.length);
    }

    if (category && category !== 'Tümü') {
      filtered = filtered.filter((p) => p.category === category);
      console.log('[MSW Products] After category filter:', filtered.length, 'for category:', category);
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
      console.log('[MSW Products] After minPrice filter:', filtered.length);
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
      console.log('[MSW Products] After maxPrice filter:', filtered.length);
    }

    if (minWeight || maxWeight) {
      filtered = filtered.filter((p) => {
        // Extract numeric value from weight string (e.g., "5.2g" -> 5.2)
        const weightValue = parseFloat(p.weight.replace(/[^0-9.]/g, ''));
        if (minWeight && weightValue < parseFloat(minWeight)) return false;
        if (maxWeight && weightValue > parseFloat(maxWeight)) return false;
        return true;
      });
      console.log('[MSW Products] After weight filter:', filtered.length);
    }

    console.log('[MSW Products] Returning', filtered.length, 'products');

    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  http.get(`${API_BASE}/products/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const product = mockData.products.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json(
        { success: false, message: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: product,
    });
  }),

  http.post(`${API_BASE}/products`, async ({ request }) => {
    await delay(500);
    const body = await request.json() as any;
    
    const newProduct = {
      id: String(mockData.products.length + 1),
      ...body,
      createdAt: new Date().toISOString(),
    };

    mockData.products.push(newProduct);

    return HttpResponse.json({
      success: true,
      data: newProduct,
      message: 'Ürün başarıyla eklendi',
    });
  }),

  http.put(`${API_BASE}/products/:id`, async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const body = await request.json() as any;
    
    const index = mockData.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    mockData.products[index] = {
      ...mockData.products[index],
      ...body,
    };

    return HttpResponse.json({
      success: true,
      data: mockData.products[index],
      message: 'Ürün başarıyla güncellendi',
    });
  }),

  http.delete(`${API_BASE}/products/:id`, async ({ params }) => {
    await delay(500);
    const { id } = params;
    const index = mockData.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { success: false, message: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    mockData.products.splice(index, 1);

    return HttpResponse.json({
      success: true,
      message: 'Ürün başarıyla silindi',
    });
  }),

  // Orders endpoints
  http.get(`${API_BASE}/orders`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || '';
    const limit = url.searchParams.get('limit');

    console.log('[MSW Orders] Status:', status, 'Limit:', limit);

    let filtered = mockData.orders;

    if (status && status !== 'Tümü') {
      filtered = filtered.filter((o) => o.status === status);
      console.log('[MSW Orders] After status filter:', filtered.length, 'for status:', status);
    }

    // Sort by date descending
    filtered = [...filtered].sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    if (limit) {
      filtered = filtered.slice(0, parseInt(limit));
      console.log('[MSW Orders] After limit:', filtered.length);
    }

    console.log('[MSW Orders] Returning', filtered.length, 'orders');

    return HttpResponse.json({
      success: true,
      data: filtered,
    });
  }),

  http.get(`${API_BASE}/orders/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const order = mockData.orders.find((o) => o.id === id);

    if (!order) {
      return HttpResponse.json(
        { success: false, message: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: order,
    });
  }),

  // Categories endpoint (derived from products)
  http.get(`${API_BASE}/categories`, async () => {
    await delay(200);
    const categories = ['Tümü', ...new Set(mockData.products.map((p) => p.category))];
    
    return HttpResponse.json({
      success: true,
      data: categories,
    });
  }),
];
