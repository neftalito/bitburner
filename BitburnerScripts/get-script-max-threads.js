/** @param {NS} ns **/
export async function main(ns) {

	var fileSize = 1;
	fileSize = ns.args[0];
	
	var scriptRamUsage = ns.getScriptRam(ns.getScriptName());

    var maxRam = ns.getServerMaxRam("home");
	var usedRam = ns.getServerUsedRam("home");
	var usableRam = (maxRam - usedRam) + scriptRamUsage;
	var threads = Math.floor(usableRam / fileSize);

	ns.tprint("\nThreads needed for the script: "+threads)
}