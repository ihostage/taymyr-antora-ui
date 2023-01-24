import { spawn, SpawnOptions } from 'node:child_process'

export const spawnCommand = (commandStr: string, options?: SpawnOptions) => {
  const [command, ...args] = commandStr.split(' ')

  if (!command) return Promise.reject()

  return new Promise((resolve, reject) => {
    const spawnedProcess = spawn(command, args, {
      shell: true,
      stdio: 'inherit',
      env: { FORCE_COLOR: 'true', ...process.env },
      ...options,
    })

    spawnedProcess.stdout?.on('data', data => {
      console.log(data.toString())
    })

    spawnedProcess?.on('close', code => {
      if (code === 1) {
        //eslint-disable-next-line
                reject()
      }

      resolve(null)
    })
  })
}
