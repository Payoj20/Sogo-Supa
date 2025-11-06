export type UserDoc = { 
    uid:string;
    email: string | null;
    name?: string | null;
    photoURL?: string | null;
    cart?: CartItem[];
    createdAt?: any;
    orders?: Order[];
};

export type Order = {
  id: string;
  items: CartItem[];
  date: string;
  deliveryDate: string;
  status: string;
};

export type CartItem = {
    productId: string;
    title: string;
    price: number;
    qty: number;
    image?: string;
}
