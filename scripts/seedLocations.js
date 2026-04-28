/**
 * Bilingual Location Seed Script
 * Seeds all Bangladesh divisions, districts, and areas with both English and Bengali names.
 * Run with: node scripts/seedLocations.js
 *
 * ⚠️  This script ONLY replaces Location documents (not users or properties).
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('../models/Location');

dotenv.config();

// Helper to create a bilingual area object
const a = (name, name_bn) => ({ name, name_bn });

const bangladeshLocations = [
  {
    division: 'Dhaka',
    division_bn: 'ঢাকা',
    districts: [
      {
        name: 'Dhaka',
        name_bn: 'ঢাকা',
        areas: [
          a('Azimpur', 'আজিমপুর'),
          a('Adabor', 'আদাবর'),
          a('Aftab Nagar', 'আফতাব নগর'),
          a('Al-Amin Road', 'আল-আমিন রোড'),
          a('Ashkona', 'আশকোনা'),
          a('Eskaton', 'ইস্কাটন'),
          a('Uttarkhan', 'উত্তর খান'),
          a('Uttara', 'উত্তরা'),
          a('Elephant Road', 'এলিফ্যান্ট রোড'),
          a('Wari', 'ওয়ারী'),
          a('Kalabagan', 'কলাবাগান'),
          a('Kalabagan Main Road', 'কলাবাগান মেইন রোড'),
          a('Kalyanpur', 'কল্যাণপুর'),
          a('Kafrul', 'কাফরুল'),
          a('Kamrangirchar', 'কামরাঙ্গীরচর'),
          a('Kuril', 'কুড়িল'),
          a('Kotwali', 'কোতোয়ালি'),
          a('Lake Circus Road', 'লেক সার্কাস রোড'),
          a('Cantonment', 'ক্যান্টনমেন্ট'),
          a('Khilkhet', 'খিলক্ষেত'),
          a('Khilgaon', 'খিলগাঁও'),
          a('Gulshan', 'গুলশান'),
          a('Gandaria', 'গেন্ডারিয়া'),
          a('Green Road', 'গ্রিন রোড'),
          a('Chawkbazar', 'চকবাজার'),
          a('Central Road', 'সেন্ট্রাল রোড'),
          a('Jigatola', 'জিগাতলা'),
          a('Jatrabari', 'যাত্রাবাড়ী'),
          a('Tongi', 'টঙ্গী'),
          a('Demra', 'ডেমরা'),
          a('Tejgaon', 'তেজগাঁও'),
          a('Dakshinkhan', 'দক্ষিণ খান'),
          a('Dhanmondi', 'ধানমন্ডি'),
          a('New Market', 'নিউমার্কেট'),
          a('Nikunja', 'নিকুঞ্জ'),
          a('Niketan', 'নিকেতন'),
          a('North Road', 'নর্থ রোড'),
          a('Paltan', 'পল্টন'),
          a('Panthapath', 'পান্থপথ'),
          a('Pallabi', 'পল্লবী'),
          a('Banani', 'বনানী'),
          a('Banasree', 'বনশ্রী'),
          a('Banglamotor', 'বাংলামোটর'),
          a('Baridhara', 'বারিধারা'),
          a('Basabo', 'বাসাবো'),
          a('Bashundhara R/A', 'বসুন্ধরা আ/এ'),
          a('Badda', 'বাড্ডা'),
          a('Farmgate', 'ফার্মগেট'),
          a('Mohakhali', 'মহাখালী'),
          a('Mohammadpur', 'মোহাম্মদপুর'),
          a('Motijheel', 'মতিঝিল'),
          a('Malibagh', 'মালিবাগ'),
          a('Mugdha', 'মুগদা'),
          a('Mirpur', 'মিরপুর'),
          a('Rampura', 'রামপুরা'),
          a('Lalbagh', 'লালবাগ'),
          a('Lalmatia', 'লালমাটিয়া'),
          a('Shantinagar', 'শান্তিনগর'),
          a('Shukrabad Road', 'শুক্রাবাদ রোড'),
          a('Shahbagh', 'শাহবাগ'),
          a('Shajahanpur', 'শাজাহানপুর'),
          a('Shyamoli', 'শ্যামলী'),
          a('Sobhanbag Road', 'সোবহানবাগ রোড'),
          a('South Road', 'সাউথ রোড'),
          a('Sabujbagh', 'সবুজবাগ'),
          a('Sutrapur', 'সূত্রাপুর'),
          a('Savar', 'সাভার'),
          a('Science Lab', 'সায়েন্স ল্যাব'),
          a('Hazaribagh', 'হাজারীবাগ'),
          a('Kakrail', 'কাকরাইল'),
          a('Nawabganj', 'নবাবগঞ্জ'),
          a('Agargaon', 'আগারগাঁও'),
          a('Gabtoli', 'গাবতলী'),
          a('Kawran Bazar', 'কারওয়ান বাজার'),
          a('Sayedabad', 'সায়েদাবাদ'),
          a('Keraniganj', 'কেরানীগঞ্জ'),
        ]
      },
      {
        name: 'Gazipur',
        name_bn: 'গাজীপুর',
        areas: [
          a('Gazipur Sadar', 'গাজীপুর সদর'),
          a('Tongi', 'টঙ্গী'),
          a('Kaliakair', 'কালিয়াকৈর'),
          a('Kapasia', 'কাপাসিয়া'),
          a('Sreepur', 'শ্রীপুর'),
          a('Kaliganj', 'কালীগঞ্জ'),
        ]
      },
      {
        name: 'Narayanganj',
        name_bn: 'নারায়ণগঞ্জ',
        areas: [
          a('Narayanganj Sadar', 'নারায়ণগঞ্জ সদর'),
          a('Rupganj', 'রূপগঞ্জ'),
          a('Sonargaon', 'সোনারগাঁও'),
          a('Bandar', 'বন্দর'),
          a('Araihazar', 'আড়াইহাজার'),
          a('Siddhirganj', 'সিদ্ধিরগঞ্জ'),
        ]
      },
      {
        name: 'Manikganj',
        name_bn: 'মানিকগঞ্জ',
        areas: [
          a('Manikganj Sadar', 'মানিকগঞ্জ সদর'),
          a('Singair', 'সিঙ্গাইর'),
          a('Ghior', 'ঘিওর'),
          a('Shibalaya', 'শিবালয়'),
        ]
      },
      {
        name: 'Munshiganj',
        name_bn: 'মুন্সিগঞ্জ',
        areas: [
          a('Munshiganj Sadar', 'মুন্সিগঞ্জ সদর'),
          a('Sreenagar', 'শ্রীনগর'),
          a('Sirajdikhan', 'সিরাজদিখান'),
          a('Gazaria', 'গজারিয়া'),
        ]
      },
      {
        name: 'Norsingdi',
        name_bn: 'নরসিংদী',
        areas: [
          a('Norsingdi Sadar', 'নরসিংদী সদর'),
          a('Palash', 'পলাশ'),
          a('Shibpur', 'শিবপুর'),
          a('Monohardi', 'মনোহরদী'),
        ]
      },
      {
        name: 'Tangail',
        name_bn: 'টাঙ্গাইল',
        areas: [
          a('Tangail Sadar', 'টাঙ্গাইল সদর'),
          a('Basail', 'বাসাইল'),
          a('Kalihati', 'কালিহাতী'),
          a('Mirzapur', 'মির্জাপুর'),
          a('Ghatail', 'ঘাটাইল'),
        ]
      },
      {
        name: 'Faridpur',
        name_bn: 'ফরিদপুর',
        areas: [
          a('Faridpur Sadar', 'ফরিদপুর সদর'),
          a('Boalmari', 'বোয়ালমারী'),
          a('Alfadanga', 'আলফাডাঙ্গা'),
          a('Nagarkanda', 'নগরকান্দা'),
        ]
      },
    ]
  },
  {
    division: 'Chittagong',
    division_bn: 'চট্টগ্রাম',
    districts: [
      {
        name: 'Chittagong',
        name_bn: 'চট্টগ্রাম',
        areas: [
          a('Agrabad', 'আগ্রাবাদ'),
          a('Panchlaish', 'পাঁচলাইশ'),
          a('Khulshi', 'খুলশী'),
          a('Halishahar', 'হালিশহর'),
          a('Nasirabad', 'নাসিরাবাদ'),
          a('GEC Circle', 'জিইসি সার্কেল'),
          a('Chawkbazar', 'চকবাজার'),
          a('Kotwali', 'কোতোয়ালি'),
          a('Pahartali', 'পাহাড়তলী'),
          a('Bayazid', 'বায়েজিদ'),
          a('Chandgaon', 'চান্দগাঁও'),
          a('Bakalia', 'বাকলিয়া'),
          a('Sadarghat', 'সদরঘাট'),
          a('Patenga', 'পতেঙ্গা'),
          a('Oxygen', 'অক্সিজেন'),
          a('Muradpur', 'মুরাদপুর'),
          a('Dampara', 'দামপাড়া'),
          a('Lalkhan Bazar', 'লালখান বাজার'),
          a('Sugandha', 'সুগন্ধা'),
          a('Momin Road', 'মোমিন রোড'),
        ]
      },
      {
        name: "Cox's Bazar",
        name_bn: "কক্সবাজার",
        areas: [
          a("Cox's Bazar Sadar", 'কক্সবাজার সদর'),
          a('Teknaf', 'টেকনাফ'),
          a('Ramu', 'রামু'),
          a('Ukhia', 'উখিয়া'),
          a('Chakaria', 'চকরিয়া'),
          a('Maheshkhali', 'মহেশখালী'),
        ]
      },
      {
        name: 'Comilla',
        name_bn: 'কুমিল্লা',
        areas: [
          a('Comilla Sadar', 'কুমিল্লা সদর'),
          a('Kandirpar', 'কান্দিরপাড়'),
          a('Kotbari', 'কোটবাড়ি'),
          a('Chauddagram', 'চৌদ্দগ্রাম'),
          a('Laksam', 'লাকসাম'),
          a('Debidwar', 'দেবীদ্বার'),
        ]
      },
      {
        name: 'Feni',
        name_bn: 'ফেনী',
        areas: [
          a('Feni Sadar', 'ফেনী সদর'),
          a('Parshuram', 'পরশুরাম'),
          a('Daganbhuiyan', 'দাগনভূঞা'),
          a('Chhagalnaiya', 'ছাগলনাইয়া'),
        ]
      },
      {
        name: 'Brahmanbaria',
        name_bn: 'ব্রাহ্মণবাড়িয়া',
        areas: [
          a('Brahmanbaria Sadar', 'ব্রাহ্মণবাড়িয়া সদর'),
          a('Ashuganj', 'আশুগঞ্জ'),
          a('Sarail', 'সরাইল'),
          a('Kasba', 'কসবা'),
        ]
      },
      {
        name: 'Noakhali',
        name_bn: 'নোয়াখালী',
        areas: [
          a('Noakhali Sadar', 'নোয়াখালী সদর'),
          a('Maijdee', 'মাইজদী'),
          a('Begumganj', 'বেগমগঞ্জ'),
          a('Companiganj', 'কোম্পানীগঞ্জ'),
          a('Chatkhil', 'চাটখিল'),
        ]
      },
      {
        name: 'Chandpur',
        name_bn: 'চাঁদপুর',
        areas: [
          a('Chandpur Sadar', 'চাঁদপুর সদর'),
          a('Matlab Uttar', 'মতলব উত্তর'),
          a('Matlab Dakhin', 'মতলব দক্ষিণ'),
          a('Hajiganj', 'হাজীগঞ্জ'),
          a('Kachua', 'কচুয়া'),
        ]
      },
    ]
  },
  {
    division: 'Rajshahi',
    division_bn: 'রাজশাহী',
    districts: [
      {
        name: 'Rajshahi',
        name_bn: 'রাজশাহী',
        areas: [
          a('Rajshahi Sadar', 'রাজশাহী সদর'),
          a('Boalia', 'বোয়ালিয়া'),
          a('Motihar', 'মতিহার'),
          a('Shah Makhdum', 'শাহ মখদুম'),
          a('Rajpara', 'রাজপাড়া'),
          a('Paba', 'পবা'),
          a('Godagari', 'গোদাগাড়ী'),
        ]
      },
      {
        name: 'Natore',
        name_bn: 'নাটোর',
        areas: [
          a('Natore Sadar', 'নাটোর সদর'),
          a('Baraigram', 'বড়াইগ্রাম'),
          a('Singra', 'সিংড়া'),
          a('Lalpur', 'লালপুর'),
        ]
      },
      {
        name: 'Nawabganj',
        name_bn: 'চাঁপাইনবাবগঞ্জ',
        areas: [
          a('Nawabganj Sadar', 'নবাবগঞ্জ সদর'),
          a('Shibganj', 'শিবগঞ্জ'),
          a('Gomastapur', 'গোমস্তাপুর'),
          a('Nachole', 'নাচোল'),
        ]
      },
      {
        name: 'Pabna',
        name_bn: 'পাবনা',
        areas: [
          a('Pabna Sadar', 'পাবনা সদর'),
          a('Ishwardi', 'ঈশ্বরদী'),
          a('Santhia', 'সাঁথিয়া'),
          a('Bera', 'বেড়া'),
        ]
      },
      {
        name: 'Sirajganj',
        name_bn: 'সিরাজগঞ্জ',
        areas: [
          a('Sirajganj Sadar', 'সিরাজগঞ্জ সদর'),
          a('Belkuchi', 'বেলকুচি'),
          a('Kazipur', 'কাজীপুর'),
          a('Raiganj', 'রায়গঞ্জ'),
          a('Ullapara', 'উল্লাপাড়া'),
        ]
      },
      {
        name: 'Bogra',
        name_bn: 'বগুড়া',
        areas: [
          a('Bogra Sadar', 'বগুড়া সদর'),
          a('Sherpur', 'শেরপুর'),
          a('Shibganj', 'শিবগঞ্জ'),
          a('Gabtali', 'গাবতলী'),
          a('Sonatola', 'সোনাতলা'),
        ]
      },
      {
        name: 'Joypurhat',
        name_bn: 'জয়পুরহাট',
        areas: [
          a('Joypurhat Sadar', 'জয়পুরহাট সদর'),
          a('Akkelpur', 'আক্কেলপুর'),
          a('Khetlal', 'ক্ষেতলাল'),
          a('Panchbibi', 'পাঁচবিবি'),
        ]
      },
    ]
  },
  {
    division: 'Khulna',
    division_bn: 'খুলনা',
    districts: [
      {
        name: 'Khulna',
        name_bn: 'খুলনা',
        areas: [
          a('Khulna Sadar', 'খুলনা সদর'),
          a('Sonadanga', 'সোনাডাঙ্গা'),
          a('Khalishpur', 'খালিশপুর'),
          a('Daulatpur', 'দৌলতপুর'),
          a('Boyra', 'বয়রা'),
          a('Rupsha', 'রূপসা'),
          a('Batiaghata', 'বটিয়াঘাটা'),
        ]
      },
      {
        name: 'Jessore',
        name_bn: 'যশোর',
        areas: [
          a('Jessore Sadar', 'যশোর সদর'),
          a('Abhaynagar', 'অভয়নগর'),
          a('Bagherpara', 'বাঘারপাড়া'),
          a('Chaugachha', 'চৌগাছা'),
          a('Jhikargacha', 'ঝিকরগাছা'),
          a('Monirampur', 'মণিরামপুর'),
        ]
      },
      {
        name: 'Bagerhat',
        name_bn: 'বাগেরহাট',
        areas: [
          a('Bagerhat Sadar', 'বাগেরহাট সদর'),
          a('Chitalmari', 'চিতলমারী'),
          a('Mongla', 'মংলা'),
          a('Morrelganj', 'মোড়েলগঞ্জ'),
        ]
      },
      {
        name: 'Satkhira',
        name_bn: 'সাতক্ষীরা',
        areas: [
          a('Satkhira Sadar', 'সাতক্ষীরা সদর'),
          a('Assasuni', 'আশাশুনি'),
          a('Debhata', 'দেবহাটা'),
          a('Kalaroa', 'কলারোয়া'),
          a('Kaliganj', 'কালিগঞ্জ'),
        ]
      },
      {
        name: 'Kushtia',
        name_bn: 'কুষ্টিয়া',
        areas: [
          a('Kushtia Sadar', 'কুষ্টিয়া সদর'),
          a('Khoksa', 'খোকসা'),
          a('Kumarkhali', 'কুমারখালী'),
          a('Bheramara', 'ভেড়ামারা'),
          a('Mirpur', 'মিরপুর'),
        ]
      },
    ]
  },
  {
    division: 'Sylhet',
    division_bn: 'সিলেট',
    districts: [
      {
        name: 'Sylhet',
        name_bn: 'সিলেট',
        areas: [
          a('Sylhet Sadar', 'সিলেট সদর'),
          a('Zindabazar', 'জিন্দাবাজার'),
          a('Ambarkhana', 'আম্বরখানা'),
          a('Uposhohor', 'উপশহর'),
          a('Moglabazar', 'মোগলাবাজার'),
          a('Shahjalal Upashahar', 'শাহজালাল উপশহর'),
          a('Bondor Bazar', 'বন্দর বাজার'),
          a('Kumarpara', 'কুমারপাড়া'),
          a('Tilagor', 'টিলাগড়'),
          a('Subidbazar', 'সুবিদবাজার'),
        ]
      },
      {
        name: 'Moulvibazar',
        name_bn: 'মৌলভীবাজার',
        areas: [
          a('Moulvibazar Sadar', 'মৌলভীবাজার সদর'),
          a('Kulaura', 'কুলাউড়া'),
          a('Sreemangal', 'শ্রীমঙ্গল'),
          a('Barlekha', 'বড়লেখা'),
          a('Rajnagar', 'রাজনগর'),
        ]
      },
      {
        name: 'Habiganj',
        name_bn: 'হবিগঞ্জ',
        areas: [
          a('Habiganj Sadar', 'হবিগঞ্জ সদর'),
          a('Baniachong', 'বানিয়াচং'),
          a('Chunarughat', 'চুনারুঘাট'),
          a('Nabiganj', 'নবীগঞ্জ'),
        ]
      },
      {
        name: 'Sunamganj',
        name_bn: 'সুনামগঞ্জ',
        areas: [
          a('Sunamganj Sadar', 'সুনামগঞ্জ সদর'),
          a('Bishwamvarpur', 'বিশ্বম্ভরপুর'),
          a('Chhatak', 'ছাতক'),
          a('Dowarabazar', 'দোয়ারাবাজার'),
          a('Jagannathpur', 'জগন্নাথপুর'),
        ]
      },
    ]
  },
  {
    division: 'Barisal',
    division_bn: 'বরিশাল',
    districts: [
      {
        name: 'Barisal',
        name_bn: 'বরিশাল',
        areas: [
          a('Barisal Sadar', 'বরিশাল সদর'),
          a('Kotwali', 'কোতোয়ালি'),
          a('Bandor', 'বন্দর'),
          a('Rupatali', 'রূপাতলী'),
          a('Kawnia', 'কাউনিয়া'),
          a('Charbaria', 'চরবাড়িয়া'),
          a('Notullabad', 'নথুল্লাবাদ'),
        ]
      },
      {
        name: 'Patuakhali',
        name_bn: 'পটুয়াখালী',
        areas: [
          a('Patuakhali Sadar', 'পটুয়াখালী সদর'),
          a('Bauphal', 'বাউফল'),
          a('Dumki', 'দুমকি'),
          a('Galachipa', 'গলাচিপা'),
          a('Kuakata', 'কুয়াকাটা'),
        ]
      },
      {
        name: 'Bhola',
        name_bn: 'ভোলা',
        areas: [
          a('Bhola Sadar', 'ভোলা সদর'),
          a('Burhanuddin', 'বোরহানউদ্দিন'),
          a('Daulatkhan', 'দৌলতখান'),
          a('Lalmohan', 'লালমোহন'),
          a('Charfasson', 'চরফ্যাশন'),
        ]
      },
      {
        name: 'Jhalokati',
        name_bn: 'ঝালকাঠি',
        areas: [
          a('Jhalokati Sadar', 'ঝালকাঠি সদর'),
          a('Nalchity', 'নলছিটি'),
          a('Rajapur', 'রাজাপুর'),
          a('Kathalia', 'কাঠালিয়া'),
        ]
      },
      {
        name: 'Pirojpur',
        name_bn: 'পিরোজপুর',
        areas: [
          a('Pirojpur Sadar', 'পিরোজপুর সদর'),
          a('Bhandaria', 'ভান্ডারিয়া'),
          a('Kawkhali', 'কাউখালী'),
          a('Mathbaria', 'মঠবাড়িয়া'),
          a('Nazirpur', 'নাজিরপুর'),
        ]
      },
    ]
  },
  {
    division: 'Rangpur',
    division_bn: 'রংপুর',
    districts: [
      {
        name: 'Rangpur',
        name_bn: 'রংপুর',
        areas: [
          a('Rangpur Sadar', 'রংপুর সদর'),
          a('Tajhat', 'তাজহাট'),
          a('Mahiganj', 'মাহিগঞ্জ'),
          a('Mithapukur', 'মিঠাপুকুর'),
          a('Kaunia', 'কাউনিয়া'),
          a('Pirganj', 'পীরগঞ্জ'),
        ]
      },
      {
        name: 'Dinajpur',
        name_bn: 'দিনাজপুর',
        areas: [
          a('Dinajpur Sadar', 'দিনাজপুর সদর'),
          a('Birampur', 'বিরামপুর'),
          a('Birganj', 'বীরগঞ্জ'),
          a('Hakimpur', 'হাকিমপুর'),
          a('Parbatipur', 'পার্বতীপুর'),
          a('Phulbari', 'ফুলবাড়ী'),
        ]
      },
      {
        name: 'Gaibandha',
        name_bn: 'গাইবান্ধা',
        areas: [
          a('Gaibandha Sadar', 'গাইবান্ধা সদর'),
          a('Gobindaganj', 'গোবিন্দগঞ্জ'),
          a('Palashbari', 'পলাশবাড়ী'),
          a('Sadullapur', 'সাদুল্লাপুর'),
        ]
      },
      {
        name: 'Kurigram',
        name_bn: 'কুড়িগ্রাম',
        areas: [
          a('Kurigram Sadar', 'কুড়িগ্রাম সদর'),
          a('Nageshwari', 'নাগেশ্বরী'),
          a('Bhurungamari', 'ভুরুঙ্গামারী'),
          a('Rajarhat', 'রাজারহাট'),
        ]
      },
      {
        name: 'Lalmonirhat',
        name_bn: 'লালমনিরহাট',
        areas: [
          a('Lalmonirhat Sadar', 'লালমনিরহাট সদর'),
          a('Aditmari', 'আদিতমারী'),
          a('Hatibandha', 'হাতীবান্ধা'),
          a('Kaliganj', 'কালীগঞ্জ'),
        ]
      },
      {
        name: 'Nilphamari',
        name_bn: 'নীলফামারী',
        areas: [
          a('Nilphamari Sadar', 'নীলফামারী সদর'),
          a('Saidpur', 'সৈয়দপুর'),
          a('Jaldhaka', 'জলঢাকা'),
          a('Kishoreganj', 'কিশোরগঞ্জ'),
          a('Domar', 'ডোমার'),
        ]
      },
      {
        name: 'Panchagarh',
        name_bn: 'পঞ্চগড়',
        areas: [
          a('Panchagarh Sadar', 'পঞ্চগড় সদর'),
          a('Boda', 'বোদা'),
          a('Debiganj', 'দেবীগঞ্জ'),
          a('Tetulia', 'তেতুলিয়া'),
          a('Atwari', 'আটোয়ারী'),
        ]
      },
      {
        name: 'Thakurgaon',
        name_bn: 'ঠাকুরগাঁও',
        areas: [
          a('Thakurgaon Sadar', 'ঠাকুরগাঁও সদর'),
          a('Baliadangi', 'বালিয়াডাঙ্গী'),
          a('Haripur', 'হরিপুর'),
          a('Pirganj', 'পীরগঞ্জ'),
          a('Ranisankail', 'রানীশংকৈল'),
        ]
      },
    ]
  },
  {
    division: 'Mymensingh',
    division_bn: 'ময়মনসিংহ',
    districts: [
      {
        name: 'Mymensingh',
        name_bn: 'ময়মনসিংহ',
        areas: [
          a('Mymensingh Sadar', 'ময়মনসিংহ সদর'),
          a('Charpara', 'চরপাড়া'),
          a('Kewatkhali', 'কেওয়াটখালী'),
          a('Maskanda', 'মাসকান্দা'),
          a('Shambhuganj', 'শম্ভুগঞ্জ'),
          a('Valuka', 'ভালুকা'),
          a('Phulpur', 'ফুলপুর'),
          a('Haluaghat', 'হালুয়াঘাট'),
          a('Trishal', 'ত্রিশাল'),
          a('Muktagacha', 'মুক্তাগাছা'),
        ]
      },
      {
        name: 'Jamalpur',
        name_bn: 'জামালপুর',
        areas: [
          a('Jamalpur Sadar', 'জামালপুর সদর'),
          a('Islampur', 'ইসলামপুর'),
          a('Mel Idh', 'মেলন্দহ'),
          a('Sarishabari', 'সরিষাবাড়ী'),
          a('Dewanganj', 'দেওয়ানগঞ্জ'),
        ]
      },
      {
        name: 'Sherpur',
        name_bn: 'শেরপুর',
        areas: [
          a('Sherpur Sadar', 'শেরপুর সদর'),
          a('Nakla', 'নকলা'),
          a('Sribordi', 'শ্রীবরদী'),
          a('Nalitabari', 'নালিতাবাড়ী'),
        ]
      },
      {
        name: 'Netrokona',
        name_bn: 'নেত্রকোণা',
        areas: [
          a('Netrokona Sadar', 'নেত্রকোণা সদর'),
          a('Barhatta', 'বারহাট্টা'),
          a('Durgapur', 'দুর্গাপুর'),
          a('Kalmakanda', 'কলমাকান্দা'),
          a('Mohanganj', 'মোহনগঞ্জ'),
          a('Purbadhala', 'পূর্বধলা'),
        ]
      },
    ]
  }
];

async function seedLocations() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Only clear Location data, leave users & properties intact
    await Location.deleteMany({});
    console.log('🗑️  Old location data removed');

    await Location.insertMany(bangladeshLocations);

    const divisionCount = bangladeshLocations.length;
    const districtCount = bangladeshLocations.reduce((s, d) => s + d.districts.length, 0);
    const areaCount = bangladeshLocations.reduce(
      (s, d) => s + d.districts.reduce((ds, dist) => ds + dist.areas.length, 0),
      0
    );

    console.log(`\n✨ Location seeding complete!`);
    console.log(`   📍 Divisions : ${divisionCount}`);
    console.log(`   🗺️  Districts : ${districtCount}`);
    console.log(`   🏘️  Areas     : ${areaCount}`);
  } catch (err) {
    console.error('❌ Error seeding locations:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedLocations();
