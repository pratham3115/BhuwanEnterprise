import { useState, useRef, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import QR from "../../assets/QR Code.jpg";

const Contact = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    country: "",
    tel: "",
    companyName: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (form.current) {
        const result = await emailjs.sendForm(
          'service_gfg5xpu', // Replace with your EmailJS service ID
          'template_ai9snbb', // Replace with your EmailJS template ID
          form.current,
          'SSE_hozH-UAjm8jdc' // Replace with your EmailJS public key
        );

        if (result.text === 'OK') {
          setFormData({
            email: "",
            name: "",
            country: "",
            tel: "",
            companyName: "",
            message: "",
          });
          setSelectedFile(null);
          alert("Message sent successfully!");
        } else {
          alert("Failed to send message. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 25 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert("File size should not exceed 25MB");
      e.target.value = '';
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </a>
            <span className="mx-2">›</span>
            <span className="text-gray-600">Contact Us</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Contact Our Sales Team</h1>
        <p className="text-gray-600 mb-12">
          If you have any queries about our machines, please feel free to let us know. We will get back to you
          within 12 hours.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="to_email" value="jpratham134@gmail.com" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  value={formData.country}
                  onChange={handleChange}
                />
                <input
                  type="tel"
                  name="tel"
                  placeholder="Tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  value={formData.tel}
                  onChange={handleChange}
                />
              </div>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                value={formData.companyName}
                onChange={handleChange}
              />
              <textarea
                name="message"
                placeholder="Message"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                required
                value={formData.message}
                onChange={handleChange}
              />
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  accept=".jpg,.png,.pdf,.dxf,.dwg"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer inline-block px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
                <p className="mt-1 text-xs text-gray-500">
                  *Please upload only jpg, png, pdf, dxf, dwg files. Size limit is 25MB.
                </p>
              </div>
              <button
                type="submit"
                className={`w-full bg-[#234F1E] text-white py-3 rounded-lg hover:bg-[#1a3b16] transition duration-300 ${
                  isSubmitting ? "opacity-50 cursor-wait" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Email</h2>
              <a
                href="mailto:bhuwanenterprise@yahoo.com"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                bhuwanenterprise@yahoo.com
              </a>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tel</h2>
              <a href="tel:+918866082044" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                +91 8866082044
              </a>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Address</h2>
              <p className="text-gray-600">
                Shed No.5, Plot No. 272, Parth Ind. Estate, Damanganga Industrial Park, Karvad Vapi- 396193, GUJARAT
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Get Social</h2>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://www.twitter.com"
                  className="text-gray-600 hover:text-blue-400 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://www.instagram.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Instant Message</h2>
              <p className="text-gray-600 mb-4">
                You can also scan the instant messenger link below to reach us for quick communication.
              </p>
              <div className="text-center max-w-[200px]">
                <div className="bg-white p-4 rounded-lg shadow-md mb-2">
                  <img src={QR} alt="WhatsApp QR" className="w-full" />
                </div>
                <p className="text-gray-600">WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Bhuwan Enterprise</h3>
              <p>Striving to exceed customer expectations by offering impeccable quality products and services.</p>
              <p>
                <strong>Timings:</strong> 9 AM - 7 PM
                <br />
                <strong>Working Days:</strong> Monday to Saturday
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">PAGES</h3>
              <ul className="space-y-1">
                <li>
                  <a href="/" className="hover:underline transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:underline transition-colors duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:underline transition-colors duration-200">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:underline transition-colors duration-200">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">ABOUT US</h3>
              <p>
                Bhuwan Enterprise is a technology-driven organization equipped with the best manufacturing facilities,
                catering to the unprecedented efforts of many industries.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">ADDRESS</h3>
              <p>
                Shed No.5, Plot No. 272, Parth Ind. Estate, Damanganga Industrial Park, Karvad Vapi- 396193, GUJARAT
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Bhuwan Enterprise. All rights reserved - Developed by PH Devs
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://www.facebook.com"
                aria-label="Facebook"
                className="hover:text-white transition-colors duration-200"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com"
                aria-label="Instagram"
                className="hover:text-white transition-colors duration-200"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.twitter.com"
                aria-label="Twitter"
                className="hover:text-white transition-colors duration-200"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
