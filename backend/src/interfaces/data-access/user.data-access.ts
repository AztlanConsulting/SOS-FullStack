import mongoose, { Schema, Model } from 'mongoose';
import { userRepository } from '../../domain/repositories/user.repository';
import { IUser } from '../../domain/models/user.model';

// 1. Definition of the Mongoose Schema (DB Structure)
const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    petName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// 2. Creation of the Model
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// 3. Repository implementation
export const clientDataAccess: userRepository = {
    save: async (client: IUser): Promise<void> => {
        const newUser = new UserModel(client);
        await newUser.save();
    },

    findByEmail: async (email: string): Promise<IUser | null> => {
        // .lean() improves performance as it return a JS object instead of a Mongoose document
        return await UserModel.findOne({ email }).lean();
    }
};