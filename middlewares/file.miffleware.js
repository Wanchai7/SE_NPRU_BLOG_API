const multer = require("multer");
const path = require("path");
const fileFilter = require("../config/filrefilter.config");

const { getStorage, ref, upliadBytesResumable } = require("firebase/storage");

//initialize Firebase storage
const { initializeApp } = require("firebase/app");
const firebaseConfig = require("../config/firebase.config");
const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

//set storage engine
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, // 1mb
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("cover");

function checkFileType(req, file, cb) {
  const FileType = /jpeg|jpg|png|gif|webp/;
  const extName = FileType.test(
    path,
    extname(file.priginalname).toLocaleLoweCase()
  );
  const mimetype = FileType.test(file.mimetype);
  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cv("Error image only!!");
  }
}

//upload to firebase store
async function uploadToFirebase(req, res, next) {
  if (!req.cover) {
    next();
    return;
  }

  //save location
  const storageRef = ref(firebaseStorage, `upload/${req.cover.originalname}`);

  const metadata = {
    contentType: req.cover.mimetype,
  };
  try {
    const snapshost = await uploadBytesResumable(
      storageRef,
      req.cover.buffer,
      metadata
    );
    //get url from firebase
    req.cover.filebaseurl = await getDownloadURL(snapshost.ref);
    next();
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Something went wrong while uploading to firebase",
    });
  }
}
