const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  division: {
    type: String,
    required: [true, 'Division is required'],
    trim: true
  },
  division_bn: {
    type: String,
    trim: true
  },
  districts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    name_bn: {
      type: String,
      trim: true
    },
    areas: [{
      name: {
        type: String,
        trim: true
      },
      name_bn: {
        type: String,
        trim: true
      }
    }]
  }]
}, {
  timestamps: true
});

// Index for faster queries
locationSchema.index({ division: 1 });
locationSchema.index({ 'districts.name': 1 });
locationSchema.index({ 'districts.areas.name': 1 });
locationSchema.index({ 'districts.areas.name_bn': 1 });

// Static method to get all divisions
locationSchema.statics.getAllDivisions = async function() {
  const locations = await this.find({}, 'division division_bn').sort({ division: 1 });
  return locations.map(loc => ({ name: loc.division, name_bn: loc.division_bn }));
};

// Static method to get districts by division
locationSchema.statics.getDistrictsByDivision = async function(division) {
  const location = await this.findOne({ division });
  if (!location) return [];
  return location.districts
    .map(d => ({ name: d.name, name_bn: d.name_bn }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Static method to get areas by district
locationSchema.statics.getAreasByDistrict = async function(division, district) {
  const location = await this.findOne({ division });
  if (!location) return [];
  const districtData = location.districts.find(d => d.name === district);
  if (!districtData) return [];
  return districtData.areas
    .map(a => ({ name: a.name, name_bn: a.name_bn }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Static method to search areas, districts, divisions (bilingual)
locationSchema.statics.searchAreas = async function(searchTerm) {
  const locations = await this.find({
    $or: [
      { 'districts.areas.name': { $regex: searchTerm, $options: 'i' } },
      { 'districts.areas.name_bn': { $regex: searchTerm, $options: 'i' } },
      { 'districts.name': { $regex: searchTerm, $options: 'i' } },
      { 'districts.name_bn': { $regex: searchTerm, $options: 'i' } },
      { division: { $regex: searchTerm, $options: 'i' } },
      { division_bn: { $regex: searchTerm, $options: 'i' } }
    ]
  });

  const results = [];
  const seen = new Set();
  const term = searchTerm.toLowerCase();

  locations.forEach(location => {
    // Division match
    if (
      location.division.toLowerCase().includes(term) ||
      (location.division_bn && location.division_bn.includes(searchTerm))
    ) {
      const key = `div:${location.division}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          type: 'division',
          name: location.division,
          name_bn: location.division_bn || location.division,
          division: location.division,
          division_bn: location.division_bn || ''
        });
      }
    }

    location.districts.forEach(district => {
      // District match
      if (
        district.name.toLowerCase().includes(term) ||
        (district.name_bn && district.name_bn.includes(searchTerm))
      ) {
        const key = `dist:${district.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            type: 'district',
            name: district.name,
            name_bn: district.name_bn || district.name,
            division: location.division,
            division_bn: location.division_bn || '',
            district: district.name,
            district_bn: district.name_bn || ''
          });
        }
      }

      // Area match
      district.areas.forEach(area => {
        if (
          area.name.toLowerCase().includes(term) ||
          (area.name_bn && area.name_bn.includes(searchTerm))
        ) {
          const key = `area:${area.name}:${district.name}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              type: 'area',
              name: area.name,
              name_bn: area.name_bn || area.name,
              division: location.division,
              division_bn: location.division_bn || '',
              district: district.name,
              district_bn: district.name_bn || ''
            });
          }
        }
      });
    });
  });

  return results;
};

module.exports = mongoose.model('Location', locationSchema);
