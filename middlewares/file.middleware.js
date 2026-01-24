const multer = require("multer");
const path = require("path");
const supabaseConfig = require("../config/supabase.config");

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase Client
const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

//set storage engine
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, //1mb
  fileFilter: (req, file, cb) => {
    console.log(file);
    checkFileType(file, cb);
  },
}).single("file");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extName = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extName) {
    console.log("file accepted");
    return cb(null, true);
  } else {
    cb("Error image only!!");
  }
}

//upload to supabase storage
async function uploadToSupabase(req, res, next) {
  if (!req.file) {
    console.log("No file to upload");
    next();
    return;
  }

  try {
    // Generate unique filename
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads") // bucket name
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(fileName);

    req.file.supabaseUrl = publicUrl;
    console.log(req.file.supabaseUrl);
    next();
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Something went wrong while uploading to supabase",
    });
  }
}

module.exports = { upload, uploadToSupabase };
