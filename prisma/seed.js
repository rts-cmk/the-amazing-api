import prisma from "../config/prisma.js"
import cliProgress from "cli-progress"

const progress = new cliProgress.SingleBar({
	format: "{bar} | {percentage}% | {value}/{total}",
	hideCursor: true,
})

const totalSteps = 4

async function main() {
	progress.start(totalSteps, 0)

	const [admin, editor, user] = await Promise.all([
		prisma.user.create({
			data: {
				email: "admin@mail.com",
				password: "admin",
				role: "ADMIN",
				name: "Admin Jensen",
			},
		}),
		prisma.user.create({
			data: {
				email: "editor@mail.com",
				password: "editor",
				role: "EDITOR",
				name: "Editor Jensen",
			},
		}),
		prisma.user.create({
			data: {
				email: "user@mail.com",
				password: "user",
				role: "USER", // optional if your schema defaults to USER
				name: "User Jensen",
			},
		}),
	])

	progress.increment(1)

	const images = await Promise.all([
		prisma.media.create({
			data: {
				name: "The Thing",
				description: "Action figure of The Thing in the original box",
				type: "IMAGE",
				width: 1200,
				height: 1200,
				mimetype: "image/webp",
				size: 139264,
				originalFilename: "the-thing-package.webp",
				filename: "the-thing-package.webp",
				url: "http://localhost:4000/media/the-thing-package.webp",
			},
		}),
		prisma.media.create({
			data: {
				name: "The Thing",
				description: "Action figure of The Thing posing with a wide stance and one fist in the air",
				type: "IMAGE",
				width: 768,
				height: 768,
				mimetype: "image/jpeg",
				size: 61440,
				originalFilename: "the-thing.jpg",
				filename: "the-thing.jpg",
				url: "http://localhost:4000/media/the-thing.jpg",
			},
		}),
		prisma.media.create({
			data: {
				name: "Spiderman",
				description: "Action figure of Spiderman in original box",
				type: "IMAGE",
				width: 1600,
				height: 1600,
				mimetype: "image/jpeg",
				size: 1105920,
				originalFilename: "spiderman-box.jpeg",
				filename: "spiderman-box.jpeg",
				url: "http://localhost:4000/media/spiderman-box.jpeg",
			},
		}),
		prisma.media.create({
			data: {
				name: "Spiderman",
				description: "Action figure of Spiderman in a dynamic pose",
				type: "IMAGE",
				width: 2000,
				height: 2000,
				mimetype: "image/jpeg",
				size: 364544,
				originalFilename: "spiderman.jpeg",
				filename: "spiderman.jpeg",
				url: "http://localhost:4000/media/spiderman.jpeg",
			},
		}),
		prisma.media.create({
			data: {
				name: "Iron Man",
				description: "Action figure of Iron Man in the original box",
				type: "IMAGE",
				width: 2500,
				height: 2500,
				mimetype: "image/jpeg",
				size: 630784,
				originalFilename: "iron-man-box.jpg",
				filename: "iron-man-box.jpg",
				url: "http://localhost:4000/media/iron-man-box.jpg",
			},
		}),
		prisma.media.create({
			data: {
				name: "Iron Man",
				description: "Action figure of Iron Man in a dynamic pose",
				type: "IMAGE",
				width: 1000,
				height: 1000,
				mimetype: "image/jpeg",
				size: 81920,
				originalFilename: "iron-man.jpg",
				filename: "iron-man.jpg",
				url: "http://localhost:4000/media/iron-man.jpg",
			},
		}),
	])

	progress.increment(1)

	const products = await Promise.all([
		prisma.product.create({
			data: {
				name: "The Thing",
				description: "Action figure of The Thing from The Fantastic Four in the original box",
				slug: "the-thing",
				sku: "123456",
				price: 29.99,
				saleprice: 19.99,
				weight: 1.5,
				height: 12,
				width: 12,
				length: 12,
				stock: 10,
				media: {
					connect: [
						{
							id: images[0].id,
						},
						{
							id: images[1].id,
						},
					]
				}
			},
		}),
		prisma.product.create({
			data: {
				name: "Spider-Man",
				description: "Action figure of Spider-Man in a dynamic pose",
				slug: "spider-man",
				sku: "123457",
				price: 24.99,
				saleprice: 17.99,
				weight: 1.2,
				height: 10,
				width: 8,
				length: 8,
				stock: 15,
				media: {
					connect: [
						{ id: images[2].id },
						{ id: images[3].id },
					],
				},
			},
		}),
		prisma.product.create({
			data: {
				name: "Iron Man",
				description: "Action figure of Iron Man with light-up chest",
				slug: "iron-man",
				sku: "123458",
				price: 34.99,
				saleprice: 25.99,
				weight: 1.8,
				height: 12,
				width: 10,
				length: 10,
				stock: 20,
				media: {
					connect: [
						{ id: images[4].id },
						{ id: images[5].id },
					],
				},
			},
		}),
	])

	progress.increment(1)

	/*
	{
		name: "Captain America",
		description: "Action figure of Captain America with shield",
		slug: "captain-america",
		sku: "123459",
		price: 29.99,
		saleprice: 22.99,
		weight: 1.6,
		height: 11,
		width: 9,
		length: 9,
		stock: 12,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	},
	{
		name: "Hulk",
		description: "Action figure of Hulk in a smashing pose",
		slug: "hulk",
		sku: "123460",
		price: 39.99,
		saleprice: 29.99,
		weight: 2.5,
		height: 14,
		width: 12,
		length: 12,
		stock: 8,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	},
	{
		name: "Thor",
		description: "Action figure of Thor with Mjolnir",
		slug: "thor",
		sku: "123461",
		price: 32.99,
		saleprice: 24.99,
		weight: 1.7,
		height: 12,
		width: 10,
		length: 10,
		stock: 10,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	},
	{
		name: "Black Widow",
		description: "Action figure of Black Widow with dual batons",
		slug: "black-widow",
		sku: "123462",
		price: 27.99,
		saleprice: 19.99,
		weight: 1.3,
		height: 10,
		width: 8,
		length: 8,
		stock: 18,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	},
	{
		name: "Black Panther",
		description: "Action figure of Black Panther in a crouching pose",
		slug: "black-panther",
		sku: "123463",
		price: 31.99,
		saleprice: 23.99,
		weight: 1.4,
		height: 11,
		width: 9,
		length: 9,
		stock: 14,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	},
	{
		name: "Doctor Strange",
		description: "Action figure of Doctor Strange with a magic effect",
		slug: "doctor-strange",
		sku: "123464",
		price: 36.99,
		saleprice: 27.99,
		weight: 1.9,
		height: 12,
		width: 10,
		length: 10,
		stock: 9,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	},
	{
		name: "Wolverine",
		description: "Action figure of Wolverine with claws extended",
		slug: "wolverine",
		sku: "123465",
		price: 28.99,
		saleprice: 21.99,
		weight: 1.5,
		height: 11,
		width: 9,
		length: 9,
		stock: 13,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	},
	{
		name: "Deadpool",
		description: "Action figure of Deadpool with katanas",
		slug: "deadpool",
		sku: "123466",
		price: 33.99,
		saleprice: 25.99,
		weight: 1.6,
		height: 12,
		width: 10,
		length: 10,
		stock: 11,
		Media: {
			connect: [
				{ id: images[0].id },
				{ id: images[1].id },
			],
		},
	}, */

	const post = await prisma.post.create({
		data: {
			title: "My first post",
			slug: "my-first-post",
			published: new Date(Date.now() + 3000).toISOString(),
			author: {
				connect: {
					id: editor.id,
				},
			},
			blocks: {
				create: [
					{
						"type": "HEADING",
						"content": {
							"level": 2,
							"text": "Hello, World!"
						},
						"position": 1
					},
					{
						"type": "TEXT",
						"content": {
							"spans": [
								{
									"text": "This is such an exciting ",
									"marks": []
								},
								{
									"text": "blog post",
									"marks": ["bold"]
								},
								{
									"text": ". Would you like to know ",
									"marks": []
								},
								{
									"text": "more",
									"marks": [
										{
											"type": "link",
											"href": "http://localhost:4000"
										}
									]
								},
								{
									"text": "?",
									"marks": []
								}
							]
						},
						"position": 2
					}
				]
			},
		},
	})

	progress.increment(1)
	progress.stop()
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
		process.exit(0)
	})