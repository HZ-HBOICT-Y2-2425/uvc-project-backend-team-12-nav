// routes/index.js
import express from 'express';
import { getAllIds, addId, deleteId, updateId } from '../controllers/groupMembersController.js';

const router = express.Router();
//groups -> id -> members -> id 
// maak er group members 
// Routes for managing IDs
router.get('/ids', getAllIds);          
router.post('/ids', addId);       
router.delete('/ids/:id', deleteId);    
router.put('/ids/:id', updateId);        

export default router;
