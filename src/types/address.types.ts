export interface Address {
  id: string;
  title: string;
  street: string;
  district: string;
  city: string;
  interior?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}
