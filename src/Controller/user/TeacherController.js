import Teacher from "../../Model/Teacher.model";
import { NotFoundError } from "../../core/error.response";
const Encrypt = require('../../Utils/encryption');

module.exports = {
  createTeacher: async (req, res) => {
    const { mgv, fullname } = req.body
    const hashPassword = await Encrypt.cryptPassword(mgv)
    try {
      const existUser = await Teacher.findOne({ mgv: mgv })
      if (existUser) {
        return res.status(400).json({ message: "Teacher already exist" });
      }
      const newTeacher = await Teacher.create({
        mgv: mgv,
        fullname: fullname,
        isAdmin: false,
        isGV: true,
        password: hashPassword
      })
      res.status(200).json(newTeacher)
    } catch (e) {
      res.status(500).json({ message: "Error" })
    }
  },

  getAll: async (req, res) => {
    try {
      // Tìm tất cả giáo viên và populate trường classrooms
      const data = await Teacher.find({})
        .populate({
          path: 'classrooms',
          select: '_id name' // Chọn các trường cần thiết từ lớp học
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
          select: '_id name'
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
    const { id } = req.params; // Make sure `id` is used here
    const { fullname } = req.body;
  
    try {
      // Validate that `id` is not undefined or null
      if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
  
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        throw new NotFoundError('Teacher not found');
      }
  
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        id,
        { $set: { fullname } },
        { new: true } // Return the updated document
      ).populate('classrooms');
  
      if (!updatedTeacher) {
        throw new NotFoundError('Update failed');
      }
  
      res.status(200).json({ message: 'Teacher updated successfully', data: updatedTeacher });
    } catch (error) {
      next(error);
    }
  },  
  
};
