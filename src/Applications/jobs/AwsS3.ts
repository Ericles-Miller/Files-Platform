import express, { Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';


const s3 = new aws.S3({
  
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'seu-bucket-s3',
    acl: 'public-read', // Permissões de acesso
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString()); // Gera um nome de arquivo único
    },
  }),
});