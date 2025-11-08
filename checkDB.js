// Check database contents
db = connect('mongodb://localhost:27017/express-products');

print('\nDatabase Info:');
print('-------------');
print('Current Database:', db.getName());

print('\nCollections:');
print('-------------');
db.getCollectionNames().forEach(collection => {
    print('Collection:', collection);
    print('Document Count:', db[collection].countDocuments());
    print('Sample Document:', JSON.stringify(db[collection].findOne(), null, 2));
    print('-------------');
});