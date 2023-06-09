import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { get } from "http";

export function GET(req) {
	const client = getQSParamFromURL("client", req.url);
	const workflow = getQSParamFromURL("workflow", req.url);
	console.log(client, workflow);
	const filePath = path.join(
		process.cwd(),
		"data",
		client,
		`${workflow}.json`
	);
	console.log(filePath);
	console.log(fs.existsSync(filePath));

	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, "utf8");
		console.log(data);
		return NextResponse.json(JSON.parse(data));
	}
	return new Response("Not found", { status: 404 });
}

export async function POST(req) {
	const data = await req.json();
	if (!data.data) {
		data.data = JSON.parse(
			fs.readFileSync(
				path.join(process.cwd(), "data", "template.json"),
				"utf8"
			)
		);
		data.data.name = data.workflow;
		data.workflow = getUUID(data.client);
	} else {
		const filePath = path.join(
			process.cwd(),
			"data",
			data.client,
			`${data.workflow}.json`
		);
		if (!fs.existsSync(filePath)) {
			return new Response("Workflow already exists", { status: 400 });
		}
	}
	const filePath = path.join(
		process.cwd(),
		"data",
		data.client,
		`${data.workflow}.json`
	);
	fs.writeFileSync(filePath, JSON.stringify(data.data));
	return new Response("OK", { status: 200 });
}

export async function DELETE(req) {
	const client = getQSParamFromURL("client", req.url);
	const workflow = getQSParamFromURL("workflow", req.url);
	const filePath = path.join(
		process.cwd(),
		"data",
		client,
		`${workflow}.json`
	);
	fs.unlinkSync(filePath);
	return new Response("OK", { status: 200 });
}

export function getQSParamFromURL(key, url) {
	if (!url) return "";
	const search = new URL(url).search;
	const urlParams = new URLSearchParams(search);
	return urlParams.get(key);
}

export function getUUID(customer) {
	const folderPath = path.join(process.cwd(), "data", customer);
	const workflows = fs
		.readdirSync(folderPath)
		.filter((file) => file.endsWith(".json"))
		.map((file) => Number(file.slice(0, -5)));

	return (() => {
		workflows.sort((a, b) => a - b);
		for (let i = 0; i < workflows.length; i++) {
			if (workflows[i] !== i) {
				return i;
			}
		}
		return workflows.length;
	})(workflows);
}
