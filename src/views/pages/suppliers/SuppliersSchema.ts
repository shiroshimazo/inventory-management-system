import { z } from 'zod'
import {
  MIN_SUPPLIER_NAME_LENGTH,
  MAX_SUPPLIER_NAME_LENGTH,
  MIN_CONTACT_PERSON_LENGTH,
  MAX_CONTACT_PERSON_LENGTH,
  MIN_PHONE_DIGITS,
  MAX_PHONE_LENGTH,
  MAX_EMAIL_LENGTH,
  MIN_ADDRESS_LENGTH,
  MAX_ADDRESS_LENGTH,
  type Supplier
} from './SuppliersData.ts'

// Partial values are allowed while typing; the schema checks completed values.
export const supplierInputPatterns = {
  name: /^[\p{L}\p{M}\p{N} .,&'()/-]*$/u,
  contactPerson: /^[\p{L}\p{M} .'-]*$/u,
  phone: /^\+?[0-9 ()-]*$/,
  email: /^\S*$/u,
  address: /^[\p{L}\p{M}\p{N} .,#/'()-]*$/u
}

export function createSupplierSchema(suppliers: Supplier[]) {
  return z.object({
    name: z
      .string()
      .trim()
      .refine(
        value =>
          value.length >= MIN_SUPPLIER_NAME_LENGTH &&
          value.length <= MAX_SUPPLIER_NAME_LENGTH &&
          /\p{L}/u.test(value) &&
          supplierInputPatterns.name.test(value),
        'Use 2-60 characters with a letter.'
      )
      .refine(
        value => !suppliers.some(supplier => supplier.name.trim().toLowerCase() === value.toLowerCase()),
        'This supplier name is already used.'
      ),
    contactPerson: z
      .string()
      .trim()
      .refine(
        value =>
          value.length >= MIN_CONTACT_PERSON_LENGTH &&
          value.length <= MAX_CONTACT_PERSON_LENGTH &&
          /\p{L}/u.test(value) &&
          supplierInputPatterns.contactPerson.test(value),
        'Use 2-60 letters, spaces, periods, hyphens or apostrophes.'
      ),
    phone: z
      .string()
      .trim()
      .refine(
        value =>
          value.length <= MAX_PHONE_LENGTH &&
          value.replace(/\D/g, '').length >= MIN_PHONE_DIGITS &&
          supplierInputPatterns.phone.test(value),
        'Enter a phone number with 7-20 digits.'
      ),
    email: z
      .string()
      .trim()
      .max(MAX_EMAIL_LENGTH, 'Enter a valid email, like orders@example.com.')
      .pipe(z.email('Enter a valid email, like orders@example.com.')),
    address: z
      .string()
      .trim()
      .refine(
        value =>
          value.length >= MIN_ADDRESS_LENGTH &&
          value.length <= MAX_ADDRESS_LENGTH &&
          /\p{L}/u.test(value) &&
          supplierInputPatterns.address.test(value),
        'Enter an address of 5-160 characters.'
      )
  })
}

export type SupplierDraft = z.infer<ReturnType<typeof createSupplierSchema>>
export const supplierFieldLabels = {
  name: 'Supplier name',
  contactPerson: 'Contact person',
  phone: 'Phone',
  email: 'Email',
  address: 'Address'
}
export const supplierFieldPlaceholders = {
  name: 'Highland Fruit Growers',
  contactPerson: 'Maria Santos',
  phone: '+63 917 555 0142',
  email: 'orders@example.com',
  address: '123 Market Street, Manila'
}
