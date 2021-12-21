/** @param {NS} ns **/
export async function main(ns) {
	var ram = 1;
	ram = ns.args[0];
	var cost = ns.getPurchasedServerCost(ram);

	ns.tprint("\nEl coste del servidor para " + ram + "GB de ram es de " + new Intl.NumberFormat().format(cost));
}