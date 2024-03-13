import express from 'express';

import UserRoutes from './user';

const ApiRoutes = express.Router();

ApiRoutes.use('/user', UserRoutes);

export default ApiRoutes;
