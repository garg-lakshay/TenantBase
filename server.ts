import express from 'express';
import router from './router/userrouter';
import router1 from './router/tenantrouter';
import router3 from './router/projectrouter';
import cors from 'cors';
import router2 from './router/taskrouter';

const app = express();
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Hello World');
})
app.use(express.json());


// Mount routers
app.use("/auth", router);
app.use("/tenant", router1);
app.use("/project", router3);
app.use("/task", router2);

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Connected sucessfully on PORT${PORT}`)
});
