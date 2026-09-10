const CONFIG={APPS_SCRIPT_URL:"https://script.google.com/macros/s/AKfycbyIl-X_GHpPnWbLh3c_tGTXi9R-Lh5sagPHP5Upwo6qzTHoo_JpQYRV3-EovNrHpf3F-w/exec",BUSINESS_EMAIL:"hello@gottacoffeedelivery.com"};
let cart=[],currentDrink=null,selectedOptions={milk:null,flavors:[],bottom:null,espresso:false,lotus:false,coldFoam:false};
const $=id=>document.getElementById(id),money=n=>`$${Number(n||0).toFixed(2)}`;

let LIVE_MENU_READY=false;
let LIVE_MENU_REFRESHING=false;
let LIVE_MENU_WAITERS=[];
let LIVE_MENU_TIMER=null;
let LIVE_MENU_SCRIPT=null;
let LIVE_MENU_ATTEMPT=0;
const LIVE_MENU_MAX_ATTEMPTS=4;
const LIVE_MENU_ATTEMPT_TIMEOUT=9000;

function applyLiveMenu(live){
  if(!live||typeof live!=="object")throw Error("Live menu response was empty.");
  ["drinks","foods","milks","flavors","bottoms","addons"].forEach(k=>{
    if(Array.isArray(live[k]))MENU[k]=live[k];
  });
  if(live.business)MENU.business={...(MENU.business||{}),...live.business};
  LIVE_MENU_READY=true;
  LIVE_MENU_REFRESHING=false;
  LIVE_MENU_ATTEMPT=0;
  if(LIVE_MENU_TIMER){clearTimeout(LIVE_MENU_TIMER);LIVE_MENU_TIMER=null;}
  if(LIVE_MENU_SCRIPT){try{LIVE_MENU_SCRIPT.remove()}catch(_){ } LIVE_MENU_SCRIPT=null;}
  try{localStorage.setItem("gottaCoffeeLastLiveMenu",JSON.stringify({savedAt:Date.now(),menu:live}));}catch(_){ }
  const waiters=[...LIVE_MENU_WAITERS];
  LIVE_MENU_WAITERS=[];
  waiters.forEach(fn=>{try{fn(true)}catch(err){console.error(err)}});
  setLiveMenuStatus("Today's menu is ready.");
  console.log("Gotta Coffee live menu loaded.",live.updatedAt||"");
}

function useMenuResponse(response){
  try{
    if(!response || typeof response!=="object")return false;
    if(response.ok===true && response.menu){
      applyLiveMenu(response.menu);
      return true;
    }
    if(Array.isArray(response.drinks) || response.business){
      applyLiveMenu(response);
      return true;
    }
  }catch(err){
    console.error("Could not apply live menu:",err);
  }
  return false;
}

function setLiveMenuStatus(message){
  document.querySelectorAll("[data-live-menu-status]").forEach(el=>el.textContent=message);
}

function finishLiveMenuFailure(){
  LIVE_MENU_REFRESHING=false;
  if(LIVE_MENU_TIMER){clearTimeout(LIVE_MENU_TIMER);LIVE_MENU_TIMER=null;}
  if(LIVE_MENU_SCRIPT){try{LIVE_MENU_SCRIPT.remove()}catch(_){ } LIVE_MENU_SCRIPT=null;}
  const waiters=[...LIVE_MENU_WAITERS];
  LIVE_MENU_WAITERS=[];
  waiters.forEach(fn=>{try{fn(false)}catch(err){console.error(err)}});
}

// JSONP callback used by the Apps Script ?action=menu endpoint.
// This avoids the cross-site iframe/postMessage path that Facebook's in-app
// browser was blocking.
window.gottaCoffeeMenuCallback=function(response){
  if(useMenuResponse(response)) window.GOTTA_COFFEE_LIVE_MENU=response;
};

