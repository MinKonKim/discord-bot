export const logger = {
  info: (message: string) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`)
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`)
    if (error) {
      console.error(error.stack)
    }
  },
}
