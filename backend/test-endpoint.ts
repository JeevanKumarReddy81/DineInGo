import mongoose from 'mongoose';
import { getUserAchievements } from './src/controllers/achievementController';

const mockReq = {
  params: { userId: 'cT87VYgv1hgukQT7ehEt7x9Eh6h2' }
} as any;

const mockRes = {
  status: function(code: number) { this.statusCode = code; return this; },
  json: function(data: any) { console.log('Response JSON:', JSON.stringify(data, null, 2)); return this; }
} as any;

mongoose.connect('mongodb+srv://dineingoapp:FzyC357xJaxj6oXM@cluster0dine.sofa1gx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0dine').then(async () => {
    await getUserAchievements(mockReq, mockRes);
    mongoose.disconnect();
}).catch(console.error);
