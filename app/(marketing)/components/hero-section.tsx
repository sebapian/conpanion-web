import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="w-full pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center">
        <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Streamline Construction Project Management
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Purpose-built tools that simplify workflows for construction teams on-site and in the office
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-6 text-lg"
            >
              <Link href="#newsletter">Join the Waitlist</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 px-8 py-6 text-lg"
            >
              <Link href="#pain-points">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative">
          <div className="bg-gray-200 rounded-lg aspect-video w-full flex items-center justify-center">
            <p className="text-gray-500 text-center p-8">
              [Construction site image: Workers using tablets on a construction site with building framework in background]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 