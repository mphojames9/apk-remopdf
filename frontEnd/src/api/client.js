import axios from 'axios';

//const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://remopdf-backend.onrender.com/api';
const downloadBlob = (blob, filename) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    let dataUrl = reader.result;
    
    // Inject the filename into the Base64 URL so Android can extract it
    dataUrl = dataUrl.replace(';base64,', `;name=${encodeURIComponent(filename)};base64,`);

    const link = document.createElement('a');
    link.href = dataUrl; 
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  reader.readAsDataURL(blob);
};

export const mergePdfs = async (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await axios.post(`${API_URL}/tools/merge`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/pdf' }), 'RemoPDF_Merged.pdf');
  return true;
};

export const splitPdf = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/tools/split`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/zip' }), 'RemoPDF_Split.zip');
  return true;
};

export const compressPdf = async (file, quality, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('quality', quality);

  const response = await axios.post(`${API_URL}/tools/compress`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/pdf' }), `Compressed_${file.name}`);
  return true;
};

export const imagesToPdf = async (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await axios.post(`${API_URL}/tools/image-to-pdf`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/pdf' }), 'RemoPDF_Images.pdf');
  return true;
};

export const pdfToImages = async (files, imageType, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('image_type', imageType);

  const response = await axios.post(`${API_URL}/tools/pdf-to-images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/zip' }), 'RemoPDF_Images.zip');
  return true;
};

export const getPdfPreviews = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const response = await axios.post(`${API_URL}/tools/get-previews`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const removePdfPages = async (files, config, mode, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('config', JSON.stringify(config));
  formData.append('mode', mode);

  const response = await axios.post(`${API_URL}/tools/remove-pages`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  const filename = mode === 'single' ? 'RemoPDF_Pro_Merged.pdf' : 'RemoPDF_Pro_Package.zip';
  const mimeType = mode === 'single' ? 'application/pdf' : 'application/zip';
  downloadBlob(new Blob([response.data], { type: mimeType }), filename);
  return true;
};

export const compressImages = async (files, quality, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('quality', quality);

  const response = await axios.post(`${API_URL}/tools/compress-images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/zip' }), 'RemoPDF_Premium_Compressed_Images.zip');
  return true;
};

export const pdfToWord = async (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await axios.post(`${API_URL}/tools/pdf-to-word`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/zip' }), 'RemoPDF_Word_Files.zip');
  return true;
};


export const pdfToExcel = async (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await axios.post(`${API_URL}/tools/pdf-to-excel`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  downloadBlob(new Blob([response.data], { type: 'application/zip' }), 'RemoPDF_Excel_Files.zip');
  return true;
};

export const addPasswordToPdf = async (file, password, onProgress) => {
  const formData = new FormData();
  formData.append('file', file); // Single file injection
  formData.append('password', password);

  const response = await axios.post(`${API_URL}/tools/add-password`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  const baseName = file.name.rsplit ? file.name.rsplit('.', 1)[0] : file.name.split('.').slice(0, -1).join('.');
  downloadBlob(new Blob([response.data], { type: 'application/pdf' }), `${baseName || 'RemoPDF'}_protected.pdf`);
  return true;
};

export const verifyPdfPassword = async (file, password) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('password', password);

  const response = await axios.post(`${API_URL}/tools/verify-password`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const removePdfPassword = async (file, password, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('password', password);

  const response = await axios.post(`${API_URL}/tools/remove-password`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  const baseName = file.name.rsplit ? file.name.rsplit('.', 1)[0] : file.name.split('.').slice(0, -1).join('.');
  downloadBlob(new Blob([response.data], { type: 'application/pdf' }), `${baseName || 'RemoPDF'}_unlocked.pdf`);
  return true;
};

export const changePdfPassword = async (file, oldPassword, newPassword, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('old_password', oldPassword);
  formData.append('new_password', newPassword);

  const response = await axios.post(`${API_URL}/tools/change-password`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });

  const baseName = file.name.rsplit ? file.name.rsplit('.', 1)[0] : file.name.split('.').slice(0, -1).join('.');
  downloadBlob(new Blob([response.data], { type: 'application/pdf' }), `${baseName || 'RemoPDF'}_updated.pdf`);
  return true;
};

export const pdfToPpt = async (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  try {
    const response = await axios.post(`${API_URL}/tools/pdf-to-ppt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percentCompleted);
      }
    });

    downloadBlob(new Blob([response.data], { type: 'application/zip' }), 'RemoPDF_PowerPoint_Files.zip');
    return true;
  } catch (error) {
    // CRITICAL FIX: If the server rejects the file with a JSON error (like a 403 ENCRYPTED flag), 
    // Axios hides it inside the Blob format. We must extract the text back into JSON to read it.
    if (error.response && error.response.data && error.response.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        throw json; // Throw the parsed JSON to the frontend
      } catch (e) {
        throw error;
      }
    }
    throw error;
  }
};
