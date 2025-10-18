export default () => ({
  filestore: {
    r2: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
      bucketName: process.env.R2_BUCKET_NAME || "my-bucket",
      endpoint:
        process.env.R2_ENDPOINT ||
        "https://<account_id>.r2.cloudflarestorage.com",
      publicUrl:
        process.env.R2_PUBLIC_URL ||
        "https://pub-dd705dfd4d8d47f8b90caa782970deeb.r2.dev",
      region: process.env.R2_REGION || "auto",
    },
  },
});
