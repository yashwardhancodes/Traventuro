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
    const entryForm = document.getElementById('entryForm');
    const serialNoField = document.getElementById('serialNo');

    entryForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const serialNo = serialNoField.value;
        const particular = document.getElementById('particular').value;
        const rate = parseFloat(document.getElementById('rate').value);
        const amount = parseFloat(document.getElementById('amount').value);

        const response = await fetch('/repairDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                serialNo,
                particular,
                rate,
                amount
            })
        });

        if (response.ok) {
            addTableRow(serialNo, particular, rate, amount);
            serialNoField.value = parseInt(serialNoField.value) + 1;
            entryForm.reset();
        } else {
            console.error('Failed to add repair detail');
        }
    });

    function addTableRow(serialNo, particular, rate, amount) {
        const tableBody = document.getElementById('tableBody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${serialNo}</td>
            <td>${particular}</td>
            <td>${rate.toFixed(2)}</td>
            <td>${amount.toFixed(2)}</td>
        `;

        tableBody.insertBefore(newRow, tableBody.lastElementChild.previousSibling);
        updateTotalAmount();
    }

    function updateTotalAmount() {
        const tableBody = document.getElementById('tableBody');
        let totalAmount = 0;
        tableBody.querySelectorAll('tr').forEach((row, index) => {
            if (index < tableBody.rows.length - 1) {
                const amount = parseFloat(row.cells[3].innerText);
                totalAmount += amount;
            }
        });
        document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
    }
});
