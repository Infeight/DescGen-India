interface Props {
  image?: string | null;

  description: string;
}

export default function FacebookPreview({
  image,
  description,
}: Props) {
  return (
    <div className="mx-auto max-w-md my-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#111827] shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <div className="h-11 w-11 rounded-full bg-blue-500" />

        <div>
          <p className="text-sm font-semibold text-white">
            DescGen Seller
          </p>

          <p className="text-xs text-gray-400">
            Marketplace listing
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

      {/* Content */}
      <div className="space-y-3 p-5">
        
        {/* Fake price */}
        <p className="text-2xl font-bold text-white">
          ₹499
        </p>

        {/* Fake title */}
        <h3 className="line-clamp-2 text-lg font-semibold text-white">
          Premium Product Listing
        </h3>

        {/* Description */}
        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-300">
          {description}
        </p>

        {/* Footer */}
        <div className="pt-3 text-xs text-gray-500">
          Visakhapatnam, India
        </div>
      </div>
    </div>
  );
}