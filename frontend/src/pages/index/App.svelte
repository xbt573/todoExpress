<script>
    import Navbar from '../../components/Navbar.svelte';
    import Task from '../../components/Task.svelte';

    import { onMount } from 'svelte';

    let tasks = [];

    onMount(async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken || refreshToken.trim() == 'undefined') {
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

        const body = await accessResponse.json();

        const response = await fetch('/api/tasks', {
            headers: {
                'Authorization': `Bearer ${body.accessToken}`
            }
        });

        const colorToNumber = {
            red: 3,
            yellow: 2,
            green: 1
        }

        tasks = (await response.json()).sort((a, b) => {
            return colorToNumber[b.color] - colorToNumber[a.color];
        });
        console.log(tasks);
    });
</script>

<main>
    <Navbar />

    {#if String(tasks) != ''}
        <h1 class="text-2xl m-5">Tasks</h1>
        {#each tasks as task}
            <Task id={task.id} title={task.title} checked={task.completed} color={task.color} />
        {/each}
    {:else}
        <h1 class="text-2xl m-5">No tasks :/</h1>
    {/if}
</main>
