declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // NODE_ENV?: 'development' | 'production';
      GIMMI_5_USERNAME: string;
      GIMMI_5_PASSWORD: string;
      TELEGRAM_TOKEN: string;
      TELEGRAM_USER_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}