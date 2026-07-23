'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Star, ChevronLeft, ChevronRight } from 'lucide-react'

export function MarinaHero({ bgImage = '/home-hero-bg.png' }: { bgImage?: string }) {
  return (
    <section className="relative w-full h-[1024px] flex items-center bg-[#f8f9fa] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={bgImage} alt="Marina Dubson" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent w-full md:w-2/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="text-white pt-24 pb-12 lg:pt-32 lg:pb-0 lg:max-w-[703px] flex flex-col gap-6">
          <h1
            className="text-4xl md:text-6xl lg:text-[64px] font-bold uppercase leading-[1.1] lg:leading-[68px] tracking-tight lg:tracking-[-0.03em] font-poppins drop-shadow-md lg:w-[703px]"
          >
            <span className="text-white">New York </span>
            <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Court</span>{' '}
            <span className="text-white">Reporter —</span>{' '}
            <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Realtime Reporting,</span>{' '}
            <span className="text-white">Depositions &amp; CART</span>{' '}
            <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Services</span>
          </h1>
          <p className="text-base md:text-lg text-white/90 font-medium max-w-xl leading-relaxed drop-shadow-md">
            Accurate, verbatim, and on time — every assignment, every word. Marina Dubson is a stenographic court reporter based in New York City, delivering Realtime reporting, depositions, arbitrations, hearings, and CART services with the precision that complex legal proceedings demand.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/contact" className="bg-[#0051a8] text-white px-8 py-4 rounded-md font-bold uppercase tracking-widest text-sm hover:bg-[#003f8a] transition-colors shadow-lg">
              Request a Court Reporter
            </Link>
            <Link href="/about" className="border border-white/70 text-white px-8 py-4 rounded-md font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#0051a8] transition-colors">
              View Resume
            </Link>
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
    <section className="relative overflow-hidden pt-24 pb-24 md:pb-32">
      <div className="absolute inset-0 z-0">
        <Image src="/home-hero-secondary.png" alt="Marina Dubson at her desk" fill className="object-cover object-left" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f6fa]/30 via-[#f4f6fa]/85 to-[#f4f6fa]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="ml-auto w-full md:w-3/5 lg:w-1/2">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[2px] bg-[#0051a8] w-20"></div>
            <h4 className="text-[#0051a8] text-sm font-semibold tracking-wide">About Us</h4>
          </div>
          <h2 className="text-4xl md:text-[3.5rem] font-black uppercase text-gray-900 mb-8 tracking-tight leading-none">Marina Dubson</h2>
          <p className="text-gray-600 mb-6 leading-relaxed font-medium text-[16px]">
            For attorneys, agencies, and institutions that can&apos;t afford a single missed word, Marina pairs stenographic speed with a deep command of English grammar, syntax, and legal phraseology. The result is a clean, certified transcript delivered when you need it — not a rough draft you have to fix.
          </p>
          <p className="text-gray-600 mb-10 leading-relaxed font-medium text-[16px]">
            Marina is an independent court reporter who personally handles every assignment she accepts. When you book Marina, you get Marina.
          </p>
          <Link href="/services" className="inline-block bg-[#0051a8] text-white px-8 py-4 rounded-md font-medium tracking-wide text-sm hover:bg-[#003f8a] transition-colors shadow-md">
            View Practice Areas
          </Link>
        </div>
      </div>

      {/* Bottom Horizontal SVG Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-20 leading-none translate-y-px">
        <Image src="/marina-about-us-svg.png" alt="About Divider" width={1920} height={100} className="w-full h-auto object-cover object-bottom" />
      </div>
    </section>
  )
}

export function MarinaServicesGrid({ dark = true }: { dark?: boolean }) {
  const services = [
    {
      title: 'Realtime Reporting',
      text: 'Instant, streaming transcription you can read as the words are spoken.',
      img: '/service-realtime.png',
    },
    {
      title: 'Depositions',
      text: 'Verbatim deposition transcripts for civil and federal matters across New York.',
      img: '/service-depositions.png',
    },
    {
      title: 'Arbitrations & Hearings',
      text: 'Reliable coverage for arbitrations, administrative hearings, and proceedings.',
      img: '/service-arbitrations.png',
    },
    {
      title: 'CART Services',
      text: 'Communication Access Realtime Translation for schools, universities, and events.',
      img: '/service-cart.png',
    },
    {
      title: 'Transcript Production',
      text: 'End-to-end transcript preparation, from rough to certified final.',
      img: '/service-transcript.png',
    },
  ]

  return (
    <section className={`relative pt-20 pb-24 overflow-hidden ${dark ? 'bg-[#0051a8]' : 'bg-[#f4f6fa]'}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto mb-14 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`h-[1px] w-14 ${dark ? 'bg-white/60' : 'bg-[#0051a8]/60'}`}></div>
            <h4 className={`text-xs font-semibold tracking-[0.3em] uppercase ${dark ? 'text-white/80' : 'text-[#0051a8]'}`}>Our Services</h4>
            <div className={`h-[1px] w-14 ${dark ? 'bg-white/60' : 'bg-[#0051a8]/60'}`}></div>
          </div>
          <h2 className={`text-3xl md:text-4xl lg:text-[42px] uppercase leading-tight tracking-tight lg:tracking-[-0.02em] font-poppins ${dark ? 'text-white' : 'text-gray-950'}`}>
            <span className="font-normal">Professional </span>
            <span className="font-bold">Court</span>
            <span className="font-normal"> Reporting </span>
            <span className="font-bold">Services</span>
            <span className="font-normal"> for </span>
            <span className="font-bold">Attorneys</span>
            <span className="font-normal"> &amp; </span>
            <span className="font-bold">Agencies</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service) => (
            <div key={service.title} className={`w-full sm:w-[300px] rounded-2xl border p-4 ${dark ? 'border-white/30' : 'border-[#0051a8]/30 bg-white'}`}>
              <div className="relative h-[220px] rounded-xl overflow-hidden mb-5">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className={`text-lg font-bold text-center mb-2 ${dark ? 'text-white' : 'text-gray-950'}`}>{service.title}</h3>
              <p className={`text-sm font-medium leading-relaxed text-center ${dark ? 'text-white/80' : 'text-gray-600'}`}>{service.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MarinaWhyChoose() {
  const features = [
    "Accuracy first. A former English Literature major and writing instructor, Marina brings an editor's ear to every transcript.",
    "On time, always. Daily and immediate-delivery turnaround when the schedule is tight.",
    "Trusted on high-profile matters. Experience reporting sensitive, complex, and closely watched proceedings.",
    "Nationwide reach. Marina partners with court reporting agencies across the United States.",
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
              <h4 className="text-white/80 text-xs font-semibold tracking-[0.3em] uppercase">Why Work With Marina</h4>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-[60px] uppercase mb-6 leading-tight lg:leading-[56px] tracking-tight lg:tracking-[-0.04em] font-poppins"><span className="font-normal">Why Work With </span><span className="font-bold">Marina Dubson</span></h2>
            <ul className="space-y-4 mb-10 text-[15px]">
              {features.map((feature, idx) => (
                <li key={idx} className="font-medium text-white/95 leading-relaxed">{feature}</li>
              ))}
            </ul>
            <Link href="/contact" className="inline-block bg-white text-[#0051a8] px-8 py-3.5 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md">
              Request a Court Reporter
            </Link>
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

export function MarinaExperienceTeaser() {
  return (
    <section className="relative bg-[#f4f6fa] pb-16 md:pb-24">
      <div className="h-[220px] bg-[#0051a8]" />
      <div className="relative z-10 mx-auto w-[90%] max-w-6xl -mt-[220px]">
        <div className="relative min-h-[520px] overflow-hidden rounded-2xl flex items-center justify-center">
          <Image
            src="/home-notable-teaser.png"
            alt="Notable Experience"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0051a8]/80" />

          <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 md:py-20 text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] bg-white/60 w-12"></div>
              <h4 className="text-white/80 text-xs font-semibold tracking-[0.3em] uppercase">Experience</h4>
              <div className="h-[1px] bg-white/60 w-12"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] uppercase mb-6 leading-tight tracking-tight lg:tracking-[-0.02em] font-poppins">
              <span className="font-normal">Trusted </span>
              <span className="font-bold">to Capture </span>
              <span className="font-normal">the</span>
              <br />
              <span className="font-bold">Record </span>
              <span className="font-normal">When It Matters</span>
              <span className="font-bold"> Most</span>
            </h2>
            <p className="text-white/90 mb-8 leading-relaxed font-medium text-[15px]">
              From government ethics hearings to landmark workplace-discrimination trials and high-stakes arbitrations, Marina has been trusted to capture the record when it matters most.
            </p>
            <Link href="/notable-experience" className="inline-block bg-white text-[#0051a8] px-8 py-3.5 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg">
              See Notable Experience
            </Link>
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
      name: "Litigation Partner",
      role: "NYC Civil Litigation Firm",
      quote: "Marina's realtime feed let us catch a key admission mid-deposition and pivot our questioning on the spot. The certified transcript matched what we saw on screen word for word — no surprises, no corrections.",
    },
    {
      name: "Court Reporting Coordinator",
      role: "National Reporting Agency",
      quote: "We route our most sensitive assignments to Marina because she's never missed a turnaround deadline and the transcripts come back clean. Attorneys ask for her by name.",
    },
    {
      name: "General Counsel",
      role: "Financial Services Company",
      quote: "Our arbitration involved dense technical testimony, and Marina's transcript captured every term correctly on the first pass. Her preparation beforehand clearly made the difference.",
    },
    {
      name: "Disability Services Director",
      role: "New York University",
      quote: "Marina's CART captioning kept up with fast-moving panel discussions without dropping a beat. Students told us it was the clearest live captioning they'd had all semester.",
    },
  ]

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1))
  const review = reviews[current]

  return (
    <section className="py-24 bg-white text-center">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h4 className="text-[#0051a8] text-xs font-black uppercase tracking-[0.3em] mb-3">Testimonials</h4>
        <h2 className="text-4xl md:text-5xl uppercase text-gray-900 mb-16 tracking-tight"><span className="font-bold">Trusted </span><span className="font-normal">by clients who </span><span className="font-bold">needed results</span></h2>
        
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <button
            onClick={prev}
            className="hidden md:flex h-12 w-12 rounded-full border-2 border-gray-200 items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 flex-shrink-0"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="bg-[#0051a8] text-white p-8 md:p-10 rounded-[2rem] w-full max-w-2xl text-left shadow-2xl relative transition-all duration-300">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-16 w-16 rounded-full bg-white/20 border-2 border-white/30 flex-shrink-0 flex items-center justify-center font-black text-lg">
                {review.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
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
              &ldquo;{review.quote}&rdquo;
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

export function MarinaCTA({
  title = "Need Experienced\nLegal Guidance?",
  buttonLabel = "Book A Consultation",
  href = "/contact",
}: {
  title?: string
  buttonLabel?: string
  href?: string
}) {
  const lines = title.split('\n')
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
          {lines.map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
        <div className="flex-shrink-0">
          <Link href={href} className="inline-block bg-white text-gray-800 px-8 py-4 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md whitespace-nowrap">
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
