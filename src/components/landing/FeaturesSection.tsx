import { Heart, Globe, Zap, Tags, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Heart,
    title: 'Empathy Analysis',
    description: 'Measure emotional connection and compassion in speeches with advanced NLP',
    metric: '8.2/10 avg'
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Analyze Hindi, Marathi, English, Tamil speeches with 95%+ accuracy',
    metric: '4 languages'
  },
  {
    icon: Zap,
    title: 'Real-Time',
    description: 'Get instant feedback and actionable insights in under 2 minutes',
    metric: '60-120 sec'
  },
  {
    icon: Tags,
    title: 'Theme Extraction',
    description: 'Identify key topics, policy focus, and rhetorical strategies',
    metric: 'Top 5 themes'
  },
  {
    icon: TrendingUp,
    title: 'Sentiment Analysis',
    description: 'Track emotional tone, positivity, and audience engagement levels',
    metric: '95% accurate'
  },
  {
    icon: FileText,
    title: 'Export Reports',
    description: 'Download comprehensive analysis in PDF, CSV, or JSON formats',
    metric: '3 formats'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-10 sm:py-14 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2.5">
            Professional Speech Analysis Tools
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to analyze political speeches and understand communication impact
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        {/* Icon with enhanced design */}
        <div className="mb-4 relative">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{feature.description}</p>

        {/* Metric Badge with better design */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all duration-300">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          {feature.metric}
        </div>
      </div>
    </motion.div>
  );
}