function runLiveMenuAttempt(){
  if(LIVE_MENU_READY)return;
  LIVE_MENU_REFRESHING=true;
  LIVE_MENU_ATTEMPT++;
  setLiveMenuStatus(`Checking today's menu… attempt ${LIVE_MENU_ATTEMPT} of ${LIVE_MENU_MAX_ATTEMPTS}`);

  if(LIVE_MENU_SCRIPT){try{LIVE_MENU_SCRIPT.remove()}catch(_){ }}
  const script=document.createElement("script");
  LIVE_MENU_SCRIPT=script;
  script.async=true;
  script.src=CONFIG.APPS_SCRIPT_URL+
    "?action=menu&callback=gottaCoffeeMenuCallback&_="+Date.now()+"-"+LIVE_MENU_ATTEMPT;
  script.onerror=function(){
    if(LIVE_MENU_READY)return;
    if(LIVE_MENU_TIMER){clearTimeout(LIVE_MENU_TIMER);LIVE_MENU_TIMER=null;}
    retryOrFail();
  };
  document.head.appendChild(script);

  if(LIVE_MENU_TIMER)clearTimeout(LIVE_MENU_TIMER);
  const thisAttempt=LIVE_MENU_ATTEMPT;
  LIVE_MENU_TIMER=setTimeout(function(){
    if(LIVE_MENU_READY || thisAttempt!==LIVE_MENU_ATTEMPT)return;
    retryOrFail();
  },LIVE_MENU_ATTEMPT_TIMEOUT);
}

function retryOrFail(){
  if(LIVE_MENU_READY)return;
  if(LIVE_MENU_ATTEMPT<LIVE_MENU_MAX_ATTEMPTS){
    setLiveMenuStatus("Google took a little too long — retrying automatically…");
    setTimeout(runLiveMenuAttempt,900);
  }else{
    console.warn("Fresh live menu did not arrive after automatic retries.");
    finishLiveMenuFailure();
  }
}

function refreshLiveMenu(callback){
  if(typeof callback==="function")LIVE_MENU_WAITERS.push(callback);
  if(LIVE_MENU_READY){
    const waiters=[...LIVE_MENU_WAITERS];
    LIVE_MENU_WAITERS=[];
    waiters.forEach(fn=>{try{fn(true)}catch(err){console.error(err)}});
    return;
  }
  if(LIVE_MENU_REFRESHING)return;
  LIVE_MENU_ATTEMPT=0;
  runLiveMenuAttempt();
}

document.addEventListener("DOMContentLoaded",()=>{
  if(useMenuResponse(window.GOTTA_COFFEE_LIVE_MENU))return;
  refreshLiveMenu();
});

