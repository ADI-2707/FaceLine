import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Server REST API Authentication Gates', () => {
  it('should return 401 Unauthorized for keys routes without auth header', async () => {
    const resUpload = await request(app).post('/api/keys/upload').send({});
    expect(resUpload.status).toBe(401);

    const resGetKeys = await request(app).get('/api/keys/user_123');
    expect(resGetKeys.status).toBe(401);
  });

  it('should return 401 Unauthorized for conversation routes without auth header', async () => {
    const resGetConvs = await request(app).get('/api/conversations');
    expect(resGetConvs.status).toBe(401);

    const resCreateConv = await request(app).post('/api/conversations').send({});
    expect(resCreateConv.status).toBe(401);
  });

  it('should return 401 Unauthorized for user routes without auth header', async () => {
    const resSearch = await request(app).get('/api/users/search?query=alice');
    expect(resSearch.status).toBe(401);

    const resProfile = await request(app).put('/api/users/profile').send({});
    expect(resProfile.status).toBe(401);
  });
});
