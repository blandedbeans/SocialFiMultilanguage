import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { NextLink } from './MenuItems'

export default function ForNonprofits() {
  const { t } = useTranslation('common')
  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx(
              'w-full text-left px-1 md:px-1 py-1 rounded-md font-black cursor-pointer text-xs tracking-wide',
              {
                'text-black dark:text-white bg-gray-200 dark:bg-gray-800': open,
                'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
                  !open
              }
            )}
          >
            {t('For nonprofits')}
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition fade-in duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition fade-out duration-75"
            leaveFrom="transform opacity-0 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute py-1 mt-2 w-52 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
            >
              <Menu.Item
                as={NextLink}
                href="/acceptingcrypto"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <div>{t('Accepting Crypto')}</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as={NextLink}
                href="/whychoose"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <div>{t('Why Choose Crypto')}</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as={NextLink}
                href="/support"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <div>{t('Support For Organizations')}</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as={NextLink}
                href="/resources"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <div>{t('Other Crypto Resources')}</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as={NextLink}
                href="/clientstories"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <div>{t('Client Stories')}</div>
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