function showView(id){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$(id).classList.add("active");scrollTo(0,0)}
function goHome(){showView("homeView")}
function renderOrderingClosed(){
  $("orderContent").innerHTML=`<div class="panel"><h2>☕ Ordering is currently closed</h2><div class="notice">${escapeHtml(MENU.business.closedMessage||"Ordering is currently closed. Please check back later!")}</div><div class="actions"><button onclick="goHome()">← Home</button></div></div>`;
}
function renderLiveMenuError(targetId){
  $(targetId).innerHTML=`<div class="panel"><h2>We couldn't refresh the current menu</h2><div class="notice">Please tap Retry so we can load today's prices and available options directly from Gotta Coffee.</div><div class="actions"><button class="primary" onclick="${targetId==='orderContent'?'startOrder()':targetId==='menuContent'?'showMenu()':'showInfo()'}">Retry</button><button onclick="goHome()">Home</button></div></div>`;
}
function startOrder(){
  cart=[];
  showView("orderView");
  $("orderContent").innerHTML=`<div class="panel"><h2>Loading today's menu… ☕</h2><div class="notice" data-live-menu-status>Checking current prices and available options.</div></div>`;
  refreshLiveMenu(ok=>{
    if(!ok)return renderLiveMenuError("orderContent");
    if(MENU.business && MENU.business.orderingOpen===false)return renderOrderingClosed();
    renderDrinkPicker();
  });
}
function showMenu(){
  showView("menuView");
  $("menuContent").innerHTML=`<div class="panel"><h2>Loading today's menu… ☕</h2><div class="notice" data-live-menu-status>Checking current prices and availability.</div></div>`;
  refreshLiveMenu(ok=>ok?renderMenu():renderLiveMenuError("menuContent"));
}
function showInfo(){
  showView("infoView");
  $("infoContent").innerHTML=`<div class="panel"><h2>Loading delivery information…</h2><div class="notice" data-live-menu-status>Checking today's delivery options.</div></div>`;
  refreshLiveMenu(ok=>ok?renderInfo():renderLiveMenuError("infoContent"));
}
function showChat(){showView("chatView");initChat()}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]))}
function jsq(s){return String(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}
function availableDrinks(){return MENU.drinks.filter(d=>d.available)}
function milkLabel(name){return String(name)==="0.02"?"2%":String(name)}
function renderDrinkPicker(){let h=`<div class="panel"><h2>What would you like?</h2><div class="choices">`;
availableDrinks().forEach(d=>h+=`<button class="choice" onclick='chooseDrink(${JSON.stringify(d).replace(/'/g,"&#39;")})'><span><strong>${escapeHtml(d.sourceName)}</strong><small>${escapeHtml(d.description)}</small></span><span class="price">${money(d.price)}</span></button>`);
h+=`</div><div class="notice">🚗 Delivery orders must be at least <strong>${money(MENU.business.deliveryMinimum)}</strong> before delivery fees.</div></div>`;$("orderContent").innerHTML=h}
function chooseDrink(d){currentDrink={...d};selectedOptions={milk:null,flavors:[],bottom:null,espresso:false,lotus:false,coldFoam:false};renderDrinkOptions()}
function renderDrinkOptions(){const d=currentDrink;let h=`<div class="panel"><h2>${escapeHtml(d.sourceName)}</h2><p>${escapeHtml(d.description)}</p>`;
h+=`<div class="option-group"><h3>Milk</h3><div class="choices">`;MENU.milks.filter(x=>x.available).forEach(m=>{const label=milkLabel(m.name);h+=`<button class="choice ${selectedOptions.milk===label?"selected":""}" onclick="selectMilk('${jsq(label)}')">${escapeHtml(label)}</button>`});h+=`</div></div>`;
h+=`<div class="option-group"><h3>Flavors <small>(up to 4)</small></h3><div class="chips">`;MENU.flavors.filter(x=>x.available).forEach(f=>h+=`<button class="chip ${selectedOptions.flavors.includes(f.name)?"selected":""}" onclick="toggleFlavor('${jsq(f.name)}')">${escapeHtml(f.name)}</button>`);h+=`</div></div>`;
if(MENU.bottoms.some(x=>x.available)){h+=`<div class="option-group"><h3>Bottom (optional)</h3><div class="choices"><button class="choice ${!selectedOptions.bottom?"selected":""}" onclick="selectBottom(null)">No Bottom</button>`;MENU.bottoms.filter(x=>x.available).forEach(b=>h+=`<button class="choice ${selectedOptions.bottom===b.name?"selected":""}" onclick="selectBottom('${jsq(b.name)}')">${escapeHtml(b.name)}</button>`);h+=`</div></div>`}
h+=`<div class="option-group"><h3>Add-ons</h3><div class="choices">`;MENU.addons.filter(x=>x.available).forEach(a=>{let k=a.name.toLowerCase().includes("espresso")?"espresso":a.name.toLowerCase().includes("lotus")?"lotus":"coldFoam";h+=`<button class="choice ${selectedOptions[k]?"selected":""}" onclick="toggleAddon('${k}')"><span>${escapeHtml(a.name)}</span><span class="price">+${money(a.price)}</span></button>`});h+=`</div></div>`;
h+=`<label>Special instructions</label><textarea id="drinkNotes" placeholder="Anything else for this drink?"></textarea><div class="actions"><button onclick="renderDrinkPicker()">← Change</button><button class="primary" onclick="addCurrentDrink()">Add to order →</button></div></div>`;$("orderContent").innerHTML=h}
function selectMilk(v){selectedOptions.milk=v;renderDrinkOptions()} function selectBottom(v){selectedOptions.bottom=v;renderDrinkOptions()}
function toggleFlavor(v){let i=selectedOptions.flavors.indexOf(v);if(i>=0)selectedOptions.flavors.splice(i,1);else if(selectedOptions.flavors.length<4)selectedOptions.flavors.push(v);else alert("You can choose up to 4 flavors.");renderDrinkOptions()}
function toggleAddon(k){selectedOptions[k]=!selectedOptions[k];renderDrinkOptions()}
function addonPrice(k){let a=MENU.addons.find(x=>(k==="espresso"&&x.name.toLowerCase().includes("espresso"))||(k==="lotus"&&x.name.toLowerCase().includes("lotus"))||(k==="coldFoam"&&x.name.toLowerCase().includes("foam")));return a?.price||0}
function addCurrentDrink(){let notes=$("drinkNotes")?.value||"";cart.push({...currentDrink,milk:selectedOptions.milk,flavors:[...selectedOptions.flavors],bottom:selectedOptions.bottom,espresso:selectedOptions.espresso,lotus:selectedOptions.lotus,coldFoam:selectedOptions.coldFoam,notes,itemPrice:currentDrink.price+(selectedOptions.espresso?addonPrice("espresso"):0)+(selectedOptions.lotus?addonPrice("lotus"):0)+(selectedOptions.coldFoam?addonPrice("coldFoam"):0)});renderCart()}
function cartSubtotal(){return cart.reduce((s,i)=>s+i.itemPrice,0)}
function renderCart(){let h=`<div class="panel"><h2>Your Order</h2>`;cart.forEach((i,n)=>{h+=`<div class="summary"><div class="summary-row"><strong>${escapeHtml(i.sourceName)}</strong><strong>${money(i.itemPrice)}</strong></div>${i.milk?`<div>${escapeHtml(i.milk)}</div>`:""}${i.flavors.length?`<div>Flavors: ${i.flavors.map(escapeHtml).join(", ")}</div>`:""}${i.bottom?`<div>Bottom: ${escapeHtml(i.bottom)}</div>`:""}${i.espresso?`<div>Double espresso</div>`:""}${i.lotus?`<div>Lotus shot</div>`:""}${i.coldFoam?`<div>Cold foam</div>`:""}${i.notes?`<div>Notes: ${escapeHtml(i.notes)}</div>`:""}<button class="danger" onclick="removeItem(${n})">Remove</button></div>`});
let sub=cartSubtotal();h+=`<div class="summary"><div class="summary-row"><span>Subtotal</span><strong>${money(sub)}</strong></div></div><div class="actions"><button onclick="renderDrinkPicker()">+ Add another</button><button class="primary" ${cart.length?"":"disabled"} onclick="checkout()">Checkout →</button></div></div>`;$("orderContent").innerHTML=h}
function removeItem(i){cart.splice(i,1);renderCart()} function checkout(){let s=cartSubtotal();if(s<MENU.business.deliveryMinimum){alert(`Delivery minimum is ${money(MENU.business.deliveryMinimum)}. Add ${money(MENU.business.deliveryMinimum-s)} more.`);return}renderCheckout()}
function renderCheckout(){
  if(MENU.business && MENU.business.orderingOpen===false){startOrder();return}
  let s=cartSubtotal();
  const towns=Object.keys(MENU.business.areas||{});
  const times=Array.isArray(MENU.business.deliveryTimes)?MENU.business.deliveryTimes:[];
  if(!towns.length){$("orderContent").innerHTML=`<div class="panel"><h2>Delivery unavailable</h2><div class="notice">No delivery towns are currently available. Please check back later.</div><div class="actions"><button onclick="goHome()">← Home</button></div></div>`;return}
  if(!times.length){$("orderContent").innerHTML=`<div class="panel"><h2>Delivery unavailable</h2><div class="notice">No delivery times are currently available. Please check back later.</div><div class="actions"><button onclick="goHome()">← Home</button></div></div>`;return}
  $("orderContent").innerHTML=`<div class="panel"><h2>Delivery & Checkout</h2><div class="notice">Minimum: <strong>${money(MENU.business.deliveryMinimum)}</strong> before fees. Cash delivery is free; Venmo adds ${money(MENU.business.venmoDeliveryFee)}.</div>
  <label>Name *</label><input id="custName"><label>Phone *</label><input id="custPhone" type="tel"><label>Email *</label><input id="custEmail" type="email" required><label>Delivery town *</label><select id="town" required><option value="">Choose...</option>${towns.map(x=>`<option>${escapeHtml(x)}</option>`).join("")}</select><label>Delivery address *</label><input id="address"><label>Delivery time *</label><select id="deliveryTime" required><option value="">Choose...</option>${times.map(x=>`<option>${escapeHtml(x)}</option>`).join("")}</select><label>Payment *</label><select id="payment"><option value="">Choose...</option><option>Cash</option><option>Venmo</option></select>
  <div class="notice payment-instructions">Your total is calculated below. If paying cash, change is available up to $50. If paying Venmo, the link is available by clicking the purple neon Venmo on the previous page, or I can send it to your email/text. By placing this sovereign food order, I understand that I will be responsible for payment upon delivery. Reach out to <strong>ordergottacoffee@gmail.com</strong>!</div>
  <label>Order notes</label><textarea id="orderNotes"></textarea>
  <div class="summary"><div class="summary-row"><span>Subtotal</span><strong>${money(s)}</strong></div><div class="summary-row"><span>Delivery</span><strong id="deliveryFee">${money(0)}</strong></div><div class="summary-row total"><span>Total</span><strong id="checkoutTotal">${money(s)}</strong></div></div><div class="actions"><button onclick="renderCart()">← Back</button><button class="primary" onclick="submitOrder()">Place Order</button></div></div>`;
  $("payment").onchange=updateCheckoutTotal;
}

function updateCheckoutTotal(){let f=$("payment").value==="Venmo"?MENU.business.venmoDeliveryFee:0;$("deliveryFee").textContent=money(f);$("checkoutTotal").textContent=money(cartSubtotal()+f)}
function postOrderViaForm(order){
let frame=$("gcOrderSubmitFrame");
if(!frame){
frame=document.createElement("iframe");
frame.id="gcOrderSubmitFrame";
frame.name="gcOrderSubmitFrame";
frame.style.display="none";
document.body.appendChild(frame);
}
let form=document.createElement("form");
form.method="POST";
form.action=CONFIG.APPS_SCRIPT_URL;
form.target="gcOrderSubmitFrame";
form.style.display="none";

let payload=document.createElement("input");
payload.type="hidden";
payload.name="payload";
payload.value=JSON.stringify(order);
form.appendChild(payload);

document.body.appendChild(form);
form.submit();
setTimeout(()=>form.remove(),1500);
}

async function submitOrder(){
let p=$("payment").value,s=cartSubtotal(),email=$("custEmail").value.trim(),d={customer:{name:$("custName").value.trim(),phone:$("custPhone").value.trim(),email},delivery:{town:$("town").value,address:$("address").value.trim(),time:$("deliveryTime").value},payment:p,notes:$("orderNotes").value.trim(),items:cart.map(i=>({sourceName:i.sourceName,name:i.name,size:i.size,price:i.price,itemPrice:i.itemPrice,milk:i.milk,flavors:i.flavors,bottom:i.bottom,espresso:i.espresso,lotus:i.lotus,coldFoam:i.coldFoam,notes:i.notes})),subtotal:s,deliveryFee:p==="Venmo"?MENU.business.venmoDeliveryFee:0,total:s+(p==="Venmo"?MENU.business.venmoDeliveryFee:0),submittedAt:new Date().toISOString()};

if(!d.customer.name||!d.customer.phone||!d.customer.email||!d.delivery.town||!d.delivery.address||!d.delivery.time||!p){alert("Please complete all required fields, including delivery time and email.");return}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.customer.email)){alert("Please enter a valid email address.");return}
if(s<MENU.business.deliveryMinimum){alert(`Your order is below the ${money(MENU.business.deliveryMinimum)} delivery minimum.`);return}
if(!CONFIG.APPS_SCRIPT_URL){localStorage.setItem("lastGottaCoffeeOrder",JSON.stringify(d));return showConfirmation(d,"LOCAL-TEST")}

