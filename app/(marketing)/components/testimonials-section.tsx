import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  company: string;
}

const Testimonial = ({ quote, name, role, company }: TestimonialProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="text-yellow-500 mb-4">
        <Quote size={28} />
      </div>
      <p className="text-gray-700 italic mb-6 flex-grow">{quote}</p>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-gray-600 text-sm">
          {role}, {company}
        </p>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  // Placeholder testimonials
  const testimonials = [
    {
      quote: "[Placeholder] Conpanion has transformed how we manage our construction projects. The mobile functionality has been a game-changer for our site teams.",
      name: "Jane Doe",
      role: "Project Manager",
      company: "ABC Construction"
    },
    {
      quote: "[Placeholder] The approval workflow in Conpanion has cut our decision-making time in half. We're able to move much faster on critical issues.",
      name: "John Smith",
      role: "Site Supervisor",
      company: "XYZ Builders"
    },
    {
      quote: "[Placeholder] Our site diaries are now consistently completed and provide valuable insights. The simple interface makes a big difference.",
      name: "Alex Johnson",
      role: "Operations Director",
      company: "123 Construction Group"
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What Our Pilot Partners Are Saying
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Here's what early adopters have to say about their experience with Conpanion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 italic">
            These are placeholder testimonials. Real customer stories will be featured here as our pilot program progresses.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 