var express = require('express');
var router = express.Router();

var multer = require('multer');

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    if (file != null) {
      const mimeType = file.mimetype.split('/');
      const fileType = mimeType[1];
      const fileName = req.body.name + '.' + fileType;
      cb(null, fileName);
    }
  },
});

const diskStorage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/files');
  },
  filename: (req, file, cb) => {
    if (file != null) {
      const mimeType = file.mimetype.split('/');
      const fileType = mimeType[1];
      const fileName = req.body.nif + file.originalname;
      cb(null, fileName);
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file != null) {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  }
};

const pdfFilter = (req, file, cb) => {
  if (file != null) {
    const allowedMimeTypes = ['application/pdf'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  }
};

const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single(
  'imagem',
);

const storagePdf = multer({
  storage: diskStorage2,
  fileFilter: pdfFilter,
}).single('file');

const eventController = require('../controllers/EventController');
const authController = require('../controllers/AuthController');

router.get('/events', eventController.showAll);
router.post(
  '/:id?/event',
  authController.verifyToken,
  storage,
  eventController.save,
);

router.get(
  '/myevents',
  authController.verifyToken,
  eventController.showMyEvents,
);
router.delete(
  '/myevents/:ide?',
  authController.verifyToken,
  eventController.deleteEvent,
);
router.post(
  '/myevents/:ide?',
  authController.verifyToken,
  storage,
  eventController.editEvent,
);
router.put(
  '/myevents/publish/:ide?',
  authController.verifyToken,
  eventController.publishEvent,
);

router.get('/editevent/:ide', eventController.showEventByID);

router.post(
  '/buyticket/:ide',
  authController.verifyToken,
  storagePdf,
  eventController.buyTicket,
);

router.get('/getowner/:id', eventController.getOwner);

module.exports = router;
