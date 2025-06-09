'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const screenshots = [
  {
    title: "Task Management Dashboard",
    description: "Assign, track and manage tasks across your construction projects with ease.",
  },
  {
    title: "Mobile Approvals",
    description: "Review and approve requests directly from your mobile device, no matter where you are.",
  },
  {
    title: "Site Diary",
    description: "Quickly log daily activities, weather conditions, and progress updates.",
  },
  {
    title: "Project Dashboard",
    description: "Get a comprehensive overview of all your projects in one centralized location.",
  },
];

const ScreenshotsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Designed for Construction Teams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intuitive interface makes managing construction projects simple and efficient.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Screenshot carousel */}
          <div className="bg-gray-200 rounded-lg aspect-[16/9] w-full overflow-hidden relative">
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <h3 className="text-2xl font-semibold mb-4">{screenshots[currentIndex].title}</h3>
                <p className="text-gray-700 mb-6">{screenshots[currentIndex].description}</p>
                <div className="bg-gray-300 text-gray-500 py-20 px-4 rounded">
                  [Screenshot placeholder: {screenshots[currentIndex].title}]
                </div>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <Button 
              variant="secondary"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="secondary"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-yellow-500" : "w-2 bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection; 