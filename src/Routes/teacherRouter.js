const router = require("express").Router()
const middlewareControler = require('../MiddleWare/middlewareControler')
const TeacherControler = require("../Controller/user/TeacherController")

router.get('/getAll',middlewareControler.verifyTokenIsAdminOrGV, TeacherControler.getAll)
router.get('/:teacherId', middlewareControler.verifyTokenIsAdminOrGV, TeacherControler.getTeacher)
router.post('/create-teacher',middlewareControler.verifyTokenIsAdmin, TeacherControler.createTeacher)

router.put('/update/:id', middlewareControler.verifyTokenIsAdmin, TeacherControler.updateTeacher);

// Delete teacher route
router.delete('/delete/:id', middlewareControler.verifyTokenIsAdmin, TeacherControler.deleteTeacher);

module.exports = router