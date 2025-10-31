import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname=dirname(fileURLToPath(import.meta.url));
const app=express();
const port=process.env.PORT || 3000;
const postArray=[];

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// post home screen
app.get("/",(req,res)=>{
    res.render("index.ejs",{postArray});
});

app.post("/submit",(req,res)=>{
    const {title,author,content}=req.body;
    const ele={ id:Date.now(), //timestamp id 
                title,
                author,
                content,
                date:new Date().toLocaleDateString()};
    postArray.push(ele);
    res.redirect("/");
});

// Read a single post
app.get("/post/:id",(req,res)=>{
    const postId=req.params.id;
    const currPost=postArray.find(p=>p.id==postId)
    if(!currPost) return res.status(404).send("Post Not Found");  //only one if post not found execution stops here
    res.render("post.ejs",{currPost,postArray});
});

//save edited post
app.post("/posts/edit/:id",(req,res)=>{
    const postId=req.params.id;
    const currPost=postArray.find(p=>p.id==postId);
    const {title,author,content} = req.body;

    if(currPost) {
        currPost.title=title;
        currPost.author=author;
        currPost.content=content;
        currPost.date=new Date().toLocaleDateString();
    }
    res.render("all-post.ejs",{postArray})
});

//delete post
app.delete("/posts/delete",(req,res)=>{
    const postId=req.body.id;
    const idx=postArray.findIndex(p=>p.id===postId);
    if(idx!=-1) {
        postArray.splice(idx,1);
        return res.status(200).json({message:"Post deleted succesfully."});
    } else {
        return res.status(404).json({message:"Something went wrong."});
    }
});

app.get("/posts",(req,res)=>{
    res.render("all-post.ejs",{postArray});
});

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});