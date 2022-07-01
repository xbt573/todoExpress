<script>
    export let id = 0;
    export let title = '';
    export let checked = false;
    export let color = '';

    const colorDict = {
        red: 'red-700',
        yellow: 'yellow-600',
        green: 'lime-700'
    }

    async function getAccessToken() {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken || refreshToken == 'undefined') {
            location.replace('/login');
        }

        const response = await fetch('/api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        });

        if (!response.ok) {
            location.replace('/login');
        }

        const body = await response.json();
        return body.accessToken;
    }

    async function toggleChecked() {
        checked = !checked;
        const accessToken = await getAccessToken();

        const body = JSON.stringify({
            id: id,
            title: title,
            completed: checked,
            color: color
        });
        console.log(body);
        await fetch('/api/tasks', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: body
        });

        location.reload();
    }

    async function deleteTask() {
        const accessToken = await getAccessToken();

        await fetch('/api/tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: id
            })
        });
        location.reload();
    }

    $: taskColor = 'text-' + colorDict[color] || black;
    $: through = checked ? 'line-through' : '';
</script>

<main>
    <p class="text-red-700" style="display: none;"></p>
    <p class="text-yellow-600" style="display: none;"></p>
    <p class="text-lime-700" style="display: none;"></p>
    <div class="rounded-lg w-2/3 m-5 bg-gray-300
    flex flex-row justify-between p-2">
        <div class="flex flex-row items-center mx-2">
            <input type="checkbox" class="bg-[#0081AF] m-1" {checked} on:click={toggleChecked}>
            <p class="m-1 {taskColor} {through}">{title}</p>
        </div>

        <div class="flex items-center">
            <button on:click={deleteTask} class="text-white bg-[#FF1F40] hover:bg-[#F50025] rounded-lg p-1">Delete</button>
        </div>
    </div>
</main>

<!-- <style>
    .styleGen {
        display: none;
    }
</style> -->
