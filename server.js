import express from "express";
import formRoutes from "./routes/form.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use('/api/forms', formRoutes);

app.get("/", (req, res)=>{
    res.send("Hello server started!");
})

app.listen(PORT, ()=>console.log(`server started listening at http://${process.env.HOST}:${PORT}`));