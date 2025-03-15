const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "david.html"));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: req.app.get("env") === "development" ? err : {},
    });
});

app.listen(process.env.PORT || port, () => {
    console.log(`App is listening on port: ${port}`)
});