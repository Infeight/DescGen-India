interface Props {
  image?: string | null;

  description: string;
    price?: string;
}

export default function AmazonPreview({
  image,
  description,
    price
}: Props) {
  return (
    <div className="mx-auto max-w-4xl my-8 overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl">
      
      <div className="grid gap-6 p-6 md:grid-cols-[320px_1fr]">
        
        {/* Product Image */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
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

        {/* Product Content */}
        <div className="flex flex-col">
          
          {/* Title */}
          <h2 className="text-2xl font-medium leading-9 text-gray-900">
            Premium Product Listing
          </h2>

          {/* Ratings */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex text-orange-400">
              ★★★★★
            </div>

            <span className="text-sm text-blue-600">
              1,284 ratings
            </span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-semibold text-gray-900">
              {price ? `₹${price}` : "₹499"}
            </span>

            <span className="text-sm text-gray-400 line-through">
              ₹999
            </span>

            <span className="text-sm text-emerald-600">
              50% off
            </span>
          </div>

          {/* Delivery */}
          <p className="mt-3 text-sm text-gray-700">
            FREE delivery by Tomorrow
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
  ✓ In Stock
</div>

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
              About this item
            </h3>

            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
              {description}
            </p>
          </div>

          {/* Buy Button */}
          <button className="mt-6 w-full rounded-full bg-yellow-400 px-6 py-3 text-sm font-medium text-black transition hover:bg-yellow-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}