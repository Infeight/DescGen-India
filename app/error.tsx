"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <div className="max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl">
        <h1 className="text-5xl font-bold text-white">
          Something went wrong
        </h1>

        <p className="mt-4 text-gray-400">
          An unexpected error occurred.
          Please try again.
        </p>

        <button
          onClick={reset}
          className="mt-8 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}