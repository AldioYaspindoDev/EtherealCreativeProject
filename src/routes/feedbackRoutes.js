import feedbackController from "../controllers/feedbackController.js";
import express from "express";

const feedbackRoute = express.Router();

// METHOD GET : mengambil semua data feedback
feedbackRoute.get('/', feedbackController.getAllFeedback);

// METHOD GET : mengambil data feedback bedasarkan id
feedbackRoute.get('/:id', feedbackController.getFeedbackById);

// METHOD POST : membuat data feedback
feedbackRoute.post('/', feedbackController.createFeedback);

// METHOD PUT : mengubah data feedback
feedbackRoute.put('/:id', feedbackController.updateFeedback);

// METHOD DELETE : menghapus data feedback
feedbackRoute.delete('/:id',  feedbackController.deleteFeedback);



export default feedbackRoute;