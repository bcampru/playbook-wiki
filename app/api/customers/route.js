import fs from "fs-extra";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
	const dataPath = path.join(process.cwd(), "data");
	const folders = fs
		.readdirSync(dataPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	const data = [];
	for (const folder of folders) {
		const folderPath = path.join(dataPath, folder);
		var fileResult = [];
		const files = fs
			.readdirSync(folderPath)
			.filter((file) => file.endsWith(".json"))
			.map((file) => file.slice(0, -5));
		files.forEach((file) => {
			const filePath = path.join(folderPath, `${file}.json`);
			const fileData = JSON.parse(fs.readFileSync(filePath, "utf8"));
			fileResult.push({ file: file, name: fileData.name });
		});

		data.push({ name: folder, workflows: fileResult });
	}
	return NextResponse.json(data);
}

export async function POST(req) {
	const data = await req.json();
	const dataPath = path.join(process.cwd(), "data");
	const folderPath = path.join(dataPath, data.name);
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
	}
	return new Response("OK", { status: 200 });
}

export async function DELETE(req) {
	const client = getQSParamFromURL("client", req.url);
	const filePath = path.join(process.cwd(), "data", client);
	await fs.remove(filePath);
	return new Response("OK", { status: 200 });
}

export function getQSParamFromURL(key, url) {
	if (!url) return "";
	const search = new URL(url).search;
	const urlParams = new URLSearchParams(search);
	return urlParams.get(key);
}
