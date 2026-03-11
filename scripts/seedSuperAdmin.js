/**
 * SuperAdmin Seeder
 * Creates the superadmin account + seeds default service types
 * Run with: node scripts/seedSuperAdmin.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const ServiceType = require('../models/ServiceType');

dotenv.config();

const defaultServices = [
  { key: 'svc_build_prop',      label_en: 'Building & Property Services', label_bn: 'বিল্ডিং ও প্রপার্টি সেবা',    order: 1 },
  { key: 'svc_build_design',    label_en: 'Building Design',              label_bn: 'বিল্ডিং ডিজাইন',              order: 2 },
  { key: 'svc_interior_design', label_en: 'Interior Design',              label_bn: 'ইন্টেরিওর ডিজাইন',            order: 3 },
  { key: 'svc_architect',       label_en: 'Architect Firm',               label_bn: 'আর্কিটেক্ট ফার্ম',            order: 4 },
  { key: 'svc_construction',    label_en: 'Construction Firm',            label_bn: 'কনস্ট্রাকশন ফার্ম',           order: 5 },
  { key: 'svc_surveyor',        label_en: 'Surveyor Firm',                label_bn: 'সার্ভেয়ার ফার্ম',             order: 6 },
  { key: 'svc_contractor',      label_en: 'Building Contractor',          label_bn: 'বিল্ডিং ঠিকাদার',             order: 7 },
  { key: 'svc_piling',          label_en: 'Building Piling Firm',         label_bn: 'বিল্ডিং পাইলিং ফার্ম',        order: 8 },
  { key: 'svc_soil_test',       label_en: 'Soil Test Firm',               label_bn: 'সয়েল টেস্ট ফার্ম',            order: 9 },
  { key: 'svc_electrical',      label_en: 'Electrical Work',              label_bn: 'ইলেক্ট্রিক্যাল কাজ',          order: 10 },
  { key: 'svc_sanitary',        label_en: 'Sanitary Work',                label_bn: 'স্যানিটারি কাজ',               order: 11 },
  { key: 'svc_tiles',           label_en: 'Tiles Work',                   label_bn: 'টাইলস কাজ',                    order: 12 },
  { key: 'svc_tools_service',   label_en: 'Tools & Service',              label_bn: 'টুলস ও সার্ভিস',               order: 13 },
  { key: 'svc_deed_writer',     label_en: 'Deed Writer',                  label_bn: 'দলিল লেখক',                    order: 14 },
  { key: 'svc_consult_docs',    label_en: 'Consultation & Documents',     label_bn: 'পরামর্শ এবং নথি',             order: 15 },
  { key: 'svc_mutation',        label_en: 'Namjari & Kharij',             label_bn: 'নামজারি ও খারিজ',              order: 16 },
  { key: 'svc_legal',           label_en: 'Property Legal Services',      label_bn: 'প্রপার্টি লিগ্যাল সেবা',      order: 17 },
  { key: 'svc_garden',          label_en: 'Garden Maintenance',           label_bn: 'বাগান পরিচর্যা সেবা',         order: 18 },
  { key: 'svc_security',        label_en: 'Security Services',            label_bn: 'সিকিউরিটি সেবা',              order: 19 },
  { key: 'svc_buysell',         label_en: 'Property Buy/Sell Help',       label_bn: 'প্রপার্টি কেনা-বেচা সহায়তা', order: 20 },
  { key: 'svc_registry',        label_en: 'Property Registration',        label_bn: 'প্রপার্টি রেজিস্ট্রেশন',      order: 21 },
  { key: 'svc_plumbing',        label_en: 'Plumbing Work',                label_bn: 'প্লাম্বিং কাজ',                order: 22 },
  { key: 'svc_gypsum',          label_en: 'Gypsum Work',                  label_bn: 'জিপসাম কাজ',                   order: 23 },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // --- Create/Update SuperAdmin ---
    const email = 'superadmin@bikroy.com';
    const existing = await User.findOne({ email });

    if (existing) {
      existing.role = 'superadmin';
      existing.isActive = true;
      existing.verified = true;
      await existing.save();
      console.log('♻️  Existing user updated to superadmin:', email);
    } else {
      const superAdmin = new User({
        name: 'Princeton SuperAdmin',
        email,
        password: 'superadmin123',
        role: 'superadmin',
        verified: true,
        isActive: true,
        phone: '01700000000'
      });
      await superAdmin.save();
      console.log('✅ SuperAdmin created:', email);
    }

    // --- Seed Service Types (skip existing) ---
    let addedCount = 0;
    for (const svc of defaultServices) {
      const exists = await ServiceType.findOne({ key: svc.key });
      if (!exists) {
        await ServiceType.create(svc);
        addedCount++;
      }
    }
    console.log(`✅ Service types seeded: ${addedCount} new, ${defaultServices.length - addedCount} already existed`);

    console.log('\n✨ Done!');
    console.log('   📧 Email   : superadmin@bikroy.com');
    console.log('   🔑 Password: superadmin123');
    console.log('   🛡️  Role    : superadmin\n');

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
