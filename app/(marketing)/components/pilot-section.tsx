import { Button } from '@/components/ui/button';
import { ArrowRight, Building, Users, Headset, Coins } from 'lucide-react';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Benefit = ({ icon, title, description }: BenefitProps) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-yellow-500 mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const PilotSection = () => {
  const benefits = [
    {
      icon: <Building size={24} />,
      title: "Early Access to Features",
      description: "Be the first to use new features and shape their development."
    },
    {
      icon: <Users size={24} />,
      title: "Influence Product Development",
      description: "Your feedback directly impacts our roadmap and priorities."
    },
    {
      icon: <Headset size={24} />,
      title: "Dedicated Support",
      description: "Get priority access to our support team during implementation and use."
    },
    {
      icon: <Coins size={24} />,
      title: "Special Pricing",
      description: "Pilot partners receive preferred pricing as early adopters."
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Become a Pilot Partner
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're looking for construction companies to partner with us as we refine our platform. 
              Join our pilot program to help shape the future of construction project management.
            </p>
            
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <Benefit
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
            
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center">
              Apply for Pilot Program <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-gray-200 rounded-lg aspect-square w-full flex items-center justify-center">
              <p className="text-gray-500 text-center p-8">
                [Image placeholder: Construction team in meeting using tablets with project plans visible]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilotSection; 