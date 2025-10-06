import { Target, Users, Heart, DollarSign, AlertCircle } from 'lucide-react';

interface CallToAction {
  timestamp: string;
  text: string;
  type: string;
}

interface CallToActionsListProps {
  actions: CallToAction[];
}

export default function CallToActionsList({ actions }: CallToActionsListProps) {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vote_appeal':
        return <Target className="h-5 w-5" />;
      case 'rally':
        return <Users className="h-5 w-5" />;
      case 'donation':
        return <DollarSign className="h-5 w-5" />;
      case 'support':
        return <Heart className="h-5 w-5" />;
      case 'awareness':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vote_appeal':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'rally':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'donation':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'support':
        return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'awareness':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!actions || actions.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">No specific calls to action detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <div key={index} className={`border-l-4 p-4 rounded-r-lg ${getTypeColor(action.type)} border`}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getTypeIcon(action.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">
                  {action.timestamp}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-white border">
                  {formatType(action.type)}
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                {action.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
