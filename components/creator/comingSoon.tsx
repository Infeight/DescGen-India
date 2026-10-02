export default function ComingSoon({
  title,
}: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

      <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
        Coming Soon
      </div>

      <h2 className="mt-6 text-3xl font-bold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-gray-400">
        This feature is currently
        being built with our
        founding creators.
      </p>

    </div>
  );
}