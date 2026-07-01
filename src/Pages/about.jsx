import hero from '../../public/about.png';

const About = () => {
  return (
    <section className="container mx-auto px-6 py-16">
      {/* Header */}
      <h1 className="text-center text-3xl md:text-4xl font-bold mb-16 text-gray-800 tracking-wide">
        <span className="border-b-4 border-red-300 pb-2">OUR HISTORY</span>
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Image Section - Fixed size issue */}
        <div className="w-full md:w-1/2">
          <img
            src={hero}
            alt="Lumière Perfume Story"
            className="w-full h-[400px] md:h-[550px] object-cover rounded-2xl shadow-xl transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Text Section - Better readability */}
        <div className="w-full md:w-1/2 relative p-8">
          {/* Decorative Corner Frames */}
          <div className="absolute top-0 left-0 h-16 w-16 border-t-4 border-l-4 border-red-300 rounded-tl-xl" />
          <div className="absolute bottom-0 right-0 h-16 w-16 border-b-4 border-r-4 border-red-300 rounded-br-xl" />

          <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
            <p>
              At Lumière Perfume, we believe fragrance is more than a scent—it's a reflection of your personality, emotions, and unforgettable moments. Inspired by the French word "Lumière," meaning light, our brand is dedicated to illuminating confidence, elegance, and individuality through every fragrance we create.
            </p>
            <p>
              Our carefully crafted perfumes blend premium ingredients with timeless artistry to deliver long-lasting, captivating scents that leave a lasting impression. Whether you seek a fresh everyday fragrance, a bold signature scent, or a luxurious gift, Lumière offers a collection designed to complement every mood and occasion.
            </p>
            <p>
              We are committed to quality, sophistication, and authenticity. Every bottle represents our passion for creating fragrances that inspire confidence, evoke memories, and celebrate the beauty of self-expression.
            </p>
            <p className="font-semibold italic text-gray-800">
              Lumière Perfume – Illuminate Your Presence. ✨
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;