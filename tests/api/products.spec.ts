import { test, expect } from '@playwright/test';

test('GET product returns the requested product', async ({ request }) => {
  const response = await request.get('/products/1');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const product = await response.json();

  expect(product.id).toBe(1);
  expect(typeof product.title).toBe('string');
  expect(product.title.trim().length).toBeGreaterThan(0);
  expect(typeof product.price).toBe('number');
  expect(product.price).toBeGreaterThanOrEqual(0);
});

test('GET products respects pagination parameters', async ({ request }) => {
  const response = await request.get('/products', {
    params: {
      limit: 5,
      skip: 5,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products).toHaveLength(5);
  expect(body.limit).toBe(5);
  expect(body.skip).toBe(5);
  expect(body.total).toBeGreaterThanOrEqual(10);
});