const mode = process.env.NODE_ENV

export const Env = {
  isDev: mode === 'development',
  isProd: mode === 'production',
  cwd: process.cwd(),
}
