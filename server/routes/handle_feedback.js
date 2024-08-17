
import multer from 'multer'
import fs from 'fs'
import csv from 'csv-parser'
import { Router } from "express";
let router = Router()
const upload = multer({ dest: 'uploads/' });
import handle_feedback from '../helpers/handle_feedback.js'

const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const validateIndividualFeedback = (data) => {
  if (!data.name || typeof data.name !== 'string') return 'Invalid name';
  if (!isValidDate(data.dob)) return 'Invalid date of birth';
  if (!data.treatment || typeof data.treatment !== 'string') return 'Invalid treatment';
  if (!isValidDate(data.date)) return 'Invalid treatment date';
  if (data.feedbackType === 'email' && !isValidEmail(data.email)) return 'Invalid email';
  if (data.feedbackType === 'whatsapp' && !data.whatsapp) return 'Invalid WhatsApp number';
  return null;
};

router.post('/single', async(req, res) => {
  const data = req.body;
  const validationError = validateIndividualFeedback(data);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  console.log('Processing individual feedback:', data);
  let response={}
    try {
        response.db = await handle_feedback.newResponse(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.send("Session feedback submitted successfully. Thank you for your response.")
        }
    }
});
router.post('/bulk', upload.single('file'), async(req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
        console.log("data",data)
        results.push(data)})
    .on('end', () => {
      console.log('Bulk feedback data:', results);
      

      const processedResults = results.map(row => {
        const validationError = validateIndividualFeedback({
          ...row,
          feedbackType: req.body.feedbackType
        });
        return validationError ? { ...row, error: validationError } : row;
      });
      console.log("processedresults",processedResults)
      fs.unlinkSync(req.file.path);
      

      // Simulate processing delay
    //   setTimeout(() => {
        // res.json({
        //   message: 'Bulk feedback processed',
        //   totalRecords: results.length,
        //   validRecords: processedResults.filter(r => !r.error).length,
        //   invalidRecords: processedResults.filter(r => r.error).length,
        //   details: processedResults
        // });
    //   }, 2000);
    });
    
    let response={}
    setTimeout(async() => {
        console.log("results",results)
        try {
            response.db = await handle_feedback.newResponse(results)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: 500,
                message: err
            })
        } finally {
            if (response) {
                res.send("Session feedback submitted successfully. Thank you for your response.")
            }
        }
    }, 2000);
    
});
export default router
