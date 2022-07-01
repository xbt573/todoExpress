<script>
    import Navbar from '../../components/Navbar.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        const elements = [
            document.getElementById('title')
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

    let color = 'green';

    const numberToColor = {
        0: 'red',
        1: 'yellow',
        2: 'green'
    }

    const colorToCss = {
        red: 'red-700',
        yellow: 'yellow-600',
        green: 'lime-700'
    }

    function onInputChange() {
        const selector = document.getElementById('chooser');
        color = numberToColor[selector.options.selectedIndex];
    }

    async function createTask() {
        const title = document.getElementById('title').value;
        const completed = document.getElementById('completed').checked;

        if (!title || title.trim() == '') {
            alert('Title is empty!');
            return;
        }

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken || refreshToken == 'undefined') {
            location.replace('/login');
        }

        const accessResponse = await fetch('/api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        });

        if (!accessResponse.ok) {
            location.replace('/login');
        }

        const accessBody = await accessResponse.json();
        const accessToken = accessBody.accessToken;

        const body = JSON.stringify({
            title: title,
            color: color,
            completed: completed
        });
        console.log(body);
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: body
        });

        if (!response.ok) {
            switch (response.status) {
                case 409:
                    alert('Task already exists.');
                    return;

                default:
                    alert('Something bad happened :(\nTry again in few minutes');
                    return;

            }
        }

        location.replace('/');
    }

    $: selectorColor = 'text-' + colorToCss[color];
</script>

<main>
    <Navbar />

    <h1 class="text-2xl m-5">New task</h1>

    <div class="m-5 flex flex-row items-center border-2 w-2/3 border-gray-400 rounded-lg overflow-hidden">
        <div class="bg-gray-300 rounded rounded-r-none border-r-2 border-gray-400">
            <p class="p-2">Title</p>
        </div>
        <input id="title" type="text" class="p-2 w-full rounded-lg rounded-l-none" placeholder="Buy cheese">
    </div>

    <div class="m-5 flex flex-row items-center border-2 w-2/3 border-gray-400 rounded-lg overflow-hidden">
        <div class="bg-gray-300 rounded rounded-r-none border-r-2 border-gray-400 mr-2">
            <p class="p-2">Priority</p>
        </div>
        <select name="color" id="chooser" size="1" class={selectorColor} on:change={onInputChange}>
            <option class="text-red-700">● red</option>
            <option class="text-yellow-600">● yellow</option>
            <option class="text-lime-700" selected>● green</option>
        </select>
    </div>

    <div class="m-5 flex flex-row items-center border-2 w-2/3 border-gray-400 rounded-lg overflow-hidden">
        <div class="bg-gray-300 rounded rounded-r-none border-r-2 border-gray-400 mr-2">
            <p class="p-2">Completed</p>
        </div>
        <input type="checkbox" id="completed">
    </div>

    <button id="submit" on:click={createTask} class="rounded-lg p-3 px-5 m-5 bg-sky-500 text-white">Submit</button>
</main>
