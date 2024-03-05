const router=require('express').Router()
const controller=require('../controllers/taskController')

router.post('/watchAllfileChangeswithOcuurences',controller.readAllFiles)
router.post('/fileReadwithOccurencess',controller.readFiles)
router.get('/alltask',controller.taskStatus)



module.exports=router