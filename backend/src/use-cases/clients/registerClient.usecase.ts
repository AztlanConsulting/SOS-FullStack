import bcrypt from 'bcryptjs';
import { IClientRepository } from '../../domain/ports/IClientRepository';
import { IEmailProvider } from '../../domain/ports/IEmailProvider';

export const registerClientUseCase = async (
    clientRepository: IClientRepository,
    emailProvider: IEmailProvider,
    data: { email: string; petName: string }
) => {
    const { email, petName } = data;

    // 1. Validating if the client already exists
    const existingClient = await clientRepository.findByEmail(email);
    if (existingClient) {
        throw new Error('El cliente ya está registrado');
    }

    // 2. Applying rule of US-17: Password is the name of the pet
    // The password is hashed before saving it for security
    const hashedPassword = await bcrypt.hash(petName, 10);

    // 3. Persist in the datebase via the port
    await clientRepository.save({
        email: email,
        password: hashedPassword,
        petName: petName,
        createdAt: new Date()
    });

    // 4. Notifying the user with their credentials
    // The unhashed petName is sent so they know their password
    await emailProvider.sendCredentials(email, petName);

    return { success: true };
};