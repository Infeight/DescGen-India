interface Props {
  image?: string | null;

  description: string;
    price?: string;
}

export default function MyntraPreview({
  image,
  description,
    price
}: Props) {
  return (
    <div className="mx-auto max-w-md my-8 relative overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl">
      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow">
  ♡
</div>
      {/* Image */}
      {image ? (
        <img
          src={image}
          alt="preview"
          className="aspect-[4/5] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[4/5] items-center justify-center bg-gray-100 text-sm text-gray-400">
          No Image Uploaded
        </div>
      )}

      {/* Content */}
      <div className="space-y-4 p-5">
        
        {/* Brand */}
        <div>
          <p className="text-lg font-bold uppercase tracking-wide text-gray-900">
            Brand Name
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Premium Fashion Collection
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-gray-900">
            {price ? `₹${price}` : "₹1499"}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ₹2999
          </span>

          <span className="text-sm font-medium text-orange-500">
            50% OFF
          </span>
        </div>

        {/* Ratings */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700">
          ★ 4.5 | 3.2k Ratings
        </div>

        {/* Description */}
        <div className="border-t border-gray-100 pt-4">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
            {description}
          </p>
        </div>

        {/* CTA */}
        <button className="w-full rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
          Wishlist
        </button>
      </div>
    </div>
  );
}