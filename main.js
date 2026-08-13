// ============================
// XX8.COM SYSTEM EFFECT
// ============================


document.addEventListener(
"DOMContentLoaded",
()=>{


const elements = document.querySelectorAll(
`
.header,
.intro-panel,
.department-card,
.status-panel,
.quick-card
`
);



elements.forEach(
(item,index)=>{


item.style.opacity="0";

item.style.transform=
"translateY(25px)";



setTimeout(()=>{


item.style.transition=
"all .7s ease";


item.style.opacity="1";


item.style.transform=
"translateY(0)";



},index*120);



});



});





// ============================
// CARD GLOW EFFECT
// ============================


const cards =
document.querySelectorAll(
".department-card"
);



cards.forEach(card=>{


card.addEventListener(
"mousemove",
(e)=>{


const rect =
card.getBoundingClientRect();


const x =
e.clientX - rect.left;


const y =
e.clientY - rect.top;



card.style.background =
`
radial-gradient(
circle at ${x}px ${y}px,
rgba(255,23,79,.35),
rgba(0,0,0,.8)
)
`;



});



card.addEventListener(
"mouseleave",
()=>{


card.style.background=
"rgba(0,0,0,.7)";


});


});





// ============================
// TELEGRAM BUTTON EFFECT
// ============================


const telegram =
document.querySelector(
".telegram-btn"
);



if(telegram){


setInterval(()=>{


telegram.style.boxShadow=
"0 0 35px #ff174f";



setTimeout(()=>{


telegram.style.boxShadow=
"0 0 15px #ff174f";


},800);



},2000);


}