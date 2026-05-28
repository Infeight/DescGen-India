interface Props {
  image?: string | null;

  description: string;
    price?: string;
}

export default function FlipkartPreview({
  image,
  description,
    price
}: Props) {
  return (
    <div className="mx-auto max-w-4xl my-8 overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl">
      
      <div className="grid gap-6 p-6 md:grid-cols-[280px_1fr]">
        
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {image ? (
            <img
              src={image}
              alt="preview"
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-sm text-gray-400">
              No Image Uploaded
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          
          {/* Sponsored */}
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-600">
            Assured Seller
          </p>

          {/* Title */}
          <h2 className="text-2xl font-medium leading-9 text-gray-900">
            Trending Product Listing
          </h2>

          {/* Ratings */}
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
              4.4 ★
            </div>

            <span className="text-sm text-gray-500">
              8,421 Ratings & Reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold text-gray-900">
                {price ? `₹${price}` : "₹499"}
            </span>

            <span className="text-lg text-gray-400 line-through">
              ₹1299
            </span>

            <span className="text-lg font-medium text-emerald-600">
              61% off
            </span>
          </div>

          {/* Offers */}
          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-700">
              Bank Offer
            </p>

            <p className="mt-1 text-sm text-gray-700">
              Extra ₹50 off on UPI payments
            </p>
          </div>

          <div className="mt-3 text-sm text-gray-600">
  Or Pay ₹449 with SuperCoins
</div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Product Highlights
            </h3>

            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
              {description}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-orange-400">
              Add to Cart
            </button>

            <button className="w-full rounded-xl bg-yellow-400 px-6 py-3 text-sm font-medium text-black transition hover:bg-yellow-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}