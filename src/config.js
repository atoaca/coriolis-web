export const coriolisUrl = process.env.CORIOLIS_URL || '/'

export const servicesUrl = {
  identity: `${coriolisUrl}identity/auth/tokens`,
  projects: `${coriolisUrl}identity/auth/projects`,
  users: `${coriolisUrl}identity/users`,
  endpoints: `${coriolisUrl}coriolis/endpoints`,
  coriolis: `${coriolisUrl}coriolis`,
  migrations: `${coriolisUrl}coriolis/migrations`,
  barbican: `${coriolisUrl}barbican`,
  openId: `${coriolisUrl}identity/OS-FEDERATION/identity_providers/google/protocols/openid/auth`,
}

export const useSecret = true // use secret_ref when creating and endpoint

export const requestPollTimeout = 5000

export const providerTypes = {
  TARGET_MIGRATION: 1,
  SOURCE_MIGRATION: 2,
  TARGET_REPLICA: 4,
  SOURCE_REPLICA: 8,
}

export const loginButtons = [
  // {
  //   name: 'Google',
  //   id: 'google',
  //   url: '',
  // },
]

export const env = {
  name: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isBrowser: typeof window !== 'undefined',
}

export const wizardConfig = {
  pages: [
    { id: 'type', title: 'New', breadcrumb: 'Type' },
    { id: 'source', title: 'Select your source cloud', breadcrumb: 'Source Cloud' },
    { id: 'target', title: 'Select your target cloud', breadcrumb: 'Target Cloud' },
    { id: 'vms', title: 'Select instances', breadcrumb: 'Select VMs' },
    { id: 'networks', title: 'Networks', breadcrumb: 'Networks' },
    { id: 'options', title: 'Options', breadcrumb: 'Options' },
    { id: 'schedule', title: 'Schedule', breadcrumb: 'Schedule' },
    { id: 'summary', title: 'Summary', breadcrumb: 'Summary' },
  ],
  instancesItemsPerPage: 6,
}

export const basename = process.env.PUBLIC_PATH
