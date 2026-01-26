export interface Address {
  id: string;
  title: string;
  street: string;
  district: string;
  city: string;
  interior?: string;
  postalCode?: string;
  isDefault: boolean;
}
