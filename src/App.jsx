import React, { useState, useRef } from 'react';

// Replace string below with the Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxk9xj8ZYWJ6gW3ZWQ06HbQmimXsn_0LhKaWqaaMih0j7QfkROh74esGi1fOghPtxu1ag/exec";

const EMPLOYEES = ["Hanna", "Rancy", "Prisk", "Vikas", "Prasanna", "Raviteja", "Naga Sai", "Sai", "Team"];

function App() {
  const [employee, setEmployee] = useState(EMPLOYEES[0]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      setStatus('error');
      setMessage('Please select an image file.');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setMessage('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getBase64 = (fileObj) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileObj);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus('error');
      setMessage('Please select a file to upload.');
      return;
    }

    if (GOOGLE_SCRIPT_URL === "YOUR_SCRIPT_URL_HERE") {
      setStatus('error');
      setMessage('Please configure the GOOGLE_SCRIPT_URL in App.jsx first.');
      return;
    }

    setStatus('loading');

    try {
      const base64Str = await getBase64(file);
      const payload = {
        employeeName: employee,
        fileBase64: base64Str,
        mimeType: file.type,
        fileName: `${employee}_${Date.now()}_${file.name}`
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        setStatus('success');
        setMessage('Posted successfully! Your count has been updated.');
        removeFile();
      } else {
        setStatus('error');
        setMessage(result.message || 'Error uploading file.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('An error occurred during upload. Check console for details.');
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Media Tracker</h1>
        <p>100 Posters Target &mdash; 2/day per person</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employee">Select Designer</label>
          <select
            id="employee"
            className="form-select"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
          >
            {EMPLOYEES.map(emp => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Poster Image</label>
          {!file ? (
            <div
              className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                accept="image/*"
                onChange={handleChange}
              />
              <div className="upload-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="upload-text">Click to upload or drag and drop</div>
              <div className="upload-hint">PNG, JPG, GIF</div>
            </div>
          ) : (
            <div className="preview-area">
              <div className="preview-info">
                {preview && <img src={preview} alt="Preview" className="preview-thumb" />}
                <span className="preview-name">{file.name}</span>
              </div>
              <button type="button" className="remove-btn" onClick={removeFile}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={status === 'loading' || !file}
        >
          {status === 'loading' ? (
            <>
              <div className="spinner"></div>
              <span>Uploading...</span>
            </>
          ) : (
            'Submit Poster'
          )}
        </button>

        {status === 'success' && (
          <div className="status-message status-success">
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="status-message status-error">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
