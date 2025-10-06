import { Upload, Brain, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Upload Video',
    description: 'Drag and drop your speech video. Supports MP4, AVI, MOV formats up to 500MB.',
    icon: Upload
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our NLP models process speech-to-text, empathy, emotions, and key themes in 60-120 seconds.',
    icon: Brain
  },
  {
    number: '03',
    title: 'View Insights',
    description: 'Access comprehensive dashboard with scores, sentiment, themes, and export reports.',
    icon: BarChart3
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-10 sm:py-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2.5">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three simple steps to analyze any political speech and get actionable insights
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm"
          >
            Start Analyzing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: typeof steps[0];
  index: number;
}

function StepCard({ step, index }: StepCardProps) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <div className="group bg-white rounded-xl border border-slate-200 p-6 h-full hover:shadow-lg hover:border-slate-300 transition-all duration-300">
        {/* Step Number Badge */}
        <div className="absolute -top-3 -left-3 w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
          {step.number}
        </div>

        {/* Icon with decorative background */}
        <div className="relative mb-5 mt-2">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
      </div>

      {/* Connecting Arrow with animation */}
      {index < steps.length - 1 && (
        <div className="hidden md:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-10 items-center">
          <motion.div
            initial={{ x: -5, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <ArrowRight className="h-6 w-6 text-slate-400" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
