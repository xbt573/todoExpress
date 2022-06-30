<template>
    <nav class="navbar navbar-expand-lg bg-dark">
        <div class="d-flex justify-content-between container-fluid">
            <a href="/" class="navbar-brand text-white px-1">ToDo</a>

            <div class="px-2">
                <a href="/login" onclick="localStorage.setItem('refreshToken', 'undefined');" class="nav-item text-white text-decoration-none mx-3">Logout</a>
                <a href="/new" class="nav-item text-white text-decoration-none mx-3">New Task</a>
            </div>
        </div>
    </nav>
</template>
