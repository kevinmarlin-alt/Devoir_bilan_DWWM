import express from 'express'

const App = () => {

    const app = express();
    
    app.use(express.json())
    
    app.get('/health', (req, res) => {
        res.status(200).send({
            status: "ok"
        })
    })

    return app;

};

export default App;