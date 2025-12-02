import AWS from 'aws-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const s3 = new AWS.S3();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fileName, fileType } = req.body;

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: fileType,
    Expires: 60,
  };

  const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

  return res.status(200).json({
    uploadUrl,
    fileUrl: uploadUrl.split('?')[0],
  });
}
