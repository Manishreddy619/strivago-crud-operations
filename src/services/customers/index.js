import customerModel from './schema.js';
import express from 'express';
import createHttpError from 'http-errors';
import { JWTAuthenticate } from '../auth/tools.js';
import { JWTAuthMiddleware } from '../auth/tokenmiddleware.js';
import accomadationSchema from '../accommodation/schema.js';
const customerRouter = express.Router();

customerRouter.post('/register', async (req, res, next) => {
	const { email, password, role } = req.body;
	let user = {
		email,
		password,
		role,
	};
	try {
		const newUser = new customerModel(user);
		const customer = await newUser.save();
		res.send(customer);
	} catch (error) {
		next(error);
	}
});
customerRouter.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await customerModel.checkCredentials(email, password);
		if (user) {
			const accessToken = await JWTAuthenticate(user);
			res.send({ accessToken });
		} else {
			next(createHttpError(401, 'credentials are not ok'));
		}
	} catch (error) {
		next(error);
	}
});
customerRouter.get(
	'/me/accomadation',
	JWTAuthMiddleware,
	async (req, res, next) => {
		console.log(req.user);
		try {
			if (req.user) {
				if (req.user.role === 'Host') {
					console.log('---------------', String(req.user._id));
					// const id = String(ObjectID);
					const id = String(req.user._id);
					const accomadationMe = await accomadationSchema.find({ userId: id });
					res.send(accomadationMe);
				} else {
					res.send(createHttpError(403, 'you are forbidden for this activity'));
				}
			} else {
				res.send(createHttpError(500, 'server error'));
			}
		} catch (error) {
			next(error);
		}
	},
);
customerRouter.get('/me', JWTAuthMiddleware, async (req, res, next) => {
	try {
		if (req.user) {
			res.send({ staus: 'ok', user: req.user });
		}
	} catch (error) {
		next(error);
	}
});
export default customerRouter;
