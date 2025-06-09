import { Smartphone, ClipboardList, CheckCircle, BookOpen, Bell, LayoutDashboard } from 'lucide-react';

interface PainPointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PainPoint = ({ icon, title, description }: PainPointProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4 text-yellow-500">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 bg-gray-100 rounded p-3 text-sm text-gray-500">
        [Screenshot placeholder: {title} interface]
      </div>
    </div>
  );
};

const PainPointsSection = () => {
  const painPoints = [
    {
      icon: <Smartphone size={32} />,
      title: "Mobile-First",
      description: "Record once on-site and submit for approval, eliminating double-entry and paperwork."
    },
    {
      icon: <ClipboardList size={32} />,
      title: "Task Management",
      description: "Assign tasks with all required forms attached, ensuring nothing falls through the cracks."
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Instant Approvals",
      description: "Request and receive approvals seamlessly, accelerating decision-making processes."
    },
    {
      icon: <BookOpen size={32} />,
      title: "Simplified Site Diaries",
      description: "No complicated flows for daily reporting, making it easy to document progress."
    },
    {
      icon: <Bell size={32} />,
      title: "Real-time Notifications",
      description: "Stay updated across your entire project with timely alerts and reminders."
    },
    {
      icon: <LayoutDashboard size={32} />,
      title: "Project Dashboard",
      description: "Full visibility of your construction project with key metrics and progress tracking."
    }
  ];

  return (
    <section id="pain-points" className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Built for Construction Challenges
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've designed Conpanion to address the specific pain points that construction professionals face daily.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <PainPoint
              key={index}
              icon={point.icon}
              title={point.title}
              description={point.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection; 