/** @param {NS} ns **/
export async function main(ns) {
	var fileName = "server-hack.js"

    var purchasedServers = ns.getPurchasedServers();
	for(let i = 0; i < purchasedServers.length; i++){

		let server = purchasedServers[i]
		let threads = Math.floor(ns.getServerMaxRam(server) / 2.4)

		await ns.scp(fileName,server);
		ns.exec(fileName,server,threads);
	}
}