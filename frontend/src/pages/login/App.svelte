<script>
    import Navbar from '../../components/Navbar.svelte';
    import { onMount } from 'svelte';

    async function submit() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || username.trim() == '') {
            alert('Username is empty!');
            return;
        }

        if (!password || password.trim() == '') {
            alert('Password is empty!');
            return;
        }

        const response = await fetch('/api/login', {
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
                case 403:
                    alert('Incorrect username of password.');
                    return;

                default:
                    alert('Something bad happened :(\nTry again in few minutes');
                    return;
            }
        }

        const body = await response.json();

        localStorage.setItem('refreshToken', body.refreshToken);
        localStorage.setItem('accessToken', body.accessToken);
        location.replace('/');
    }

    onMount(() => {
        const elements = [
            document.getElementById('username'),
            document.getElementById('password')
        ];

        const button = document.getElementById('submit');

        [...elements].forEach(element => {
            element.addEventListener('keypress', e => {
                if (e.key == 'Enter') {
                    button.click();
                }
            });
        });
    });
</script>

<main>
    <Navbar />
    <h1 class="text-2xl m-5">Login</h1>

    <div class="m-5 flex flex-row items-center border-2 w-2/3 border-gray-400 rounded-lg overflow-hidden">
        <div class="bg-gray-300 rounded rounded-r-none border-r-2 border-gray-400">
            <p class="p-2">Username</p>
        </div>
        <input id="username" type="text" class="p-2 w-full rounded-lg rounded-l-none" placeholder="JohnDoe">
    </div>

    <div class="m-5 flex flex-row items-center border-2 w-2/3 border-gray-400 rounded-lg overflow-hidden">
        <div class="bg-gray-300 rounded rounded-r-none border-r-2 border-gray-400">
            <p class="p-2">Password</p>
        </div>
        <input id="password" type="password" class="p-2 w-full rounded-lg rounded-l-none">
    </div>

    <div class="m-5 flex flex-row">
        <button on:click={submit} id="submit" class="rounded-lg p-3 px-5 mr-2 bg-sky-500 text-white">Login</button>
        <a href="/register" class="rounded-lg p-3 px-5 bg-sky-500 text-white">Register</a>
    </div>
</main>
