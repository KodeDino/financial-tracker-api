declare global {
  namespace Express {
    interface User {
      id: string;
      google_id: string;
      email: string;
      name?: string;
      picture?: string;
    }
  }
}

export {};
