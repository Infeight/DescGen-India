const testimonials = [
  {
    name: "Sai",
    brand: "ecom.sai",
    image:
      "/ecomSai.jpeg",

    review:
      "We recently got new stock and were busy preparing listings, but I tried DescGen for one product and honestly it worked really well. The descriptions are generated based on the product features we provide, which makes listing much easier. Even though I couldn't explore everything yet, I genuinely think this will become a great tool for e-commerce operators.",
  },

  {
    name: "Girls Corner",
    brand: "Instagram Seller",
    image:
      "/girlsCorner.jpeg",

    review:
      "The caption generation is actually really good for Instagram selling. It would be even better with emojis and niche hashtags included automatically. Overall, the outputs already feel very useful for product posting and promotions.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Loved by Indian sellers
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Early feedback from sellers using DescGen India
            for ecommerce listings, captions, and marketplace
            content generation.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-fuchsia-500/20"
            >
              {/* Card Glow */}
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-500/10" />

              <div className="relative">
                {/* User */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-full border border-white/10 object-cover"
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.name}
                    </h3>

                    <p className="text-sm text-fuchsia-300">
                      {item.brand}
                    </p>
                  </div>
                </div>

                {/* Review */}
                <p className="mt-6 text-[15px] leading-8 text-gray-300">
                  “{item.review}”
                </p>

                {/* Bottom */}
                <div className="mt-8 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="text-lg text-yellow-400"
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}