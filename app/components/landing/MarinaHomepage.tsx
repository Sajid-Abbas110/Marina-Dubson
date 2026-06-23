'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Star, ChevronLeft, ChevronRight } from 'lucide-react'

export function MarinaHero() {
  return (
    <section className="relative w-full h-[1024px] flex items-center bg-[#f8f9fa] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/marina-hero-bg.png" alt="Marina Dubson" fill className="object-cover object-top" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent w-full md:w-2/3" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="text-white pt-24 pb-12 lg:pt-32 lg:pb-0 lg:max-w-[703px] flex flex-col gap-6">
          <h1 
            className="text-4xl md:text-6xl lg:text-[80px] font-bold uppercase leading-[1.1] lg:leading-[79px] tracking-tight lg:tracking-[-0.04em] font-poppins drop-shadow-md lg:w-[703px] lg:h-[316px] border border-transparent"
          >
            <span className="text-white">Trusted</span>{' '}
            <span style={{ WebkitTextStroke: '1.5px white', color: 'transparent' }}>Legal</span><br/>
            <span style={{ WebkitTextStroke: '1.5px white', color: 'transparent' }}>Representation</span><br/>
            <span style={{ WebkitTextStroke: '1.5px white', color: 'transparent' }}>With A</span>{' '}
            <span className="text-white">Personal</span><br/>
            <span className="text-white">Commitment</span>
          </h1>
          <p className="text-base md:text-lg text-white/90 font-medium max-w-xl leading-relaxed drop-shadow-md">
            Marina Dubson provides accessible and effective legal representation to protect your rights, defend your future, and manage your risk. Our strategic counsel works closely with clients to achieve their legal goals.
          </p>
          <div className="pt-2">
            <button className="bg-[#0051a8] text-white px-8 py-4 rounded-md font-bold uppercase tracking-widest text-sm hover:bg-[#003f8a] transition-colors shadow-lg">
              Book a consultation
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Horizontal SVG Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-20 leading-none translate-y-px">
        <Image src="/marina-hero-svg.png" alt="Hero Divider" width={1920} height={100} className="w-full h-auto object-cover" />
      </div>
    </section>
  )
}

