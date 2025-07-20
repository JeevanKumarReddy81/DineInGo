"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var mongoose_1 = require("mongoose");
var Restaurant_1 = require("./src/models/Restaurant");
var Event_1 = require("./src/models/Event");
dotenv.config();
console.log('--- SEED SCRIPT STARTED ---');
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dineingoapp:FzyC357xJaxj6oXM@cluster0dine.sofa1gx.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0dine';
console.log('Using MongoDB URI:', MONGODB_URI);
var restaurants = [
    {
        name: 'Spice Garden',
        address: 'MG Road, Bangalore',
        cuisine: 'Indian, North Indian',
        description: 'Authentic Indian cuisine with a modern twist',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
    },
    {
        name: 'The Coastal Kitchen',
        address: 'Indiranagar, Bangalore',
        cuisine: 'Seafood, Coastal',
        description: 'Fresh seafood and coastal cuisine',
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b'
    },
    {
        name: 'Biryani House',
        address: 'Koramangala, Bangalore',
        cuisine: 'Indian, Biryani',
        description: 'Specialized in authentic biryani dishes',
        imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0'
    },
    {
        name: 'Pizza Paradise',
        address: 'Whitefield, Bangalore',
        cuisine: 'Italian, Pizza',
        description: 'Authentic Italian pizza and pasta',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
    },
    {
        name: 'Sushi Master',
        address: 'UB City, Bangalore',
        cuisine: 'Japanese, Sushi',
        description: 'Premium Japanese sushi and sashimi',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'
    },
    {
        name: 'Burger Junction',
        address: 'Marathahalli, Bangalore',
        cuisine: 'American, Burgers',
        description: 'Classic American burgers and fast food',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
    }
];
var events = [
    {
        title: 'Wine Tasting Experience',
        description: 'Join us for an evening of wine tasting featuring selections from around the world',
        date: new Date('2024-04-25T19:00:00Z'),
        location: 'The Wine Cellar, Indiranagar, Bangalore',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        title: 'Bangalore Food Festival',
        description: 'Experience the best of Bangalore\'s culinary scene with top chefs and restaurants',
        date: new Date('2024-05-15T11:00:00Z'),
        location: 'Palace Grounds, Bangalore',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        title: 'Craft Beer Workshop',
        description: 'Learn about craft beer brewing and tasting with expert brewers',
        date: new Date('2024-05-20T18:00:00Z'),
        location: 'Toit Brewpub, Indiranagar, Bangalore',
        imageUrl: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        title: 'South Indian Cooking Masterclass',
        description: 'Learn authentic South Indian recipes from celebrity chef',
        date: new Date('2024-06-05T14:00:00Z'),
        location: 'Culinary Academy, Koramangala, Bangalore',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        title: 'Coffee Cupping Session',
        description: 'Discover the art of coffee tasting with expert baristas',
        date: new Date('2024-06-12T10:00:00Z'),
        location: 'Third Wave Coffee Roasters, MG Road, Bangalore',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
];
function seedRestaurantsAndEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var collections, delRest, delEv, insertedRestaurants, insertedEvents, collectionsAfter, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    console.log('Connecting to MongoDB Atlas...');
                    return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI, {
                            useNewUrlParser: true,
                            useUnifiedTopology: true
                        })];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB Atlas successfully');
                    console.log('Mongoose connection name:', mongoose_1.default.connection.name);
                    console.log('Mongoose connection db:', mongoose_1.default.connection.db.databaseName);
                    return [4 /*yield*/, mongoose_1.default.connection.db.listCollections().toArray()];
                case 2:
                    collections = _a.sent();
                    console.log('Collections before seeding:', collections.map(function (c) { return c.name; }));
                    // Clear existing data
                    console.log('Clearing existing restaurants and events...');
                    return [4 /*yield*/, Restaurant_1.Restaurant.deleteMany({})];
                case 3:
                    delRest = _a.sent();
                    return [4 /*yield*/, Event_1.Event.deleteMany({})];
                case 4:
                    delEv = _a.sent();
                    console.log('Deleted restaurants:', delRest.deletedCount, 'Deleted events:', delEv.deletedCount);
                    // Insert restaurants
                    console.log('Inserting restaurants...');
                    return [4 /*yield*/, Restaurant_1.Restaurant.insertMany(restaurants)];
                case 5:
                    insertedRestaurants = _a.sent();
                    console.log("\u2705 Successfully inserted ".concat(insertedRestaurants.length, " restaurants"));
                    // Insert events
                    console.log('Inserting events...');
                    return [4 /*yield*/, Event_1.Event.insertMany(events)];
                case 6:
                    insertedEvents = _a.sent();
                    console.log("\u2705 Successfully inserted ".concat(insertedEvents.length, " events"));
                    return [4 /*yield*/, mongoose_1.default.connection.db.listCollections().toArray()];
                case 7:
                    collectionsAfter = _a.sent();
                    console.log('Collections after seeding:', collectionsAfter.map(function (c) { return c.name; }));
                    // Display summary
                    console.log('\n📊 Seeding Summary:');
                    console.log("Restaurants: ".concat(insertedRestaurants.length));
                    console.log("Events: ".concat(insertedEvents.length));
                    console.log('\n🎉 Seeding completed successfully!');
                    // Display inserted data
                    console.log('\n📋 Inserted Restaurants:');
                    insertedRestaurants.forEach(function (restaurant, index) {
                        console.log("".concat(index + 1, ". ").concat(restaurant.name, " - ").concat(restaurant.cuisine));
                    });
                    console.log('\n📅 Inserted Events:');
                    insertedEvents.forEach(function (event, index) {
                        console.log("".concat(index + 1, ". ").concat(event.title, " - ").concat(event.date.toLocaleDateString()));
                    });
                    process.exit(0);
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    console.error('❌ Seeding failed:', err_1);
                    process.exit(1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
seedRestaurantsAndEvents();
