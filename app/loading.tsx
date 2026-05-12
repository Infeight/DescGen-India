export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-5">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-fuchsia-500 border-t-cyan-400" />

        <p className="text-sm text-gray-400">
          Loading workspace...
        </p>
      </div>
    </div>
  );
}