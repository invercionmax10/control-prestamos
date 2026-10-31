const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');

function load(initialStorage = {}) {
  const store = { ...initialStorage };
  const nodes = new Map();
  const createNode = () => ({textContent:'',innerHTML:'',value:'',style:{},hidden:false,dataset:{},classList:{toggle(){},add(){},remove(){}},querySelector(){return this},querySelectorAll(){return []},addEventListener(){},focus(){},reset(){}});
  const document = {querySelector:selector=>{if(!nodes.has(selector))nodes.set(selector,createNode());return nodes.get(selector)},querySelectorAll:()=>[],addEventListener(){}};
  const context = {localStorage:{getItem:key=>store[key]??null,setItem:(key,value)=>{store[key]=value}},console,Intl,Date,Math,Number,String,JSON,Array,Set,Map,FormData:class{},confirm:()=>true,window:{scrollTo(){}},document};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app.js','utf8'),context);
  return {context,store,nodes};
}
const {context}=load();
const checks=vm.runInContext(`(()=>{
 const l30={principal:1000000,days:30,date:'2026-01-05'};
 const l60={principal:1000000,days:60,date:'2026-01-05'};
 const due30=migratedCalendar(l30),due60=migratedCalendar(l60);
 const sunday=collectionDates('2026-01-04',3);
 const userLoans=data.loans.filter(l=>l.userId==='u-1');
 role='user';currentUserId='u-1';
 const html=userDashboard();
 return {interest30:interestAmount(l30),total30:total(l30),interest60:interestAmount(l60),total60:total(l60),count30:due30.length,sum30:due30.reduce((s,x)=>s+x.due,0),count60:due60.length,sum60:due60.reduce((s,x)=>s+x.due,0),sunday,hasSunday:due60.some(x=>new Date(x.date+'T12:00:00').getDay()===0),clientLoanCount:userLoans.length,cardCount:(html.match(/class="loan-card"/g)||[]).length,hasSeparateIds:userLoans.every(l=>html.includes('data-loan-card="'+l.id+'"'))};
})()`,context);
assert.equal(checks.interest30,200000);assert.equal(checks.total30,1200000);assert.equal(checks.interest60,400000);assert.equal(checks.total60,1400000);
assert.equal(checks.count30,30);assert.equal(checks.sum30,1200000);assert.equal(checks.count60,60);assert.equal(checks.sum60,1400000);
assert.deepEqual(Array.from(checks.sunday),['2026-01-05','2026-01-06','2026-01-07']);assert.equal(checks.hasSunday,false);
assert.equal(checks.clientLoanCount,2);assert.equal(checks.cardCount,2);assert.equal(checks.hasSeparateIds,true);
const legacy={version:1,users:[{id:'u',name:'Test',email:'t@t',color:'green'}],investments:[{id:'i',amount:5000,date:'2026-01-01'}],loans:[{id:'old',userId:'u',principal:1000,date:'2026-01-04',days:14,status:'Activo',payments:[{id:'p',amount:100,date:'2026-01-05',note:'old'}]}]};
const migrated=load({'brujula-demo-v1':JSON.stringify(legacy)});
const migration=vm.runInContext(`({days:data.loans[0].days,schedule:data.loans[0].schedule.length,payments:data.loans[0].payments.length,version:data.version})`,migrated.context);
assert.equal(migration.days,30);assert.equal(migration.schedule,30);assert.equal(migration.payments,1);assert.equal(migration.version,2);
assert.match(migrated.store['invercion-max-demo-v2'],/"version":2/);
console.log('PASS: interest, daily schedule, Sunday exclusion, client-specific independent cards and legacy migration.',JSON.stringify({checks,migration}));
