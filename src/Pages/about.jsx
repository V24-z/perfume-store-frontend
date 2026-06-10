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
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Reiciendis consequatur dolor accusamus hic dolorum debitis alias
              perspiciatis mollitia fugiat doloribus nam iure est explicabo quo
              molestias, eaque culpa voluptates! Ipsa minus dolore repudiandae
              commodi perferendis, architecto ut laboriosam facere molestias,
              magnam similique, aliquam illum velit corporis. In delectus illum
              earum consequatur repudiandae praesentium voluptatem? Quisquam
              voluptates ratione ullam sunt amet. Ipsam officiis dignissimos
              ullam numquam voluptatum.
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
