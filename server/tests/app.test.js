const request = require('supertest');

describe('GET /api/health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(global.__TEST_APP__).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
