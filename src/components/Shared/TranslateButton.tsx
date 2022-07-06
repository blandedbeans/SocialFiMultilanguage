import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import i18n from '../../i18n'

//import common_en from '../../translations/en/common.json'
//import common_zhCN from '../../translations/zh-CN/common.json'
export default function TranslateButton() {
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    console.log(i18n.language)
  }
  const { t } = useTranslation('common')
  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            className={clsx(
              'w-full text-left px-2 md:px-3 py-1 rounded-md font-black cursor-pointer text-sm tracking-wide',
              {
                'text-black dark:text-white bg-gray-200 dark:bg-gray-800': open,
                'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
                  !open
              }
            )}
          >
            {t('Change Language')}
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute py-1 mt-2 w-52 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
            >
              <Menu.Item as="div" onClick={() => changeLanguage('en')}>
                <div className="flex items-center space-x-1.5">English</div>
              </Menu.Item>

              <Menu.Item as="div" onClick={() => changeLanguage('zhCN')}>
                <div className="flex items-center space-x-1.5">ZhongWen</div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
