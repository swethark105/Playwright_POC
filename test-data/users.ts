// Public demo accounts published on the SauceDemo login page.
// Override the password with SAUCE_PASSWORD if it ever changes.
const password = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password },
  lockedOut: { username: 'locked_out_user', password },
} as const;

export type User = (typeof users)[keyof typeof users];

export const checkoutCustomer = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '02021',
} as const;
