
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export interface Temple {
  id: string;
  name: string;
  location: string;
  description: string;
  image: ImagePlaceholder;
}

export interface Pooja {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    price: number;
    image: ImagePlaceholder;
    tags: string[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: ImagePlaceholder;
    rating: number;
    reviews: number;
}

export interface User {
    displayName: string;
    email: string;
    photoURL?: string;
    plan: 'Free' | 'Premium';
    bio: string;
}

const heroImage = PlaceHolderImages.find((img) => img.id === 'temple-south');
const templeNorth = PlaceHolderImages.find((img) => img.id === 'temple-north');
const poojaGanesh = PlaceHolderImages.find((img) => img.id === 'pooja-ganesh');
const poojaLakshmi = PlaceHolderImages.find((img) => img.id === 'pooja-lakshmi');

export const temples: Temple[] = [
    {
      id: 't1',
      name: 'Sri Venkateswara Temple',
      location: 'Tirupati, Andhra Pradesh',
      description: 'A landmark Vaishnavite temple situated in the hill town of Tirumala at Tirupati in Tirupati district of Andhra Pradesh, India.',
      image: heroImage!,
    },
    {
      id: 't2',
      name: 'Kashi Vishwanath Temple',
      location: 'Varanasi, Uttar Pradesh',
      description: 'One of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India.',
      image: templeNorth!,
    },
     {
      id: 't3',
      name: 'Ganesh Temple',
      location: 'Mumbai, Maharashtra',
      description: 'A famous temple dedicated to Lord Ganesh, attracting many devotees daily.',
      image: poojaGanesh!,
    },
    {
      id: 't4',
      name: 'Lakshmi Temple',
      location: 'Jaipur, Rajasthan',
      description: 'A beautiful temple dedicated to the goddess of wealth, Lakshmi.',
      image: poojaLakshmi!,
    },
  ];
  

export const poojas: Pooja[] = [
  {
    id: 'p1',
    name: 'Ganesh Pooja',
    description: 'A special pooja to seek the blessings of Lord Ganesha for success and removal of obstacles.',
    date: 'July 28, 2024',
    time: '8:00 AM - 10:00 AM',
    price: 51,
    image: PlaceHolderImages.find((img) => img.id === 'pooja-ganesh')!,
    tags: ['New Beginnings', 'Success'],
  },
  {
    id: 'p2',
    name: 'Satyanarayan Pooja',
    description: 'A ritual to honor Lord Vishnu and seek his blessings for health, wealth, and prosperity.',
    date: 'August 5, 2024',
    time: '6:00 PM - 8:00 PM',
    price: 101,
    image: PlaceHolderImages.find((img) => img.id === 'pooja-satyanarayan')!,
    tags: ['Prosperity', 'Family'],
  },
  {
    id: 'p3',
    name: 'Lakshmi Pooja',
    description: 'Invoke the goddess of wealth and fortune for financial well-being and abundance.',
    date: 'August 12, 2024',
    time: '7:00 PM - 8:30 PM',
    price: 75,
    image: PlaceHolderImages.find((img) => img.id === 'pooja-lakshmi')!,
    tags: ['Wealth', 'Diwali Special'],
  },
  {
    id: 'p4',
    name: 'Havan / Yagna',
    description: 'A fire ritual to purify the environment and invoke divine energies for spiritual growth.',
    date: 'Upon Request',
    time: 'Flexible',
    price: 251,
    image: PlaceHolderImages.find((img) => img.id === 'pooja-havan')!,
    tags: ['Purification', 'Spiritual'],
  },
    {
    id: 'p5',
    name: 'Saraswati Pooja',
    description: 'Dedicated to the goddess of knowledge, music, and arts. Ideal for students and artists.',
    date: 'August 20, 2024',
    time: '9:00 AM - 11:00 AM',
    price: 61,
    image: PlaceHolderImages.find((img) => img.id === 'pooja-saraswati')!,
    tags: ['Knowledge', 'Education'],
  },
  {
    id: 'p6',
    name: 'Navagraha Pooja',
    description: 'A pooja to appease the nine planets and mitigate their negative effects on one\'s life.',
    date: 'Upon Request',
    time: 'Flexible',
    price: 151,
    image: PlaceHolderImages.find((img) => img.id === 'pooja-navagraha')!,
    tags: ['Astrology', 'Well-being'],
  },
];


export const products: Product[] = [
  {
    id: 's1',
    name: 'Tirupati Laddu Prasad',
    description: 'Authentic, sacred laddu from the famous Tirupati temple, made with pure ghee and nuts.',
    price: 15,
    image: PlaceHolderImages.find((img) => img.id === 'product-prasad')!,
    rating: 4.9,
    reviews: 1200,
  },
  {
    id: 's2',
    name: 'Panchamrita',
    description: 'A holy mixture of five nectars: milk, yogurt, honey, ghee, and sugar.',
    price: 25,
    image: PlaceHolderImages.find((img) => img.id === 'product-incense')!,
    rating: 4.8,
    reviews: 450,
  },
  {
    id: 's3',
    name: 'Brass Diya Set',
    description: 'A set of two beautifully handcrafted brass oil lamps for your home altar.',
    price: 45,
    image: PlaceHolderImages.find((img) => img.id === 'product-diya')!,
    rating: 4.7,
    reviews: 310,
  },
  {
    id: 's4',
    name: 'Marble Krishna Statue',
    description: 'A 6-inch exquisite marble murti of Lord Krishna, perfect for worship and decor.',
    price: 120,
    image: PlaceHolderImages.find((img) => img.id === 'product-murti')!,
    rating: 4.9,
    reviews: 150,
  },
];

export const user: User = {
    displayName: "Devotee User",
    email: "devotee.user@example.com",
    photoURL: PlaceHolderImages.find((img) => img.id === 'user-avatar-1')?.imageUrl,
    plan: "Premium",
    bio: "A passionate devotee dedicated to spiritual growth and supporting temple communities."
}
