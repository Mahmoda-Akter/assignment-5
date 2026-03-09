// for bug button logic
const createElement = (arr) => {
    const htmlelement = arr.map((el) => `<span class="btn rounded-full bg-amber-100">${el}</span>`)
    return (htmlelement.join(" "));
};
let allbtn = document.getElementById('all-btn');
let openbtn = document.getElementById('open-btn');
let closebtn = document.getElementById('closed-btn');
let countissue = document.getElementById('count-issue')
let allissue = [];


// remove and active button logic
const removeactive = () => {
    allbtn.classList.remove("bg-blue-600")
    openbtn.classList.remove("bg-blue-600")
    closebtn.classList.remove("bg-blue-600")
}
const addactive = (btn) => {
    btn.classList.add("bg-blue-600", "text-black")
}

allbtn.addEventListener('click', () => {
    removeactive()
    addactive(allbtn)
    let allcount = allissue.length;
    countissue.innerText = `${allcount} Issues`
    displayallcard(allissue)
})
openbtn.addEventListener('click', () => {
    removeactive()
    addactive(openbtn)
    lodingspinner(true);
    const openissue = allissue.filter(item => item.status === "open");
    let opencount = (openissue.length)
    countissue.innerText = `${opencount} Issues`;
    displayallcard(openissue);
    lodingspinner(false)
})
closebtn.addEventListener('click', () => {
    removeactive()
    addactive(closebtn)
    lodingspinner(true)
    const closeissue = allissue.filter(item => item.status === "closed")
    let closecount = closeissue.length;
    countissue.innerText = `${closecount} Issues`
    displayallcard(closeissue)
    lodingspinner(false)
})

// loding spinner is here
const lodingspinner=(state)=>{
    if(state == true){
        document.getElementById("loding-container").classList.remove('hidden');
        document.getElementById('issue-container').classList.add('hidden')
    }else{
        document.getElementById('issue-container').classList.remove("hidden");
        document.getElementById("loding-container").classList.add("hidden")
    }
};

// search button logic here
const searchbtn=document.getElementById('search-btn')
searchbtn.addEventListener('click',() =>{
    const searchinput=document.getElementById('search-inpute')
    let searchvalue=searchinput.value.toLowerCase();
    console.log(searchvalue)

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchvalue}`)
    .then(res => res.json())
    .then((data)=>{
        const allword=data.data;
        console.log(allword);
        const filterword=allword.filter((word)=> word.title.toLowerCase().includes(searchvalue))
        console.log(filterword)
        displayallcard(filterword);
    })
    
    
    
})

// load all card form api
const loadallcar = async () => {
    lodingspinner(true);
    let res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    let data = await res.json();
    allissue = (data.data);
    console.log(allissue.length)
    displayallcard(allissue)
    
}
// load all model info from api
const modelid=document.getElementById("my_modal_5")
console.log(modelid)
const openmodel=async (id)=>{
    const url=`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    console.log(url)
    const res=await fetch(url);
    const dtailes=await res.json();
    displayshowmodel(dtailes.data);
    
}
// display all model logic

const displayshowmodel=(modelinfo)=>{
    const modelcontainer=document.getElementById('modelcontainer')
    modelcontainer.innerHTML=`
    <div id="modelcontainer" class="modal-box">
                        <h2 class="tittle font-bold text-2xl">${modelinfo.title}</h2>
                        <div class="flex gap-2">
                            <p class="bg-green-600 rounded-2xl text-amber-50  w-[80px] h-[30px] text-center">${modelinfo.status}</p>
                            <p>. Opened by ${modelinfo.author}</p>
                            <p>. ${modelinfo.updatedAt}</p>
                        </div>
                        <div class="flex gap-2 mt-4">${createElement(modelinfo.labels)}</div>
                        <p class="mt-2">${modelinfo.description}</p>
                        <div class="flex justify-between mt-3">
                            <div>
                                <p>Assignee:</p>
                                <p class="font-bold">${modelinfo.author}</p>
                            </div>
                            <div>
                                <p>Priority:</p>
                                <button class="bg-red-600 rounded-2xl border-none text-amber-50  w-[80px] h-[30px]">${modelinfo.priority}</button>
                            </div>
                        </div>
                        <div class="modal-action">
                            <form method="dialog">
                                <!-- if there is a button in form, it will close the modal -->
                                <button class="btn bg-blue-600">Close</button>
                            </form>
                        </div>
                    </div>
    `
    modelid.showModal();
}

// display all card logic

const displayallcard = (cards) => {
    // catch issuecontainer
    const issuecontainer = document.getElementById("issue-container");
    issuecontainer.innerHTML = "";
    // loop all Card 
    for (let card of cards) {
        // createelement here

        let carddiv = document.createElement("div");
        let setborder = ""
        if (card.status === "open") {
            setborder = "border-t-4 border-green-500"
        } else if (card.status === "closed") {
            setborder = "border-t-4 border-purple-500"
        }
        carddiv.innerHTML = `
        <div onclick="openmodel(${card.id})" class="bg-white shadow-2xl p-6 ${setborder}">
                    <div class="flex justify-between items-center">
                        <img src="./assets/Open-Status.png">
                        <p class="bg-amber-200 w-20 text-center p-1">${card.priority}</p>
                    </div>
                    <h2 class="font-bold mt-2">${card.title}</h2>
                    <p class="mt-2 line-clamp-2">${card.description}</p>
                    <div class="flex mt-4 gap-4">${createElement(card.labels)}</div>
                    <div class="flex justify-between"> 
                        <div class="mt-5">
                        <p class="text-[#64748B]">#1${card.author}</p>
                        <p class="text-[#64748B]">${card.assignee}</p>
                    </div>
                    <div class="mt-5">
                        <p class="text-[#64748B]">${card.createdAt}</p>
                        <p class="text-[#64748B]">${card.updatedAt}</p>
                    </div>
                    </div>
                </div>
        `
        issuecontainer.appendChild(carddiv);
    }
    lodingspinner(false);

}

loadallcar();