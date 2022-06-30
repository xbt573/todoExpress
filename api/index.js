const express = require('express');
const app = express();

// ORM models
const { Users, Tasks, Tokens } = require('./models');

const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecret';

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

    const accessToken = jwt.sign({ userId: user.userId },
        accessTokenSecret,
        { expiresIn: '1m' });
    const refreshToken = jwt.sign({ userId: user.userId },
        refreshTokenSecret,
        { expiresIn: '3d' });

    await Tokens.create({
        userId: user.userId,
        refreshToken: refreshToken
    });

    res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        success: true
    });
});


app.post('/api/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || refreshToken.trim() == '') {
        res.status(400).json({
            error: "refreshToken is empty",
            success: false
        });
        return;
    }

    const token = await Tokens.findOne({
        where: {
            refreshToken: refreshToken
        }
    });

    if (!token) {
        res.status(403).json({
            error: "Invalid refreshToken",
            success: false
        });
        return;
    }

    const accessToken = jwt.sign({ userId: token.userId },
        accessTokenSecret,
        { expiresIn: '1m' });

    res.status(200).json({
        accessToken: accessToken,
        refreshToken: token.refreshToken,
        success: true
    });
});

app.delete('/api/logout', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || refreshToken.trim() == '') {
        res.status(400).json({
            error: "refreshToken is empty",
            success: false
        });
        return;
    }

    await Tokens.destroy({
        where: {
            refreshToken: refreshToken
        }
    });

    res.status(200).json({
        success: true
    });
});

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
