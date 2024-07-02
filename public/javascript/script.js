(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


  document.addEventListener('DOMContentLoaded', () => {
    var totalAmount = 0;
    var serialNo = 1;

    // Fetch existing data from the server
    fetch('/repairDetails')
        .then(response => response.json())
        .then(data => {
            data.forEach(detail => {
                addTableRow(detail.serialNo, detail.particular, detail.rate, detail.amount);
                totalAmount += detail.amount;
                serialNo = detail.serialNo + 1;
            });
            updateTotalAmount();
        });

    document.getElementById('entryForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission

        // Get input values
        var particular = document.getElementById('particular').value;
        var rate = parseFloat(document.getElementById('rate').value);
        var amount = parseFloat(document.getElementById('amount').value);

        // Prepare data to send to server
        var detail = {
            serialNo: serialNo,
            particular: particular,
            rate: rate,
            amount: amount
        };

        // Post data to the server
        fetch('/repairDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(detail)
        })
        .then(response => response.json())
        .then(data => {
            // Add new row to table
            addTableRow(data.serialNo, data.particular, data.rate, data.amount);

            // Update total amount
            totalAmount += data.amount;
            updateTotalAmount();

            // Increment serial number
            serialNo++;

            // Reset form
            document.getElementById('entryForm').reset();
        });
    });

    function addTableRow(serialNo, particular, rate, amount) {
        var tableBody = document.getElementById('tableBody');
        var newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${serialNo}</td>
            <td>${particular}</td>
            <td>${rate.toFixed(2)}</td>
            <td>${amount.toFixed(2)}</td>
        `;

        // Insert new row before the total row
        tableBody.insertBefore(newRow, tableBody.lastElementChild);
    }

    function updateTotalAmount() {
        document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
    }
});
