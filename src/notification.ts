import type { MongoError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { User} from 'c:/ITMCSolution/itmc-web-chat-backend/src/user/entities/user.model';
const { MongoClient } = require('mongodb');

export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}
  
    async findByUsername(username: string): Promise<UserDocument | null> {
      return this.userModel.findOne({ username }).exec();
    }
  }
const uri = "mongodb+srv://phamthien12a6:aA7rYSscuozgJyn4@thiendeptrai.lcjwtix.mongodb.net/?retryWrites=true&w=majority&appName=thiendeptrai";

const client = new MongoClient(uri);
//const usersCollection = client.db('app').collection('user');

client.connect(async (err: MongoError | null) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }

    const notificationsCollection = client.db('app').collection('notifications');

    // Enum values
    const NotificationType = {
        NEW_MESSAGE: 'NEW_MESSAGE',
        INVITATION_TO_GROUP: 'INVITATION_TO_GROUP'
    };

    const NotificationStatus = {
        READ: 'READ',
        UNREAD: 'UNREAD'
    };

    const now = new Date();

    try {
        const user = await UserService.findByUsername('username');
        const insertResult = await notificationsCollection.insertOne({
            owner_id: user._id,
            type: NotificationType.NEW_MESSAGE,
            status: NotificationStatus.UNREAD,
            created_at: now,
            updated_at: now,
            deleted_at: null
        });

        console.log('Notification created with ID:', insertResult.insertedId);

        const notification = await notificationsCollection.findOne({ _id: insertResult.insertedId });

        console.log('Notification:', notification);

        const updateResult = await notificationsCollection.updateOne(
            { _id: insertResult.insertedId },
            { $set: { status: NotificationStatus.READ, updated_at: new Date() } }
        );

        if (updateResult.modifiedCount === 1) {
            console.log('Notification status updated successfully.');
        } else {
            console.log('Notification not found.');
        }

        const deleteResult = await notificationsCollection.deleteOne({ _id: insertResult.insertedId });

        if (deleteResult.deletedCount === 1) {
            console.log('Notification deleted successfully.');
        } else {
            console.log('Notification not found.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
});
