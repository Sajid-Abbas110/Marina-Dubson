fetch('http://localhost:3000/api/invoices')
    .then(r => r.json())
    .then(console.log)
    .catch(console.error);
