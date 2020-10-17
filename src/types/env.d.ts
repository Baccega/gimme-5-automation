declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      GIMME_5_USERNAME: string
      GIMME_5_PASSWORD: string
      TELEGRAM_TOKEN: string
      TELEGRAM_USER_ID: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
