window.addEventListener("scroll", ()=>{
    let content = document.querySelector(".row")
    let contentPosition = content.getBoundingClientRect().top
    let scrrnPossition = window.innerHeight / 1.7
    if(contentPosition < scrrnPossition){
        content.classList.add("rodar")
    }else{
        content.classList.remove("rodar")
    }
})