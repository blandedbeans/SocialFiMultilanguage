const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const { withSentryConfig } = require('@sentry/nextjs')
const withTM = require('next-transpile-modules')(['plyr-react'])

const moduleExports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    maximumFileSizeToCacheInBytes: 5000000,
    runtimeCaching
  },
  reactStrictMode: process.env.NODE_ENV === 'production',
  maximumFileSizeToCacheInBytes: 5000000
})

const sentryWebpackPluginOptions = {
  silent: true
}

module.exports = withTM(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions)
)
