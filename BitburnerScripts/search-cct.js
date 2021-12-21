/** @param {NS} ns **/
export async function main(ns) {
    var targets = ["n00dles","max-hardware","foodnstuff","sigma-cosmetics","joesguns","CSEC","phantasy","the-hub","comptek","syscore","lexo-corp","aevum-police","crush-fitness","summit-uni","catalyst","alpha-ent","galactic-cyber","aerocorp","unitalife","omega-net","hong-fang-tea","zer0","harakiri-sushi","iron-gym","nectar-net","neo-net","netlink","rothman-uni","rho-construction","global-pharm","snap-fitness","omnia","univ-energy","infocomm","titan-labs","stormtech","4sigma","nwo","The-Cave",".","b-and-a","clarkinc","ecorp","applied-energetics","helios","kuai-gong","powerhouse-fitness","fulcrumassets","run4theh111z","fulcrumtech","omnitek","blade","megacorp","vitalife","zb-def","solaris","zeus-med","deltaone","defcomm","icarus","taiyang-digital","nova-med","microdyne","johnson-ortho","zb-institute","avmnite-02h","I.I.I.I","millenium-fitness","silver-helix","darkweb"]
    for(var server = 0; server<targets.length;server++){
        let files = ns.ls(targets[server]);
        for(let index = 0; index<files.length;index++){
            if(files[index].endsWith(".cct")){
                ns.tprint(`Found ${files[index]} in ${targets[server]}`);
            }
        }
    }
}