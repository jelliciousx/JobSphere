import React from "react";
import { IoArrowForward } from "react-icons/io5";
import Button from "../components/Button/button";
import HomeHeroSection from "../assets/HomeHeroSection.png";
import HomeHeroSection2 from "../assets/HomeHeroSection2.jpg";
import HomeHeroSection4 from "../assets/HeroSection4.png";
import Jobs from "./Jobs";

const Home = () => {
  return (
    <>
      {/* Hero Section – full screen */}
      <div className="h-screen flex items-center overflow-hidden">
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat flex items-center relative"
          style={{ backgroundImage: `url(${HomeHeroSection})` }}
        >
          <div className="absolute inset-0"></div>

          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8 lg:py-0">
              <div className="flex flex-col lg:px-10 justify-center space-y-6 animate-fade-in-up">
                <div className="">
                  <h1 className="text-3xl sm:text-5xl lg:text-5xl font-[500] text-white sm:whitespace-nowrap">
                    Your Next Career Move
                  </h1>
                  <h2 className="text-3xl sm:text-5xl lg:text-5xl font-[500] text-white">
                    Starts Here
                  </h2>
                </div>
                <p className="text-base sm:text-lg lg:text-sm font-[300] text-gray-400 leading-tight">
                  Explore verified job openings, apply instantly, and take the
                  next step toward your professional growth
                </p>
                <div className="pt-2">
                  <Button
                    text="Apply Here"
                    background="bg-blue-600"
                    textcolor="text-white"
                    rightIcon={<IoArrowForward size={18} />}
                    onClick={() => (window.location.href = "/jobs")}
                    className="hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 w-auto px-8 h-12"
                  />
                </div>
              </div>
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section – exactly viewport height */}
      <section className="w-full h-screen px-4 sm:px-6 lg:px-8 bg-[var(--color-background)] ">
        <div className="max-w-7xl mx-auto h-full flex items-center py-6 sm:py-8 lg:py-10">
          {/* Added h-full to make card fill the flex container height */}
          <div className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-[#F8FAFC] border border-gray-100 flex flex-col lg:flex-row w-full h-full">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 px-6 sm:px-10 lg:px-16 py-12 lg:py-20 flex items-center">
              <div className="space-y-5 sm:space-y-6 max-w-lg">
                <div className="space-y-1">
                  <h2 className="text-[1.65rem] sm:text-3xl lg:font-[500] xl:text-[35px] font-bold text-gray-900 leading-[1.2]">
                    One of the Most Capable Overseas
                  </h2>
                  <h2 className="text-[1.65rem] sm:text-3xl lg:font-[500] xl:text-[35px] font-bold text-blue-500 leading-[1.2]">
                    Recruitment and Employment
                  </h2>
                  <h2 className="text-[1.65rem] sm:text-3xl lg:font-[500] xl:text-[35px] font-bold text-gray-900 leading-[1.2]">
                    Agencies in Pakistan
                  </h2>
                </div>
                <p className="text-sm sm:text-base lg:text-md text-gray-500 leading-relaxed max-w-md">
                  With the world changing from reliable to sustainable, many
                  projects are addressing this vision. Due to this, there is a
                  huge shortage of qualified talent around the globe. Many
                  companies are turning to overseas recruitment partners to find
                  perfect quality candidates for their positions.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => (window.location.href = "/about")}
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group text-sm sm:text-base"
                  >
                    See Details
                    <IoArrowForward
                      size={18}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image – now stretches full height on desktop */}
            <div className="relative w-full lg:w-1/2 h-[260px] sm:h-[340px] lg:h-full">
              <img
                src={HomeHeroSection2}
                alt="Professional recruitment consultation"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Apply for Jobs Section */}
      <section className="w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-6 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-white px-6 sm:px-12 lg:px-20 py-14 sm:py-18 lg:py-24 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex mb-6">
              <span className="bg-blue-200/70 text-blue-700 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full tracking-[0.25em] uppercase">
                Apply For Jobs
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] xl:text-[2.8rem] font-bold text-gray-900 leading-tight max-w-4xl">
              Apply for Your <span className="text-blue-500">Desired Job</span>{" "}
              in Three Simple Steps
            </h2>

            {/* Description */}
            <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-4xl">
              Provide your essential information, including your full name,
              email, and contact number. Add a short introduction about your
              skills, experience, and career goals so employers can understand
              your profile at a glance. Finally, upload your updated CV to help
              employers review your qualifications and connect with you more
              quickly.
            </p>

            {/* Button */}
            <div className="mt-8 sm:mt-10">
              <button
                onClick={() => (window.location.href = "/jobs")}
                className="inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-sm sm:text-base uppercase tracking-wide"
              >
                Apply Here
                <IoArrowForward
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Services Section */}

      <section className="w-full py-16  lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left Image */}
            <div className="w-full lg:w-5/12 relative h-[260px] sm:h-[340px] lg:h-[500px]">
              <img
                src={HomeHeroSection4}
                alt="Recruitment professionals"
                className="w-full h-full object-contain max-h-[500px] lg:max-h-none"
              />
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-7/12 space-y-5 sm:space-y-6">
              {/* Heading */}
              <h2 className="text-[1.65rem] sm:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] font-bold text-gray-900 leading-[1.2]">
                We Provide Best Recruitment Services For{" "}
                <span className="text-blue-500">Saudi Arabia</span> Companies
                From Pakistan
              </h2>

              {/* Paragraphs */}
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                We connect skilled and qualified professionals from Pakistan
                with top companies in Saudi Arabia. Our recruitment process is
                fast, transparent, and reliable—ensuring that candidates find
                the right opportunities and employers get the best talent. From
                screening to final selection, we manage everything with complete
                professionalism.
              </p>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                With a strong talent pool of skilled professionals from
                Pakistan, we make overseas hiring smooth, fast, and
                cost-effective. From candidate sourcing to visa processing and
                government formalities, we ensure a hassle-free recruitment
                experience for Middle Eastern companies.
              </p>

              {/* Blue Highlight Box */}
              <div className="bg-blue-500 text-white px-5 sm:px-6 py-4 rounded-2xl">
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  Here are the key areas which makes us the Ideal Recruitment
                  Agency in Pakistan for Saudi Arabia for Saudi companies:
                </p>
              </div>

              {/* White Card with Checkmarks */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Knowledge of the Saudi Job Market",
                    "Streamlined recruitment process",
                    "Premium customer experience",
                    "Vast network of candidates",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </>
  );
};

export default Home;