try{
localStorage.setItem("lastGottaCoffeeOrder",JSON.stringify(d));
postOrderViaForm(d);
setTimeout(()=>showConfirmation(d,"SENT"),500);
}catch(e){
console.error("Gotta Coffee order submission failed:",e);
alert(`The order could not be sent automatically.\n\nTechnical detail: ${e.message||e}`);
}
}
function showConfirmation(d,n){$("orderContent").innerHTML=`<div class="panel"><h2>☕ Order Received!</h2><div class="notice"><strong>Order #${escapeHtml(n)}</strong></div><p>Thanks, ${escapeHtml(d.customer.name)}! We received your order.</p><div class="summary">${d.items.map(i=>`<div class="summary-row"><span>${escapeHtml(i.sourceName)}</span><strong>${money(i.itemPrice)}</strong></div>`).join("")}<div class="summary-row"><span>Delivery</span><span>${money(d.deliveryFee)}</span></div><div class="summary-row total"><span>Total</span><strong>${money(d.total)}</strong></div></div><p>Delivery time: <strong>${escapeHtml(d.delivery.time)}</strong></p><p>Payment: <strong>${escapeHtml(d.payment)}</strong></p><div class="actions"><button onclick="goHome()">Done</button><button onclick="startOrder()">New Order</button></div></div>`;cart=[]}
function renderMenu(){let h=`<div class="panel"><h2>Drinks</h2>`;availableDrinks().forEach(d=>h+=`<div class="menu-item"><h3>${escapeHtml(d.sourceName)} <span class="price">${money(d.price)}</span></h3><p>${escapeHtml(d.description)}</p></div>`);h+=`<h2>Milk Choices</h2><div class="chips">${MENU.milks.filter(x=>x.available).map(x=>`<span class="chip">${escapeHtml(milkLabel(x.name))}</span>`).join("")}</div><h2>Flavors</h2><div class="chips">${MENU.flavors.filter(x=>x.available).map(x=>`<span class="chip">${escapeHtml(x.name)}</span>`).join("")}</div><h2>Add-ons</h2>`;MENU.addons.filter(x=>x.available).forEach(x=>h+=`<div class="menu-item"><strong>${escapeHtml(x.name)}</strong> <span class="price">+${money(x.price)}</span></div>`);h+=`</div>`;$("menuContent").innerHTML=h}
function renderInfo(){
  const towns=Object.keys(MENU.business.areas||{});
  const times=Array.isArray(MENU.business.deliveryTimes)?MENU.business.deliveryTimes:[];
  const status=MENU.business.orderingOpen===false?`<div class="notice"><strong>Ordering is currently closed.</strong> ${escapeHtml(MENU.business.closedMessage||"")}</div>`:"";
  $("infoContent").innerHTML=`<div class="panel"><h2>Delivery Information</h2>${status}<div class="notice">🚗 <strong>Minimum delivery order: ${money(MENU.business.deliveryMinimum||5)}</strong> before delivery fees.</div><p><strong>Monday-Friday</strong></p><p><strong>Currently available towns:</strong> ${towns.length?towns.map(escapeHtml).join(", "):"None"}</p><p><strong>Currently available delivery times:</strong> ${times.length?times.map(escapeHtml).join(", "):"None"}</p><p>Cash delivery is free; Venmo delivery is +${money(MENU.business.venmoDeliveryFee||2)}. No Canada deliveries.</p><button class="primary" onclick="startOrder()" ${MENU.business.orderingOpen===false?"disabled":""}>Start an Order</button></div>`;
}

