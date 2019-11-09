var data = [];

// grab the database and the employees collection
// onSnapshot alerts when any change is made
db.collection('employees').onSnapshot(res => {

    // loop through each change (incl. on page load)
    res.docChanges().forEach(change => {

        // setup a doc for each change that I'll ultimately store in the data array above, incl. the id
        const doc = { ...change.doc.data(), id: change.doc.id };

        // find out what kind of change was made, then switch the logic accordingly
        switch (change.type) {
            case 'added':
                data.push(doc);
                break;

            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;

            case 'removed':
                data.filter(item => item.id !== doc.id);
                break;
            
            default:
                break;
            
        }
    });

    console.log(data);
    
});