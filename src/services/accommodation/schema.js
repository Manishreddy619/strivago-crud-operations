import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const accomadationSchema = new Schema(
	{
		name: { type: String, required: true },

		description: { type: String, required: true },
		city: { type: String, required: true },
		totalGuest: { type: Number, required: true },
		userId: { type: String },
	},

	{
		timestamps: true,
	},
);

export default model('Accomdation', accomadationSchema);
