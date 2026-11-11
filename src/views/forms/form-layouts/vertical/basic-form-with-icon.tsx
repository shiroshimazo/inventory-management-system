// Third-party Imports
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Building02Icon, MapIcon, MapPinIcon, PhoneIcon, SignpostIcon, UserIcon } from '@hugeicons/core-free-icons'

// Component Imports
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

const BasicFormWithIcon = () => {
  return (
    <form>
      <FieldGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-first-name'>First Name</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={UserIcon} className='size-4' />
              <span className='sr-only'>First Name</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-first-name' placeholder='John' />
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-last-name'>Last Name</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={UserIcon} className='size-4' />
              <span className='sr-only'>Last Name</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-last-name' placeholder='Doe' />
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-mobile'>Mobile</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={PhoneIcon} className='size-4' />
              <span className='sr-only'>Mobile</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-mobile' type='tel' placeholder='+1 (555) 123-4567' />
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-pincode'>Pincode</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={MapPinIcon} className='size-4' />
              <span className='sr-only'>Pincode</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-pincode' placeholder='Postal Code' />
          </InputGroup>
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='basic-with-icons-address'>Address</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={MapPinIcon} className='size-4' />
              <span className='sr-only'>Address</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-address' placeholder='123 Main St' />
          </InputGroup>
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='basic-with-icons-landmark'>Landmark</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={SignpostIcon} className='size-4' />
              <span className='sr-only'>Landmark</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-landmark' placeholder='Near Central Park, New York' />
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-city'>City</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={Building02Icon} className='size-4' />
              <span className='sr-only'>City</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-city' placeholder='New York' />
          </InputGroup>
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='basic-with-icons-state'>State</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon icon={MapIcon} className='size-4' />
              <span className='sr-only'>State</span>
            </InputGroupAddon>
            <InputGroupInput id='basic-with-icons-state' placeholder='NY' />
          </InputGroup>
        </Field>
      </FieldGroup>

      <div className='mt-8'>
        <Button type='submit'>Save Information</Button>
      </div>
    </form>
  )
}

export default BasicFormWithIcon
