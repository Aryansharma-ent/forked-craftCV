import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  institution: { type: String, default: '' },
  year: { type: String, default: '' },
  score: { type: String, default: '' }
}, { _id: false });

const PortfolioSchema = new mongoose.Schema({
  title: { type: String, default: 'My Resume' },
  template: { type: String, default: 'apex' },
  mode: { type: String, default: 'manual' },
  personalInfo: {
    fullName: { type: String, default: '' },
    title: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    githubUsername: { type: String, default: '' },
  },
  skills: {
    languages: [{ type: String }],
    frameworks: [{ type: String }],
    tools: [{ type: String }]
  },
  experience: [ExperienceSchema],
  education: [EducationSchema]
}, {
  timestamps: true
});

export const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