export function MarinaAbout() {
  return (
    <section className="pt-24 pb-12 bg-[#f4f6fa] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 flex justify-center relative translate-y-12 md:translate-y-20">
             <Image src="/marina-about-us.png" alt="About Marina Dubson" width={800} height={1000} className="w-full h-auto max-h-[85vh] object-contain object-bottom" />
          </div>
          <div className="w-full md:w-1/2 relative z-10 pb-16 md:pb-24">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-[2px] bg-[#0051a8] w-20"></div>
              <h4 className="text-[#0051a8] text-sm font-semibold tracking-wide">About Us</h4>
            </div>
            <h2 className="text-4xl md:text-[3.5rem] font-black uppercase text-gray-900 mb-8 tracking-tight leading-none">Marina Dubson</h2>
            <p className="text-gray-600 mb-6 leading-relaxed font-medium text-[16px]">
              Marina Dubson is a dedicated legal professional committed to helping individuals, families, and businesses navigate legal challenges with confidence. With a client-first approach, she focuses on delivering personalized legal strategies, clear communication, and strong advocacy tailored to every case.
            </p>
            <p className="text-gray-600 mb-10 leading-relaxed font-medium text-[16px]">
              Her mission is simple — provide trusted legal guidance while building lasting relationships based on honesty, professionalism, and results.
            </p>
            <button className="bg-[#0051a8] text-white px-8 py-4 rounded-md font-medium tracking-wide text-sm hover:bg-[#003f8a] transition-colors shadow-md">
              View Practice Areas
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Horizontal SVG Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-20 leading-none translate-y-px">
        <Image src="/marina-about-us-svg.png" alt="About Divider" width={1920} height={100} className="w-full h-auto object-cover object-bottom" />
      </div>
    </section>
  )
}

export function MarinaWhyChoose() {
  const features = [
    "Personalized Legal Strategies",
    "Clear & Honest Communication",
    "Strong Client Advocacy",
    "Detail-Oriented Representation",
    "Trusted Professional Support"
  ]

  return (
    <section className="relative py-24 bg-[#0051a8] overflow-hidden">
      {/* Marina signature watermark - vertical at the far right edge, bottom to top */}
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none z-0 hidden lg:flex items-center justify-end overflow-hidden" style={{width: '220px'}}>
        <div className="absolute" style={{
          right: '-80px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'center center',
          whiteSpace: 'nowrap'
        }}>
          <Image 
            src="/Marina-Dubson-sign.png" 
            alt="Marina Dubson signature" 
            width={900} 
            height={180} 
            className="h-[180px] w-auto object-contain opacity-15 brightness-0 invert"
            style={{maxWidth: 'none'}}
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] bg-white/40 w-12"></div>
              <h4 className="text-white/80 text-xs font-semibold tracking-[0.3em] uppercase">Why Choose Marina</h4>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-[60px] font-bold uppercase mb-6 leading-tight lg:leading-[56px] tracking-tight lg:tracking-[-0.04em] font-poppins">Professional Legal Support You Can Rely On</h2>
            <p className="text-white/90 mb-8 font-medium text-[15px] leading-relaxed max-w-lg">
              Clients choose Marina Dubson for her dedication, responsiveness, and strategic legal approach. Every case receives personal attention, thoughtful guidance, and a commitment to achieving the best possible outcome.
            </p>
            <ul className="space-y-2 mb-10 text-[15px]">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-white select-none">•</span>
                  <span className="font-semibold text-white/95">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="bg-white text-[#0051a8] px-8 py-3.5 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md">
              Get Legal Guidance
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center lg:justify-end items-stretch gap-3 relative" style={{height: '75vh', maxHeight: '700px'}}>
             {/* Marina photo - wider */}
             <div className="flex-1 relative">
               <Image src="/why-choose-marina.png" alt="Why Choose Marina" fill className="object-contain object-bottom" />
             </div>
             {/* Marina sign - narrow but same height */}
             <div className="hidden lg:block w-[90px] flex-shrink-0 relative">
               <Image src="/Marina-Dubson-sign.png" alt="Marina Dubson signature" fill className="object-contain object-bottom opacity-60 brightness-0 invert" />
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function MarinaPracticeAreas() {
  const areas = [
    "Civil Litigation",
    "Legal Consultation",
    "Family Law",
    "Contract Matters",
    "Business Law",
    "Dispute Resolution"
  ]

  return (
    <section className="relative w-full bg-[#0051a8] overflow-hidden" style={{height: '750px'}}>
      {/* Full background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/practice-area.png"
          alt="Practice Areas"
          fill
          className="object-cover object-left"
          priority
        />
      </div>

      {/* Text content overlaid on the right */}
      <div className="relative z-10 h-full flex items-start justify-end">
        <div className="w-full md:w-1/2 flex flex-col justify-start px-8 md:px-12 lg:px-16 pt-16 pb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] bg-white/60 w-12"></div>
            <h4 className="text-white/80 text-xs font-semibold tracking-[0.3em] uppercase">Practice Areas</h4>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-[60px] font-bold uppercase mb-6 leading-tight lg:leading-[56px] tracking-tight lg:tracking-[-0.04em] font-poppins">
            Legal Services<br/>Tailored To<br/>Your Needs
          </h2>
          <p className="text-white/90 mb-8 leading-relaxed font-medium text-[15px] max-w-md">
            Marina Dubson offers professional legal support across a range of practice areas, helping clients resolve disputes, protect their interests, and move forward with confidence
          </p>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-10">
            {areas.map((area, idx) => (
              <span
                key={idx}
                className="text-white text-sm font-semibold underline underline-offset-4 cursor-pointer hover:text-white/70 transition-colors"
              >
                {area}
              </span>
            ))}
          </div>
          <div>
            <button className="bg-white text-[#0051a8] px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
              Explore Services
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function MarinaContact() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-stretch">
          <div className="w-full md:w-5/12 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl lg:text-[42px] font-black uppercase text-gray-900 mb-10 tracking-tight leading-none">Contact Info</h2>
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 text-gray-800">
                  <Phone className="h-5 w-5 text-[#0051a8] flex-shrink-0" />
                  <span className="font-semibold text-lg leading-none">+1 (917) 494-1859</span>
                </div>
                <div className="flex items-center gap-4 text-gray-800">
                  <Mail className="h-5 w-5 text-[#0051a8] flex-shrink-0" />
                  <span className="font-semibold text-lg leading-none">MarinaDubson@gmail.com</span>
                </div>
                <div className="flex items-start gap-4 text-gray-800">
                  <MapPin className="h-5 w-5 text-[#0051a8] flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-lg leading-snug">12A Saturn Lane, Staten Island, NY</span>
                </div>
              </div>
            </div>
            {/* Real Mock Google Map using Staten Island location */}
            <div className="w-full h-[350px] bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200 shadow-sm mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48479.9922904598!2d-74.195022!3d40.579022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa170089739%3A0xc34b049e31a67554!2sStaten%20Island%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale opacity-90"
              ></iframe>
            </div>
          </div>
          <div className="w-full md:w-7/12">
            <div className="bg-[#f4f6fa] p-8 md:p-12 rounded-[2.5rem] border border-gray-100 flex flex-col justify-center h-full">
              <h2 className="text-4xl lg:text-[42px] font-black uppercase text-gray-900 mb-10 tracking-tight leading-none">Get In Touch</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-white border border-[#0051a8] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0051a8]/20 text-gray-800 placeholder-gray-400 font-medium transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-white border border-[#0051a8] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0051a8]/20 text-gray-800 placeholder-gray-400 font-medium transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-white border border-[#0051a8] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0051a8]/20 text-gray-800 placeholder-gray-400 font-medium transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Num"
                    className="w-full bg-white border border-[#0051a8] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0051a8]/20 text-gray-800 placeholder-gray-400 font-medium transition-all"
                  />
                </div>
                <textarea
                  rows={5}
                  placeholder="Message"
                  className="w-full bg-white border border-[#0051a8] rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0051a8]/20 text-gray-800 placeholder-gray-400 font-medium transition-all resize-none"
                ></textarea>
                <div>
                  <button
                    type="button"
                    className="bg-[#0051a8] text-white px-10 py-3.5 rounded-lg font-semibold text-base hover:bg-[#003f8a] transition-all shadow-md active:scale-98"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function MarinaTestimonials() {
  const [current, setCurrent] = React.useState(0)

  const reviews = [
    {
      name: "Alex Markov",
      role: "Business Owner",
      quote: "Marina Dubson was absolutely outstanding. She handled my case with professionalism and genuine care. Thanks to her strategic approach, we achieved results I didn't think were possible. I couldn't recommend her more highly.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Mitchell",
      role: "Family Law Client",
      quote: "From the very first consultation, Marina made me feel heard and supported. Her knowledge of family law is exceptional and she guided me through one of the hardest periods of my life with compassion and clarity.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "James O'Brien",
      role: "Contract Dispute Client",
      quote: "I was involved in a complex contract dispute that seemed impossible to resolve. Marina's attention to detail and relentless advocacy turned things around quickly. She delivered results that exceeded every expectation.",
      img: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
      name: "Natalie Torres",
      role: "Civil Litigation Client",
      quote: "Marina is the kind of attorney who truly goes above and beyond. She kept me informed every step of the way and fought hard for my rights. Her commitment to her clients is unmatched.",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ]

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1))
  const review = reviews[current]

  return (
    <section className="py-24 bg-white text-center">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h4 className="text-[#0051a8] text-xs font-black uppercase tracking-[0.3em] mb-3">Testimonials</h4>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-gray-900 mb-16 tracking-tight">Trusted by clients who needed results</h2>
        
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <button
            onClick={prev}
            className="hidden md:flex h-12 w-12 rounded-full border-2 border-gray-200 items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 flex-shrink-0"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="bg-[#0051a8] text-white p-8 md:p-10 rounded-[2rem] w-full max-w-2xl text-left shadow-2xl relative transition-all duration-300">
            {/* Google logo */}
            <div className="absolute top-8 right-8 h-10 w-10 bg-white rounded-full flex items-center justify-center font-black text-xl">
              <span className="text-blue-500">G</span>
            </div>
            
            <div className="flex items-center gap-5 mb-6">
              <div className="h-16 w-16 rounded-full bg-white/20 overflow-hidden border-2 border-white/30 flex-shrink-0">
                <Image src={review.img} alt={review.name} width={64} height={64} className="object-cover h-full w-full" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">{review.name}</h3>
                <div className="text-white/70 text-xs font-semibold tracking-wider uppercase mb-1">{review.role}</div>
                <div className="flex text-yellow-400 gap-1">
                  <Star className="fill-current h-4 w-4" /><Star className="fill-current h-4 w-4" /><Star className="fill-current h-4 w-4" /><Star className="fill-current h-4 w-4" /><Star className="fill-current h-4 w-4" />
                </div>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed text-[15px] font-medium">
              "{review.quote}"
            </p>
          </div>

          <button
            onClick={next}
            className="hidden md:flex h-12 w-12 rounded-full border-2 border-gray-200 items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 flex-shrink-0"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${idx === current ? 'w-7 bg-[#0051a8]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="flex justify-center gap-4 mt-6 md:hidden">
          <button onClick={prev} className="h-10 w-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="h-10 w-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export function MarinaCTA() {
  return (
    <section className="relative overflow-hidden mx-auto rounded-xl" style={{height: '200px', width: '90%'}}>
      {/* Background image - visible, light overlay */}
      <div className="absolute inset-0 z-0">
        <Image src="/home-cta-bg.png" alt="CTA Background" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content: text left, button right — same row */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between gap-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white leading-tight tracking-tight">
          Need Experienced<br/>Legal Guidance?
        </h2>
        <div className="flex-shrink-0">
          <button className="bg-white text-gray-800 px-8 py-4 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md whitespace-nowrap">
            Book A Consultation
          </button>
        </div>
      </div>
    </section>
  )
}
