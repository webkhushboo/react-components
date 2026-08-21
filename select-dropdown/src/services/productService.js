const products = [
  {
    id: 1,
    productName: 'One plus',
    category: 'Mobile',
    visible: true,
  },
  {
    id: 2,
    productName: 'iphone',
    category: 'Mobile',
    visible: true,
  },
  {
    id: 3,
    productName: 'Tablet',
    category: 'tablet',
    visible: true,
  },
  {
    id: 4,
    productName: 'Mcbook',
    category: 'laptop',
    visible: true,
  },
];

export async function getAllProducts() {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Product details not found');
  }
  return products;
}
