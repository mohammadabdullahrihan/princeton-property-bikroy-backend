const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Property = require('../models/Property');

dotenv.config();

// Real Unsplash image URLs for flats and lands
const flatImages = [
  [
    { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=75', caption: 'Living Room' },
    { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=75', caption: 'Bedroom' },
    { url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1000&q=75', caption: 'Kitchen' }
  ],
  [
    { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=75', caption: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=75', caption: 'Balcony' },
    { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=75', caption: 'Master Bedroom' }
  ],
  [
    { url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=75', caption: 'Living Area' },
    { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=75', caption: 'Kitchen' },
    { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=75', caption: 'Bedroom' }
  ],
  [
    { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=75', caption: 'Modern Flat' },
    { url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=75', caption: 'Bathroom' },
    { url: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1000&q=75', caption: 'View' }
  ]
];

const landImages = [
  [
    { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=75', caption: 'Plot View' },
    { url: 'https://images.unsplash.com/photo-1564013434775-f71db0030976?auto=format&fit=crop&w=1000&q=75', caption: 'Land Area' }
  ],
  [
    { url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=75', caption: 'Plot Front' },
    { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=75', caption: 'Road View' }
  ]
];

const getImages = (type, i) => {
  if (type === 'land') return landImages[i % landImages.length];
  return flatImages[i % flatImages.length];
};

const getDemoProperties = (adminId) => {
  const areas = [
    { area: 'Dhanmondi', address: 'Road 27, Dhanmondi', note: 'ধানমন্ডি আবাসিক এলাকায়' },
    { area: 'Dhanmondi', address: 'Road 8/A, Dhanmondi', note: 'ধানমন্ডি লেকের পাশে' },
    { area: 'Dhanmondi', address: 'Road 32, Dhanmondi', note: 'ধানমন্ডি ৩২ নম্বরের কাছে' },
    { area: 'Kalabagan', address: 'Kalabagan 1st Lane', note: 'কলাবাগান মূল এলাকায়' },
    { area: 'Kalabagan', address: 'Kalabagan Main Road', note: 'কলাবাগান বাজারের পাশে' },
    { area: 'Green Road', address: 'Green Road, Tejgaon', note: 'গ্রিন রোড মূল সড়কের উপর' },
    { area: 'Green Road', address: 'Green Road Extension', note: 'গ্রিন রোড সম্প্রসারিত এলাকায়' },
    { area: 'Farmgate', address: 'Farmgate, Tejgaon', note: 'ফার্মগেট মূল এলাকায়' },
    { area: 'Farmgate', address: 'Bijoy Sarani, Farmgate', note: 'বিজয় সরণির কাছে' },
    { area: 'Lalmatia', address: 'Lalmatia, Mohammadpur', note: 'লালমাটিয়া আবাসিক এলাকায়' },
  ];

  const flats = [
    // ──── FLATS / APARTMENTS ────
    {
      title: 'ধানমন্ডিতে আধুনিক ৩ বেড ফ্ল্যাট বিক্রি হবে',
      description: 'ধানমন্ডি ২৭ নম্বর রোডে চমৎকার অবস্থানে একটি আধুনিক ফ্ল্যাট। মোট ১৭০০ বর্গফুটের এই ফ্ল্যাটে রয়েছে ৩টি বেডরুম, ৩টি বাথরুম, বড় ড্রইংরুম, ডাইনিং, আধুনিক রান্নাঘর এবং বড় বারান্দা। বিল্ডিংয়ে রয়েছে লিফট, জেনারেটর ও সার্বক্ষণিক নিরাপত্তা ব্যবস্থা। স্কুল, বাজার ও যানবাহনের কাছে।',
      category: 'buy', type: 'ready_flat', price: 12500000, size: 1700, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 3, images: getImages('flat', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Road 27, Dhanmondi' },
      amenities: ['লিফট', 'জেনারেটর', 'গ্যাস', 'পানি', 'নিরাপত্তা', 'পার্কিং'],
      features: { parking: true, elevator: true, generator: true, security: true, balcony: true },
      featured: true, verified: true, status: 'active', floor: '৫ম তলা', totalFloors: 10,
    },
    {
      title: 'ধানমন্ডি লেকের পাশে বিলাসবহুল ৪ বেড ফ্ল্যাট',
      description: 'ধানমন্ডি লেকের সুন্দর দৃশ্য উপভোগ করুন এই বিলাসবহুল ফ্ল্যাট থেকে। ২২০০ বর্গফুটের এই ফ্ল্যাটে রয়েছে ৪টি বেডরুম, ৩টি বাথরুম, বড় ড্রইংরুম ও ডাইনিং, মডার্ন কিচেন, মাস্টার বেডরুমে অ্যাটাচড বাথরুম, এবং লেকের ভিউ বারান্দা। সব সুবিধাসহ সম্পূর্ণ নির্ভরযোগ্য ভবনে।',
      category: 'buy', type: 'ready_flat', price: 18000000, size: 2200, sizeUnit: 'sqft',
      bedrooms: 4, bathrooms: 3, images: getImages('flat', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Road 8/A, Dhanmondi' },
      amenities: ['লেক ভিউ', 'লিফট', 'জেনারেটর', 'মডার্ন কিচেন', 'পার্কিং', 'নিরাপত্তা'],
      features: { parking: true, elevator: true, generator: true, security: true, balcony: true },
      featured: true, verified: true, status: 'active', floor: '৮ম তলা', totalFloors: 12,
    },
    {
      title: 'ধানমন্ডিতে ২ বেডের প্রিমিয়াম অ্যাপার্টমেন্ট ভাড়া',
      description: 'ধানমন্ডি ৩২ নম্বরের কাছে ১২০০ বর্গফুটের চমৎকার ফ্ল্যাট ভাড়া দেওয়া হবে। দুটি বড় বেডরুম, দুটি বাথরুম, সুন্দর লিভিং রুম এবং আধুনিক কিচেন রয়েছে। ফ্ল্যাটটি সম্পূর্ণ টাইলস করা এবং রঙ করা। সব ধরনের নাগরিক সুবিধা কাছেই পাবেন।',
      category: 'buy', type: 'used_flat', price: 8500000, size: 1200, sizeUnit: 'sqft',
      bedrooms: 2, bathrooms: 2, images: getImages('flat', 2),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Road 32, Dhanmondi' },
      amenities: ['গ্যাস', 'পানি', 'লিফট', 'নিরাপত্তা'],
      features: { elevator: true, security: true, balcony: true },
      featured: false, verified: true, status: 'active', floor: '৩য় তলা', totalFloors: 8,
    },
    {
      title: 'কলাবাগানে নতুন ৩ বেড ফ্ল্যাট বিক্রি',
      description: 'কলাবাগান প্রথম লেনে সম্পূর্ণ নতুন এবং আধুনিক ফ্ল্যাট বিক্রি হবে। ১৫০০ বর্গফুটের এই ফ্ল্যাটে ৩টি বেডরুম, ২টি বাথরুম, প্রশস্ত ড্রইং-ডাইনিং এবং আধুনিক কিচেন রয়েছে। বিল্ডিংটি সম্পূর্ণ নতুন নির্মিত এবং সব সুবিধাসম্পন্ন। ধানমন্ডি ও কলাবাগান উভয় এলাকায় সহজ যোগাযোগ।',
      category: 'buy', type: 'ready_flat', price: 10500000, size: 1500, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 2, images: getImages('flat', 3),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Kalabagan', address: 'Kalabagan 1st Lane' },
      amenities: ['লিফট', 'জেনারেটর', 'গ্যাস', 'পানি', 'পার্কিং'],
      features: { parking: true, elevator: true, generator: true, security: true },
      featured: true, verified: true, status: 'active', floor: '৬ষ্ঠ তলা', totalFloors: 10,
    },
    {
      title: 'কলাবাগানে পরিবারের জন্য আদর্শ ৩ বেড অ্যাপার্টমেন্ট',
      description: 'কলাবাগান মূল সড়কের পাশে শান্ত পরিবেশে একটি আদর্শ পারিবারিক ফ্ল্যাট। ১৬৫০ বর্গফুটের এই ফ্ল্যাটে রয়েছে ৩টি বেডরুম, ৩টি বাথরুম, বড় বসার ঘর ও খাবার ঘর। বিদ্যালয়, হাসপাতাল ও বাজার খুব কাছেই। পরিবহন সুবিধাজনক।',
      category: 'buy', type: 'used_flat', price: 9800000, size: 1650, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 3, images: getImages('flat', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Kalabagan', address: 'Kalabagan Main Road' },
      amenities: ['গ্যাস', 'পানি', 'নিরাপত্তা', 'লিফট', 'বারান্দা'],
      features: { elevator: true, security: true, balcony: true },
      featured: false, verified: true, status: 'active', floor: '৪র্থ তলা', totalFloors: 9,
    },
    {
      title: 'গ্রিন রোডে প্রশস্ত ৩ বেড ফ্ল্যাট বিক্রয়',
      description: 'গ্রিন রোডের মূল সড়কের উপর অবস্থিত একটি চমৎকার ফ্ল্যাট। ১৮০০ বর্গফুটের এই অ্যাপার্টমেন্টে রয়েছে ৩টি বড় বেডরুম, ৩টি বাথরুম, বিশাল ড্রইং-ডাইনিং, আধুনিক কিচেন ও বারান্দা। ফ্ল্যাটটি সম্পূর্ণ রেডিমেড এবং অবিলম্বে বসবাসযোগ্য।',
      category: 'buy', type: 'ready_flat', price: 13500000, size: 1800, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 3, images: getImages('flat', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Green Road', address: 'Green Road, Tejgaon' },
      amenities: ['লিফট', 'জেনারেটর', 'পার্কিং', 'সিকিউরিটি', 'গ্যাস'],
      features: { parking: true, elevator: true, generator: true, security: true, balcony: true },
      featured: true, verified: true, status: 'active', floor: '৭ম তলা', totalFloors: 12,
    },
    {
      title: 'গ্রিন রোডে ২ বেড মডার্ন ফ্ল্যাট ভাড়া',
      description: 'গ্রিন রোড এক্সটেনশনে একটি আধুনিক ও সুন্দর ২ বেডরুম ফ্ল্যাট ভাড়া দেওয়া হবে। ১১০০ বর্গফুটের এই ফ্ল্যাটটি সম্পূর্ণ টাইলস করা, নতুন রঙ করা এবং সব আধুনিক সুবিধাসম্পন্ন। স্বামী-স্ত্রী বা ছোট পরিবারের জন্য আদর্শ।',
      category: 'buy', type: 'used_flat', price: 7500000, size: 1100, sizeUnit: 'sqft',
      bedrooms: 2, bathrooms: 2, images: getImages('flat', 2),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Green Road', address: 'Green Road Extension' },
      amenities: ['গ্যাস', 'পানি', 'লিফট', 'নিরাপত্তা'],
      features: { elevator: true, security: true },
      featured: false, verified: true, status: 'active', floor: '২য় তলা', totalFloors: 7,
    },
    {
      title: 'ফার্মগেটে অফিস ও বসবাসের উপযোগী ৪ বেড ফ্ল্যাট',
      description: 'ফার্মগেটের বিজয় সরণী সংলগ্ন এলাকায় একটি বড় এবং বহুমুখী ফ্ল্যাট বিক্রয় হবে। ২৫০০ বর্গফুটের এই ফ্ল্যাটটি অফিস বা বসবাস যেকোনো কাজে ব্যবহার করা যাবে। ৪টি কক্ষ, ৩টি বাথরুম, বড় হল এবং সার্বক্ষণিক বিদ্যুৎ ব্যবস্থা রয়েছে।',
      category: 'buy', type: 'ready_flat', price: 16000000, size: 2500, sizeUnit: 'sqft',
      bedrooms: 4, bathrooms: 3, images: getImages('flat', 3),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Farmgate', address: 'Bijoy Sarani, Farmgate' },
      amenities: ['লিফট', 'জেনারেটর', 'পার্কিং', 'নিরাপত্তা', 'ইন্টারনেট'],
      features: { parking: true, elevator: true, generator: true, security: true },
      featured: true, verified: true, status: 'active', floor: '৫ম তলা', totalFloors: 10,
    },
    {
      title: 'ফার্মগেটে সাশ্রয়ী ২ বেড অ্যাপার্টমেন্ট',
      description: 'ফার্মগেট মূল এলাকায় একটি সাশ্রয়ী মূল্যের ২ বেডরুম ফ্ল্যাট বিক্রয় হবে। ১০৫০ বর্গফুটের এই ফ্ল্যাটে দুটি বেডরুম, দুটি বাথরুম, লিভিং রুম ও কিচেন রয়েছে। বাসস্ট্যান্ড ও মার্কেটের কাছে অবস্থিত হওয়ায় যাতায়াত অত্যন্ত সুবিধাজনক।',
      category: 'buy', type: 'used_flat', price: 6800000, size: 1050, sizeUnit: 'sqft',
      bedrooms: 2, bathrooms: 2, images: getImages('flat', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Farmgate', address: 'Farmgate, Tejgaon' },
      amenities: ['গ্যাস', 'পানি', 'লিফট', 'নিরাপত্তা'],
      features: { elevator: true, security: true },
      featured: false, verified: true, status: 'active', floor: '৪র্থ তলা', totalFloors: 8,
    },
    {
      title: 'লালমাটিয়ায় চমৎকার ৩ বেড অ্যাপার্টমেন্ট',
      description: 'লালমাটিয়া আবাসিক এলাকায় একটি শান্ত ও নিরিবিলি পরিবেশে সুন্দর ৩ বেডরুম ফ্ল্যাট বিক্রয় হবে। ১৫৫০ বর্গফুটের এই ফ্ল্যাটে মডার্ন সুযোগ-সুবিধা এবং ধানমন্ডিতে সহজ যোগাযোগ ব্যবস্থা রয়েছে।',
      category: 'buy', type: 'ready_flat', price: 11000000, size: 1550, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 2, images: getImages('flat', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Lalmatia', address: 'Lalmatia, Mohammadpur' },
      amenities: ['লিফট', 'গ্যাস', 'পানি', 'নিরাপত্তা', 'বারান্দা'],
      features: { elevator: true, security: true, balcony: true },
      featured: false, verified: true, status: 'active', floor: '৬ষ্ঠ তলা', totalFloors: 9,
    },
    // ──── MORE FLATS ────
    {
      title: 'ধানমন্ডিতে বিলাসবহুল পেন্টহাউস বিক্রয়',
      description: 'ধানমন্ডির প্রাইম লোকেশনে রুফটপ টেরেসযুক্ত বিলাসবহুল পেন্টহাউস। ৩২০০ বর্গফুট, ৪ বেডরুম, ৪ বাথরুম, প্রাইভেট ছাদবাগান ও সুইমিং পুলের সুবিধা। শহরের সেরা লোকেশনে আনন্দময় জীবনযাপন নিশ্চিত করুন।',
      category: 'buy', type: 'furnished_apt', price: 38000000, size: 3200, sizeUnit: 'sqft',
      bedrooms: 4, bathrooms: 4, images: getImages('flat', 2),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Road 15, Dhanmondi' },
      amenities: ['রুফটপ গার্ডেন', 'সুইমিং পুল', 'জিম', 'লিফট', 'জেনারেটর', 'পার্কিং'],
      features: { parking: true, elevator: true, generator: true, security: true, garden: true, gym: true, swimmingPool: true, balcony: true },
      featured: true, verified: true, status: 'active', floor: 'পেন্টহাউস', totalFloors: 12,
    },
    {
      title: 'কলাবাগান সংলগ্ন ৩ বেড নতুন ফ্ল্যাট',
      description: 'কলাবাগান ও ধানমন্ডি সংযোগস্থলে নতুনভাবে নির্মিত একটি সুন্দর ৩ বেডরুম ফ্ল্যাট। ১৪৫০ বর্গফুটের এই ফ্ল্যাটে সব আধুনিক সুযোগ-সুবিধা রয়েছে। নতুন বিল্ডিংয়ে অবস্থিত তাই দীর্ঘমেয়াদে বিনিয়োগ হিসেবেও উপযুক্ত।',
      category: 'buy', type: 'ready_flat', price: 9200000, size: 1450, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 2, images: getImages('flat', 3),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Kalabagan', address: 'Kalabagan Link Road' },
      amenities: ['লিফট', 'জেনারেটর', 'গ্যাস', 'পানি', 'পার্কিং'],
      features: { parking: true, elevator: true, generator: true, security: true },
      featured: false, verified: true, status: 'active', floor: '৩য় তলা', totalFloors: 8,
    },
    {
      title: 'গ্রিন রোডের কাছে সাশ্রয়ী ২ বেড অ্যাপার্টমেন্ট',
      description: 'গ্রিন রোড ও ফার্মগেটের মাঝামাঝি অবস্থানে একটি সাশ্রয়ী মূল্যের ২ বেডরুম ফ্ল্যাট বিক্রয় হবে। ১০০০ বর্গফুটের এই ফ্ল্যাটটি প্রথমবারের ক্রেতাদের জন্য বা বিনিয়োগের জন্য আদর্শ।',
      category: 'buy', type: 'used_flat', price: 6200000, size: 1000, sizeUnit: 'sqft',
      bedrooms: 2, bathrooms: 2, images: getImages('flat', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Green Road', address: 'Near Green Road, Panthapath' },
      amenities: ['গ্যাস', 'পানি', 'লিফট'],
      features: { elevator: true, security: true },
      featured: false, verified: true, status: 'active', floor: '৫ম তলা', totalFloors: 10,
    },
    {
      title: 'ধানমন্ডিতে প্রিমিয়াম অফিস কাম রেসিডেন্সিয়াল ফ্ল্যাট',
      description: 'ধানমন্ডির বাণিজ্যিক এলাকায় একটি বহুমুখী ব্যবহারের উপযোগী ফ্ল্যাট। ২০০০ বর্গফুট, ৪ কক্ষ, কনফারেন্স রুমের সুবিধাসহ সম্পূর্ণ হাই-এন্ড ফিনিশিং।',
      category: 'buy', type: 'apartment', price: 22000000, size: 2000, sizeUnit: 'sqft',
      bedrooms: 4, bathrooms: 3, images: getImages('flat', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Satmasjid Road, Dhanmondi' },
      amenities: ['হাই-স্পিড ইন্টারনেট', 'লিফট', 'জেনারেটর', 'নিরাপত্তা', 'পার্কিং'],
      features: { parking: true, elevator: true, generator: true, security: true },
      featured: true, verified: true, status: 'active', floor: '৮ম তলা', totalFloors: 15,
    },
    {
      title: 'ফার্মগেট সংলগ্ন লো-প্রাইস ২ বেড ফ্ল্যাট',
      description: 'ফার্মগেটের কাছাকাছি এলাকায় একটি সাশ্রয়ী মূল্যের ২ বেডরুম ফ্ল্যাট। ৯৫০ বর্গফুটের এই ফ্ল্যাটটি একটি ছোট পরিবার বা নবদম্পতির জন্য একদম পারফেক্ট।',
      category: 'buy', type: 'used_flat', price: 5800000, size: 950, sizeUnit: 'sqft',
      bedrooms: 2, bathrooms: 1, images: getImages('flat', 2),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Farmgate', address: 'Indira Road, Farmgate' },
      amenities: ['গ্যাস', 'পানি', 'নিরাপত্তা'],
      features: { security: true },
      featured: false, verified: true, status: 'active', floor: '২য় তলা', totalFloors: 6,
    },
    {
      title: 'লালমাটিয়ায় ৩ বেড রেডি ফ্ল্যাট বিক্রয়',
      description: 'লালমাটিয়া আবাসিক এলাকায় রেডিমেড একটি চমৎকার ৩ বেডরুম ফ্ল্যাট। ১৪৫০ বর্গফুট, সুন্দর ভিউ এবং শান্ত পরিবেশে বসবাসের সুযোগ। ধানমন্ডি, কলাবাগান ও মোহাম্মদপুর—সবই কাছে।',
      category: 'buy', type: 'ready_flat', price: 10200000, size: 1450, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 2, images: getImages('flat', 3),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Lalmatia', address: 'Block B, Lalmatia' },
      amenities: ['লিফট', 'গ্যাস', 'পানি', 'পার্কিং', 'নিরাপত্তা'],
      features: { parking: true, elevator: true, security: true, balcony: true },
      featured: false, verified: true, status: 'active', floor: '৫ম তলা', totalFloors: 9,
    },
    {
      title: 'ধানমন্ডি ২/এ তে ৪ বেড ডুপ্লেক্স ফ্ল্যাট',
      description: 'ধানমন্ডির ২/এ রোডে অত্যন্ত আকর্ষণীয় একটি ডুপ্লেক্স ফ্ল্যাট বিক্রয় হবে। দুই তলা জুড়ে মোট ২৮০০ বর্গফুট, ৪ বেডরুম, রুফটপ টেরেস, এবং সব আধুনিক সুবিধা সম্পন্ন।',
      category: 'buy', type: 'duplex', price: 28000000, size: 2800, sizeUnit: 'sqft',
      bedrooms: 4, bathrooms: 4, images: getImages('flat', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Road 2/A, Dhanmondi' },
      amenities: ['রুফটপ', 'লিফট', 'জেনারেটর', 'পার্কিং', 'নিরাপত্তা'],
      features: { parking: true, elevator: true, generator: true, security: true, balcony: true },
      featured: true, verified: true, status: 'active', floor: '৯-১০ম তলা', totalFloors: 10,
    },
    {
      title: 'কলাবাগানে বাজেট-ফ্রেন্ডলি ১ বেড ফ্ল্যাট',
      description: 'কলাবাগানে সিঙ্গেল বা নতুন দম্পতির জন্য একটি আদর্শ ১ বেডরুম ফ্ল্যাট। ৭৫০ বর্গফুটের কমপ্যাক্ট এবং কার্যকর লেআউট। একদম সাশ্রয়ী মূল্যে।',
      category: 'buy', type: 'used_flat', price: 4500000, size: 750, sizeUnit: 'sqft',
      bedrooms: 1, bathrooms: 1, images: getImages('flat', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Kalabagan', address: 'Kalabagan Back Road' },
      amenities: ['গ্যাস', 'পানি', 'নিরাপত্তা'],
      features: { security: true },
      featured: false, verified: true, status: 'active', floor: '৩য় তলা', totalFloors: 7,
    },
    {
      title: 'গ্রিন রোডে ৩ বেড মডার্ন অ্যাপার্টমেন্ট',
      description: 'গ্রিন রোডের কাছে আধুনিক সুযোগ-সুবিধাসম্পন্ন একটি ৩ বেডরুম ফ্ল্যাট বিক্রয় হবে। ১৬০০ বর্গফুটের এই ফ্ল্যাটটি সম্পূর্ণ টাইলস করা এবং পেইন্ট করা, অবিলম্বে বসবাসযোগ্য।',
      category: 'buy', type: 'ready_flat', price: 12000000, size: 1600, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 3, images: getImages('flat', 2),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Green Road', address: 'Green Road, Panthapath Link' },
      amenities: ['লিফট', 'জেনারেটর', 'গ্যাস', 'পানি', 'বারান্দা'],
      features: { elevator: true, generator: true, security: true, balcony: true },
      featured: false, verified: true, status: 'active', floor: '৬ষ্ঠ তলা', totalFloors: 11,
    },
    {
      title: 'লালমাটিয়ায় ৩ বেড কর্নার ফ্ল্যাট বিক্রয়',
      description: 'লালমাটিয়ার কর্নার প্লটে অবস্থিত বড় ও হাওয়া-বাতাসযুক্ত ৩ বেডরুম ফ্ল্যাট বিক্রয় হবে। ১৭৫০ বর্গফুট, সব দিক থেকে আলো-বায়ু প্রবেশ করে। দুটি বারান্দা রয়েছে।',
      category: 'buy', type: 'ready_flat', price: 13000000, size: 1750, sizeUnit: 'sqft',
      bedrooms: 3, bathrooms: 3, images: getImages('flat', 3),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Lalmatia', address: 'Block C, Lalmatia' },
      amenities: ['দুটি বারান্দা', 'লিফট', 'জেনারেটর', 'গ্যাস', 'পার্কিং'],
      features: { parking: true, elevator: true, generator: true, security: true, balcony: true },
      featured: false, verified: true, status: 'active', floor: '৭ম তলা', totalFloors: 10,
    },
  ];

  const lands = [
    // ──── LANDS / PLOTS ────
    {
      title: 'ধানমন্ডিতে ৫ কাঠা আবাসিক প্লট বিক্রয়',
      description: 'ধানমন্ডির আবাসিক এলাকায় ৫ কাঠার একটি প্রাইম প্লট বিক্রয় হবে। পরিষ্কার দলিল, সব ইউটিলিটি সংযোগ রয়েছে, রাস্তার কাছে। বাড়ি নির্মাণ বা বিনিয়োগের জন্য আদর্শ সুযোগ।',
      category: 'buy', type: 'plot', price: 35000000, size: 5, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Road 12, Dhanmondi' },
      amenities: ['পরিষ্কার দলিল', 'রাস্তার সংযোগ', 'ইউটিলিটি', 'কর্নার প্লট'],
      features: {}, featured: true, verified: true, status: 'active',
    },
    {
      title: 'ধানমন্ডিতে ৩ কাঠা কমার্শিয়াল প্লট',
      description: 'ধানমন্ডির বাণিজ্যিক এলাকায় ৩ কাঠার একটি চমৎকার কমার্শিয়াল প্লট বিক্রয় হবে। শপিং মল, অফিস ভবন বা মিক্সড-ইউজ ডেভেলপমেন্টের জন্য উপযুক্ত। প্রধান সড়কের উপর অবস্থিত।',
      category: 'buy', type: 'plot', price: 28000000, size: 3, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'Satmasjid Road, Dhanmondi' },
      amenities: ['মেইন রোড ফেসিং', 'কমার্শিয়াল জোন', 'পরিষ্কার দলিল'],
      features: {}, featured: true, verified: true, status: 'active',
    },
    {
      title: 'কলাবাগানে ২ কাঠা আবাসিক প্লট',
      description: 'কলাবাগানে ২ কাঠার একটি আবাসিক প্লট বিক্রয় হবে। শান্ত ও নিরিবিলি এলাকায় অবস্থিত, বাড়ি নির্মাণের জন্য আদর্শ। সব কাগজপত্র পরিষ্কার।',
      category: 'buy', type: 'land', price: 18000000, size: 2, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Kalabagan', address: 'Kalabagan Residential Area' },
      amenities: ['পরিষ্কার দলিল', 'আবাসিক জোন', 'রাস্তার সংযোগ'],
      features: {}, featured: false, verified: true, status: 'active',
    },
    {
      title: 'গ্রিন রোড সংলগ্ন ৪ কাঠা জমি বিক্রয়',
      description: 'গ্রিন রোডের কাছে ৪ কাঠার একটি জমি বিক্রয় হবে। দুটি রাস্তার সংযোগ, সব ইউটিলিটি আছে। বহুতল ভবন নির্মাণের জন্য পারফেক্ট।',
      category: 'buy', type: 'land', price: 32000000, size: 4, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Green Road', address: 'Green Road Area' },
      amenities: ['দুটি রাস্তার সংযোগ', 'ইউটিলিটি', 'পরিষ্কার দলিল', 'বাণিজ্যিক সুবিধা'],
      features: {}, featured: true, verified: true, status: 'active',
    },
    {
      title: 'ফার্মগেটে ৩ কাঠা কমার্শিয়াল জমি',
      description: 'ফার্মগেটের মূল সড়কের পাশে ৩ কাঠা কমার্শিয়াল জমি বিক্রয় হবে। অফিস বা কমার্শিয়াল কমপ্লেক্স নির্মাণের জন্য আদর্শ সুযোগ। প্রচুর যানচলাচল এলাকা।',
      category: 'buy', type: 'plot', price: 25000000, size: 3, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Farmgate', address: 'Farmgate Main Road' },
      amenities: ['মেইন রোড', 'কমার্শিয়াল জোন', 'পরিষ্কার দলিল'],
      features: {}, featured: false, verified: true, status: 'active',
    },
    {
      title: 'লালমাটিয়ায় ২.৫ কাঠা আবাসিক জমি',
      description: 'লালমাটিয়া আবাসিক এলাকায় ২.৫ কাঠার একটি সুন্দর জমি বিক্রয় হবে। পরিষ্কার দলিল, রাস্তার সুবিধা এবং শান্ত পরিবেশ। প্রাইভেট বাড়ি বা ছোট অ্যাপার্টমেন্ট ভবনের জন্য আদর্শ।',
      category: 'buy', type: 'land', price: 20000000, size: 2.5, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Lalmatia', address: 'Block D, Lalmatia' },
      amenities: ['পরিষ্কার দলিল', 'আবাসিক জোন', 'রাস্তার সংযোগ'],
      features: {}, featured: false, verified: true, status: 'active',
    },
    {
      title: 'ধানমন্ডি ও লালমাটিয়ার মাঝে ৬ কাঠা বড় প্লট',
      description: 'ধানমন্ডি ও লালমাটিয়ার সংযোগস্থলে ৬ কাঠার একটি বিশাল প্লট বিক্রয় হবে। মাল্টি-স্টোরি বিল্ডিং বা জয়েন্ট ভেঞ্চারের জন্য অত্যন্ত উপযোগী। বিনিয়োগের সেরা সুযোগ।',
      category: 'buy', type: 'land', price: 48000000, size: 6, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Lalmatia', address: 'Lalmatia-Dhanmondi Border Road' },
      amenities: ['বড় এলাকা', 'কর্নার', 'পরিষ্কার দলিল', 'প্রধান সড়কের কাছে'],
      features: {}, featured: true, verified: true, status: 'active',
    },
    {
      title: 'কলাবাগানে ৫ কাঠা ভালো লোকেশনে প্লট',
      description: 'কলাবাগানের মূল এলাকায় ৫ কাঠার একটি চমৎকার আবাসিক প্লট। পরিষ্কার কাগজপত্র, সরাসরি রাস্তার সংযোগ এবং সব নাগরিক সুবিধার নিকটে।',
      category: 'buy', type: 'plot', price: 38000000, size: 5, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Kalabagan', address: 'Kalabagan, Main Area' },
      amenities: ['পরিষ্কার দলিল', 'মূল সড়কের পাশে', 'ইউটিলিটি'],
      features: {}, featured: false, verified: true, status: 'active',
    },
    {
      title: 'গ্রিন রোডে জয়েন্ট ভেঞ্চারের জন্য ৪ কাঠা জমি',
      description: 'গ্রিন রোড এলাকায় জয়েন্ট ভেঞ্চার বা নিজস্ব বহুতল ভবন নির্মাণের জন্য ৪ কাঠা জমি। ডেভেলপারদের জন্য বিশেষভাবে উপযুক্ত। সব ধরণের অনুমোদন নেওয়া সহজ।',
      category: 'buy', type: 'land_share', price: 30000000, size: 4, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 0),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Green Road', address: 'Green Road Extension Area' },
      amenities: ['পরিষ্কার দলিল', 'জয়েন্ট ভেঞ্চার উপযোগী', 'মূল সড়কের কাছে'],
      features: {}, featured: false, verified: true, status: 'active',
    },
    {
      title: 'ফার্মগেটে ৮ কাঠা বাণিজ্যিক ভূমি বিক্রয়',
      description: 'ফার্মগেট প্রধান সড়কের পাশে ৮ কাঠার একটি বিশাল বাণিজ্যিক ভূমি বিক্রয় হবে। শপিং কমপ্লেক্স, হোটেল বা বড় অফিস ভবনের জন্য একদম পারফেক্ট লোকেশন।',
      category: 'buy', type: 'ind_land', price: 65000000, size: 8, sizeUnit: 'katha',
      bedrooms: 0, bathrooms: 0, images: getImages('land', 1),
      location: { division: 'Dhaka', district: 'Dhaka', area: 'Farmgate', address: 'Farmgate, Kazi Nazrul Islam Avenue' },
      amenities: ['মূল সড়কের পাশে', 'বাণিজ্যিক জোন', 'পরিষ্কার দলিল', 'বড় এলাকা'],
      features: {}, featured: true, verified: true, status: 'active',
    },
  ];

  // Attach admin as owner to all
  return [...flats, ...lands].map(p => ({
    ...p,
    userId: adminId,
    contactInfo: {
      name: 'Princeton Development Ltd.',
      phone: '01711111111',
      email: 'admin@bikroy.com'
    }
  }));
};

const seedDemoProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');

    // Find admin user
    let admin = await User.findOne({ role: { $in: ['admin', 'superadmin'] } });
    if (!admin) {
      console.error('❌ No admin user found. Please run the main seed.js first.');
      process.exit(1);
    }

    // Delete only demo properties (won't delete existing real ones)
    const deleteResult = await Property.deleteMany({ 'contactInfo.email': 'admin@bikroy.com' });
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} previous demo properties`);

    const properties = getDemoProperties(admin._id);
    const created = await Property.insertMany(properties);
    console.log(`✅ Seeded ${created.length} demo properties in Dhanmondi, Kalabagan, Green Road, Farmgate & Lalmatia`);

    console.log('\n📍 Areas covered:');
    console.log('   🏠 Flats: Dhanmondi, Kalabagan, Green Road, Farmgate, Lalmatia');
    console.log('   🌿 Lands: Dhanmondi, Kalabagan, Green Road, Farmgate, Lalmatia');
    console.log(`\n✨ Done! Total: ${created.length} properties added\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedDemoProperties();
