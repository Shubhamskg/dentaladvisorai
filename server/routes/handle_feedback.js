import multer from 'multer';
import fs from 'fs';
import { Router } from "express";
import handle_feedback from '../helpers/handle_feedback.js';
import feedback_form from "./email_feedback_fn.js";
import send_message from "./whatsapp_feedback_fn.js";

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Enhanced email validation
const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(String(email).toLowerCase());
};

// WhatsApp number validation with country code
const isValidWhatsApp = (number) => {
  const re = /^\+[1-9]\d{1,14}$/;
  return re.test(number);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const validateIndividualFeedback = (data) => {
  console.log('Validating individual feedback data:', data);
  if (!data.name || typeof data.name !== 'string') return 'Invalid name';
  if (!isValidDate(data.dob)) return 'Invalid date of birth';
  if (!data.treatment || typeof data.treatment !== 'string') return 'Invalid treatment';
  if (!isValidDate(data.date)) return 'Invalid treatment date';
  if (data.feedbackType === 'email' && !isValidEmail(data.email)) return 'Invalid email';
  if (data.feedbackType === 'whatsapp' && !isValidWhatsApp(data.whatsapp)) return 'Invalid WhatsApp number';
  return null;
};

// New function for bulk email validation
const validateBulkEmails = (emailString) => {
  console.log('Validating bulk emails');
  const emails = emailString.split('\n').slice(1).map(email => email.trim()).filter(email => email !== '');
  const validatedEmails = emails.map(email => ({
    email,
    isValid: isValidEmail(email)
  }));
  console.log(`Validated ${validatedEmails.length} emails`);
  return validatedEmails;
};

// New function for bulk contact (WhatsApp) validation
const validateBulkContacts = (contactString) => {
  console.log('Validating bulk contacts');
  const contacts = contactString.split('\n').slice(1).map(contact => contact.trim()).filter(contact => contact !== '');
  const validatedContacts = contacts.map(contact => ({
    contact,
    isValid: isValidWhatsApp(contact)
  }));
  console.log(`Validated ${validatedContacts.length} contacts`);
  return validatedContacts;
};

router.post('/single', async (req, res) => {
  console.log('Received single feedback request:', req.body);
  const data = req.body;
  const validationError = validateIndividualFeedback(data);

  if (validationError) {
    console.log('Validation error:', validationError);
    return res.status(400).json({ error: validationError });
  }

  try {
    if (data.feedbackType === 'email') {
      console.log('Sending email feedback form to:', data.email);
      await feedback_form(data.email);
    } else if (data.feedbackType === 'whatsapp') {
      console.log('Sending WhatsApp message to:', data.whatsapp);
      await send_message(data.whatsapp);
    }

    console.log('Saving feedback to database');
    const dbResponse = await handle_feedback.newResponse(data);
    console.log('Database response:', dbResponse);
    res.status(200).send("Session feedback submitted successfully. Thank you for your response.");
  } catch (err) {
    console.error('Error processing single feedback:', err);
    res.status(500).json({
      status: 500,
      message: "An error occurred while processing your feedback."
    });
  }
});

router.post('/bulk', upload.single('file'), async (req, res) => {
  console.log('Received bulk feedback request');
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    console.log('File content received');

    let validatedData;
    const firstLine = fileContent.split('\n')[0].trim().toLowerCase();
    if (firstLine === 'email') {
      validatedData = validateBulkEmails(fileContent);
    } else if (firstLine === 'contact') {
      validatedData = validateBulkContacts(fileContent);
    } else {
      throw new Error('Invalid file format. First line must be either "email" or "contact".');
    }

    const validRecords = validatedData.filter(record => record.isValid);
    console.log(`Valid records: ${validRecords.length}, Invalid records: ${validatedData.length - validRecords.length}`);

    for (const record of validRecords) {
      if ('email' in record) {
        console.log(`Sending email feedback form to: ${record.email}`);
        await feedback_form(record.email);
      } else if ('contact' in record) {
        console.log(`Sending WhatsApp message to: ${record.contact}`);
        await send_message(record.contact);
      }
    }

    console.log('Saving bulk feedback to database');
    const dbResponse = await handle_feedback.newResponse(validRecords);
    console.log('Database response received');

    res.status(200).json({
      message: 'Bulk feedback processed',
      totalRecords: validatedData.length,
      validRecords: validRecords.length,
      invalidRecords: validatedData.length - validRecords.length,
      details: validatedData
    });
  } catch (err) {
    console.error('Error processing bulk feedback:', err);
    res.status(500).json({
      status: 500,
      message: "An error occurred while processing bulk feedback."
    });
  } finally {
    console.log(`Cleaning up: Deleting uploaded file ${req.file.path}`);
    fs.unlinkSync(req.file.path);
  }
});

export default router;