$(".create-post").on("click",()=>{
    $("#formContainer").removeClass("d-none");
});

$(".form-close").on("click",()=>{
    $("#formContainer").addClass("d-none");
});

// Form edit functionality 
$(".post-edit-btn").on("click",(e)=>{
                
    const id=e.target.dataset.id;
    const post=postArray.find(p => p.id==id);

    if(post) {
        // prefill the form
        $("#post-edit-id").val(Number(id));
        $("#edit-title").val(post.title);
        $("#edit-author").val(post.author);
        $("#edit-content").val(post.content);
    }

    // show the form
    $("#formEditContainer").removeClass("d-none");
});


$(".post-edit-close").on("click",()=>{
    $("#formEditContainer").addClass("d-none");
});

$(".post-edit-save").on("click",(e)=>{
    e.preventDefault();
    const postId=$("#post-edit-id").val();
    const updatedPost= {
        title: $("#edit-title").val(),
        author: $("#edit-author").val(),
        content: $("#edit-content").val()
    };
    $.post(`/posts/edit/${postId}`,updatedPost,()=>{
        location.reload();  
    });
});

$(".post-delete-btn").on("click",async (e)=>{
    const postId=Number(e.target.dataset.id);
    if(confirm("Are you sure you want to delete this post?")) {
        try{
            const response= await fetch("/posts/delete",{
                method: "DELETE",
                headers: {"content-type":"application/json"},
                body: JSON.stringify({id:postId})
            });
            const data= await response.json();
            if(response.ok) {
                alert(data.message);
                location.reload();
            } else {
                alert(data.message);
            }
        } catch(error) {
            console.log("Error: "+error);
        }
    }
});

$(".form-submit").on("click",(event)=>{
    const content=$("#content").val().trim();
    const title=$("#title").val().trim();
    const author=$("#author").val().trim();
    
    const warning1=$("#warning-title");
    const warning2=$("#warning-author");
    const warning3=$("#warning-content");

    showWarning(event,title,warning1);
    showWarning(event,author,warning2);
    showWarning(event,content,warning3);
});

function showWarning(event,textContent,warning) {
    if(textContent==="") {
        event.preventDefault();
        warning.text("Please enter content before submitting.");
    }
    else {
        warning.text("");
    }
}

