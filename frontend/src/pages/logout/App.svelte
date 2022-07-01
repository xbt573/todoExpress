<script>
    import { onMount } from 'svelte';

    onMount(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        localStorage.setItem('refreshToken', 'undefined');

        if (refreshToken && refreshToken != 'undefined') {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });
        }

        location.replace('/login');
    });
</script>
<main></main>
