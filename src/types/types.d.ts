interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    category?: string;
    description?: string;
    pictures: {
      data: {
        id: number;
        attributes: {
          url: string;
        };
      }[];
    };
  };
}

interface CartProduct {
  id: number;
  name: string;
  picture: string;
  price: number;
  count: number;
}

interface ProductPriceRange {
  index: number;
  min: number;
  max: number;
}

interface ProductCategory {
  label: string;
  value: string;
}

interface ProductSortOption {
  label: string;
  field: string;
  type: "asc" | "desc";
}

interface Meta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

interface IShippingAddress {
  id?: number;
  street: string;
  local: string;
  city: string;
  postal: string;
  firstName: string;
  lastName: string;
  phone: string;
  main: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  firstName: string;
  lastName: string;
}

interface ICredential {
  identifier: string;
  password: string;
}

interface ISignUpCredential {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface DeliveryMethod {
  id: number;
  text: string;
  name: string;
  price: string;
}

interface PaymentMethod {
  id: number;
  text: string;
  name: string;
  icon: string;
}

interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  total: number;
  status:
    | "awaiting"
    | "paid"
    | "fulfilling"
    | "transport"
    | "delivered"
    | "cancelled";
  delivery: string;
  payment: string;
  ordered: {
    id: number;
    count: number;
    product: {
      id: number;
      name: string;
      price: number;
      category: string;
      pictures: {
        id: number;
        url: string;
      }[];
    };
  }[];
}

interface SEO {
  metaTitle: string;
  metaDescription: string;
  [key: string]: string;
}

interface PageSectionData {
  id: number;
  __component: string;
  header: string;
  [key: string]: any;
}
