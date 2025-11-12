import { Service } from './types';

export const services: Service[] = [
  {
    id: 'facial',
    name: 'Facial Treatment',
    description: 'Deep cleansing facial with hydrating mask',
    duration: '60 minutes',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&q=80',
    details: {
      whatToExpect: [
        'Deep cleansing and exfoliation',
        'Customized mask treatment',
        'Hydrating serum application',
        'Gentle facial massage',
      ],
      benefits: [
        'Improved skin texture and tone',
        'Deep hydration and nourishment',
        'Reduced appearance of fine lines',
        'Radiant, glowing complexion',
      ],
      preparation: [
        'Arrive with clean, makeup-free skin',
        'Avoid sun exposure 24 hours before',
        'Skip retinol products 2 days prior',
      ],
    },
  },
  {
    id: 'botox',
    name: 'Botox Consultation',
    description: 'Expert consultation for Botox treatments',
    duration: '30 minutes',
    imageUrl: 'https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg',
    details: {
      whatToExpect: [
        'Comprehensive skin analysis',
        'Discussion of treatment goals',
        'Personalized treatment plan',
        'Q&A session with expert',
      ],
      benefits: [
        'Expert guidance on Botox options',
        'Personalized treatment recommendations',
        'Clear understanding of results',
        'Safe, informed decision-making',
      ],
      preparation: [
        'Come with questions prepared',
        'Share medical history and concerns',
        'No special preparation needed',
      ],
    },
  },
  {
    id: 'hair-removal',
    name: 'Hair Removal',
    description: 'Laser hair removal session',
    duration: '45 minutes',
    imageUrl: 'https://www.kolorshealthcare.com/blog/wp-content/uploads/2023/07/Laser-Hair-Removal-Face.jpg',
    details: {
      whatToExpect: [
        'Pre-treatment skin assessment',
        'Laser treatment of target area',
        'Cooling gel application',
        'Post-treatment care instructions',
      ],
      benefits: [
        'Long-lasting hair reduction',
        'Smooth, hair-free skin',
        'Minimal discomfort',
        'Precision targeting',
      ],
      preparation: [
        'Shave treatment area 24 hours before',
        'Avoid sun exposure 2 weeks prior',
        'No waxing or plucking 4 weeks before',
        'Arrive with clean, product-free skin',
      ],
    },
  },
];

