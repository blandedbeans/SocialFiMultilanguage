import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { Profile } from '@generated/types'
import { Menu, Transition } from '@headlessui/react'
import {
  ArrowCircleRightIcon,
  CogIcon,
  LogoutIcon,
  MoonIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SunIcon,
  SwitchHorizontalIcon,
  UserIcon
} from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import getAvatar from '@lib/getAvatar'
import isBeta from '@lib/isBeta'
import isStaff from '@lib/isStaff'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FC, Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GIT_COMMIT_SHA } from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { useDisconnect } from 'wagmi'

import Slug from '../Slug'
import TranslateButton from '../TranslateButton'
import Login from './Login'

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href}>
    <a {...rest}>{children}</a>
  </Link>
)

interface Props {
  pingData: {
    ping: string
  }
}

const MenuItems: FC<Props> = ({ pingData }) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const { theme, setTheme } = useTheme()
  const { disconnect } = useDisconnect()

  const { profiles } = useAppStore()
  const {
    isAuthenticated,
    currentUser,
    setCurrentUser,
    staffMode,
    setStaffMode
  } = useAppPersistStore()

  const toggleStaffMode = () => {
    setStaffMode(!staffMode)
  }
  const { t } = useTranslation('common')

  return isAuthenticated && currentUser ? (
    <>
      <TranslateButton />
      <Menu as="div">
        {({ open }) => (
          <>
            <Menu.Button
              as="img"
              src={getAvatar(currentUser)}
              className="w-8 h-8 rounded-full border cursor-pointer dark:border-gray-700/80"
              alt={currentUser?.handle}
            />
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
                className="absolute right-0 py-1 mt-2 w-48 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
              >
                <Menu.Item
                  as={NextLink}
                  href={`/u/${currentUser?.handle}`}
                  className={({ active }: { active: boolean }) =>
                    clsx({ 'dropdown-active': active }, 'menu-item')
                  }
                >
                  <div>{t('Logged in as')}</div>
                  <div className="truncate">
                    <Slug
                      className="font-bold"
                      slug={currentUser?.handle}
                      prefix="@"
                    />
                  </div>
                </Menu.Item>
                <div className="divider" />
                <Menu.Item
                  as={NextLink}
                  href={`/u/${currentUser?.handle}`}
                  className={({ active }: { active: boolean }) =>
                    clsx({ 'dropdown-active': active }, 'menu-item')
                  }
                >
                  <div className="flex items-center space-x-1.5">
                    <UserIcon className="w-4 h-4" />
                    <div>{t('Your Profile')}</div>
                  </div>
                </Menu.Item>
                <Menu.Item
                  as={NextLink}
                  href="/settings"
                  className={({ active }: { active: boolean }) =>
                    clsx({ 'dropdown-active': active }, 'menu-item')
                  }
                >
                  <div className="flex items-center space-x-1.5">
                    <CogIcon className="w-4 h-4" />
                    <div>{t('Settings')}</div>
                  </div>
                </Menu.Item>
                <Menu.Item
                  as="a"
                  onClick={() => {
                    setCurrentUser(null)
                    Cookies.remove('accessToken')
                    Cookies.remove('refreshToken')
                    localStorage.removeItem('bcharity.store')
                    if (disconnect) disconnect()
                  }}
                  className={({ active }: { active: boolean }) =>
                    clsx({ 'dropdown-active': active }, 'menu-item')
                  }
                >
                  <div className="flex items-center space-x-1.5">
                    <LogoutIcon className="w-4 h-4" />
                    <div>{t('Logout')}</div>
                  </div>
                </Menu.Item>
                {profiles?.length > 1 && (
                  <>
                    <div className="divider" />
                    <div className="overflow-auto m-2 max-h-36 no-scrollbar">
                      <div className="flex items-center px-4 pt-1 pb-2 space-x-1.5 text-sm font-bold text-gray-500">
                        <SwitchHorizontalIcon className="w-4 h-4" />
                        <div>{t('Switch')}</div>
                      </div>
                      {profiles.map((profile: Profile, index: number) => (
                        <div
                          key={profile?.id}
                          className="block text-sm text-gray-700 rounded-lg cursor-pointer dark:text-gray-200"
                        >
                          <button
                            type="button"
                            className="flex items-center py-1.5 px-4 space-x-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => {
                              setCurrentUser(profiles[index])
                            }}
                          >
                            {currentUser?.id === profile?.id && (
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            )}
                            <img
                              className="w-5 h-5 rounded-full border dark:border-gray-700/80"
                              height={20}
                              width={20}
                              src={getAvatar(profile)}
                              alt={profile?.handle}
                            />
                            <div className="truncate">{profile?.handle}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className="divider" />
                <Menu.Item
                  as="a"
                  onClick={() => {
                    setTheme(theme === 'light' ? 'dark' : 'light')
                  }}
                  className={({ active }: { active: boolean }) =>
                    clsx({ 'dropdown-active': active }, 'menu-item')
                  }
                >
                  <div className="flex items-center space-x-1.5">
                    {theme === 'light' ? (
                      <>
                        <MoonIcon className="w-4 h-4" />
                        <div>{t('Dark mode')}</div>
                      </>
                    ) : (
                      <>
                        <SunIcon className="w-4 h-4" />
                        <div>{t('Light mode')}</div>
                      </>
                    )}
                  </div>
                </Menu.Item>
                {currentUser && GIT_COMMIT_SHA && (
                  <>
                    <div className="divider" />
                    <div className="py-3 px-6 text-xs flex items-center space-x-2">
                      {pingData && (
                        <Tooltip content="Indexer Status" placement="top">
                          <div
                            className={clsx(
                              { 'bg-green-500': pingData?.ping === 'pong' },
                              { 'bg-red-500': pingData?.ping !== 'pong' },
                              'p-[4.5px] rounded-full animate-pulse'
                            )}
                          />
                        </Tooltip>
                      )}
                      <a
                        href={`https://gitlab.com/bcharity/bcharity/-/commit/${GIT_COMMIT_SHA}`}
                        className="font-mono"
                        title="Git commit SHA"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {GIT_COMMIT_SHA} {isBeta(currentUser) && '(beta)'}
                      </a>
                    </div>
                  </>
                )}
                {isStaff(currentUser?.id) && (
                  <>
                    <div className="divider" />
                    <Menu.Item
                      as="div"
                      onClick={toggleStaffMode}
                      className={({ active }: { active: boolean }) =>
                        clsx(
                          { 'bg-yellow-100 dark:bg-yellow-800': active },
                          'menu-item'
                        )
                      }
                    >
                      {staffMode ? (
                        <div className="flex items-center space-x-1.5">
                          <div>Disable staff mode</div>
                          <ShieldExclamationIcon className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <div>Enable staff mode</div>
                          <ShieldCheckIcon className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                    </Menu.Item>
                  </>
                )}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </>
  ) : (
    <>
      <Modal
        title="Login"
        icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand" />}
        show={showLoginModal}
        onClose={() => setShowLoginModal(!showLoginModal)}
      >
        <Login />
      </Modal>
      <TranslateButton />
      <Button
        icon={
          <img
            className="mr-0.5 w-4 h-4"
            height={16}
            width={16}
            src="/lens.png"
            alt="Lens Logo"
          />
        }
        onClick={() => {
          setShowLoginModal(!showLoginModal)
        }}
      >
        {t('Login')}
      </Button>
    </>
  )
}

export default MenuItems
