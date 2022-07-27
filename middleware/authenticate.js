const jwt = require("jsonwebtoken");
const pool = require("../db");
const authenticateToken = async(req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null){
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user;
        req.uid = user.id.rows[0].id;
        req.session_id = user.sessionId;
        const Is_ended = await pool.query(
            'SELECT is_ended FROM sessiontable WHERE session_id = $1', [req.session_id]);
        if(Is_ended.rows[0].is_ended === true){
            res.status(440).send('Session Expired!!!');
        } else{
            next()
        }
    })
}

module.exports = {
    authenticateToken
}

