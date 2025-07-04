const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(cors());
app.use(express.json());







//verify JWT token
const authenticateToken = ( req, res, next ) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'Acess tokenm required'});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({ error: 'Invalid or expired token'});
        }
        req.user = user;
        next();
    });
};

//User registration 
app.post('api/auth/register', async (req,res) => {
    try {
        const { email, password, name } = req.body;

        //validate
        if(!email || !password || !name){
            return res.status(400).json({ error: 'All fields required'});
        }

        if(password.length < 6){
            return res.status(400).json({ error: 'Password must be at least 6 characters'});
        }

        //check if already exists 
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]
        );

        if(existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists'});
        }

        //Hash Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //Insert user into database
        const result = await pool.query(
            'INSERT INTO userrs (email, password, name) VALUES ($1, $2, $3) REUTRNING id, email, name',
            [email, hashedPassword, name]
        );

        const user = result.rows[0];

        //generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            JWT_SECRET,
            { 
                expiresIn: '24h'
            }
        );

        res.status(201).json ({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch(error){
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//User login 
app.post('api/auth/login', async (req,res) => {
    try{
        const{ email, password }= req.body;

        //validation
        if(!email || !password ){
            return res.status(400).json({ error: 'Email and Password Required'});
        }

        //FInd user in database
        const result = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]
        );

        if(result.rowCount.length === 0){
            return res.status(400).json({error: 'Invalid Credentials'});
        }

        const user= result.rows[0];

        //verify password 
        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword){
            return res.status(401).json({ error: 'Invalid Credentials'});
        }

        //Generate JWT token 
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            JWT_SECRET,
            { 
                expiresIn: '24h'
            }
        );

        req.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch(error){
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected route example
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token verification endpoint
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Logout endpoint (client-side token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Start server
app.listen(PORT, async () => {
  await initDB();
  console.log(`Server running on port ${PORT}`);
});



            

