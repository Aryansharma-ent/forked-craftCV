import { Portfolio } from '../models/Portfolio.js';

// GET ALL RESUMES
export const getPortfolios = async (req, res) => {
  try {
    const resumes = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE RESUME BY ID
export const getPortfolio = async (req, res) => {
  try {
    const resume = await Portfolio.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE NEW RESUME
export const createPortfolio = async (req, res) => {
  try {
    const newResume = new Portfolio(req.body);
    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE RESUME BY ID
export const updatePortfolio = async (req, res) => {
  try {
    const updatedResume = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(updatedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE RESUME BY ID
export const deletePortfolio = async (req, res) => {
  try {
    const deletedResume = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
