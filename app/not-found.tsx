import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <div className="max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl">
        <h1 className="text-6xl font-bold text-white">
          404
        </h1>

        <p className="mt-4 text-lg text-gray-400">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}