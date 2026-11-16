export type Supplier = {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
}

export const MIN_SUPPLIER_NAME_LENGTH = 2
export const MAX_SUPPLIER_NAME_LENGTH = 60
export const MIN_CONTACT_PERSON_LENGTH = 2
export const MAX_CONTACT_PERSON_LENGTH = 60
export const MIN_PHONE_DIGITS = 7
export const MAX_PHONE_LENGTH = 20
export const MAX_EMAIL_LENGTH = 254
export const MIN_ADDRESS_LENGTH = 5
export const MAX_ADDRESS_LENGTH = 160

export const suppliersSeed: Supplier[] = [
  {
    id: 's1',
    name: 'Benguet Highland Growers',
    contactPerson: 'Maria Santos',
    phone: '+63 917 555 0142',
    email: 'orders@highlandgrowers.example.com',
    address: 'Km 5, La Trinidad, Benguet'
  },
  {
    id: 's2',
    name: 'Metro Fruit Supply',
    contactPerson: 'Jose Ramirez',
    phone: '+63 918 555 0198',
    email: 'sales@metrofruit.example.com',
    address: '124 Divisoria Market, Manila'
  },
  {
    id: 's3',
    name: 'Davao Tropical Produce',
    contactPerson: 'Andrea Lim',
    phone: '+63 920 555 0173',
    email: 'hello@davaotropical.example.com',
    address: '88 Bankerohan, Davao City'
  },
  {
    id: 's4',
    name: 'Batangas Citrus Trading',
    contactPerson: 'Ramon Dela Cruz',
    phone: '+63 915 555 0165',
    email: 'orders@batangascitrus.example.com',
    address: 'Poblacion, Batangas City'
  },
  {
    id: 's5',
    name: 'Laguna Berry Farms',
    contactPerson: 'Sofia Reyes',
    phone: '+63 926 555 0184',
    email: 'sofia@lagunaberries.example.com',
    address: 'Los Baños, Laguna'
  },
  {
    id: 's6',
    name: 'Cordillera Apple Company',
    contactPerson: 'Daniel Bautista',
    phone: '+63 927 555 0119',
    email: 'supply@cordilleraapple.example.com',
    address: 'Buguias, Benguet'
  },
  {
    id: 's7',
    name: 'Visayas Banana Exchange',
    contactPerson: 'Grace Villanueva',
    phone: '+63 919 555 0126',
    email: 'grace@visayasbanana.example.com',
    address: 'Bacolod City, Negros Occidental'
  }
]
