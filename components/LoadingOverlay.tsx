type LoadingOverlayProps = {
  message?: string
  isLoading: boolean
}

export default function LoadingOverlay({
  message,
  isLoading,
}: LoadingOverlayProps) {
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          {message && <p className="mt-4 text-white">{message}</p>}
        </div>
      )}
    </>
  )
}
