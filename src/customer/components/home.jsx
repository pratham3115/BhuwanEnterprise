"use client"

import { useState, useEffect, useCallback } from "react"
import { Factory, Award, Users, Target } from "lucide-react"
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Machine_1 from "../../assets/Machine 1.jpg"
import Machine_2 from "../../assets/Machine 2.jpg"
import Machine_3 from "../../assets/Machine 3.jpg"
import IntroVideo from "../../assets/Intro.mp4"
import Product_1 from "../../assets/White electric.jpg"
import Product_2 from "../../assets/Fine_circle.jpg"
import Product_3 from "../../assets/Circle spark.jpg"
import Product_4 from "../../assets/cap.jpg"
import Product_5 from "../../assets/circle plate.jpg"
import Product_6 from "../../assets/Thin plate.jpg"
import Product_7 from "../../assets/Types_fuse.jpg"
import Product_8 from "../../assets/grip.jpg"

const products = [
  { name: "MANDREL", image: Product_1 },
  { name: "HELICAL GEAR", image: Product_2 },
  { name: "CNC TURNED COMPONENTS", image: Product_3 },
  { name: "SPINDLE", image: Product_4 },
  { name: "RECEIVING GAUGES", image: Product_5 },
  { name: "DRILL JIG", image: Product_6 },
  { name: "COLLETS", image: Product_7 },
  { name: "HYDRAULIC FIXTURES", image: Product_8 },
]

const machines = [Machine_1, Machine_2, Machine_3]

const FadeInWhenVisible = ({ children }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.3 }}
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0.9 },
      }}
    >
      {children}
    </motion.div>
  )
}

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [currentMachine, setCurrentMachine] = useState(0)

  const nextMachine = useCallback(() => {
    setCurrentMachine((prev) => (prev + 1) % machines.length)
  }, [])

  const prevMachine = useCallback(() => {
    setCurrentMachine((prev) => (prev - 1 + machines.length) % machines.length)
  }, [])

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="w-full">
      <main>
        {/* Hero Section */}
        <div className="relative bg-gray-900 text-white">
          <div className="absolute inset-0">
            <video className="w-full h-full object-cover" src={IntroVideo} autoPlay loop muted playsInline />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-6">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold mb-4"
            >
              Welcome to Bhuwan Enterprise
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-gray-300"
            >
              Your OneStop Solution for Precision Engineering.
            </motion.p>
          </div>
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* About Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Best Manufacturing Solution</h2>
              <div className="w-24 h-1 bg-[#234F1E] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Bhuwan enterprise always thinks about customers' benefits, we provide the best solution according to
                  the customer's budget and beyond their expectations.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                    <Factory className="w-10 h-10 text-[#234F1E] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Manufacturing</h3>
                    <p className="text-gray-600 text-sm">Expert solutions in warp knitting machinery</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                    <Award className="w-10 h-10 text-[#234F1E] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Experience</h3>
                    <p className="text-gray-600 text-sm">17 years of industry expertise</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                    <Users className="w-10 h-10 text-[#234F1E] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                    <p className="text-gray-600 text-sm">Experienced professionals dedicated to quality</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
                    <Target className="w-10 h-10 text-[#234F1E] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                    <p className="text-gray-600 text-sm">Meeting diverse needs worldwide</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Bhuwan enterprise is a trusted enterprise in the warp knitting machinery, dedicated to delivering the
                  best mechanism solutions. Our expertise in the knitting machinery field ensures our products meet the
                  highest standards of quality, reliability, and performance. With a dedicated team of experts, we're
                  committed to delivering excellence in every project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Machinery Section */}
        <FadeInWhenVisible>
          <div className="text-center p-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Our Machinery</h2>
            <div className="w-full max-w-5xl mx-auto relative h-[500px]">
              <img
                src={machines[currentMachine] || "/placeholder.svg"}
                alt={`Machine ${currentMachine + 1}`}
                className="w-full h-full object-contain rounded-lg shadow-lg"
              />
              <button
                onClick={prevMachine}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full shadow-md hover:bg-opacity-75 transition duration-300"
                aria-label="Previous machine"
              >
                <FaChevronLeft className="text-gray-800 text-xl" />
              </button>
              <button
                onClick={nextMachine}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-3 rounded-full shadow-md hover:bg-opacity-75 transition duration-300"
                aria-label="Next machine"
              >
                <FaChevronRight className="text-gray-800 text-xl" />
              </button>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Products Section */}
        <FadeInWhenVisible>
          <section className="py-10 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Our Products</h2>
              <p className="text-center text-gray-600 mb-6 text-xs">
                Bhuwan Enterprise provides you wide range of products.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map((product, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeInWhenVisible>

        {/* Contact Section */}
        <FadeInWhenVisible>
          <section className="py-12 bg-blue-50">
            <div className="max-w-xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-6 text-[#234F1E]">Get in touch</h2>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234F1E] transition duration-300"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234F1E] transition duration-300"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234F1E] transition duration-300"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#234F1E] text-white py-2 rounded-lg hover:bg-[#1a3b16] transition duration-300"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </section>
        </FadeInWhenVisible>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="container mx-auto px-4">
            {/* Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Section 1 */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white">Bhuwan Enterprise</h3>
                <p className="text-sm">
                  Striving to exceed customer expectations by offering impeccable quality products and services.
                </p>
                <p className="text-sm">
                  <strong>Timings:</strong> 9 AM - 7 PM
                  <br />
                  <strong>Working Days:</strong> Monday to Saturday
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white">PAGES</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="hover:underline transition duration-300"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => (window.location.href = "/about")}
                      className="hover:underline transition duration-300"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => (window.location.href = "/products")}
                      className="hover:underline transition duration-300"
                    >
                      Products
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => (window.location.href = "/contact")}
                      className="hover:underline transition duration-300"
                    >
                      Contact Us
                    </button>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white">ABOUT US</h3>
                <p className="text-sm">
                  Bhuwan Enterprise is a technology-driven organization equipped with the best manufacturing facilities,
                  catering to the unprecedented efforts of many industries.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-white">ADDRESS</h3>
                <p className="text-sm">
                  {" "}
                  Shed No.5, Plot No. 272, Parth Ind. Estate, Damanganga Industrial Park, Karvad Vapi- 396193, GUJARAT
                </p>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-xs">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Bhuwan Enterprise. All rights reserved - Developed by PH Devs
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <button aria-label="Facebook" className="hover:text-white transition duration-300">
                  <FaFacebook size={16} />
                </button>
                <button aria-label="Twitter" className="hover:text-white transition duration-300">
                  <FaTwitter size={16} />
                </button>
                <button aria-label="Instagram" className="hover:text-white transition duration-300">
                  <FaInstagram size={16} />
                </button>
                <button aria-label="Pinterest" className="hover:text-white transition duration-300">
                  <FaPinterest size={16} />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-[#234F1E] text-white p-2 rounded-full shadow-lg hover:bg-[#1a3b16] transition duration-300"
        >
          <FaArrowUp size={16} />
        </motion.button>
      )}
    </div>
  )
}

export default Home

