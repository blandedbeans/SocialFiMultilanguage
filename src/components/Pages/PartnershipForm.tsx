import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import SettingsHelper from '@components/Shared/SettingsHelper'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { TextArea } from '@components/UI/TextArea'
import SEO from '@components/utils/SEO'
import { PencilAltIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import trackEvent from '@lib/trackEvent'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useState } from 'react'
import { object, string } from 'zod'

const PartnershipForm: FC = () => {
  const { push } = useRouter()
  const newContactSchema = object({
    name: string()
      .max(260, {
        message: 'Name should not exceed 260 characters'
      })
      .nonempty(),
    email: string()
      .max(1000, {
        message: 'Email should not exceed 1000 characters'
      })
      .nonempty(),
    organizationname: string()
      .max(1000, {
        message: 'Organization name should not exceed 1000 characters'
      })
      .nonempty(),
    websiteurl: string()
      .max(1000, {
        message: 'Website URL should not exceed 1000 characters'
      })
      .nonempty(),
    country: string()
      .max(1000, {
        message: 'Country should not exceed 1000 characters'
      })
      .nonempty(),
    category: string()
      .max(1000, {
        message: 'Category should not exceed 1000 characters'
      })
      .nonempty(),
    reason: string()
      .max(1000, {
        message: 'Reason should not exceed 1000 characters'
      })
      .nonempty(),
    message: string()
      .max(1000, {
        message: 'Message should not exceed 1000 characters'
      })
      .nonempty()
  })

  const form = useZodForm({
    schema: newContactSchema
  })
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const selectCountryHandler = (value: React.SetStateAction<string>) =>
    setSelectedCountry(value)

  const selectCategoryHandler = (value: React.SetStateAction<string>) =>
    setSelectedCategory(value)

  const selectReasonHandler = (value: React.SetStateAction<string>) =>
    setSelectedReason(value)

  // Have to register the languages you want to use
  countries.registerLocale(enLocale)

  // Returns an object not a list
  const countryObj = countries.getNames('en', { select: 'official' })

  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: key
    }
  })

  return (
    <GridLayout>
      <SEO title="Apply for a Partnership • BCharity" />
      <GridItemFour>
        <SettingsHelper
          heading="Become a BCharity Partner"
          description="Fill out this form to become a parter with BCharity"
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {false ? (
            <EmptyState
              message={<span>Form Submitted!</span>}
              icon={<CheckCircleIcon className="w-14 h-14 text-green-500" />}
              hideCard
            />
          ) : (
            <Form
              form={form}
              className="p-5 space-y-4"
              onSubmit={({
                name,
                email,
                organizationname,
                websiteurl,
                country,
                category,
                reason,
                message
              }) => {
                console.log(name)
                console.log(email)
                console.log(organizationname)
                console.log(websiteurl)
                console.log(country)
                console.log(category)
                console.log(reason)
                console.log(message)
                trackEvent('contact')
                push('/')
              }}
            >
              <Input label="Name" placeholder="" {...form.register('name')} />
              <Input label="Email" placeholder="" {...form.register('email')} />
              <Input
                label="Organization Name"
                placeholder=""
                {...form.register('organizationname')}
              />
              <Input
                label="Website URL"
                placeholder=""
                {...form.register('websiteurl')}
              />
              <div>
                <div className="label">Select Country</div>
                <select
                  className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                  value={selectedCountry}
                  {...form.register('country')}
                  onChange={(e) => selectCountryHandler(e.target.value)}
                >
                  {!!countryArr?.length &&
                    countryArr.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <div className="label">Select Category</div>
                <select
                  className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                  value={selectedCategory}
                  {...form.register('category')}
                  onChange={(e) => selectCategoryHandler(e.target.value)}
                >
                  <option>Nonprofit</option>
                  <option>Corporate Partner</option>
                  <option>Media Partner</option>
                  <option>Influencer</option>
                  <option>Donor</option>
                  <option>Financial Service</option>
                  <option>Crypto Project</option>
                  <option>NFT Project or Artist</option>
                  <option>Crypto Exchange</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <div className="label">How did you hear about us?</div>
                <select
                  className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                  value={selectedReason}
                  {...form.register('reason')}
                  onChange={(e) => selectReasonHandler(e.target.value)}
                >
                  <option>Search Engine</option>
                  <option>Social Media</option>
                  <option>Advertising</option>
                  <option>News</option>
                  <option>Newsletter</option>
                  <option>Online Event</option>
                  <option>In-person Event</option>
                  <option>Word of Mouth</option>
                </select>
              </div>
              <TextArea label="Message" {...form.register('message')} />
              <div className="ml-auto">
                <Button
                  type="submit"
                  icon={<PencilAltIcon className="w-4 h-4" />}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default PartnershipForm
