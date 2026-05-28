interface Props {
  image?: string | null;
  
  description: string;
    price?: string;
}

export default function MeeshoPreview({
  image,
  description,
  price
}: Props) {
  return (
    <div className="mx-auto my-8 max-w-sm overflow-hidden rounded-[28px] border border-pink-100 bg-white shadow-2xl">
      
      {/* Header */}
      <div className="border-b border-pink-100 bg-pink-50 p-4">
        <p className="text-sm font-semibold text-pink-600">
          Meesho Mall
        </p>
      </div>

      {/* Image */}
      {image ? (
        <img
          src={image}
          alt="preview"
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="flex aspect-square items-center justify-center bg-pink-50 text-sm text-gray-400">
          No Image Uploaded
        </div>
      )}

      {/* Content */}
      <div className="space-y-4 p-5">
        
        {/* Title */}
        <h2 className="line-clamp-2 text-lg font-medium leading-7 text-gray-900">
          Trendy Fashion Product
        </h2>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">
            {price ? `₹${price}` : "₹399"}
          </span>

          <span className="text-sm text-gray-400 line-through">
            ₹899
          </span>

          <span className="rounded bg-pink-100 px-2 py-1 text-xs font-medium text-pink-600">
            55% off
          </span>
        </div>

        {/* Delivery */}
        <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
          Free Delivery
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-pink-50 p-4">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
            {description}
          </p>
        </div>

        {/* Buttons */}
        <button className="w-full rounded-2xl bg-pink-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-pink-400">
          View Product
        </button>
      </div>
    </div>
  );
}