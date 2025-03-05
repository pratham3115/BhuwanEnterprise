import React from "react";
import IntroVideo from "../../assets/Intro.mp4"; // Replace with the path to your video

const Hero = () => {
  return (
    <div className="relative bg-gray-800 text-white">
      {/* Hero Section Wrapper */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Video */}
        <video
          className="w-full h-full object-cover opacity-70"
          src={IntroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-6">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Welcome to Bhuwan Enterprise
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl mb-6 max-w-2xl">
          Your Trusted Partner in High-Quality Manufacturing Solutions.
        </p>

        {/* Call to Action */}
        <div className="flex space-x-4">
          <a
            href="#products"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
          >
            Explore Products
          </a>
          <a
            href="#contact"
            className="px-6 py-3 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
