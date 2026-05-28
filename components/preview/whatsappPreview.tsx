interface Props {
  image?: string | null;

  description: string;
}

export default function WhatsAppPreview({
  image,
  description,
}: Props) {
  return (
    <div className="mx-auto max-w-md my-8 rounded-[32px] bg-[#0b141a] p-5">
      
      <div className="rounded-3xl bg-[#202c33] p-4 shadow-lg">
        
        {image ? (
          <img
            src={image}
            alt="preview"
            className="mb-4 rounded-2xl"
          />
        ) : (
          <div className="mb-4 flex h-48 items-center justify-center rounded-2xl bg-white/5 text-sm text-gray-500">
            No Image Uploaded
          </div>
        )}

        <p className="whitespace-pre-wrap text-sm leading-7 text-white">
          {description}
        </p>

        <p className="mt-3 text-right text-[11px] text-gray-400">
          11:42 PM
        </p>
      </div>
    </div>
  );
}