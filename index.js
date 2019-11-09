// grab the modal div class
const modal = document.querySelector('.modal');
// M = materliaze library object | Modal.init() method launches the referenced modal
M.Modal.init(modal);

// add references for form submit events
const form = document.querySelector('form');
const name = document.querySelector('#name');
const parent = document.querySelector('#parent');
const department = document.querySelector('#department');

form.addEventListener('submit', e => {
    e.preventDefault();

    db.collection('employees').add({
        name: name.value,
        parent: parent.value,
        department: department.value,
    });

    // get the modal instance using Materialize JavaScript
    var instance = M.Modal.getInstance(modal);
    instance.close();

    form.reset();
})