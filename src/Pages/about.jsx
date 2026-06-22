//import hero from "C:/my-app/FRONTEND/public/about.jpg";
import hero from '../../public/about.jpg'
const About=()=> {
  return (
    <>
      <h1 className="flex justify-center relative  p-6 m-6 text-3xl font-bold mb-4 text-gray-800 tracking-wide">
        <span className="underline m-3 underline-offset-8 decoration-4 decoration-red-300 ">
          OUR HISTORY{" "}
        </span>
      </h1>

      <div className="flex items-center min-h-screen">
        <div className="flex w-1/2 justify-center">
          <img src={hero} alt=" hero" className="w-140 h-full object-cover" />
        </div>
        <div className="w-1/2 flex flex-col justify-center px-16 py-20 text-gray-600">
          <p className="text-center items-center object-cover leading-relaxed">
            <span className="relative px-2 py-2">
              At Lumière Perfume, we believe fragrance is more than a scent—it's a reflection of your personality, emotions, and unforgettable moments. Inspired by the French word "Lumière," meaning light, our brand is dedicated to illuminating confidence, elegance, and individuality through every fragrance we create.

Our carefully crafted perfumes blend premium ingredients with timeless artistry to deliver long-lasting, captivating scents that leave a lasting impression. Whether you seek a fresh everyday fragrance, a bold signature scent, or a luxurious gift, Lumière offers a collection designed to complement every mood and occasion.

We are committed to quality, sophistication, and authenticity. Every bottle represents our passion for creating fragrances that inspire confidence, evoke memories, and celebrate the beauty of self-expression.

At Lumière, we don't just create perfumes—we create experiences that shine with elegance and leave a trail of unforgettable moments.

Lumière Perfume – Illuminate Your Presence. ✨
              <span className="absolute -top-3 -left-3  h-12  w-12 border-t-2 border-l-2  border-red-300  "></span>
             <span className="absolute right-19  -bottom-6   h-10  w-10 border-b-2 border-r-2  border-red-300  "></span>

           
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
