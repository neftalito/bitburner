/** @param {NS} ns **/
export async function main(ns) {
    var servers  = ["n00dles","max-hardware","foodnstuff","sigma-cosmetics","joesguns","CSEC","phantasy","the-hub","comptek","syscore","lexo-corp","aevum-police","crush-fitness","summit-uni","catalyst","alpha-ent","galactic-cyber","aerocorp","unitalife","omega-net","hong-fang-tea","zer0","harakiri-sushi","iron-gym","nectar-net","neo-net","netlink","rothman-uni","rho-construction","global-pharm","snap-fitness","omnia","univ-energy","infocomm","titan-labs","stormtech","4sigma","nwo","The-Cave",".","b-and-a","clarkinc","ecorp","applied-energetics","helios","kuai-gong","powerhouse-fitness","fulcrumassets","run4theh111z","fulcrumtech","omnitek","blade","megacorp","vitalife","zb-def","solaris","zeus-med","deltaone","defcomm","icarus","taiyang-digital","nova-med","microdyne","johnson-ortho","zb-institute","avmnite-02h","I.I.I.I","millenium-fitness","silver-helix","darkweb"]
	var pservers = ns.getPurchasedServers();
	var everyserver = servers.concat(pservers);
	var file = "server-hack.js";
	var fileSize = 2.4;

	for(let i = 0; i < everyserver.length; i++){
		await ns.scp(file, everyserver[i]);
		var serverRam = ns.getServerMaxRam(everyserver[i]);
		if (serverRam > fileSize) {
			var maxThread = Math.floor(serverRam / fileSize);
			ns.exec(file, everyserver[i], maxThread);
		}
	}
}