import Teacher from "../../Model/Teacher.model";
import { NotFoundError } from "../../core/error.response";
const Encrypt = require('../../Utils/encryption');

module.exports = {
  createTeacher: async (req, res) => {
    const { mgv, fullname } = req.body;
    const hashPassword = await Encrypt.cryptPassword(mgv);
    try {
      const existUser = await Teacher.findOne({ mgv: mgv });
      if (existUser) {
        return res.status(400).json({ message: "Teacher already exists" });
      }
      const newTeacher = await Teacher.create({
        mgv: mgv,
        fullname: fullname,
        isAdmin: false,
        isGV: true,
        password: hashPassword,
      });
      res.status(200).json(newTeacher);
    } catch (e) {
      res.status(500).json({ message: "Error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await Teacher.find({})
        .populate({
          path: 'classrooms',
          select: '_id name', // Select necessary fields from classrooms
        });

      res.status(200).json({ data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error", error: error.message });
    }
  },

  getTeacher: async (req, res) => {
    const { teacherId } = req.params;
    try {
      const teacher = await Teacher.findOne({ mgv: teacherId })
        .populate({
          path: 'classrooms',
          select: '_id name',
        });

      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      res.status(200).json({ data: teacher });
    } catch (error) {
      res.status(500).json({ message: 'Error', error: error.message });
    }
  },

  // Delete Teacher Module
  deleteTeacher: async (req, res, next) => {
    const { id } = req.params;
    try {
      const teacherDeleted = await Teacher.findByIdAndDelete(id);
      if (!teacherDeleted) {
        throw new NotFoundError('No teacher found');
      }
      res.status(200).json({ message: 'Delete success' });
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  },
  
  updateTeacher: async (req, res, next) => {
    const { teacherId } = req.params;
    const { fullname } = req.body;
  
    try {
      // Perform the update
      const updatedTeacher = await Teacher.findOneAndUpdate(
        { mgv: teacherId },
        { fullname },
        { new: true } // Return the updated document
      );
  
      if (!updatedTeacher) {
        throw new NotFoundError('No teacher found');
      }
  
      res.status(200).json({ message: 'Update success', data: updatedTeacher });
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  },
};
