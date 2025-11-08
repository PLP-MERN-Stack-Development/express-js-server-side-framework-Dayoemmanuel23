const request = require('supertest');
const app = require('../server');

describe('GET /api/products/stats', () => {
  test('returns stats object with totals, average price, and stock counts', async () => {
    const res = await request(app).get('/api/products/stats').expect(200);

    expect(res.body).toHaveProperty('totalProducts');
    expect(res.body).toHaveProperty('stats');
    expect(res.body).toHaveProperty('averagePrice');
    expect(res.body).toHaveProperty('inStockCount');
    expect(res.body).toHaveProperty('outOfStockCount');
    expect(res.body).toHaveProperty('averagePriceByCategory');

    // Based on the in-memory products in routes/products.js
    expect(res.body.totalProducts).toBe(5);
    expect(res.body.stats).toMatchObject({
      Electronics: 2,
      Audio: 1,
      Fashion: 1,
      Accessories: 1,
    });

    // average price = (1200 + 200 + 900 + 80 + 150) / 5 = 506
    expect(res.body.averagePrice).toBeCloseTo(506);
    expect(res.body.inStockCount).toBeGreaterThanOrEqual(0);
    expect(res.body.outOfStockCount).toBeGreaterThanOrEqual(0);

    // Check averagePriceByCategory keys
    expect(res.body.averagePriceByCategory).toHaveProperty('Electronics');
    expect(res.body.averagePriceByCategory).toHaveProperty('Audio');
  });
});
