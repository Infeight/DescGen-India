interface Props {
  image?: string | null;

  description: string;
}

export default function InstagramPreview({
  image,
  description,
}: Props) {
  return (
    <div className="mx-auto max-w-sm my-8 overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl">
      
      {/* Top */}
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500" />

        <div>
          <p className="text-sm font-semibold text-white">
            descgen.india
          </p>

          <p className="text-xs text-gray-500">
            Sponsored
          </p>
        </div>
      </div>

      {/* Image */}
      {image ? (
        <img
          src={image}
          alt="preview"
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="flex aspect-square items-center justify-center bg-white/5 text-sm text-gray-500">
          No Image Uploaded
        </div>
      )}

      <div className="flex items-center justify-between px-4 pt-3 text-white">
  <div className="flex items-center gap-4 text-lg">
    <span>♡</span>
    <span>💬</span>
    <span>➤</span>
  </div>

  <span>🔖</span>
</div>

<p className="px-4 pt-2 text-sm font-medium text-white">
  2,184 likes
</p>

      {/* Caption */}
      <div className="p-4">
        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}