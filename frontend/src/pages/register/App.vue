<script setup>
    import NavBar from '@/components/NavBar.vue';
</script>

<script>
    export default {
        methods: {
            register: async function() {
                const username = document.getElementById('login').value;
                const password = document.getElementById('password').value;

                if (!username || username.trim() == '') {
                    alert('Username is empty!');
                    return;
                }

                if (!password || password.trim() == '') {
                    alert('Password is empty!');
                    return;
                }

                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });

                if (!response.ok) {
                    switch (response.status) {
                        case 409:
                            alert('User already exists');
                            return;

                        default:
                            alert('Something bad happened :(');
                            return;
                    }
                }

                location.replace('/login');
            },

            login: function() {
                location.replace('/login');
            }
        }
    }
</script>

<template>
    <NavBar />

    <div class="my-5 mx-5">
        <h3>Register</h3>

        <div class="my-5">
            <div class="input-group my-4 w-75">
                <span class="input-group-text">@</span>
                <input type="text" id="login" class="form-control" placeholder="Username">
            </div>

            <div class="input-group my-4 w-75">
                <span class="input-group-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                    </svg>
                </span>
                <input type="password" id="password" class="form-control" placeholder="Password">
            </div>
        </div>

        <button type="button" class="btn btn-primary" @click="register">Register</button>
        <button type="button" class="btn btn-primary mx-2" @click="login">Login</button>
    </div>
</template>
