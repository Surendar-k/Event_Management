const express = require('express');

const router = express.Router();


const {forwardToHod} = require('../CONTROLLERS/forwardToHodInbox');
// const approveByHod = require('../CONTROLLERS/approveByHod');
// const approveByPrincipal = require('../CONTROLLERS/approveByPrincipal');
// const approveByCso = require('../CONTROLLERS/approveByCso');

router.post('/forwardToHod', forwardToHod);
// router.post('/approveByHod', approveByHod);
// router.post('/approveByPrincipal', approveByPrincipal);
// router.post('/approveByCso', approveByCso);

module.exports = router;