function initChat(){
if($("chatMessages").children.length)return;
addBot("Hi! 👋 I'm the Gotta Coffee assistant. I can answer questions about our menu, flavors, delivery, and ordering.");
let wrap=document.createElement("div");
wrap.style.margin="12px 0 18px";
wrap.innerHTML=`<button class="primary" type="button" onclick="startOrder()">☕ Place an Order</button>`;
$("chatMessages").appendChild(wrap);
}
function addBubble(t,c){let d=document.createElement("div");d.className=`bubble ${c}`;d.innerHTML=escapeHtml(t).replace(/\n/g,"<br>");$("chatMessages").appendChild(d);$("chatMessages").scrollTop=$("chatMessages").scrollHeight}
function addBot(t){addBubble(t,"bot")}function addUser(t){addBubble(t,"user")}function chatQuick(t){addUser(t);answerChat(t)}
$("chatForm").onsubmit=e=>{e.preventDefault();let t=$("chatInput").value.trim();if(!t)return;$("chatInput").value="";addUser(t);answerChat(t)}
function answerChat(raw){let t=raw.toLowerCase();if(t.includes("minimum")||t.includes("$5"))return addBot("Our delivery minimum is $5.00 before delivery fees.");if(t.includes("hour")||t.includes("open")||t.includes("close")){if(MENU.business.orderingOpen===false)return addBot(MENU.business.closedMessage||"Ordering is currently closed.");let towns=Object.keys(MENU.business.areas||{}).join(", ")||"no towns";let times=(MENU.business.deliveryTimes||[]).join(", ")||"no times";return addBot(`We deliver Monday-Friday. Currently available towns: ${towns}. Available delivery times: ${times}.`);}if(t.includes("venmo"))return addBot("Cash delivery is free. Venmo delivery adds $2.00.");if(t.includes("canada"))return addBot("Sorry — we do not currently deliver to Canada.");if(t.includes("flavor"))return addBot(`We currently have ${MENU.flavors.filter(x=>x.available).length} available flavors. You can choose up to 4 flavors.`);if(t.includes("size"))return addBot("Cold Brews and Carnival Lemonade have Large and XL options; other drinks use the size listed on the menu.");if(t.includes("order")||t.includes("drink")||t.includes("coffee")){addBot("Absolutely — opening the order form now.");setTimeout(startOrder,350);return}if(t.includes("milk"))return addBot(`Available milk choices are ${MENU.milks.filter(x=>x.available).map(x=>milkLabel(x.name)).join(", ")}.`);addBot("I can help with the menu, flavors, milk choices, delivery, prices, or placing an order.")}
