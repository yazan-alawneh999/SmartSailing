export interface OrderProduct {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderLocation {
  streetAddress2: string;
  buildingNumber: number;
  latitude: number;
  longitude: number;
}

export interface OrderContact {
  contactName: string;
  contactValue: string;
}

export interface Order {
  storeId: number;
  orderProducts: OrderProduct[];
  orderLocation: OrderLocation;
  orderContacts: OrderContact[];
}
