// /api/uploadImage.ts

import axios from 'axios';

export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const res = await axios.post('/api/upload/presigned-url', {
    fileName,
    fileType,
  });

  return res.data; // { uploadUrl, fileUrl }
};
