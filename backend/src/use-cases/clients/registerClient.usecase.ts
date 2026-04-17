import bcrypt from 'bcryptjs';
import { userRepository } from '../../domain/repositories/user.repository';
import { emailPort } from '../../domain/ports/email.port';

export const registerClientUseCase = async (
    userRepository: userRepository,
    emailPort: emailPort,
    data: { email: string; petName: string }
) => {
    const { email, petName } = data;

    // 1. Validating if the client already exists
    const existingClient = await userRepository.findByEmail(email);
    if (existingClient) {
        throw new Error('El cliente ya está registrado');
    }

    // 2. Applying rule of US-17: Password is the name of the pet
    // The password is hashed before saving it for security
    const hashedPassword = await bcrypt.hash(petName, 10);

    // 3. Persist in the datebase via the port
    await userRepository.save({
        email: email,
        password: hashedPassword,
        petName: petName,
        createdAt: new Date()
    });

    // 4. Notifying the user with their credentials
    // The unhashed petName is sent so they know their password
    await emailPort.sendCredentials(email, petName);

    return { success: true };
};