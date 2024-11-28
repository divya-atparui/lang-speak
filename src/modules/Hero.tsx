"use client"
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

const Hero = () => {
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
      .fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        buttonsRef.current?.children ? Array.from(buttonsRef.current.children) : [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.2 },
        '-=0.3'
      );

    // Optional: Animate the background gradient
    gsap.fromTo(
      '.bg-gradient',
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );
  }, []);

  return (
    <section className="relative  pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            ref={headingRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Learn Languages Through
            <span className="text-blue-600 dark:text-blue-400"> Natural Conversation</span>
          </h1>
          <p 
            ref={textRef}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Master any language naturally through AI-powered conversations. Practice speaking and improve your fluency with personalized language learning.
          </p>
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/get-started"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
};

export default Hero;
