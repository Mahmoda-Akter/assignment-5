const userinput=document.getElementById('userinput');
const userpassword=document.getElementById('userpassword');
const singin=document.getElementById('sing-in');

singin.addEventListener('click', function(){
    let uservalu=userinput.value;
    let userpass=userpassword.value;
    console.log(userpass)
    if(uservalu==="admin" && userpass==="admin123"){
        alert("success")
        window.location.assign("./home/index.html");
    }
    else{
        alert("Enter valid information");
    }
})
