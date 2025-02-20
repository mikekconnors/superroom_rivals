// main.js
document.addEventListener('DOMContentLoaded', function() {
    let currentName = '';

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    function showModal(name) {
        currentName = name;
        document.getElementById('modal-text').innerText = `Add ${name} to:`;
        document.getElementById('myModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('myModal').style.display = 'none';
    }

    function addToTable(type) {
        fetch(`/update/${currentName}/${type}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({}),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById(`svp-${currentName.toLowerCase()}`).innerText = data.svp_count;
                document.getElementById(`mvp-${currentName.toLowerCase()}`).innerText = data.mvp_count;
            })
            .catch(error => console.error('Error:', error));
        closeModal();
    }

    window.goBack = function() {
        window.history.back();
    };
});