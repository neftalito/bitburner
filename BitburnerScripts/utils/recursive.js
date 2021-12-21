/** @param {NS} ns **/
export async function main(ns) {
    await ns.sleep(2000);
    let a=(s,p)=>[s,...ns.scan(s).map(n=>(n!=p)?a(n,s):0).flat().filter(v=>v)];
    var servers = a("home");
    ns.write("servers.txt",servers,"W")
}