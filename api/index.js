const express = require('express');
const app = express();

// ORM models
const { Users, Tasks } = require('./models');

const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

const crypto = require('crypto');

// Helper for md5 hashing
const makeHash = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
};

// JWT authentification
const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Body parser
app.use(express.json());

/*
    POST /api/register

    - Register

    Request body:
    {
        "username": "xbt573",
        "password": "testpass"
    }

    Response body:
    {
        // Only if error occured
        "error": "Error",

        // true if all ok, else false
        "success": true
    }

    Possible HTTP codes:
        200: All ok
        400: Username or password is invalid
        409: User already exists
 */
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || username.trim() == '') {
        res.status(400).json({
            error: 'Username is empty.',
            success: false
        });
        return;
    }

    if (!password || password.trim() == '') {
        res.status(400).json({
            error: 'Password is empty.',
            success: false
        });
        return;
    }

    const user = await Users.findOne({
        where: {
            login: username
        }
    });

    if (user) {
        res.status(409).json({
            error: 'User already exists.',
            success: false
        });
        return;
    }

    await Users.create({
        userId: crypto.randomUUID(),
        login: username,
        hash: makeHash(password)
    });

    res.status(200).json({ success: true });
});

/*
    POST /api/login

    - Login

    Request body:
    {
        "username": "xbt573",
        "password": "testpass"
    }

    Response body:
    {
        // Only if error occured
        "error": "Error",

        // Only if all ok
        "jwt": "jsonwebtoken",

        // true if all ok, else false
        "success": true
    }

    Possible HTTP codes:
        200: All ok
        400: Username or password is invalid
        403: Username or password is incorrect

*/
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || username.trim() == '') {
        res.status(400).json({
            error: 'Username is empty.',
            success: false
        });
        return;
    }

    if (!password || password.trim() == '') {
        res.status(400).json({
            error: 'Password is empty.',
            success: false
        });
        return;
    }

    const user = await Users.findOne({
        where: {
            login: username,
            hash: makeHash(password)
        }
    });

    if (!user) {
        res.status(403).json({
            error: 'Incorrect login or password.',
            success: false
        });
        return;
    }

    res.status(200).json({
        jwt: jwt.sign({ userId: user.userId }, accessTokenSecret),
        success: true
    });
});


/*
    POST /api/tasks

    - Create new task

    Request headers:
        Authorization: Bearer jsonwebtoken

    Request body:
    {
        "title": "Hello World!"
    }

    Response body:
    {
        // Only if error occured
        "error": "Error",

        // true if all ok, else false
        "success": true
    }

    Possible HTTP codes:
        200: All ok
        403: Unauthorized
        400: Title is invalid
        409: Task already exists
*/
app.post('/api/tasks', authJWT, async (req, res) => {
    const { userId } = req.user;
    const { title } = req.body;

    if (!title || title.trim() == '') {
        res.status(400).json({
            error: 'Title is empty.',
            success: false
        });
        return;
    }

    const task = await Tasks.findOne({
        where: {
            userId: userId,
            title: title
        }
    });

    if (task) {
        res.status(409).json({
            error: 'Task already exists.',
            success: false
        });
        return;
    }

    await Tasks.create({
        userId: userId,
        title: title
    });

    res.status(200).json({
        success: true
    });
});

/*
    GET /api/tasks

    - Get tasks

    Request headers:
        Authorization: Bearer jsonwebtoken

    Request body: null

    Response body:
        Array of tasks:
        {
            "id": 0,
            "title": "Hello World!"
        }

    Possible HTTP codes:
        200: All ok
        403: Unauthorized
*/
app.get('/api/tasks', authJWT, async (req, res) => {
    const { userId } = req.user;

    const rawTasks = await Tasks.findAll({
        where: {
            userId: userId
        }
    });

    const tasks = rawTasks.map(x => { return { id: x.id, title: x.title }; });

    res.json(tasks);
});

/*
    PATCH /api/tasks

    - Update task

    Request body:
    {
        "id": 0,
        "title": "Hello World!"
    }

    Response body:
    {
        // Only if error occured
        "error": "Error",

        // true if all ok, else false
        "success": true
    }

    Possible HTTP codes:
        200: All ok
        403: Unauthorized
        400: Id or title is invalid
        404: Task not found
*/
app.patch('/api/tasks', authJWT, async (req, res) => {
    const { userId } = req.user;
    const { id, title } = req.body;

    if (!id) {
        res.status(400).json({
            error: 'ID is empty.',
            success: false
        });
        return;
    }

    if (!title || title.trim() == '') {
        res.status(400).json({
            error: 'Title is empty.',
            success: false
        });
        return;
    }

    const task = await Tasks.findOne({
        where: {
            userId: userId,
            id: id
        }
    });

    if (!task) {
        res.status(404).json({
            error: 'Task not found.',
            success: false
        });
        return;
    }

    await Tasks.update({ title: title }, {
        where: {
            userId: userId,
            id: id
        }
    });

    res.status(200).json({
        success: true
    });
});

/*
    DELETE /api/tasks

    - Delete task

    Request body:
    {
        "id": 0
    }

    Response body:
    {
        // Only if error occured
        "error": "Error",

        // true if all ok, else false
        "success": true
    }

    Possible HTTP codes:
        200: All ok
        403: Unauthorized
        400: Id is invalid
        404: Task not found
*/
app.delete('/api/tasks', authJWT, async (req, res) => {
    const { userId } = req.user;
    const { id } = req.body;

    if (!id) {
        res.status(400).json({
            error: 'ID is empty.',
            success: false
        });
        return;
    }

    const task = await Tasks.findOne({
        where: {
            userId: userId,
            id: id
        }
    });

    if (!task) {
        res.status(404).json({
            error: 'Task not found.',
            success: false
        });
        return;
    }

    await Tasks.destroy({
        where: {
            userId: userId,
            id: id
        }
    });

    res.status(200).json({
        success: true
    });
});

app.listen(3000, () => {
    console.log('API: Started');
});
