import React, { useState, useCallback } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CalendarIcon, UploadIcon, MailIcon, PhoneIcon } from 'lucide-react';
import axios from 'axios';
import "./feedback.scss";
import instance from '../config/instance';

const TREATMENT_TYPES = ['Cleaning', 'Filling', 'Extraction', 'Root Canal'];

const RequestTypeToggle = ({ requestType, setRequestType }) => (
  <div className="form-group request-type">
    <label>Request Type:</label>
    <div className="radio-group">
      {['individual', 'bulk'].map((type) => (
        <label key={type} className={requestType === type ? 'active' : ''}>
          <input
            type="radio"
            value={type}
            checked={requestType === type}
            onChange={() => setRequestType(type)}
          />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      ))}
    </div>
  </div>
);

const FormField = React.memo(({ label, id, type, icon: Icon, error, ...props }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}:</label>
    <div className={`input-wrapper ${Icon ? 'with-icon' : ''}`}>
      <input type={type} id={id} name={id} {...props} />
      {Icon && <Icon className="icon" />}
    </div>
    {error && <span className="error-message">{error}</span>}
  </div>
));

const FileUpload = React.memo(({ file, setFile, error }) => (
  <div className="form-group">
    <label htmlFor="file-upload">Upload Contacts File:</label>
    <div className="file-upload">
      <input
        type="file"
        id="file-upload"
        accept=".txt"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div className="file-upload-content">
        <UploadIcon className="upload-icon" />
        <span>{file ? file.name : 'Choose a file'}</span>
      </div>
    </div>
    {error && <span className="error-message">{error}</span>}
    <p className="file-format-info">
      Please upload a .txt file with each line in the format:
      <br />
      name,dob,treatment,date,email/whatsapp
    </p>
  </div>
));

const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters long";
  return "";
};

const validateDate = (date) => {
  if (!date) return "Date is required";
  const selectedDate = new Date(date);
  const today = new Date();
  if (selectedDate > today) return "Date cannot be in the future";
  return "";
};

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

const validateWhatsApp = (number) => {
  if (!number.trim()) return "WhatsApp number is required";
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(number)) return "Invalid phone number format";
  return "";
};

const validateFile = (file) => {
  if (!file) return "File is required";
  if (!file.name.endsWith('.txt')) return "File must be a .txt file";
  return "";
};

const FeedbackForm = ({ type }) => {
  const [requestType, setRequestType] = useState('individual');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    treatment: '',
    date: '',
    email: '',
    whatsapp: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (requestType === 'individual') {
      newErrors.name = validateName(formData.name);
      newErrors.dob = validateDate(formData.dob);
      newErrors.treatment = formData.treatment ? '' : 'Treatment is required';
      newErrors.date = validateDate(formData.date);
      if (type === 'email') {
        newErrors.email = validateEmail(formData.email);
      } else {
        newErrors.whatsapp = validateWhatsApp(formData.whatsapp);
      }
    } else {
      newErrors.file = validateFile(file);
    }
    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  }, [formData, requestType, type, file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError(null);
    setSuccess(false);

    try {
      const endpoint = `/api/handle_feedback/${requestType === 'individual' ? 'single' : 'bulk'}`;
      const data = requestType === 'individual' 
        ? { ...formData, requestType, feedbackType: type }
        : (() => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('requestType', requestType);
            formData.append('feedbackType', type);
            return formData;
          })();

      const response = await instance.post(endpoint, data, {
        headers: {
          'Content-Type': requestType === 'individual' ? 'application/json' : 'multipart/form-data'
        }
      });
      console.log('Server response:', response.data);
      setSuccess(true);
    } catch (err) {
      console.error('Error sending feedback request:', err);
      setServerError('An error occurred while sending the feedback request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <RequestTypeToggle requestType={requestType} setRequestType={setRequestType} />
      
      {requestType === 'individual' ? (
        <>
          <FormField 
            label="Name" 
            id="name" 
            type="text" 
            value={formData.name} 
            onChange={handleInputChange} 
            error={errors.name}
          />
          <FormField 
            label="Date of Birth" 
            id="dob" 
            type="date" 
            icon={CalendarIcon} 
            value={formData.dob} 
            onChange={handleInputChange}
            error={errors.dob}
          />
          <div className="form-group">
            <label htmlFor="treatment">Treatment Type:</label>
            <div className="input-wrapper">
              <select 
                id="treatment" 
                name="treatment" 
                value={formData.treatment} 
                onChange={handleInputChange}
              >
                <option value="">Select treatment</option>
                {TREATMENT_TYPES.map((treatment) => (
                  <option key={treatment} value={treatment.toLowerCase().replace(' ', '-')}>
                    {treatment}
                  </option>
                ))}
              </select>
            </div>
            {errors.treatment && <span className="error-message">{errors.treatment}</span>}
          </div>
          <FormField 
            label="Treatment Date" 
            id="date" 
            type="date" 
            icon={CalendarIcon} 
            value={formData.date} 
            onChange={handleInputChange}
            error={errors.date}
          />
          {type === 'email' ? (
            <FormField 
              label="Email" 
              id="email" 
              type="email" 
              icon={MailIcon} 
              value={formData.email} 
              onChange={handleInputChange}
              error={errors.email}
            />
          ) : (
            <FormField 
              label="WhatsApp Number" 
              id="whatsapp" 
              type="tel" 
              icon={PhoneIcon} 
              value={formData.whatsapp} 
              onChange={handleInputChange}
              error={errors.whatsapp}
            />
          )}
        </>
      ) : (
        <FileUpload file={file} setFile={setFile} error={errors.file} />
      )}
      {serverError && <div className="error-message">{serverError}</div>}
      {success && <div className="success-message">Feedback request sent successfully!</div>}
      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? 'Sending...' : `Send Feedback Request${requestType === 'bulk' ? 's' : ''}`}
      </button>
    </form>
  );
};

const FeedbackRequestPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="feedback-request-page">
      <h1>Feedback Request</h1>
      <div className="card">
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList>
            {[
              { icon: MailIcon, label: 'Email' },
              { icon: PhoneIcon, label: 'WhatsApp' },
            ].map(({ icon: Icon, label }, index) => (
              <Tab key={label}>
                <Icon size={18} />
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanel>
            <FeedbackForm type="email" />
          </TabPanel>
          <TabPanel>
            <FeedbackForm type="whatsapp" />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackRequestPage;