import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PriceProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

const PriceCard = ({ name, price, description, features, highlighted, buttonText }: PriceProps) => {
  return (
    <div 
      className={`rounded-lg p-8 flex flex-col h-full ${
        highlighted 
          ? 'bg-yellow-50 border-2 border-yellow-500 shadow-lg' 
          : 'bg-white border border-gray-200 shadow-md'
      }`}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Custom' && <span className="text-gray-600">/month</span>}
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        className={highlighted 
          ? "bg-yellow-500 hover:bg-yellow-600 text-white w-full" 
          : "bg-gray-100 hover:bg-gray-200 text-gray-900 w-full"
        }
      >
        {buttonText}
      </Button>
    </div>
  );
};

const PricingSection = () => {
  const pricingOptions = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for small construction teams",
      features: [
        "Up to 3 projects",
        "Basic task management",
        "Mobile access",
        "Simple approvals",
        "Site diary"
      ],
      buttonText: "Get Started"
    },
    {
      name: "Professional",
      price: "$79",
      description: "For growing construction businesses",
      features: [
        "Up to 15 projects",
        "Advanced task management",
        "Full mobile functionality",
        "Comprehensive approvals",
        "Advanced site diary",
        "Notifications",
        "Dashboard analytics"
      ],
      highlighted: true,
      buttonText: "Recommended"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large construction operations",
      features: [
        "Unlimited projects",
        "Full feature access",
        "Advanced analytics",
        "API access",
        "Dedicated support",
        "Custom integrations",
        "Personalized onboarding"
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your construction business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingOptions.map((option, index) => (
            <PriceCard
              key={index}
              name={option.name}
              price={option.price}
              description={option.description}
              features={option.features}
              highlighted={option.highlighted}
              buttonText={option.buttonText}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-700">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-gray-700 mt-2">
            <span className="font-medium">Pilot Program Partners:</span> Special pricing available. 
            <Button variant="link" className="text-yellow-500 hover:text-yellow-600 underline">
              Contact us
            </Button> for details.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 