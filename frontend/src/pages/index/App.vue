<script setup>
    import NavBar from '@/components/NavBar.vue';
</script>

<script>
    const token = localStorage.getItem('token');

    if (!token || token == 'undefined') {
        location.replace('/login');
    }

    export default {
        data() {
            return {
                tasks: []
            }
        },

        methods: {
            onChange: async function(id) {
                const text = document.getElementById(`#${id}`).value;

                console.log(text);
                console.log({ id: id, title: text });
                if (text.trim() == '') {
                    this.deleteTask(id);
                    return;
                }

                const response = await fetch('/api/tasks', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        title: text
                    })
                });

                if (!response.ok) {
                    alert('Something bad happened :(\nTry again in few minutes');
                    return;
                }

                alert('Success!');
                location.reload();
            },

            deleteTask: async function(id) {
                const response = await fetch('/api/tasks', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                    })
                });

                if (!response.ok) {
                    alert('Something bad happened :(\nTry again in few minutes');
                    return;
                }

                alert('Success!');
                location.reload();
            }
        },

        mounted: async function() {
            const response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            this.tasks = await response.json();
        }
    }
</script>

<template>
    <NavBar />

    <div class="mx-5 my-5 d-flex flex-column" v-for="task in tasks">
        <div class="d-flex input-group">
            <span class="input-group-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                    <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                    <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                </svg>
            </span>

            <input type="text" class="form-control" :id="'#'+task.id" :value="task.title" :onchange="onChange.bind(null, task.id)">
            <button class="btn btn-outline-secondary" :onclick="deleteTask.bind(null, task.id)">Delete</button>
        </div>
    </div>

    <h1 class="mx-5 my-5" v-if="String(tasks) == ''">No tasks :/</h1>
</template>
