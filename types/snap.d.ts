// types/snap.d.ts
export {}

declare global {
  interface Window {
    snap: {
      pay: (token: string) => void
    }
  }
}
