const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  division: {
    type: String,
    required: [true, 'Division is required'],
    trim: true
  },
  districts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    areas: [{
      type: String,
      trim: true
    }]
  }]
}, {
  timestamps: true
});

// Index for faster queries
locationSchema.index({ division: 1 });
locationSchema.index({ 'districts.name': 1 });

// Static method to get all divisions
locationSchema.statics.getAllDivisions = async function() {
  const locations = await this.find({}, 'division').sort({ division: 1 });
  return locations.map(loc => loc.division);
};

// Static method to get districts by division
locationSchema.statics.getDistrictsByDivision = async function(division) {
  const location = await this.findOne({ division });
  if (!location) return [];
  return location.districts.map(d => d.name).sort();
};

// Static method to get areas by district
locationSchema.statics.getAreasByDistrict = async function(division, district) {
  const location = await this.findOne({ division });
  if (!location) return [];
  
  const districtData = location.districts.find(d => d.name === district);
  if (!districtData) return [];
  
  return districtData.areas.sort();
};

// Static method to search areas
locationSchema.statics.searchAreas = async function(searchTerm) {
  const locations = await this.find({
    'districts.areas': { $regex: searchTerm, $options: 'i' }
  });
  
  const areas = [];
  locations.forEach(location => {
    location.districts.forEach(district => {
      district.areas.forEach(area => {
        if (area.toLowerCase().includes(searchTerm.toLowerCase())) {
          areas.push({
            division: location.division,
            district: district.name,
            area: area
          });
        }
      });
    });
  });
  
  return areas;
};

module.exports = mongoose.model('Location', locationSchema);
