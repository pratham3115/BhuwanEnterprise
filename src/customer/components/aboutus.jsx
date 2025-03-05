"use client";
import { motion } from "framer-motion";
import { Factory, Award, Users, Target, ChevronRight, Clock, Globe, PenToolIcon as Tool } from "lucide-react";
import Machine_1 from "../../assets/Machine 1.jpg";
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section with Video Background */}
      <div className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover opacity-50"
            src="" // Add the video source URL here
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            About Bhuwan Enterprise
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-blue-500 mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl"
          >
            Your OneStop Solution for Precision Engineering Since 2006
          </motion.p>
        </div>
      </div>

      {/* Company Overview Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">Our Journey of Excellence</h2>
              <div className="w-20 h-1 bg-blue-500"></div>
              <p className="text-gray-700 leading-relaxed">
                Bhuwan Enterprise has been at the forefront of precision engineering since 2006. We specialize in warp
                knitting machinery and have established ourselves as a trusted name in manufacturing high-quality
                components and solutions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our state-of-the-art facility in Gujarat is equipped with cutting-edge technology, enabling us to
                deliver precision-engineered products that meet international standards.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={Machine_1}
                alt="Our Facility"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white p-6 rounded-lg shadow-lg">
                <p className="text-4xl font-bold">17+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: "Punctuality", desc: "Timely delivery of quality products" },
              { icon: Tool, title: "Precision", desc: "Accuracy in every manufacturing detail" },
              { icon: Globe, title: "Global Standards", desc: "Meeting international quality benchmarks" },
              { icon: Users, title: "Customer First", desc: "Customer satisfaction is our priority" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition-colors duration-300"
              >
                <item.icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Projects Completed" },
              { number: "50+", label: "Expert Team Members" },
              { number: "15+", label: "Countries Served" },
              { number: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Bhuwan Enterprise</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine years of experience with modern technology to deliver exceptional quality and service to our
              clients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Factory,
                title: "Advanced Manufacturing",
                desc: "State-of-the-art machinery and equipment for precise manufacturing",
              },
              {
                icon: Award,
                title: "Quality Assurance",
                desc: "Rigorous quality control processes ensuring perfect output",
              },
              {
                icon: Target,
                title: "Custom Solutions",
                desc: "Tailored solutions meeting specific client requirements",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 border rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Your Project?</h2>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Contact Us <ChevronRight className="ml-2 w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}
