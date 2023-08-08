let imgBox = document.querySelector(".img-box")
let button = document.querySelector("button")

button.addEventListener("click",generateQR)


function setPlaceholder(){

}

function removerPlaceholder(){

}


// function to generate qr and handles placeholder
function generateQR(){
    let inputText = document.querySelector("input").value

    if (inputText!=""){
        
        let apiLink = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${inputText}`

        document.querySelector("#qr-img").attributes[0].value=apiLink;
        document.querySelector("#qr-img").style.opacity=1;
        document.querySelector("input").placeholder="Text/URL";
        document.querySelector("input").classList.remove("red-placeholder");
        setInterval(() => {
            document.querySelector(".download-btn").style.display="block";
            document.querySelector(".download-btn").style.opacity=1;
            
        }, 100);
        
        console.log(document.querySelector("#qr-img").attributes[0])
    }else{
        document.querySelector("input").placeholder="Please Enter a text";
        document.querySelector("input").classList.add("red-placeholder");
        document.querySelector("#qr-img").attributes[0].value="";
    }
            
}

// function that is respnsible for downloading the qr
const downloadButton = document.querySelector(".download-btn");

downloadButton.addEventListener("click", async () => {
    try {
        const inputValue = document.querySelector("input").value;
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${inputValue}`;
        
        const response = await fetch(url);
        const file = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = "qr_code.png";
        link.click();

    } catch (error) {
        alert("Failed to download the QR!");
    }
});



// toggle between scan and generate page
document.querySelector(".nav-element").addEventListener("click",function(){
    document.querySelector(".container").style.display="none";
    document.querySelector(".container2").style.display="block";
})

document.querySelector(".nav-element2").addEventListener("click",function(){
    document.querySelector(".container").style.display="block";
    document.querySelector(".container2").style.display="none";
})


// functions for scan qr page

const secondContaier = document.querySelector(".container2");
form = secondContaier.querySelector("form");
fileInp = document.querySelector("#submitQR");
infoText = form.querySelector("p");
copyBtn = secondContaier.querySelector(".copy");
closeBtn = secondContaier.querySelector(".close");


function fetchRequest(formData,file){

    infoText.innerText = "Scanning QR Code...";
    //sending post request to qr server api with passing form data as body and getting response from it

    fetch("https://api.qrserver.com/v1/read-qr-code/",{
        method:"POST",body:formData
    }).then(res=>res.json()).then(result => {
        result=result[0].symbol[0].data;

        infoText.innerText =result ? "Upload QR Code": "Couldn't Scan QR Code";
        if(!result) return;

        secondContaier.querySelector("textarea").innerText=result;
        form.querySelector("img").src=URL.createObjectURL(file);

        
        secondContaier.classList.add("active");
    }).catch(()=>{
        infoText.innerText = "Couldn't Scan QR Code";
    })
};

fileInp.addEventListener("change",e=>{
    let file = e.target.files[0]; //getting user selected file
    if(!file) return;
    let formData = new FormData(); // creating a new formdata object
    formData.append("file",file); // adding selected file to file data

    fetchRequest(formData,file);

});

copyBtn.addEventListener("click",()=>{
    let text = secondContaier.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
})

form.addEventListener("click",()=>{fileInp.click()});
closeBtn.addEventListener("click",()=>secondContaier.classList.remove("active"));

