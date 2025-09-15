import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseCase {
  title: string;
  desc: string;
  tags: string[];
  image: string;
}

interface ScrollSyncedCarouselProps {
  useCases: UseCase[];
  id: string;
}

const ScrollSyncedCarousel: React.FC<ScrollSyncedCarouselProps> = ({ useCases, id }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const contentCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = scrollWrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      if (wrapperRect.bottom < 0 || wrapperRect.top > window.innerHeight) return;
      const scrollableHeight = wrapper.offsetHeight - window.innerHeight;
      const pixelsScrolled = Math.max(0, window.scrollY - wrapper.offsetTop);
      const progress = scrollableHeight > 0 ? pixelsScrolled / scrollableHeight : 0;
      let newActiveIndex = Math.floor(progress * useCases.length);
      newActiveIndex = Math.min(useCases.length - 1, newActiveIndex);
      setActiveIndex(newActiveIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [useCases]);

  useEffect(() => {
    const contentPanel = contentCarouselRef.current;
    const activeItem = contentRefs.current[activeIndex];
    if (contentPanel && activeItem) {
      const panelHeight = contentPanel.clientHeight;
      const itemHeight = activeItem.clientHeight;
      const itemOffsetTop = activeItem.offsetTop;
      const targetScrollTop = itemOffsetTop - (panelHeight / 2) + (itemHeight / 2);
      contentPanel.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <>
      <style>{`
        .scroll-wrapper { min-height: 250vh; position: relative; }
        .sticky-container { position: sticky; top: 10vh; height: 80vh; max-height: 700px; width: 100%; max-width: 1100px; margin: 0 auto; display: flex; align-items: stretch; background: #ffffff; border-radius: 24px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); overflow: hidden; }
        .content-carousel { flex: 1; height: 100%; padding: 0 1.5rem 0 3rem; box-sizing: border-box; overflow-y: scroll; -ms-overflow-style: none; scrollbar-width: none; }
        .content-carousel::-webkit-scrollbar { display: none; }
        .content-item { height: 80vh; max-width: 450px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; transition: opacity 0.5s ease-in-out; }
        .content-item:last-child { padding-bottom: 0; }
        .image-display { flex: 1; height: 100%; display: flex; align-items: center; justify-content: center; padding: 3rem; }
        .image-card { width: 100%; height: 100%; background: white; border-radius: 1.5rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); position: relative; overflow: hidden; }
        .image-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s ease-in-out; }
        .tag { display: inline-block; background: #eef2ff; color: #4f46e5; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; padding: 0.25rem 0.75rem; box-shadow: none; }
        .content-title { font-size: 2rem; font-weight: 700; color: #1f2937; margin-top: 0.75rem; }
        .content-desc { font-size: 1.125rem; color: #4b5563; margin-top: 0.75rem; line-height: 1.75; }
        @media (max-width: 1024px) { .sticky-container { flex-direction: column; height: 90vh; top: 5vh; } .content-carousel { padding: 2rem; flex: 0 0 50%; } .image-display { padding: 0 2rem 2rem 2rem; flex: 1; } }
        @media (max-width: 640px) { .content-carousel { padding: 1.5rem; } .image-display { padding: 0 1.5rem 1.5rem 1.5rem; } .content-title { font-size: 1.5rem; } .content-desc { font-size: 1rem; } }
      `}</style>
      <div className="scroll-wrapper" ref={scrollWrapperRef}>
        <section className="sticky-container">
          <div className="content-carousel" ref={contentCarouselRef}>
            {useCases.map((useCase, i) => (
              <div 
                key={useCase.title} 
                ref={el => (contentRefs.current[i] = el)} 
                className="content-item" 
                style={{ opacity: activeIndex === i ? 1 : 0.3 }}
              >
                <span className="tag">{useCase.tags[0]}</span>
                <h3 className="content-title">{useCase.title}</h3>
                <p className="content-desc">{useCase.desc}</p>
              </div>
            ))}
          </div>
          <div className="image-display">
            <div className="image-card">
              {useCases.map((useCase, i) => (
                <img 
                  key={useCase.image} 
                  src={useCase.image} 
                  alt={useCase.title} 
                  style={{ opacity: activeIndex === i ? 1 : 0 }} 
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('career-hub');

  const useCases = [
    {
      title: "AI Post Generator",
      desc: "Generate authentic LinkedIn posts in minutes with AI that learns your voice and expertise.",
      tags: ["AI"],
      image: "https://placehold.co/600x400/4f46e5/white?text=AI+Post+Generator",
    },
    {
      title: "Professional Carousel Maker",
      desc: "Create stunning multi-slide carousels with professional templates and AI content generation.",
      tags: ["Design"],
      image: "https://placehold.co/600x400/be185d/white?text=Carousel+Maker",
    },
    {
      title: "Content Repurposing Engine",
      desc: "Transform existing articles, videos, and podcasts into multiple LinkedIn post formats.",
      tags: ["Content"],
      image: "https://placehold.co/600x400/059669/white?text=Repurposing+Engine",
    },
    {
      title: "Thought Leadership Engine",
      desc: "Build authority with AI-powered content strategy and trending topic identification.",
      tags: ["Strategy"],
      image: "https://placehold.co/600x400/d97706/white?text=Leadership+Engine",
    },
  ];

  const useCases2 = [
    {
      title: "Smart Resume Studio",
      desc: "AI-powered resume optimization with real-time ATS scoring and master/campaign resume management.",
      tags: ["Resume"],
      image: "https://placehold.co/600x400/1d4ed8/white?text=Resume+Studio",
    },
    {
      title: "Application Tailor",
      desc: "Create laser-focused applications tailored to specific job postings with AI analysis.",
      tags: ["Applications"],
      image: "https://placehold.co/600x400/9333ea/white?text=Application+Tailor",
    },
    {
      title: "Job Finder & Tracker",
      desc: "AI-powered job discovery with Kanban-style application pipeline management.",
      tags: ["Jobs"],
      image: "https://placehold.co/600x400/c026d3/white?text=Job+Tracker",
    },
    {
      title: "Interview Prep Kit",
      desc: "AI mock interviews, question banks, and performance analytics for interview mastery.",
      tags: ["Interview"],
      image: "https://placehold.co/600x400/db2777/white?text=Interview+Prep",
    },
  ];

  const useCases3 = [
    {
      title: "Skill Radar",
      desc: "Live market intelligence tracking rising skills and high-ROI learning opportunities.",
      tags: ["Radar"],
      image: "https://placehold.co/600x400/7c3aed/white?text=Skill+Radar",
    },
    {
      title: "Learning Sprints",
      desc: "Focused 2-3 week learning missions with tangible deliverables and portfolio artifacts.",
      tags: ["Sprints"],
      image: "https://placehold.co/600x400/6d28d9/white?text=Learning+Sprints",
    },
    {
      title: "Certification Planning",
      desc: "Strategic certification roadmap with study guides and market value analysis.",
      tags: ["Certs"],
      image: "https://placehold.co/600x400/5b21b6/white?text=Cert+Planning",
    },
    {
      title: "Skill Benchmarking",
      desc: "Real-time comparison against market demand with weekly alignment scoring.",
      tags: ["Benchmark"],
      image: "https://placehold.co/600x400/4c1d95/white?text=Benchmarking",
    },
  ];

  useEffect(() => {
    const allTabButtons = document.querySelectorAll('.tab-btn');
    const allSections = document.querySelectorAll('.scroll-section');

    // Function to handle click for smooth scrolling
    allTabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('data-tab');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Intersection Observer to update active tabs
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          setActiveTab(sectionId || 'career-hub');
        }
      });
    }, {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0
    });

    allSections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      allTabButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
      allSections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden" style={{
        backgroundImage: "url('https://ik.imagekit.io/fdd16n9cy/di.png?updatedAt=1757770843990')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Sun Animation */}
        <div className="relative mb-8">
          <div className="section-banner-sun">
            <div id="star-1">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
            <div id="star-2">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
            <div id="star-3">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
            <div id="star-4">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
            <div id="star-5">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
            <div id="star-6">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
            <div id="star-7">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Text - Below Animation */}
        <div className="hero-text relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{
            color: '#E8F0FF',
            textShadow: '2px 2px 12px #2B448C'
          }}>
            Accelerate your career with ai-powered growth
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{
            color: '#dbeaff',
            textShadow: '1px 1px 8px #2B448C'
          }}>
            Unify your job search, personal branding, and skill development in one intelligent platform. Career Clarified helps you land better opportunities faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/signup')}
              className="hero-button primary px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2"
              style={{
                color: '#E8F0FF',
                background: 'linear-gradient(145deg, #516395, #44547e)',
                boxShadow: '7px 7px 15px #273049, -7px -7px 15px #6b84c5'
              }}
            >
              Get started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
            
            <button 
              className="hero-button secondary px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2"
              style={{
                color: '#E8F0FF',
                background: 'linear-gradient(145deg, #516395, #44547e)',
                boxShadow: '7px 7px 15px #273049, -7px -7px 15px #6b84c5'
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
              </svg>
              Learn more
            </button>
          </div>

          {/* Trust Indicator */}
          <div className="mt-12">
            <div className="flex items-center justify-center gap-2 text-white/80 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="font-medium">Join 10,000+ professionals who landed better roles and built stronger brands</span>
            </div>
            
            {/* Company Logos */}
            <div className="flex items-center justify-center gap-8 opacity-80">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg shadow-sm border border-white/20 text-white font-semibold">Google</div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg shadow-sm border border-white/20 text-white font-semibold">Microsoft</div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg shadow-sm border border-white/20 text-white font-semibold">Amazon</div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg shadow-sm border border-white/20 text-white font-semibold">Meta</div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .section-banner-sun {
            height: 300px;
            width: 300px;
            position: relative;
            transition: left 0.3s linear;
            background-color: #E6E6FA;
            border-radius: 50%;
            animation: shadowPulse 5s ease-in-out infinite;
            box-shadow:
              0px 0px 40px 20px #7891D5,
              -5px 0px 10px 1px #E8F0FF inset,
              15px 2px 40px 20px #4D69B4c5 inset,
              -24px -2px 50px 25px #7891D5c2 inset,
              150px 0px 80px 35px #2B448Caa inset;
          }

          .curved-corner-star {
            display: flex;
            position: relative;
          }

          #curved-corner-bottomleft,
          #curved-corner-bottomright,
          #curved-corner-topleft,
          #curved-corner-topright {
            width: 4px;
            height: 5px;
            overflow: hidden;
            position: relative;
          }

          #curved-corner-bottomleft:before,
          #curved-corner-bottomright:before,
          #curved-corner-topleft:before,
          #curved-corner-topright:before {
            content: "";
            display: block;
            width: 200%;
            height: 200%;
            position: absolute;
            border-radius: 50%;
          }

          #curved-corner-bottomleft:before {
            bottom: 0;
            left: 0;
            box-shadow: -5px 5px 0 0 #E8F0FF;
          }

          #curved-corner-bottomright:before {
            bottom: 0;
            right: 0;
            box-shadow: 5px 5px 0 0 #E8F0FF;
          }

          #curved-corner-topleft:before {
            top: 0;
            left: 0;
            box-shadow: -5px -5px 0 0 #E8F0FF;
          }

          #curved-corner-topright:before {
            top: 0;
            right: 0;
            box-shadow: 5px -5px 0 0 #E8F0FF;
          }

          @keyframes twinkling {
            0%, 100% {
              opacity: 0.1;
            }
            50% {
              opacity: 1;
            }
          }

          @keyframes shadowPulse {
            0%, 100% {
              box-shadow:
                0px 0px 40px 20px #7891D5,
                -5px 0px 10px 1px #E8F0FF inset,
                15px 2px 40px 20px #4D69B4c5 inset,
                -24px -2px 50px 25px #7891D5c2 inset,
                150px 0px 80px 35px #2B448Caa inset;
            }
            50% {
              box-shadow:
                0px 0px 60px 30px #AEBFE3,
                -5px 0px 20px 5px #E8F0FF inset,
                15px 2px 60px 30px #4D69B4c5 inset,
                -24px -2px 70px 35px #7891D5c2 inset,
                150px 0px 100px 45px #2B448Caa inset;
            }
          }

          #star-1 {
            position: absolute;
            left: -20px;
            animation: twinkling 3s infinite;
          }

          #star-2 {
            position: absolute;
            left: -40px;
            top: 30px;
            animation: twinkling 2s infinite;
          }

          #star-3 {
            position: absolute;
            left: 350px;
            top: 90px;
            animation: twinkling 4s infinite;
          }

          #star-4 {
            position: absolute;
            left: 200px;
            top: 290px;
            animation: twinkling 3s infinite;
          }

          #star-5 {
            position: absolute;
            left: 50px;
            top: 270px;
            animation: twinkling 1.5s infinite;
          }

          #star-6 {
            position: absolute;
            left: 250px;
            top: -50px;
            animation: twinkling 4s infinite;
          }

          #star-7 {
            position: absolute;
            left: 290px;
            top: 60px;
            animation: twinkling 2s infinite;
          }

          .hero-button:hover {
            box-shadow: 10px 10px 22px #273049, -10px -10px 22px #6b84c5 !important;
          }

          .hero-button:active {
            background: #4a5a86 !important;
            box-shadow: inset 7px 7px 15px #273049, inset -7px -7px 15px #6b84c5 !important;
          }
        `}</style>
      </section>

      {/* Trusted By Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
            Trusted by the world's most innovative teams
          </h2>
          <div className="mt-10 w-full overflow-hidden" style={{
            maskImage: 'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 128px), transparent 100%)'
          }}>
            <div className="flex">
              <div className="flex w-max items-center animate-scroll space-x-16 hover:[animation-play-state:paused]">
                {/* Logos Set 1 */}
                <svg className="max-h-12 w-40 flex-none object-contain" viewBox="0 0 158 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.13,32.35,36.5,25.8C35.84,24.13,35,22.25,35,22.25H34.8c-.13.4-1.2,3.33-2.06,5.4l-2.2,5.7H25.4L33.73,11.4h5.2l8.2,20.95Z" fill="#5E6D82" />
                  <path d="M49.33,21.55c0-6-4.4-9.6-11.2-9.6H29.73v29.5H39c6.93,0,10.93-3.6,10.93-9.73,0-4.33-2.6-7.33-6.6-8.13a6,6,0,0,1,6-6.1Z" fill="#5E6D82" />
                </svg>
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg" alt="Reform" />
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg" alt="Tuple" />
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg" alt="SavvyCal" />
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg" alt="Statamic" />
              </div>
              <div className="flex w-max items-center animate-scroll space-x-16 hover:[animation-play-state:paused]" aria-hidden="true">
                {/* Logos Set 2 */}
                <svg className="max-h-12 w-40 flex-none object-contain" viewBox="0 0 158 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.13,32.35,36.5,25.8C35.84,24.13,35,22.25,35,22.25H34.8c-.13.4-1.2,3.33-2.06,5.4l-2.2,5.7H25.4L33.73,11.4h5.2l8.2,20.95Z" fill="#5E6D82" />
                </svg>
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg" alt="Reform" />
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg" alt="Tuple" />
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg" alt="SavvyCal" />
                <img className="max-h-12 w-40 flex-none object-contain" src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg" alt="Statamic" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Challenges Employees Face</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            If You're Qualified But Still Struggling, You're Not Alone.
          </h1>
          <h2 className="mt-6 text-lg md:text-xl text-gray-600">
            75% of qualified professionals are stuck in the same broken system. Here's why traditional approaches fail.
          </h2>
        </div>
        
        {/* Wrapper for sticky behavior */}
        <div>
          {/* Sticky Tab Navigation */}
          <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-4 mb-12">
            <div className="border border-gray-200 rounded-lg p-1.5 grid grid-cols-3 gap-1.5 bg-white shadow-sm max-w-2xl mx-auto">
              <button 
                data-tab="career-hub" 
                className={`tab-btn w-full text-center py-3 px-4 rounded-md text-gray-600 ${activeTab === 'career-hub' ? 'active' : ''}`}
                onClick={() => setActiveTab('career-hub')}
              >
                Career Hub
              </button>
              <button 
                data-tab="brand-building"
                className={`tab-btn w-full text-center py-3 px-4 rounded-md text-gray-600 ${activeTab === 'brand-building' ? 'active' : ''}`}
                onClick={() => setActiveTab('brand-building')}
              >
                Brand Building
              </button>
              <button 
                data-tab="upskilling" 
                className={`tab-btn w-full text-center py-3 px-4 rounded-md text-gray-600 ${activeTab === 'upskilling' ? 'active' : ''}`}
                onClick={() => setActiveTab('upskilling')}
              >
                Upskilling
              </button>
            </div>
          </div>

          {/* Content Sections */}
          <div id="content-sections-challenges">
            {/* Career Hub Section */}
            <section id="career-hub" className="scroll-section mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-200 bg-white rounded-xl overflow-hidden max-w-6xl mx-auto">
                <div className="p-8 md:p-12 order-2 md:order-1">
                  <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-4 text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    The ATS Black Hole
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="text-red-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">75% of resumes never reach human eyes</h3>
                        <p className="text-red-700 text-sm mt-1">ATS systems reject qualified candidates due to formatting issues, missing keywords, or poor optimization</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-3 flex-shrink-0">•</span>
                      <span>You spend hours tailoring each application, only to hear nothing back</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-3 flex-shrink-0">•</span>
                      <span>Less qualified candidates get interviews while you're stuck in the system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 mr-3 flex-shrink-0">•</span>
                      <span>The whole process feels like throwing darts in the dark</span>
                    </li>
                  </ul>
                </div>
                <div className="h-64 md:h-full order-1 md:order-2">
                  <img src="https://ik.imagekit.io/fdd16n9cy/-a-sleek--modern-laptop-sits-on-a-dark-desk--the-s.png?updatedAt=1757888837988" alt="ATS Black Hole Visual" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>

            {/* Brand Building Section */}
            <section id="brand-building" className="scroll-section mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-200 bg-white rounded-xl overflow-hidden max-w-6xl mx-auto">
                <div className="p-8 md:p-12 order-2 md:order-1">
                  <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    The Authority Gap
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="text-blue-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800">Your expertise stays hidden</h3>
                        <p className="text-blue-700 text-sm mt-1">While louder voices get the opportunities, your knowledge and skills remain invisible to decision-makers</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">•</span>
                      <span>You know you should be posting on LinkedIn, but staring at that blank text box gives you instant writer's block</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">•</span>
                      <span>You see others building authority while you struggle to find time for consistent content creation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">•</span>
                      <span>Opportunities go to those who are visible, not necessarily those who are most qualified</span>
                    </li>
                  </ul>
                </div>
                <div className="h-64 md:h-full order-1 md:order-2">
                  <img src="https://ik.imagekit.io/fdd16n9cy/_Isometric%20illustration%20of%20a%20LinkedIn%20feed%20with%20blue%20tones,%20cards,%20and%20interaction%20buttons%20(thumbs%20up,%20comment%20icons),%20but%20avoid%20using%20the%20exact%20logo.%20Minimalist%20blue%20and%20white%20color%20palette,%20clean%20lines,%20mo.jpg?updatedAt=1757931363825" alt="Brand Building Visual" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>

            {/* Upskilling Section */}
            <section id="upskilling" className="scroll-section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-200 bg-white rounded-xl overflow-hidden max-w-6xl mx-auto">
                <div className="p-8 md:p-12 order-2 md:order-1">
                  <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0112 3c1.398 0 2.743.57 3.714 1.543C18.5 6.5 19 9 19 11c2 1 2.657 1.657 2.657 1.657a8 8 0 01-4.001 6.001z" />
                      </svg>
                    </div>
                    Staying Future-Proof
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="text-green-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L8 12.586V5a1 1 0 012 0v7.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">The Upskilling Dilemma</h3>
                        <p className="text-green-700 text-sm mt-1">It's not about finding time to learn; it's about the fear of learning the wrong thing.</p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3 flex-shrink-0">•</span>
                      <span>Struggling to decide which career path or skill set to pursue for long-term growth.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3 flex-shrink-0">•</span>
                      <span>Lack of clear insights into how industries, technologies, and job demands will shift in the future.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3 flex-shrink-0">•</span>
                      <span>Mental struggles of upskilling—less about "I don't have time" and more about "Am I even going in the right direction?</span>
                    </li>
                  </ul>
                </div>
                <div className="h-64 md:h-full order-1 md:order-2 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Upskilling Visual</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Career Growth Ecosystem Title */}
        <div className="text-center pt-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Your Complete Career Growth Ecosystem
          </h1>
          <h2 className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Three integrated pillars working together to accelerate your career and build unstoppable authority
          </h2>
        </div>
        
        {/* Content Creation Section */}
        <div className="max-w-xl mx-auto text-center py-12">
          <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-4 py-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Content Creation
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Build Authority Without the Burnout</h3>
          <p className="text-gray-600">
            Generate authentic content that builds real authority while you focus on your actual work
          </p>
        </div>

        {/* React Carousel Section */}
        <ScrollSyncedCarousel useCases={useCases} id="carousel1" />

        {/* Career Hub Section Title */}
        <div className="max-w-xl mx-auto text-center py-12">
          <div className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-4 py-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Career Hub
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Land Your Dream Job Faster</h3>
          <p className="text-gray-600">
            Optimize your resume, tailor applications, and ace interviews with powerful AI tools.
          </p>
        </div>

        {/* Second React Carousel Section */}
        <ScrollSyncedCarousel useCases={useCases2} id="carousel2" />
        
        {/* Upskilling Section Title */}
        <div className="max-w-xl mx-auto text-center py-12">
          <div className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 px-4 py-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3.5 2.5a.5.5 0 00-1 0V3a2 2 0 00-2 2v9.5a.5.5 0 001 0V5a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1v-2.5a.5.5 0 00-1 0V15a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H3.5v-.5z" />
              <path d="M14.354 1.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L7 8.293l6.646-6.647a.5.5 0 01.708 0z" />
            </svg>
            Upskilling
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Stay Ahead of Market Demands</h3>
          <p className="text-gray-600">
            AI-guided skill development that keeps you competitive and future-ready
          </p>
        </div>

        {/* Third React Carousel Section */}
        <ScrollSyncedCarousel useCases={useCases3} id="carousel3" />

        {/* New Feature Section */}
        <div className="py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left side: Text Content */}
            <div className="space-y-12">
              {/* Feature 1 */}
              <div className="relative pl-8 border-l-2 border-gray-200">
                <div className="absolute -left-px top-2 h-8 w-1 bg-indigo-600 rounded-full"></div>
                <h3 className="text-3xl font-bold text-gray-900">Innovative Career Solutions</h3>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  Experience a suite of tools designed to simplify your job search and enhance your professional presence. Our platform empowers you to take charge of your career with tailored resources.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="relative pl-8 border-l-2 border-gray-200">
                <h3 className="text-3xl font-bold text-gray-900">Streamlined Job Applications</h3>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  Automate your application process with AI-driven resume tailoring and cover letter generation. Save time and increase your chances of landing interviews with our smart features.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="relative pl-8 border-l-2 border-gray-200">
                <h3 className="text-3xl font-bold text-gray-900">Personalized Learning Paths</h3>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                  Stay competitive with customized learning roadmaps that align with industry trends. Our platform provides strategic skill recommendations to enhance your career growth.
                </p>
              </div>
            </div>
            {/* Right side: Image */}
            <div className="flex items-center justify-center">
              <img className="w-full max-w-md lg:max-w-full h-auto rounded-xl shadow-2xl" src="https://placehold.co/600x600/e0e7ff/4338ca?text=Future+of+Work" alt="Innovative Career Solutions" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-base font-semibold leading-7 text-indigo-600">Tagline</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Medium length section heading goes here</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Stat 1 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                <p className="text-7xl font-bold text-indigo-600">75%</p>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">Faster job applications</h3>
                <p className="mt-2 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              {/* Stat 2 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                <p className="text-7xl font-bold text-indigo-600">60%</p>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">Improved interview success</h3>
                <p className="mt-2 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              {/* Stat 3 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                <p className="text-7xl font-bold text-indigo-600">50%</p>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">Enhanced professional visibility</h3>
                <p className="mt-2 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
            <div className="mt-16 flex justify-center items-center gap-x-6">
              <button 
                onClick={() => navigate('/signup')}
                className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Button
              </button>
              <a href="#" className="text-base font-semibold leading-6 text-gray-900 group">
                Button <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-base font-semibold leading-7 text-indigo-600">Benefits</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Automated job application process</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">Transform your career journey with an intelligent platform that combines cutting-edge AI technology and comprehensive professional development tools.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src="https://placehold.co/395x240/ddd6fe/3730a3?text=Brand+Building" alt="Professional brand building" />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">Build your professional brand</h3>
                    <p className="mt-3 text-base text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.</p>
                  </div>
                </div>
              </div>
              {/* Benefit 2 */}
              <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src="https://placehold.co/395x240/c7d2fe/3730a3?text=Skill+Development" alt="Skill development" />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">Future-ready skill development</h3>
                    <p className="mt-3 text-base text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.</p>
                  </div>
                </div>
              </div>
              {/* Benefit 3 */}
              <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src="https://placehold.co/395x240/a5b4fc/3730a3?text=Career+Growth" alt="Medium length section heading" />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">Medium length section heading goes here</h3>
                    <p className="mt-3 text-base text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 flex items-center gap-x-6">
              <button 
                onClick={() => navigate('/signup')}
                className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </button>
              <a href="#" className="text-base font-semibold leading-6 text-gray-900 group">
                Learn more <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Success stories</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">Real professionals, real transformations</p>
            </div>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Story 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="h-8">
                    <svg className="h-8 w-auto text-gray-400" viewBox="0 0 120 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M115.7 19.29H113.59V30.75H110.16V19.29H106.73V16.22H115.7V19.29Z" />
                      <path d="M96.44 16.22H102.35V19.29H99.78V30.75H96.44V16.22Z" />
                    </svg>
                  </div>
                  <blockquote className="mt-8 text-xl font-medium text-gray-900">
                    <p>"Career Clarified helped me land my dream job in tech within weeks"</p>
                  </blockquote>
                </div>
                <div className="mt-6">
                  <div className="flex items-center gap-x-4">
                    <img className="h-14 w-14 rounded-full" src="https://placehold.co/56x56/e2e8f0/64748b" alt="" />
                    <div>
                      <div className="font-semibold text-gray-900">Sarah Johnson</div>
                      <div className="text-gray-600">Senior product manager</div>
                    </div>
                  </div>
                  <a href="#" className="mt-8 text-indigo-600 font-semibold flex items-center group">
                    Read case study
                    <span className="transition-transform group-hover:translate-x-1 ml-2" aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              {/* Story 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="h-8">
                    <svg className="h-8 w-auto text-gray-400" viewBox="0 0 120 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M113.59 9H110.16V20.46H106.73V9H103.3V30.75H106.73V23.53H110.16V30.75H113.59V9Z"/>
                      <path d="M96.44 9H102.35V12.07H99.78V30.75H96.44V9Z"/>
                    </svg>
                  </div>
                  <blockquote className="mt-8 text-xl font-medium text-gray-900">
                    <p>"The AI resume builder is a game-changer for job seekers"</p>
                  </blockquote>
                </div>
                <div className="mt-6">
                  <div className="flex items-center gap-x-4">
                    <img className="h-14 w-14 rounded-full" src="https://placehold.co/56x56/e2e8f0/64748b" alt="" />
                    <div>
                      <div className="font-semibold text-gray-900">Michael Chen</div>
                      <div className="text-gray-600">Software engineer</div>
                    </div>
                  </div>
                  <a href="#" className="mt-8 text-indigo-600 font-semibold flex items-center group">
                    Read case study
                    <span className="transition-transform group-hover:translate-x-1 ml-2" aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32 xl:px-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side: Text and Form */}
                <div>
                  <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Ready to transform your career?</h2>
                  <p className="mt-6 text-lg leading-8 text-gray-300">Start your professional growth journey with our comprehensive AI-powered career development platform.</p>
                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <input type="email" placeholder="Enter your email" className="w-full sm:flex-auto rounded-md border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6" />
                    <button 
                      onClick={() => navigate('/signup')}
                      type="submit" 
                      className="w-full sm:w-auto flex-none rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Sign Up
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-gray-400">By clicking Sign Up you're confirming that you agree with our <a href="#" className="underline hover:text-white">Terms and Conditions</a>.</p>
                </div>
                {/* Right Side: Image */}
                <div className="hidden lg:block">
                  <img className="w-full h-auto rounded-xl object-cover" src="https://placehold.co/640x404/111827/4f46e5?text=Join+Us" alt="CTA Image" />
                </div>
              </div>
              <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2" aria-hidden="true">
                <circle cx="512" cy="512" r="512" fill="url(#gradient-bg)" fillOpacity="0.7"></circle>
                <defs>
                  <radialGradient id="gradient-bg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(512 512) rotate(90) scale(512)">
                    <stop stopColor="#7775D6"></stop>
                    <stop offset="1" stopColor="#E935C1" stopOpacity="0"></stop>
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Empower Your Career Journey Today</h2>
                <p className="mt-4 text-base text-gray-600">Join thousands transforming their careers with our innovative AI-driven platform.</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-x-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="rounded-md bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-700"
                >
                  Subscribe
                </button>
                <a href="#" className="rounded-md px-6 py-3 text-base font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100">Contact</a>
              </div>
            </div>
            <hr className="my-16 border-gray-200" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {/* Column 1 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Resources</h3>
                <ul className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Blog Posts</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQs</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Use</a></li>
                </ul>
              </div>
              {/* Column 2 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Company</h3>
                <ul className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">About Us</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Press Releases</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Support</a></li>
                </ul>
              </div>
              {/* Column 3 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Connect</h3>
                <ul className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">LinkedIn</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Facebook</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Instagram</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">YouTube</a></li>
                </ul>
              </div>
              {/* Column 4 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Community</h3>
                <ul className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">User Forum</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Feedback</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Events</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Webinars</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Workshops</a></li>
                </ul>
              </div>
              {/* Column 5 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Newsletters</h3>
                <ul className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Join Our Community</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Stay Updated</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Get Involved</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Share Your Story</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Explore Opportunities</a></li>
                </ul>
              </div>
              {/* Column 6 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900">Legal</h3>
                <ul className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Accessibility Statement</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">User Agreement</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Sitemap</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
                </ul>
              </div>
            </div>

            <hr className="my-16 border-gray-200" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-sm text-gray-500">© 2025 Career Clarified. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm-1.163 1.943h.001c-2.296 0-2.586.01-3.486.05-1.178.05-1.84.21-2.494.45-1.025.38-1.88.94-2.73 1.78a6.8 6.8 0 00-1.78 2.73c-.24 1.15-.4 1.81-.45 2.49-.04 1.02-.05 1.28-.05 3.48s.01 2.46.05 3.48c.05 1.18.21 1.84.45 2.49.38 1.02.94 1.88 1.78 2.73a6.8 6.8 0 002.73 1.78c1.15.24 1.81.4 2.49.45 1.02.04 1.28.05 3.48.05s2.46-.01 3.48-.05c1.18-.05 1.84-.21 2.49-.45.99-.38 1.84-.94 2.73-1.78.79-.85 1.35-1.7 1.78-2.73.24-1.15.4-1.81.45-2.49.04-1.02.05-1.28.05-3.48s-.01-2.46-.05-3.48c-.05-1.18-.21-1.84-.45-2.49-.38-.99-.94-1.84-1.78-2.73-.85-.79-1.7-1.35-2.73-1.78-1.15-.24-1.81-.4-2.49-.45-1.02-.04-1.28-.05-3.48-.05zm-4.4 2.61a5.4 5.4 0 1110.8 0 5.4 5.4 0 01-10.8 0zM12 15.11a3.11 3.11 0 100-6.22 3.11 3.11 0 000 6.22zm4.3-8.11a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .tab-btn.active {
          background-color: #F7F5F2;
          color: #260F14;
          font-weight: 500;
        }

        .scroll-section {
          scroll-margin-top: 120px;
        }
      `}</style>
    </div>
  );
};

export default Home;