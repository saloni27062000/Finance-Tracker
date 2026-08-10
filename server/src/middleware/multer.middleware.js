const multer = require("multer");
const path = require("path");

module.exports.upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
});

module.exports.convertToBase64 = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  try {
    const base64String = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64String}`;
    req.body.imageBase64 = base64String;
    req.body.imageDataUri = dataUri;
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to process image string." });
  }
};



// ----------------------------------------------------------------
// const storage = multer.diskStorage({

//   destination: function (req, file, cb) {
//     cb(null, 'src/uploads/'); 
//   },
  
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });
// ------------------------------------------------------------------
